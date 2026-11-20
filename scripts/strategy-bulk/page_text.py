"""Extract text blocks with their heading path from a cached source page (stdlib only)."""
import re
import unicodedata
from html.parser import HTMLParser

SKIP = {"script", "style", "noscript", "svg", "template", "iframe", "header", "footer", "nav", "aside", "form"}
BLOCK = {"p", "li", "td", "th", "dt", "dd", "pre", "blockquote", "figcaption", "caption", "summary", "tr",
         "div", "section", "article", "main", "ul", "ol", "table", "br"}
HEADINGS = {"h1": 1, "h2": 2, "h3": 3, "h4": 4, "h5": 5, "h6": 6}
VOID = {"br", "img", "hr", "meta", "link", "input", "source", "wbr", "area", "base", "col", "embed", "param", "track"}


class _Extractor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip_depth = 0
        self.stack = []
        self.heading_level = None
        self.heading_text = []
        self.path = []
        self.buffer = []
        self.blocks = []
        self.title = []
        self.in_title = False
        self.lists = []  # stack of {"class", "items", "current"}
        self.sequences = []

    def flush(self):
        text = re.sub(r"\s+", " ", "".join(self.buffer)).strip()
        self.buffer = []
        if text:
            self.blocks.append({"headingPath": [h for _, h in self.path], "text": text})

    def handle_starttag(self, tag, attrs):
        if tag in VOID:
            if tag == "br" and not self.skip_depth:
                self.buffer.append(" ")
            return
        self.stack.append(tag)
        if tag in SKIP:
            self.skip_depth += 1
        if self.skip_depth:
            return
        if tag == "title":
            self.in_title = True
        if tag in ("ol", "ul"):
            self.lists.append({"class": dict(attrs).get("class") or "", "items": [], "current": None})
        elif tag == "li" and self.lists:
            self.lists[-1]["current"] = []
        if tag in HEADINGS:
            self.flush()
            self.heading_level = HEADINGS[tag]
            self.heading_text = []
        elif tag in BLOCK:
            self.flush()

    def handle_endtag(self, tag):
        if tag in VOID or tag not in self.stack:
            return
        while self.stack:
            current = self.stack.pop()
            if current in SKIP:
                self.skip_depth -= 1
            if current == "title":
                self.in_title = False
            if current in HEADINGS and self.heading_level is not None and not self.skip_depth:
                text = re.sub(r"\s+", " ", "".join(self.heading_text)).strip()
                if text:
                    self.path = [(lvl, h) for lvl, h in self.path if lvl < self.heading_level]
                    self.path.append((self.heading_level, text))
                    self.blocks.append({"headingPath": [h for _, h in self.path], "text": text, "heading": True})
                self.heading_level = None
            elif current in BLOCK and not self.skip_depth:
                if current == "li" and self.lists and self.lists[-1]["current"] is not None:
                    item = re.sub(r"\s+", " ", "".join(self.lists[-1]["current"])).strip()
                    if item:
                        self.lists[-1]["items"].append(item)
                    self.lists[-1]["current"] = None
                if current in ("ol", "ul") and self.lists:
                    finished = self.lists.pop()
                    if len(finished["items"]) >= 2:
                        self.sequences.append({"headingPath": [h for _, h in self.path], "kind": "list",
                                               "listClass": finished["class"], "steps": finished["items"],
                                               "blockIndex": len(self.blocks)})
                self.flush()
            if current == tag:
                break

    def handle_data(self, data):
        if self.in_title:
            self.title.append(data)
        if self.skip_depth:
            return
        if self.heading_level is not None:
            self.heading_text.append(data)
        else:
            self.buffer.append(data)
            if self.lists and self.lists[-1]["current"] is not None:
                self.lists[-1]["current"].append(data)


def extract_blocks(html):
    parser = _Extractor()
    parser.feed(html)
    parser.close()
    parser.flush()
    sequences = [seq for seq in parser.sequences if all(len(item) <= 40 for item in seq["steps"])]
    for index, block in enumerate(parser.blocks):
        if block.get("heading"):
            continue
        for chain in arrow_chains(block["text"]):
            sequences.append({"headingPath": block["headingPath"], "kind": "text", "steps": chain["steps"],
                              "span": chain["span"], "truncatedStart": chain["truncatedStart"],
                              "referencedInSentence": chain["referencedInSentence"], "leadNote": chain["leadNote"],
                              "blockIndex": index})
    return {"title": re.sub(r"\s+", " ", "".join(parser.title)).strip(), "blocks": parser.blocks,
            "sequences": sequences}


ARROWS = re.compile(r"\s*(?:>|＞|→|⇒|▶|►|〉|》|≫|>>)\s*")


def norm(text):
    """Normalization shared by source matching. Notation differences only, never move identity."""
    text = unicodedata.normalize("NFKC", text or "").casefold()
    text = text.replace("しゃがみ", "屈").replace("しゃが", "屈")
    text = ARROWS.sub(">", text)
    text = re.sub(r"[\s・、,。.!！?？「」『』【】\[\]]", "", text)
    return text


def page_dates(html):
    """ISO dates appearing as update/publish markers in the page (structured data first)."""
    found = []
    for pattern in (r'"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})', r'"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})',
                    r'<time[^>]*datetime="(\d{4}-\d{2}-\d{2})', r'article:modified_time"\s+content="(\d{4}-\d{2}-\d{2})'):
        found += re.findall(pattern, html)
    text = unicodedata.normalize("NFKC", re.sub(r"<[^>]+>", " ", html))
    for y, m, d in re.findall(r"(20\d\d)[年/.-](\d{1,2})[月/.-](\d{1,2})日?\s*(?:更新|版|時点)", text):
        found.append(f"{y}-{int(m):02d}-{int(d):02d}")
    return sorted(set(found))


LEAD_WORDS = {"弱", "中", "強", "od", "OD", "ＯＤ", "SA1", "SA2", "SA3", "CA", "遅らせ", "最速", "ディレイ",
              "ラッシュ", "Cラッシュ", "DR", "CDR", "ドライブラッシュ", "キャンセルラッシュ", "生ラッシュ"}
MOVE_LIKE = re.compile(r"→→|[＋+]|[弱中強大小][PKＰＫ]|[PKＰＫ][PKＰＫ]|[1-9][PKＰＫ]")
TRAIL_CUT = re.compile(r"[（(]\s*[\d,，]+(?:\s*(?:ダメージ|dmg))?\s*[）)]|[。]|、(?=\S{6,})")


DIRECTION_CHARS = "↓↙←↘→↗↑↖"
GT_SEPARATORS = re.compile(r"\s*(?:＞|>|≫|》)\s*")
ARROW_SEPARATORS = re.compile(r"\s*(?:(?<![↓↙←↘↗↑↖→])→(?![↓↙←↘↗↑↖→＋+])|⇒|▶|►)\s*")


def _words(text):
    """Whitespace split that keeps parenthesised notes attached to their move."""
    words, depth, current = [], 0, ""
    for ch in text:
        depth += ch in "（(【["
        depth -= ch in "）)】]" and depth > 0
        if ch.isspace() and depth == 0:
            if current:
                words.append(current)
            current = ""
        else:
            current += ch
    if current:
        words.append(current)
    return words


def _tail_token(text):
    text = re.split(r"[、，：:]", text)[-1]
    words = _words(text)
    if not words:
        return ""
    token = words[-1]
    if len(words) >= 2 and words[-2] in LEAD_WORDS:
        token = words[-2] + " " + token
    return token


def _head_token(text):
    text = TRAIL_CUT.split(text, maxsplit=1)[0]
    words = _words(text)
    if not words:
        return ""
    if words[0] in LEAD_WORDS and len(words) >= 2:
        return words[0] + " " + words[1]
    return words[0]


COUNT_SUFFIX = re.compile(r"\s*[\d,，]+\s*(?:本|件|回)\s*$")
CLAUSE_SPLIT = re.compile(r"[、，；;]|または|もしくは|か、")


def arrow_chains(text):
    """Arrow-joined move chains inside prose, e.g. '当たったら 5中P ＞ 強P ＞ KK（2,960）。'.

    A chain never crosses a sentence or clause boundary (、/または), so aggregate lists such as
    'A ＞ B 32本、C ＞ D 25本' yield two chains instead of one merged route.
    """
    chains = []
    for sentence in re.split(r"(?<=。)", text):
        for clause in CLAUSE_SPLIT.split(sentence):
            separator = GT_SEPARATORS if GT_SEPARATORS.search(clause) else ARROW_SEPARATORS
            parts = separator.split(clause)
            if len(parts) < 2:
                continue
            first = _tail_token(parts[0])
            before = parts[0][:parts[0].rfind(first)] if first and first in parts[0] else parts[0]
            last = _head_token(COUNT_SUFFIX.sub("", parts[-1]))
            after = parts[-1].strip()[len(last):].strip() if parts[-1].strip().startswith(last) else ""
            after = re.sub(r"^[（(][\d,，／/\s]+[）)]", "", after).strip()
            lead = re.findall(r"[（(]([^（）()]{1,30})[）)]\s*$", before)
            attached = re.match(r"^[（(]([^（）()]{1,30})[）)]\s*", first)
            if attached:  # '（ガード）ドライブインパクト': the note belongs to the situation, not the move name.
                lead = [attached.group(1)]
                first = first[attached.end():]
            steps = [first] + [p.strip() for p in parts[1:-1]] + [last]
            steps = [re.sub(r"\s+", " ", COUNT_SUFFIX.sub("", step)).strip() for step in steps]
            if all(steps) and all(len(step) <= 40 for step in steps):
                # Moves right before the first captured step mean the route's real starter was cut off.
                chains.append({"steps": steps, "span": clause.strip(),
                               "truncatedStart": bool(MOVE_LIKE.search(before.split("、")[-1])),
                               # 'A ＞ B をガードさせた後' / 'A ＞ B は' use the route inside a sentence about something else.
                               "referencedInSentence": bool(re.match(r"^(?:を|の|は|が|も|より)", after)),
                               "leadNote": lead[-1].strip() if lead else ""})
    return chains

#!/usr/bin/env python3
"""キャラ別の『GIF接続候補台帳』を作る共通ツール(読み取り専用・新規出力のみ)。 使い方: build-character-ledger.py --character luke
Drive上の全GIFについて、素材の静的検査・技ID候補・MP4優先・分類・HOLD理由を1行にまとめる。
static_status: MATCHED_STATIC(技IDが公開用データと一意に対応) / NEEDS_VISUAL_QA / HOLD / BLOCKED_DUPLICATE / MP4_PRIORITY_KEPT
display_eligible は常に false(承認されるまで表示対象にしない)。approval は常に NOT_APPROVED。"""
import json, argparse, csv, collections
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]; G = ROOT / "scripts/gif-intake"; D = ROOT / "v2-web/src/data"
ap = argparse.ArgumentParser(); ap.add_argument("--character", required=True); a = ap.parse_args(); ch = a.character
FIX = {m["slug"]: m for m in json.load(open(D / "ALL_CHARACTER_RELEASE_FIXTURE_20261004.json"))["characters"][ch]["moves"]}
inv = {r["file"]: r for r in json.load(open(G / "asset-inventory-luke-manon-jp-20261116.json"))["records"] if r["character"] == ch}
rep = {r["file"]: r for r in json.load(open(G / "gif-intake-report-20261116.json"))["records"] if r["character"] == ch and r["origin"] == "drive_existing"}
cls = {r["file"]: r for r in json.load(open(G / "remaining-53-classification-20261116.json"))["rows"] if r["character"] == ch}
b2 = {r["sourceFile"]: r for r in json.load(open(G / "move-aliases-batch2-20261116.json"))["rows"] if r["character"] == ch}
cand = {}
for f in (D / "gif-intake").glob(f"SF6DNA_VER1_{ch.upper()}_GIF_MANIFEST_CANDIDATE_*.json"):
    for c in json.load(open(f))["clips"]: cand[c["source_file"]] = c
# 映像QAの結果(一括目視)。あれば台帳に反映する。承認ではない: approval は NOT_APPROVED のまま
vq_path = G / f"{ch}-visual-qa-20261116.json"
vq = {e["file"]: e for e in json.load(open(vq_path))["entries"]} if vq_path.exists() else {}
rows = []
for f, i in sorted(inv.items()):
    r = rep.get(f, {}); c = cand.get(f); k = cls.get(f); al = b2.get(f)
    slug = mid = src = None; status = "HOLD"; reasons = []
    if r.get("connectionClass") == "MP4_KEPT":
        status = "MP4_PRIORITY_KEPT"; reasons.append("既存MP4が優先。GIFは上乗せしない"); slug = r.get("moveSlug")
    elif c:
        status, slug, mid, src = "MATCHED_STATIC", c["move_slug"], c["move_id"], "CANDIDATE_MANIFEST"; reasons.append(c["mapping_evidence"])
    elif r.get("connectionClass") == "BLOCKED":
        status = "BLOCKED_DUPLICATE"; reasons += r.get("reasons", [])
    elif al:
        status, slug, mid, src = al["status"], al["moveSlug"], al["moveId"], "ALIAS_BATCH2"; reasons += al["mismatches"] + al["holdReasons"]
    elif k and k["subcategory"].startswith("C"):
        status, slug, src = "NEEDS_VISUAL_QA", k["candidateSlug"], "CLASSIFICATION_C"; mid = FIX[slug]["id"]
        reasons.append("既存技のホールド/ジャスト等の派生映像。同一技IDに複数メディアを持たせる設計判断が必要(技IDは増やさない)")
    elif k:
        reasons.append(f"{k['subcategory']}: {k['unlockCondition']}"); slug = k.get("candidateSlug")
        if slug and k["subcategory"].startswith("B"): reasons.append("OD版など、公開用データに独立した技IDがない。既存の同系統の技IDと同一視しない")
    else:
        reasons += r.get("reasons", []) or ["分類情報なし"]
    if i["assetStatus"] != "ASSET_VERIFIED": reasons.append("素材実体を取得できていない(ASSET_UNAVAILABLE)")
    if i.get("assetStatus") == "ASSET_VERIFIED" and not i.get("specAllOk"): reasons.append(f"制作規格外: {i['width']}x{i['height']} {i['fps']}fps")
    rows.append(dict(character=ch, filename=f, asset_status=i["assetStatus"], asset_sha256=i.get("sha256"), width=i.get("width"), height=i.get("height"), fps=i.get("fps"),
                     frames=i.get("frames"), bytes=i.get("bytes") or i["driveBytes"], candidate_source=src, move_slug=slug, move_id=mid, existing_mp4=(r.get("connectionClass") == "MP4_KEPT"),
                     static_status=status, visual_status={"CONFIRMED": "VISUAL_CONFIRMED_SAMPLED", "NEEDS_MORE_CHECK": "VISUAL_NEEDS_MORE_CHECK", "MISMATCH": "VISUAL_MISMATCH"}[vq[f]["result"]] if f in vq else "VISUAL_NOT_RUN",
                     local_connection_candidate=bool(f in vq and vq[f]["localConnectionCandidate"]), issue=" | ".join(reasons + ([ "未確認: " + " / ".join(vq[f]["unconfirmed"]) ] if f in vq else [])), approval="NOT_APPROVED", display_eligible=False))
# 技単位の不足: 素材が1本も対応していない対象技(通常技を除く)
have = {r["move_slug"] for r in rows if r["move_slug"] and r["static_status"] in ("MATCHED_STATIC", "NEEDS_VISUAL_QA", "MP4_PRIORITY_KEPT")}
for f in (D).glob(f"SF6DNA_VER1_{ch.upper()}_MEDIA_MANIFEST_*.json"):
    for c in json.load(open(f)).get("clips", []):
        if c.get("media_type") == "mp4" and c.get("move_slug"): have.add(c["move_slug"])
def near(slug):  # 技slugの語を全て含むファイル名(名前の近いGIF)。対応の根拠ではなく、見落とし防止の探索結果
    toks = [t for t in slug.replace(ch + "-", "", 1).split("-")]
    return [f for f in inv if all(t in f for t in toks)]
gaps = [dict(slug=s, name=m["name"], moveType=m["moveType"], nameNearMatches=near(s),
             note="素材なし。名前の近いGIFがあっても別技の可能性があり、対応させない") for s, m in FIX.items() if m["moveType"] != "normal" and s not in have]
out = dict(generated="2026-11-16", character=ch, note="静的照合の台帳。映像QA・公開承認ではない", count=len(rows),
           summary=dict(collections.Counter(r["static_status"] for r in rows)), assetSummary=dict(collections.Counter(r["asset_status"] for r in rows)), visualSummary=dict(collections.Counter(r["visual_status"] for r in rows)), moveGaps=gaps, rows=rows)
(G / f"{ch}-ledger-{len(rows)}-20261116.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
with open(G / f"{ch}-ledger-{len(rows)}-20261116.csv", "w", newline="", encoding="utf-8") as fh:
    w = csv.DictWriter(fh, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
print(len(rows), out["summary"], out["assetSummary"]); print("gaps:", [g["slug"] for g in gaps])

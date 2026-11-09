"use client";
import { useState } from "react";
import { VideoCard } from "@/components/video-card";
import type { VideoSummary } from "@/lib/event-media";
import { filterUniqueAutoVideoHits } from "@/lib/character-related-video-contract.mjs";
import type { AutoVideoResult } from "@/lib/auto-youtube-videos";
import { VIDEO_SEARCH_KINDS, VIDEO_SEARCH_LABELS, youtubeSearchHref, type VideoSearchKind } from "@/lib/auto-video-search";
import styles from "./auto-youtube-videos.module.css";

export function AutoVideoResults({ result, searches, names = [], englishNames, selectedKind = "all", language = "ja", hideKindFilters = false, hidePlayerSearch = false, registeredYoutubeIds = [] }: {
  result: AutoVideoResult; searches?: Partial<Record<VideoSearchKind, AutoVideoResult>>;
  selectedKind?: VideoSearchKind; language?: "ja" | "en"; hideKindFilters?: boolean; hidePlayerSearch?: boolean;
  names?: readonly string[]; englishNames?: readonly string[]; registeredYoutubeIds?: readonly string[];
}) {
  const [kind, setKind] = useState<VideoSearchKind>(selectedKind);
  const [visible, setVisible] = useState(12);
  const [extraPlayer, setExtraPlayer] = useState("");
  const playerTerm = extraPlayer.trim();
  const withPlayer = (base: readonly string[]) => [...new Set([...base, ...(playerTerm ? [playerTerm] : [])])];
  const externalNames = withPlayer(names);
  const currentHref = youtubeSearchHref(externalNames, kind, language);
  const ryuSuggestions = names.length === 1 && ["リュウ", "ryu"].includes(names[0].toLowerCase())
    ? ["shoto", "Yas", "ひなお", "Blaz"] : [];
  const selected = searches?.[kind] ?? result;
  const uniqueItems = filterUniqueAutoVideoHits(selected.items, registeredYoutubeIds);
  const shown = uniqueItems.slice(0, visible);
  // Search hits have no verified player/character/match association. Keep those fields empty.
  // A stable candidate ID permits favorite/watched without modifying published DB records.
  const cards: VideoSummary[] = shown.map(video => ({
    id: `youtube:${video.videoId}`,
    slug: `youtube-${video.videoId}`,
    title: video.title,
    platform: "youtube",
    videoType: null,
    publishedAt: null,
    description: null,
    url: video.watchUrl,
    thumbnailUrl: video.thumbnailUrl,
    channelName: video.channelTitle,
    durationSeconds: null,
    language: null,
    controlTypes: [],
    events: [],
    characters: [],
    players: [],
    categories: [],
    level: "unknown",
    viewCount: null,
    viewCountCheckedAt: null,
  }));
  return <section className={styles.panel} data-auto-video-state={selected.state}>
    <h3>{names.length ? `${names.join("・")}の動画を探す` : "スト6の動画を探す"}</h3>
    <p className={styles.note}>YouTubeの検索結果です。種類を選ぶと、その目的で検索した動画に切り替わります。内容や人物の一致を保証するものではありません。</p>
    {!hideKindFilters ? <div className={styles.filters} role="group" aria-label="動画の種類">
      {VIDEO_SEARCH_KINDS.filter(value => searches ? value in searches : ["all", "guide", "match", "combo"].includes(value)).map(value => <button key={value} type="button" aria-pressed={kind === value}
        onClick={() => { setKind(value); setVisible(12); }}>{VIDEO_SEARCH_LABELS[value]}</button>)}
    </div> : null}
    {selected.state === "RESULTS" ? <>
      <p role="status" aria-live="polite">{VIDEO_SEARCH_LABELS[kind]}：{uniqueItems.length}件中{shown.length}件表示</p>
      <div className="video-card-grid">{cards.map(video =>
        <VideoCard key={video.id} video={video} publishedDate={null} previewCandidate />
      )}</div>
      {visible < uniqueItems.length ? <button className={styles.more} type="button" onClick={() => setVisible(count => count + 12)}>もっと見る（残り{uniqueItems.length - visible}件）</button> : null}
    </> : <p role="status">{selected.state === "EMPTY" ? "この検索では動画が見つかりませんでした。下のリンクからYouTubeでも探せます。"
      : selected.state === "UNAVAILABLE" ? "現在、自動検索を利用できません。YouTubeで直接探せます。"
      : "動画を取得できませんでした。時間をおいて開き直すか、YouTubeで直接探してください。"}</p>}
    <div className={styles.external}>
      <h4>YouTubeでほかの動画を探す ↗</h4>
      {!hidePlayerSearch ? <>
      <div className={styles.searchForm}>
        <label>選手名を追加してYouTubeで探す<input value={extraPlayer} maxLength={40}
          onChange={event => setExtraPlayer(event.target.value)} placeholder="選手名を入力（省略できます）" /></label>
      </div>
      {ryuSuggestions.length ? <div>
        <p>リュウと組み合わせる検索候補</p>
        <div className={styles.filters} role="group" aria-label="選手名の検索候補">
          {ryuSuggestions.map(name => <button type="button" key={name} aria-pressed={extraPlayer === name}
            onClick={() => setExtraPlayer(name)}>{name}</button>)}
        </div>
      </div> : null}
      {playerTerm ? <div className={styles.filters}><button type="button" onClick={() => setExtraPlayer("")}>追加した選手名をクリア</button></div> : null}
      <p className={styles.note}>選手名の追加は下のYouTube検索リンクに反映されます。上に表示中の動画は変わりません。</p>
      </> : null}
      {currentHref ? <div className={styles.links}><a href={currentHref} target="_blank" rel="noopener noreferrer">今の検索条件で、もっと見る ↗</a></div>
        : <p role="status">検索語が長すぎるか、使用できない文字が含まれています。追加した選手名を短くするか、クリアしてください。</p>}
      {!hideKindFilters ? <p className={styles.note}>サイトに表示しきれない動画も探せます。英語検索では海外の試合・解説・コンボを探しやすくなります。</p> : null}
      {!hideKindFilters ? (["ja", "en"] as const).map(language => <div key={language}>
        <strong>{language === "ja" ? "日本語で検索" : "英語で検索"}</strong>
        <div className={styles.links}>{VIDEO_SEARCH_KINDS.map(value => {
          const href = youtubeSearchHref(withPlayer(language === "en" ? englishNames ?? names : names), value, language);
          return href ? <a key={value} href={href} target="_blank" rel="noopener noreferrer">{VIDEO_SEARCH_LABELS[value]} ↗</a> : null;
        })}</div>
      </div>) : null}
    </div>
  </section>;
}

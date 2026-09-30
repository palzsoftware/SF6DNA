import type { characterVideoReferences } from "@/lib/character-video-references";

export function CharacterVideoReferenceCard({ source, characterName }: { source: ReturnType<typeof characterVideoReferences>[number]; characterName: string }) {
  return <article className="video-card">
    <a className="video-card__thumbnail" href={source.url} target="_blank" rel="noopener noreferrer" aria-label={`${source.title}をYouTubeで見る`}><span style={{ backgroundImage: `url(${source.thumbnailUrl})` }} /></a>
    <div className="video-card__body">
      <span className="search-result__type">動画の参照元 · {characterName}</span>
      <h3><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></h3>
      {source.publisher ? <p>{source.publisher}</p> : null}
      <a className="video-card__watch" href={source.url} target="_blank" rel="noopener noreferrer">YouTubeで見る ↗</a>
    </div>
  </article>;
}

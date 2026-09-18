import type { PlayerSource } from "@/types/player";

export function playerRegionLabel(region: string | null, countryCode: string | null) {
  if (region) return region;
  return countryCode ? `国・地域：${countryCode}` : "地域情報は未登録です";
}

export function playerSourceCta(source: PlayerSource) {
  const haystack = `${source.sourceType} ${source.publisher ?? ""} ${source.title}`.toLowerCase();
  if (/(^|\s)(x|twitter)(\s|$)|x\.com/.test(haystack)) return "Player本人Xを見る";
  if (/youtube/.test(haystack)) return "YouTubeチャンネルを見る";
  if (/twitch/.test(haystack)) return "Twitchを見る";
  if (/capcom|official_esports|tournament/.test(haystack)) return "大会実績を確認する";
  if (/team|公式プロフィール/.test(haystack)) return "Team公式プロフィールを見る";
  if (/wiki|player_database|community/.test(haystack)) return "プレイヤー情報を確認する";
  return "情報源を見る";
}

export function safePlayerBio(bio: string | null) {
  if (!bio) return null;
  const japanese = bio
    .replace(/^Current (.+?) reference player on FGC Top Players \(2026 snapshot\)\.$/, "$1の大会データで使用実績を確認できるプレイヤーです。")
    .replace(/^Ryu reference player listed (?:at the top of|on) the current FGC Top Players Ryu page \(2026-08-26 snapshot\)\.$/, "公開大会データでリュウの使用実績を確認できるプレイヤーです。");
  return japanese;
}

import type { PlayerSource } from "@/types/player";

export function playerRegionLabel(region: string | null, countryCode: string | null) {
  if (region) return region;
  return countryCode ? `国・地域：${countryCode}` : "地域情報は未登録です";
}

export function playerSourceCta(source: PlayerSource) {
  const haystack = `${source.sourceType} ${source.publisher ?? ""} ${source.title}`.toLowerCase();
  if (/(^|\s)(x|twitter)(\s|$)|x\.com/.test(haystack)) return "本人のXを見る";
  if (/youtube/.test(haystack)) return "YouTubeチャンネルを見る";
  if (/twitch/.test(haystack)) return "Twitchを見る";
  if (/capcom|official_esports|tournament/.test(haystack)) return "大会実績を確認する";
  if (/team|公式プロフィール/.test(haystack)) return "チームの公式プロフィールを見る";
  if (/wiki|player_database|community/.test(haystack)) return "プレイヤー情報を確認する";
  return "情報源を見る";
}

export function safePlayerBio(bio: string | null) {
  if (!bio) return null;
  const japanese = bio
    .replace(/^Current (.+?) reference player on FGC Top Players \(2026 snapshot\)\.$/, "公開プロフィールに$1との関係が記載されています。")
    .replace(/^Ryu reference player listed (?:at the top of|on) the current FGC Top Players Ryu page \(2026-08-26 snapshot\)\.$/, "公開プロフィールにリュウとの関係が記載されています。")
    .replace(/^(.+?)選手。公開大会・プロフィールで(.+?)の使用関係を確認しています。関連動画と公式リンクから活動情報を確認できます。$/, "$1選手。公開プロフィールに$2との関係が記載されています。")
    .replace(/^JPを使用する若手競技プレイヤー。$/, "JPとの関係が公開情報に記載されている競技プレイヤーです。")
    .replace(/^2026年8月時点でJPを競技投入しているトッププロの参照候補。$/, "JPとの関係が公開情報に記載されているプロプレイヤーです。")
    .replace(/^JP専門プレイヤーとして参照する競技プレイヤー。$/, "公開プロフィールにJPとの関係が記載されている競技プレイヤーです。");
  return japanese;
}

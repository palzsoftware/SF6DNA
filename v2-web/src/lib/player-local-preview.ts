/**
 * Player図鑑のローカル確認専用スイッチ。
 * `next dev`(NODE_ENV=development) かつ SF6DNA_PLAYER_LOCAL_PREVIEW=1 のループバック要求だけ true。
 * Vercel 上(VERCEL が設定される)・本番ビルド・URLパラメータからは有効にならない。
 * 公開承認(PENDING)のデータそのものは変更しない。
 */
export function playerLocalPreviewEnabled(env: Record<string, string | undefined> = process.env, host: string | null = null): boolean {
  return env.NODE_ENV === "development" && env.SF6DNA_PLAYER_LOCAL_PREVIEW === "1" && !env.VERCEL &&
    (!env.VERCEL_ENV || env.VERCEL_ENV === "development") &&
    host !== null && /^(?:localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?$/i.test(host);
}

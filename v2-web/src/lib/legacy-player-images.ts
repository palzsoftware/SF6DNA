const VERIFIED_LEGACY_PLAYER_FILES: Record<string, string> = {
  blaz: "blaz.png",
  caba: "caba.png",
  dogura: "dogura.png",
  endingwalker: "endingwalker.png",
  go1: "go1.png",
  higuchi: "higuchi.png",
  hinao: "hinao.png",
  kilzyou: "kilzyou.png",
  micky: "micky.png",
  nemo: "nemo.png",
  ryusei: "ryusei.png",
  sako: "sako.png",
  shuto: "shuto.png",
  tachikawa: "tachikawa.png",
  takepi: "takepi.png",
  tokido: "tokido.png",
  yamaguchi: "yamaguchi.png",
};

const RAW_PLAYER_ASSET_BASE =
  "https://raw.githubusercontent.com/palzsoftware/SF6DNA/sf6dna-v2/assets/images/players";

export function legacyPlayerImageUrl(slug: string) {
  const file = VERIFIED_LEGACY_PLAYER_FILES[slug];
  return file ? `${RAW_PLAYER_ASSET_BASE}/${file}` : null;
}

const LEGACY_CHARACTER_FILES: Record<string, string> = {
  ryu: "ryu.jpg",
  luke: "luke.png",
  jamie: "jamie.jpg",
  "chun-li": "chunli.jpg",
  guile: "guile.jpg",
  kimberly: "kimberly.jpg",
  juri: "juri.jpg",
  ken: "ken.png",
  blanka: "blanka.jpg",
  dhalsim: "dhalsim.jpg",
  "e-honda": "ehonda.jpg",
  "dee-jay": "deejay.jpg",
  manon: "manon.jpg",
  marisa: "marisa.jpg",
  jp: "jp.jpg",
  zangief: "zangief.jpg",
  lily: "lily.jpg",
  cammy: "cammy.jpg",
  rashid: "rashid.png",
  aki: "aki.jpg",
  ed: "ed.jpg",
  akuma: "gouki.png",
  "m-bison": "bison.jpg",
  terry: "terry.jpg",
  mai: "mai.jpg",
  elena: "elena.jpg",
  sagat: "sagat.jpg",
  "c-viper": "cviper.jpg",
  alex: "alex.jpg",
  ingrid: "ingrid.jpg",
  yasmine: "yasmine.jpg",
};

const RAW_CHARACTER_ASSET_BASE =
  "https://raw.githubusercontent.com/palzsoftware/SF6DNA/sf6dna-v2/assets/images/characters";

export function legacyCharacterImageUrl(slug: string) {
  const file = LEGACY_CHARACTER_FILES[slug];
  return file ? `${RAW_CHARACTER_ASSET_BASE}/${file}` : null;
}

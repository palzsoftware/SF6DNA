const PLAYER_TYPE_LABELS: Record<string, string> = {
  pro: "プロ",
  competitive: "競技プレイヤー",
  non_pro_top: "非プロ強豪",
  legend: "Legend上位",
  specialist: "キャラ職人",
  streamer: "ストリーマー",
  vtuber: "VTuber",
  creator: "攻略投稿者",
  coach: "コーチ",
  other: "プレイヤー",
};

const PLAYER_ROLE_LABELS: Record<string, string> = {
  main: "メイン",
  secondary: "サブ",
  sub: "サブ",
  historical: "過去の使用",
  former: "過去の使用",
  tournament: "大会での使用",
  reference: "使用関係",
};

export function playerTypeLabel(value: string | null) {
  if (!value) return "プレイヤー";
  return PLAYER_TYPE_LABELS[value] ?? "プレイヤー";
}

export function playerRoleLabel(value: string | null) {
  if (!value) return "使用キャラクター";
  return PLAYER_ROLE_LABELS[value] ?? "使用キャラクター";
}

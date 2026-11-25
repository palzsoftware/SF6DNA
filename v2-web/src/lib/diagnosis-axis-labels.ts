/** Japanese labels of diagnosis axes. Shared by the result screen and the history screens so one key always
 * shows the same name (e.g. setup → 設置・セットプレイ). Unknown keys are returned as-is. */
export const DIAGNOSIS_AXIS_LABELS: Readonly<Record<string, string>> = {
  anti_air: "対空", drive_rush_defense: "ドライブラッシュ対応", impact_response: "インパクト返し", punish: "確定反撃",
  defense: "防御・切り返し", offense: "攻めの選択肢", meter: "ゲージ管理", matchup: "キャラ対策",
  execution: "コンボ・セットプレイ精度", neutral: "中距離・立ち回り", corner_defense: "画面端の守り", decision: "観察・判断",
  aggression: "前に出る攻め", patience: "待ち・観察", keepout: "遠距離・けん制", rushdown: "近距離ラッシュ",
  grappling: "投げ・コマンド投げ", setup: "設置・セットプレイ", footsies: "差し合い・地上戦", mobility: "機動力・位置調整",
  simplicity: "操作の分かりやすさ", technicality: "テクニカル操作", defense_preference: "守りから組み立てる", explosive: "一気に試合を動かす",
};

export function diagnosisAxisLabel(key: string): string {
  return Object.prototype.hasOwnProperty.call(DIAGNOSIS_AXIS_LABELS, key) ? DIAGNOSIS_AXIS_LABELS[key] : key;
}

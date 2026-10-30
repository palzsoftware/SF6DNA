/** Display copy only. Never changes diagnosis identity, questions or scoring. */
const COPY: Record<string, { title: string; label: string; description: string }> = {
  "上達課題診断": { title: "PLAY・課題診断", label: "今の課題を見つけたい", description: "対空、画面端の守り、攻めの判断。普段の対戦を振り返って、まず練習したいことを見つけよう。" },
  "プレイスタイル診断": { title: "プレイスタイル診断", label: "自分の戦い方を知りたい", description: "攻めたい？ じっくり待ちたい？ あなたが選びがちな動きから、好きな戦い方を探ろう。" },
  "キャラクター適性診断": { title: "キャラ適性診断", label: "使うキャラに迷っている", description: "操作の好みや、やってみたい戦い方からキャラ選びのヒントを探そう。" },
  "総合簡易診断": { title: "まとめて診断", label: "ひと通り知りたい", description: "プレイの好みと今の課題をまとめてチェック。どの診断にするか迷ったら、ここから。" },
};
export function diagnosisPresentation(title: string, description: string | null) {
  return COPY[title] ?? { title, label: "プレイを振り返る", description: description ?? "普段の対戦を思い出しながら答えてみよう。" };
}

import type { ReactNode } from "react";
import type { StrategyCardView } from "@/components/strategy-card-explorer";
import { RyuComboRoute } from "@/components/ryu-combo-preview-cards";
import styles from "./ryu-combo-preview-cards.module.css";

type RyuSequenceCandidate = {
  id: string;
  title: string;
  route: string;
  summary: string;
  feature: string;
  conditions: string;
  cautions: string;
  other: string;
  damageLabel: string;
  driveGaugeLabel: string;
  saUsage: string;
  difficulty: string;
  patch: string;
  sourceUrl: string;
  sourceCode: string;
  researchDate: string;
  evidenceStatus: string;
  frameNote: string;
  relationNote: string;
  tags: string[];
};

const candidates: RyuSequenceCandidate[] = [
  {
    "id": "RYU-R5-P001",
    "title": "鳩尾砕きガード＋3→投げ",
    "route": "6強P（ガード+3）→ 通常投げ",
    "summary": "2026年調整でガードバック縮小。投げ距離内か要確認。",
    "feature": "2026年調整でガードバック縮小。投げ距離内か要確認。",
    "conditions": "近距離",
    "cautions": "未記載",
    "other": "未記載",
    "damageLabel": "未記載（資料に記載なし）",
    "driveGaugeLabel": "未記載（資料に記載なし）",
    "saUsage": "ルート内にSA記載なし（SA不使用を保証しない）",
    "difficulty": "中級",
    "patch": "2026-08-03 Year4",
    "sourceUrl": "https://sf6-genten.com/character/ryu",
    "sourceCode": "G",
    "researchDate": "2026-11-05",
    "evidenceStatus": "出典候補をもとにした資料記載。現行Patch・実機成立は未確認",
    "frameNote": "資料記載：＋3F（現行Patch・実機未確認）",
    "relationNote": "R5に相互参照IDなし。対応関係を確認するまでリンク未設定。",
    "tags": [
      "投げ択",
      "投げ連携",
      "固め"
    ]
  },
  {
    "id": "RYU-R5-P002",
    "title": "鳩尾砕きガード＋3→小技",
    "route": "6強P（ガード+3）→ 5弱P",
    "summary": "相手の暴れに勝つ択。",
    "feature": "相手の暴れに勝つ択。",
    "conditions": "近距離",
    "cautions": "未記載",
    "other": "未記載",
    "damageLabel": "未記載（資料に記載なし）",
    "driveGaugeLabel": "未記載（資料に記載なし）",
    "saUsage": "ルート内にSA記載なし（SA不使用を保証しない）",
    "difficulty": "中級",
    "patch": "2026-08-03 Year4",
    "sourceUrl": "https://sf6-genten.com/character/ryu",
    "sourceCode": "G",
    "researchDate": "2026-11-05",
    "evidenceStatus": "出典候補をもとにした資料記載。現行Patch・実機成立は未確認",
    "frameNote": "資料記載：＋3F（現行Patch・実機未確認）",
    "relationNote": "R5に相互参照IDなし。対応関係を確認するまでリンク未設定。",
    "tags": [
      "暴れ潰し",
      "固め"
    ]
  },
  {
    "id": "RYU-R5-P003",
    "title": "鳩尾砕きガード＋3→下段",
    "route": "6強P → 2弱K",
    "summary": "後退歩きなどへの下段。",
    "feature": "後退歩きなどへの下段。",
    "conditions": "近距離",
    "cautions": "未記載",
    "other": "未記載",
    "damageLabel": "未記載（資料に記載なし）",
    "driveGaugeLabel": "未記載（資料に記載なし）",
    "saUsage": "ルート内にSA記載なし（SA不使用を保証しない）",
    "difficulty": "中級",
    "patch": "2026-08-03 Year4",
    "sourceUrl": "https://sf6-genten.com/character/ryu",
    "sourceCode": "G",
    "researchDate": "2026-11-05",
    "evidenceStatus": "出典候補をもとにした資料記載。現行Patch・実機成立は未確認",
    "frameNote": "資料記載：＋3F（現行Patch・実機未確認）",
    "relationNote": "R5に相互参照IDなし。対応関係を確認するまでリンク未設定。",
    "tags": [
      "中下段",
      "下段",
      "固め"
    ]
  },
  {
    "id": "RYU-R5-P004",
    "title": "鳩尾砕きガード＋3→下がりシミー",
    "route": "6強P → 微後退 → PC反撃",
    "summary": "投げ抜け空振りを誘う。",
    "feature": "投げ抜け空振りを誘う。",
    "conditions": "近距離",
    "cautions": "未記載",
    "other": "未記載",
    "damageLabel": "未記載（資料に記載なし）",
    "driveGaugeLabel": "未記載（資料に記載なし）",
    "saUsage": "ルート内にSA記載なし（SA不使用を保証しない）",
    "difficulty": "中級",
    "patch": "2026-08-03 Year4",
    "sourceUrl": "https://sf6-genten.com/character/ryu",
    "sourceCode": "G",
    "researchDate": "2026-11-05",
    "evidenceStatus": "出典候補をもとにした資料記載。現行Patch・実機成立は未確認",
    "frameNote": "資料記載：＋3F（現行Patch・実機未確認）",
    "relationNote": "R5に相互参照IDなし。対応関係を確認するまでリンク未設定。",
    "tags": [
      "シミー",
      "投げ狩り",
      "固め"
    ]
  },
  {
    "id": "RYU-R5-P005",
    "title": "鳩尾砕き先端→投げ非成立",
    "route": "6強P（先端ガード）→ 投げを控える",
    "summary": "先端では投げが届かない可能性を警告。",
    "feature": "先端では投げが届かない可能性を警告。",
    "conditions": "先端",
    "cautions": "未記載",
    "other": "未記載",
    "damageLabel": "未記載（資料に記載なし）",
    "driveGaugeLabel": "未記載（資料に記載なし）",
    "saUsage": "ルート内にSA記載なし（SA不使用を保証しない）",
    "difficulty": "中級",
    "patch": "2026-08-03 Year4",
    "sourceUrl": "https://sf6-genten.com/character/ryu/category/okizeme-setplay",
    "sourceCode": "O",
    "researchDate": "2026-11-05",
    "evidenceStatus": "出典候補をもとにした資料記載。現行Patch・実機成立は未確認",
    "frameNote": "資料に数値記載なし",
    "relationNote": "R5に相互参照IDなし。対応関係を確認するまでリンク未設定。",
    "tags": [
      "距離管理",
      "投げ間合い"
    ]
  },
  {
    "id": "RYU-R5-P006",
    "title": "立ち強Kガード＋1→継続",
    "route": "5強K（ガード+1）→ 5弱P",
    "summary": "攻め継続候補。発生・間合い要確認。",
    "feature": "攻め継続候補。発生・間合い要確認。",
    "conditions": "ガード+1",
    "cautions": "未記載",
    "other": "未記載",
    "damageLabel": "未記載（資料に記載なし）",
    "driveGaugeLabel": "未記載（資料に記載なし）",
    "saUsage": "ルート内にSA記載なし（SA不使用を保証しない）",
    "difficulty": "中級",
    "patch": "2026-08-03 Year4",
    "sourceUrl": "https://sf6-lab.net/fighters/ryu/frame",
    "sourceCode": "F",
    "researchDate": "2026-11-05",
    "evidenceStatus": "出典候補をもとにした資料記載。現行Patch・実機成立は未確認",
    "frameNote": "資料記載：＋1F（現行Patch・実機未確認）",
    "relationNote": "R5に相互参照IDなし。対応関係を確認するまでリンク未設定。",
    "tags": [
      "固め",
      "暴れ潰し"
    ]
  },
  {
    "id": "RYU-R5-P007",
    "title": "しゃがみ中P五分→投げの読み合い",
    "route": "2中P（ガード0）→ 投げ／後退",
    "summary": "確定ではなく読み合い。",
    "feature": "確定ではなく読み合い。",
    "conditions": "ガード0",
    "cautions": "未記載",
    "other": "未記載",
    "damageLabel": "未記載（資料に記載なし）",
    "driveGaugeLabel": "未記載（資料に記載なし）",
    "saUsage": "ルート内にSA記載なし（SA不使用を保証しない）",
    "difficulty": "中級",
    "patch": "2026-08-03 Year4",
    "sourceUrl": "https://sf6-lab.net/fighters/ryu/frame",
    "sourceCode": "F",
    "researchDate": "2026-11-05",
    "evidenceStatus": "出典候補をもとにした資料記載。現行Patch・実機成立は未確認",
    "frameNote": "資料記載：0F（現行Patch・実機未確認）",
    "relationNote": "R5に相互参照IDなし。対応関係を確認するまでリンク未設定。",
    "tags": [
      "投げ択",
      "シミー",
      "固め"
    ]
  },
  {
    "id": "RYU-R5-P008",
    "title": "立ち中Pガード−1→キャンセル択",
    "route": "5中P（ガード-1）→ 必殺技キャンセル",
    "summary": "通常技単発後の暴れとキャンセルの読み合い。連続ガード未判定。",
    "feature": "通常技単発後の暴れとキャンセルの読み合い。連続ガード未判定。",
    "conditions": "キャンセル可能",
    "cautions": "未記載",
    "other": "未記載",
    "damageLabel": "未記載（資料に記載なし）",
    "driveGaugeLabel": "未記載（資料に記載なし）",
    "saUsage": "ルート内にSA記載なし（SA不使用を保証しない）",
    "difficulty": "中級",
    "patch": "2026-08-03 Year4",
    "sourceUrl": "https://sf6-lab.net/fighters/ryu/frame",
    "sourceCode": "F",
    "researchDate": "2026-11-05",
    "evidenceStatus": "出典候補をもとにした資料記載。現行Patch・実機成立は未確認",
    "frameNote": "資料記載：−1F（現行Patch・実機未確認）",
    "relationNote": "R5に相互参照IDなし。対応関係を確認するまでリンク未設定。",
    "tags": [
      "キャンセル択",
      "固め"
    ]
  },
  {
    "id": "RYU-R5-P009",
    "title": "立ち弱P近距離→投げ",
    "route": "5弱P（ガード-1）→ 通常投げ",
    "summary": "Year4ガードバック縮小で投げが届きやすい。",
    "feature": "Year4ガードバック縮小で投げが届きやすい。",
    "conditions": "密着",
    "cautions": "未記載",
    "other": "未記載",
    "damageLabel": "未記載（資料に記載なし）",
    "driveGaugeLabel": "未記載（資料に記載なし）",
    "saUsage": "ルート内にSA記載なし（SA不使用を保証しない）",
    "difficulty": "中級",
    "patch": "2026-08-03 Year4",
    "sourceUrl": "https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/ryu",
    "sourceCode": "P",
    "researchDate": "2026-11-05",
    "evidenceStatus": "出典候補をもとにした資料記載。現行Patch・実機成立は未確認",
    "frameNote": "資料記載：-1F（現行Patch・実機未確認）",
    "relationNote": "R5に相互参照IDなし。対応関係を確認するまでリンク未設定。",
    "tags": [
      "投げ択",
      "固め"
    ]
  },
  {
    "id": "RYU-R5-P010",
    "title": "電刃OD波掌撃ガード＋4→投げ",
    "route": "電刃OD波掌撃（ガード+4）→ 投げ",
    "summary": "有利技を起点とした投げ択。",
    "feature": "有利技を起点とした投げ択。",
    "conditions": "電刃所持",
    "cautions": "未記載",
    "other": "未記載",
    "damageLabel": "未記載（資料に記載なし）",
    "driveGaugeLabel": "未記載（資料に記載なし）",
    "saUsage": "ルート内にSA記載なし（SA不使用を保証しない）",
    "difficulty": "中級",
    "patch": "2026-08-03 Year4",
    "sourceUrl": "https://sf6-genten.com/character/ryu",
    "sourceCode": "G",
    "researchDate": "2026-11-05",
    "evidenceStatus": "出典候補をもとにした資料記載。現行Patch・実機成立は未確認",
    "frameNote": "資料記載：＋4F（現行Patch・実機未確認）",
    "relationNote": "R5に相互参照IDなし。対応関係を確認するまでリンク未設定。",
    "tags": [
      "投げ択",
      "固め"
    ]
  },
  {
    "id": "RYU-R5-P011",
    "title": "電刃OD波掌撃ガード＋4→弱P",
    "route": "電刃OD波掌撃（ガード+4）→ 5弱P",
    "summary": "暴れ潰し用。",
    "feature": "暴れ潰し用。",
    "conditions": "電刃所持",
    "cautions": "未記載",
    "other": "未記載",
    "damageLabel": "未記載（資料に記載なし）",
    "driveGaugeLabel": "未記載（資料に記載なし）",
    "saUsage": "ルート内にSA記載なし（SA不使用を保証しない）",
    "difficulty": "中級",
    "patch": "2026-08-03 Year4",
    "sourceUrl": "https://sf6-genten.com/character/ryu",
    "sourceCode": "G",
    "researchDate": "2026-11-05",
    "evidenceStatus": "出典候補をもとにした資料記載。現行Patch・実機成立は未確認",
    "frameNote": "資料記載：＋4F（現行Patch・実機未確認）",
    "relationNote": "R5に相互参照IDなし。対応関係を確認するまでリンク未設定。",
    "tags": [
      "暴れ潰し",
      "固め"
    ]
  },
  {
    "id": "RYU-R5-P012",
    "title": "電刃OD波掌撃ガード＋4→2中P",
    "route": "電刃OD波掌撃（ガード+4）→ 2中P",
    "summary": "弱技以外の暴れ狩り候補。距離要確認。",
    "feature": "弱技以外の暴れ狩り候補。距離要確認。",
    "conditions": "電刃所持",
    "cautions": "未記載",
    "other": "未記載",
    "damageLabel": "未記載（資料に記載なし）",
    "driveGaugeLabel": "未記載（資料に記載なし）",
    "saUsage": "ルート内にSA記載なし（SA不使用を保証しない）",
    "difficulty": "中級",
    "patch": "2026-08-03 Year4",
    "sourceUrl": "https://sf6-lab.net/fighters/ryu/combo",
    "sourceCode": "L",
    "researchDate": "2026-11-05",
    "evidenceStatus": "出典候補をもとにした資料記載。現行Patch・実機成立は未確認",
    "frameNote": "資料記載：＋4F（現行Patch・実機未確認）",
    "relationNote": "R5に相互参照IDなし。対応関係を確認するまでリンク未設定。",
    "tags": [
      "暴れ潰し",
      "固め"
    ]
  },
  {
    "id": "RYU-R5-P013",
    "title": "電刃OD波掌撃ガード＋4→シミー",
    "route": "電刃OD波掌撃（ガード+4）→ 後ろ歩き",
    "summary": "投げを警戒する相手への対択。",
    "feature": "投げを警戒する相手への対択。",
    "conditions": "電刃所持",
    "cautions": "未記載",
    "other": "未記載",
    "damageLabel": "未記載（資料に記載なし）",
    "driveGaugeLabel": "未記載（資料に記載なし）",
    "saUsage": "ルート内にSA記載なし（SA不使用を保証しない）",
    "difficulty": "中級",
    "patch": "2026-08-03 Year4",
    "sourceUrl": "https://sf6-lab.net/fighters/ryu/combo",
    "sourceCode": "L",
    "researchDate": "2026-11-05",
    "evidenceStatus": "出典候補をもとにした資料記載。現行Patch・実機成立は未確認",
    "frameNote": "資料記載：＋4F（現行Patch・実機未確認）",
    "relationNote": "R5に相互参照IDなし。対応関係を確認するまでリンク未設定。",
    "tags": [
      "シミー",
      "投げ狩り",
      "固め"
    ]
  },
  {
    "id": "RYU-R5-P014",
    "title": "電刃OD波動拳ガード＋2→DR継続",
    "route": "電刃OD波動拳（ガード+2）→ 接近",
    "summary": "電刃中の有利ガードを利用。距離条件が重要。",
    "feature": "電刃中の有利ガードを利用。距離条件が重要。",
    "conditions": "電刃所持",
    "cautions": "未記載",
    "other": "未記載",
    "damageLabel": "未記載（資料に記載なし）",
    "driveGaugeLabel": "未記載（資料に記載なし）",
    "saUsage": "ルート内にSA記載なし（SA不使用を保証しない）",
    "difficulty": "中級",
    "patch": "2026-08-03 Year4",
    "sourceUrl": "https://sf6-genten.com/character/ryu",
    "sourceCode": "G",
    "researchDate": "2026-11-05",
    "evidenceStatus": "出典候補をもとにした資料記載。現行Patch・実機成立は未確認",
    "frameNote": "資料記載：＋2F（現行Patch・実機未確認）",
    "relationNote": "R5に相互参照IDなし。対応関係を確認するまでリンク未設定。",
    "tags": [
      "ドライブラッシュ",
      "固め"
    ]
  },
  {
    "id": "RYU-R5-P020",
    "title": "OD足刀運び→投げか打撃",
    "route": "OD足刀→旋風脚→竜巻→前ステ2回",
    "summary": "中央運び後の投げ・打撃分岐。",
    "feature": "中央運び後の投げ・打撃分岐。",
    "conditions": "中央",
    "cautions": "未記載",
    "other": "未記載",
    "damageLabel": "未記載（資料に記載なし）",
    "driveGaugeLabel": "未記載（資料に記載なし）",
    "saUsage": "ルート内にSA記載なし（SA不使用を保証しない）",
    "difficulty": "中級",
    "patch": "2026-08-03 Year4",
    "sourceUrl": "https://sf6-lab.net/fighters/ryu/combo",
    "sourceCode": "L",
    "researchDate": "2026-11-05",
    "evidenceStatus": "出典候補をもとにした資料記載。現行Patch・実機成立は未確認",
    "frameNote": "資料に数値記載なし",
    "relationNote": "R5に相互参照IDなし。対応関係を確認するまでリンク未設定。",
    "tags": [
      "投げ択",
      "打撃択",
      "固め"
    ]
  },
  {
    "id": "RYU-R5-P025",
    "title": "相手BO中の鳩尾連携",
    "route": "6強P（ガード+3）→ 投げ／2弱K",
    "summary": "通常と異なるBOの硬直差は実機検証時に別途照合。",
    "feature": "通常と異なるBOの硬直差は実機検証時に別途照合。",
    "conditions": "相手バーンアウト",
    "cautions": "未記載",
    "other": "未記載",
    "damageLabel": "未記載（資料に記載なし）",
    "driveGaugeLabel": "未記載（資料に記載なし）",
    "saUsage": "ルート内にSA記載なし（SA不使用を保証しない）",
    "difficulty": "中級",
    "patch": "2026-08-03 Year4",
    "sourceUrl": "https://sf6-genten.com/character/ryu",
    "sourceCode": "G",
    "researchDate": "2026-11-05",
    "evidenceStatus": "出典候補をもとにした資料記載。現行Patch・実機成立は未確認",
    "frameNote": "資料記載：+3F（現行Patch・実機未確認）",
    "relationNote": "R5に相互参照IDなし。対応関係を確認するまでリンク未設定。",
    "tags": [
      "投げ択",
      "中下段",
      "固め",
      "バーンアウト"
    ]
  }
];

function RyuSequenceCandidateCard({ candidate }: { candidate: RyuSequenceCandidate }) {
  return <article className={styles.card} data-research-status="unverified">
    <small className={styles.tag}>R5資料候補 / 未検証</small>
    <h3>{candidate.title}</h3>
    <div className={styles.route}>
      <strong>連携ルート</strong>
      <RyuComboRoute route={candidate.route} />
    </div>
    <p className={styles.summary}>{candidate.summary}</p>
    <details className={styles.details}>
      <summary>有利フレーム・特徴・条件を開く</summary>
      <dl>
        <div><dt>資料上の硬直差</dt><dd>{candidate.frameNote}</dd></div>
        <div><dt>ダメージ</dt><dd>{candidate.damageLabel}</dd></div>
        <div><dt>ドライブゲージ使用量</dt><dd>{candidate.driveGaugeLabel}</dd></div>
        <div><dt>SA使用・位置</dt><dd>{candidate.saUsage}</dd></div>
        <div><dt>この連携の特徴</dt><dd>{candidate.feature}</dd></div>
        <div><dt>成立条件</dt><dd>{candidate.conditions}</dd></div>
        <div><dt>注意点</dt><dd>{candidate.cautions}</dd></div>
        <div><dt>その他</dt><dd>{candidate.other}</dd></div>
        <div><dt>資料上の難易度</dt><dd>{candidate.difficulty}</dd></div>
        <div><dt>参照Patch</dt><dd>資料記載：{candidate.patch}（最新Patchとの一致は未確認）</dd></div>
        <div><dt>確認状態</dt><dd>{candidate.evidenceStatus}</dd></div>
        <div><dt>関連カード</dt><dd>{candidate.relationNote}</dd></div>
        <div><dt>GIF</dt><dd>未設定</dd></div>
      </dl>
      <p className={styles.source}>
        <span>Drive候補ID {candidate.id}・調査日 {candidate.researchDate}:</span>{" "}
        <a href={candidate.sourceUrl} target="_blank" rel="noopener noreferrer">出典候補を開く ↗</a>
      </p>
    </details>
  </article>;
}

export function projectRyuSequencePreviewCards(): StrategyCardView[] {
  return candidates.map(candidate => ({
    id: candidate.id,
    kind: "sequence",
    title: candidate.title,
    category: "R5候補",
    categoryLabel: "R5資料候補",
    searchTerms: [candidate.id, candidate.route, candidate.summary, candidate.feature, candidate.conditions, candidate.cautions, ...candidate.tags],
    driveCost: null,
    saCost: null,
    content: <RyuSequenceCandidateCard key={candidate.id} candidate={candidate} /> as ReactNode,
  }));
}

export function RyuSequencePreviewNotice() {
  return <aside className={styles.notice} role="note">
    <strong>Preview限定：R5連携候補16件</strong>
    <p>Drive研究資料のRYU-R5-P001〜P014・P020・P025から作成した候補です。資料上のフレーム記載、現行Patchとの一致、距離別の成立、相手の行動に対する結果は未検証です。ダメージ・ゲージ消費は資料に数値がないため補っていません。連続ガード成立も未確認です。</p>
    <p>実機検証・公開承認は未完了です。ProductionとDBには反映しません。</p>
  </aside>;
}

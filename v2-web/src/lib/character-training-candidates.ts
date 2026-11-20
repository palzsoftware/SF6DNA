// キャラ別の練習候補（初級・中級・上級）の読み込み。
// 既存の診断・採点・推薦ロジック（daily-training*.ts）には接続しない、独立した候補データの参照用。
// 公開承認がすべて PENDING のため、公開画面では返さない（allowPending を明示した確認用のみ返す）。
import data from "@/data/training-candidates/character-training-candidates-20261120.json";
import cardRefs from "@/data/training-candidates/strategy-card-refs-20261120.json";

export type TrainingLevel = "beginner" | "intermediate" | "advanced";

export type CharacterTrainingCandidate = {
  id: string;
  /** 旧仮番号（R12/R13由来のみ）。後方互換のため残す。新規バッチ分は空文字 */
  strategyManagementNo: string;
  /** 参照する攻略カードの NB-仮ID（正式番号は未採番）。旧データには無い */
  strategyBatchId?: string;
  level: TrainingLevel;
  levelLabel: string;
  title: string;
  purpose: string;
  steps: string[];
  trainingSettings: string[];
  successCondition: string[];
  matchUse: string[];
  matchUseNote: string;
  source: { url: string; pageUpdated: string; patchStatedBySource: string };
  evidence: string;
  gameVerification: string;
  publicationApproval: string;
  /** ACTIVE=有効候補 / PATCH_HOLD=Patch影響確認待ち / EXCLUDED_DUPLICATE=重複除外。旧データには無い（=ACTIVE扱い） */
  candidateStatus?: "ACTIVE" | "PATCH_HOLD" | "EXCLUDED_DUPLICATE";
  candidateStatusNote?: string;
};

type CandidateFile = { characters: Record<string, CharacterTrainingCandidate[]> };
const LEVEL_ORDER: readonly TrainingLevel[] = ["beginner", "intermediate", "advanced"];
type CardRef = { publication: string; formerProvisionalNo?: string };
type CardRefFile = { cards: Record<string, CardRef> };

/** 参照する攻略カードのID。新形式（strategyBatchId）を優先し、無ければ旧仮番号を返す */
export function strategyRefOf(c: CharacterTrainingCandidate): string {
  return c.strategyBatchId || c.strategyManagementNo;
}

/** 参照する攻略カードを探す。新形式は NB-仮ID、旧形式は旧仮番号（formerProvisionalNo）で引く */
function findCardRef(c: CharacterTrainingCandidate, refs: CardRefFile): CardRef | undefined {
  if (c.strategyBatchId) {
    return Object.prototype.hasOwnProperty.call(refs.cards, c.strategyBatchId) ? refs.cards[c.strategyBatchId] : undefined;
  }
  if (!c.strategyManagementNo) return undefined;
  return Object.values(refs.cards).find((r) => r.formerProvisionalNo === c.strategyManagementNo);
}

/** 参照する攻略カードが公開承認済みか。新形式・旧形式とも、カードが未承認・見つからない場合は公開しない */
function referencedCardApproved(c: CharacterTrainingCandidate, refs: CardRefFile): boolean {
  return findCardRef(c, refs)?.publication === "APPROVED";
}

/** 有効候補か（candidateStatus が無い旧データは ACTIVE とみなす） */
export function isActive(c: CharacterTrainingCandidate): boolean {
  return (c.candidateStatus ?? "ACTIVE") === "ACTIVE";
}

export function listCharacterTrainingCandidates(
  characterSlug: string,
  options: { level?: TrainingLevel; allowPending?: boolean; source?: CandidateFile; cardRefs?: CardRefFile } = {},
): CharacterTrainingCandidate[] {
  const file = options.source ?? (data as CandidateFile);
  const refs = options.cardRefs ?? (cardRefs as CardRefFile);
  if (!Object.prototype.hasOwnProperty.call(file.characters, characterSlug)) return [];
  return file.characters[characterSlug]
    // 公開: 候補自身と参照カードの両方が承認済みのときだけ。確認用(allowPending)はどちらも問わない
    // 公開: 有効候補（ACTIVE）で、候補自身と参照カードの両方が承認済みのときだけ。確認用(allowPending)は状態を問わず返す
    .filter((c) => options.allowPending === true || (isActive(c) && c.publicationApproval === "APPROVED" && referencedCardApproved(c, refs)))
    .filter((c) => !options.level || c.level === options.level)
    .slice()
    .sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level));
}

export function trainingCandidateCoverage(source: CandidateFile = data as CandidateFile) {
  return Object.entries(source.characters).map(([slug, all]) => ({ slug, total: all.length, list: all.filter(isActive) })).map(({ slug, total, list }) => ({
    slug,
    total,
    active: list.length,
    beginner: list.filter((c) => c.level === "beginner").length,
    intermediate: list.filter((c) => c.level === "intermediate").length,
    advanced: list.filter((c) => c.level === "advanced").length,
  }));
}

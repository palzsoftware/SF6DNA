import type { DevicePreviewBundle } from "@/lib/device-preview";
import type { StrategyCardView } from "@/components/strategy-card-explorer";
import { StrategyCardContent } from "@/components/strategy-card-content";
import { PilotComboCard } from "@/components/pilot-combo-card";
import { normalizePublicCopy } from "@/lib/public-copy";

/** Call only with an already-authorized Preview RPC result. Never pass local research snapshots. */
export function projectPreviewStrategyCards(bundle: DevicePreviewBundle): StrategyCardView[] {
  const clean = (value?: string | null) => value ? normalizePublicCopy(value) : null;
  const combos: StrategyCardView[] = bundle.combos.map(combo => ({
    id: combo.id, kind: "combo", title: combo.name,
    category: combo.category, categoryLabel: combo.category,
    driveCost: combo.driveCost, saCost: combo.saCost,
    searchTerms: [combo.command, combo.purpose, combo.startCondition, combo.endCondition, combo.position, combo.difficulty,
      combo.saCost == null ? null : `SA${combo.saCost}`].filter((v): v is string => typeof v === "string" && v.length > 0),
    content: <PilotComboCard key={combo.id} sample combo={{
      id: combo.id, href: `/combos/${encodeURIComponent(combo.slug)}`, name: combo.name,
      purpose: clean(combo.purpose), damage: combo.damage, drive: combo.driveCost, sa: combo.saCost,
      difficulty: combo.difficulty && /^\d+$/.test(combo.difficulty) ? Number(combo.difficulty) : null,
      verificationStatus: combo.verificationStatus, preview: true,
      category: combo.category, command: clean(combo.command),
      startCondition: clean(combo.startCondition), endCondition: clean(combo.endCondition),
      position: combo.position, patch: combo.patch, sourceLabel: combo.sourceLabel, sourceUrl: combo.sourceUrl,
      media: null,
    }} />,
  }));
  const setups: StrategyCardView[] = bundle.setups.map(setup => ({
    id: setup.id, kind: "setplay", title: setup.name, category: setup.setupType,
    searchTerms: [setup.command,setup.startCondition,setup.successCondition,setup.position,setup.description,setup.opponentOptions].filter((v): v is string => !!v),
    content: <StrategyCardContent title={setup.name} tag={setup.setupType} media={null} facts={[
      {label:"コマンド",value:clean(setup.command)},{label:"開始条件",value:clean(setup.startCondition)},
      {label:"成立条件",value:clean(setup.successCondition)},
      {label:"位置",value:clean(setup.position)},{label:"対応Patch",value:clean(setup.patch)},
      {label:"検証状況",value:setup.verificationStatus},
    ]} description={clean(setup.description)} source={setup.sourceLabel && setup.sourceUrl ? {label:setup.sourceLabel,url:setup.sourceUrl} : null} />,
  }));
  const sequences: StrategyCardView[] = bundle.sequences.map(seq => ({
    id: seq.id, kind: "sequence", title: seq.name, category: seq.sequenceType,
    searchTerms: [seq.purpose,seq.sequenceText,seq.condition,seq.notes,seq.strikeOption,seq.throwOption].filter((v): v is string => !!v),
    content: <StrategyCardContent title={seq.name} tag={seq.sequenceType} media={null} facts={[
      {label:"連携手順",value:clean(seq.sequenceText)},{label:"成立条件",value:clean(seq.condition)},
      {label:"投げ",value:clean(seq.throwOption)},{label:"打撃",value:clean(seq.strikeOption)},
      {label:"対応Patch",value:clean(seq.patch)},{label:"検証状況",value:seq.verificationStatus},
    ]} description={clean(seq.notes ?? seq.purpose)} source={seq.sourceLabel && seq.sourceUrl ? {label:seq.sourceLabel,url:seq.sourceUrl} : null} />,
  }));
  const counters: StrategyCardView[] = bundle.matchups.map(counter => ({
    id: counter.id, kind: "counter", title: counter.title, category: counter.counterType,
    searchTerms: [counter.summary,counter.counterType,counter.opponentCharacterId].filter((v): v is string => !!v),
    content: <StrategyCardContent title={counter.title} tag={counter.counterType} media={null} facts={[
      {label:"相手キャラID",value:counter.opponentCharacterId},
      {label:"難易度",value:counter.difficulty},{label:"検証状況",value:counter.verificationStatus},
    ]} description={clean(counter.summary)} />,
  }));
  return [...combos,...setups,...sequences,...counters];
}

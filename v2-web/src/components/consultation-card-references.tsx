import Link from 'next/link';
import { Sf6CardCommand, Sf6CardRecipe } from './sf6-card-command';
import { matchCardPayloads, type ConsultationCardPayload } from '../lib/consultation-card-payload';
import type { Relation } from '../lib/character-consultation';
export type { ConsultationCardPayload } from '../lib/consultation-card-payload';

// Only Result-admitted relations reach this presentation boundary.
export function ConsultationCardReferences({ relations, payloads, kind = 'Move' }: {
  relations: readonly Relation[]; payloads: readonly ConsultationCardPayload[]; kind?: 'Move' | 'Combo';
}) {
  const cards = matchCardPayloads(relations, payloads);
  return cards.length ? <>{cards.map(({ relation, payload }) => <article key={relation.kind + ':' + relation.id}>
    <h3>{payload.title}</h3><p>{payload.reason}</p><p>条件：{payload.condition}</p>
    {(payload.localReference || payload.localJpReference) && <p>RC・ローカル確認用。DBの対応版は{payload.patch}です。公式現行Patchとの一致と動作映像は確認中です。</p>}
    {payload.localComboReference && <><p>RC・ローカル確認用。録画で観測したサンプルです。対応バージョン・Modern・ジャスト成功の客観確認・映像表示は確認中です。</p>
      <dl><dt>ダメージ</dt><dd>{payload.localComboReference.damage}（検証録画）</dd>
      <dt>Drive消費</dt><dd>{payload.localComboReference.drive_cost}本</dd>
      <dt>SA消費</dt><dd>{payload.localComboReference.sa_cost}</dd>
      <dt>終了時の有利時間</dt><dd>+{payload.localComboReference.end_frame}F（検証録画）</dd></dl></>}
    {payload.cardType === 'Move' ? <Sf6CardCommand input={payload.input} /> : <Sf6CardRecipe recipe={payload.recipe} />}
    <Link href={relation.href}>カードの詳細を見る</Link>
  </article>)}</> : <p>{kind === 'Move' ? 'おすすめの技は現在確認中です。まずは下の練習から始めましょう。' : 'おすすめのコンボは現在確認中です。まずは基本操作の練習を優先しましょう。'}</p>;
}


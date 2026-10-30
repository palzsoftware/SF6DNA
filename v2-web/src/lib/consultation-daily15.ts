import { buildResult, type Context } from './character-consultation';
import { getDailyTrainingDetail, type DailyTrainingDetail } from './daily-training-details';
import { buildConsultationCards, type ConsultationCardCatalog } from './consultation-card-payload';

const review: DailyTrainingDetail = {
  category: 'decision', title: '今日の練習を仕上げる',
  why: '最初の10分を振り返り、次の対戦で試すことを1つ決めます。',
  setup: ['最初の2項目で確認した場面を用意します。'],
  minute01: ['成功した点と失敗した点を1つずつ確認します。'],
  minute13: ['難しかった場面を1つに絞り、同じ条件で試します。'],
  minute35: ['次の対戦で試すことを1文にまとめます。'],
  successCondition: ['次の対戦で試すことを1つ説明できる。'],
  commonFailure: ['一度に複数の課題を直そうとする。'],
  adjustment: ['場面と使う行動を1つずつに戻します。'],
  matchFocus: ['今回決めたことを1つ試します。'],
};

// Independent view-model. Never impersonates an existing diagnosis or save source.
export function buildConsultationDaily15(context: Context, answers: Record<string, string>, catalog?: ConsultationCardCatalog) {
  const connected = catalog ? buildConsultationCards(context, answers, catalog) : null;
  const result = connected?.result ?? buildResult(context, answers, []);
  const items = result.practiceProposal.items.map((item, index) => {
    const detail = item.templateKey === 'review' ? review : getDailyTrainingDetail(item.templateKey);
    if (!detail) throw new TypeError('Unknown practice template');
    const cards = index === 1 ? connected?.cards ?? [] : [];
    const practiceDetail: DailyTrainingDetail = cards.length ? {
      category: 'execution', title: '参考カードの操作を確認する',
      why: '参考カードに記載された確認範囲を読み、操作と条件を分けて確認します。',
      setup: ['参考カードを1つ選び、操作方式と成立条件を確認します。'],
      minute01: ['カードの入力と条件を読み、同じ状況を用意します。'],
      minute13: ['選んだ入力を試し、どの操作で止まるか確認します。'],
      minute35: ['失敗した箇所を1つに絞って試します。'],
      successCondition: ['選んだカードの条件と、操作で迷う箇所を説明できる。'],
      commonFailure: ['複数のカードを同時に練習する。'],
      adjustment: ['カードを1つに絞り、条件と操作を確認し直します。'],
      matchFocus: ['次の対戦で試す場面を1つ決めます。'],
    } : detail;
    return { id: context.character + ':' + index + ':' + item.templateKey, minutes: 5 as const,
      detail: practiceDetail, relations: cards.map(card => card.relation), payloads: cards.map(card => card.payload) };
  });
  return { source: 'character-consultation' as const, character: context.character,
    totalMinutes: 15 as const, items, persistence: 'NONE' as const,
    training: false as const, publicStrategyContent: false as const };
}

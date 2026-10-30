'use client';

import { useEffect, useRef, useState } from 'react';
import { ConsultationCardReferences } from '@/components/consultation-card-references';
import styles from './consultation.module.css';
import { nextQuestion, changeAnswer, type Context, type Control, type InputPath } from '@/lib/character-consultation';
import { buildConsultationDaily15 } from '@/lib/consultation-daily15';
import { buildConsultationCards, type ConsultationCardCatalog } from '@/lib/consultation-card-payload';

export default function ConsultationRunner({ characters, catalog }: {
  characters: { slug: string; name: string }[]; catalog: ConsultationCardCatalog;
}) {
  const [character, setCharacter] = useState('');
  const [control, setControl] = useState<Control>('CLASSIC');
  const [inputPath, setInputPath] = useState<InputPath>('manual');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [practice, setPractice] = useState(false);
  const [activePractice, setActivePractice] = useState(0);
  const [checkedPractice, setCheckedPractice] = useState<number[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const clearPractice = () => { setPractice(false); setActivePractice(0); setCheckedPractice([]); };
  const reset = () => { setAnswers({}); clearPractice(); };
  const context: Context = { character, control, inputPath, patch: catalog.patch ?? '', roster: characters.map(c => c.slug) };
  // Unknown patch keeps the questions and common practice available, without card admission.
  let payloads: ConsultationCardCatalog['payloads'] = [];
  let question: ReturnType<typeof nextQuestion> = null;
  let result: ReturnType<typeof buildConsultationCards>['result'] | null = null;
  let plan: ReturnType<typeof buildConsultationDaily15> | null = null;
  let error = false;
  if (character) {
    try {
      question = nextQuestion(context, answers);
      if (!question) {
        const connected = buildConsultationCards(context, answers, catalog);
        result = connected.result;
        payloads = connected.payloads;
        if (practice) plan = buildConsultationDaily15(context, answers, catalog);
      }
    } catch { error = true; }
  }
  const view = error ? 'error' : plan ? `practice-${activePractice}` : result ? 'result' : question?.id ?? 'choose-character';
  const previousView = useRef(view);
  useEffect(() => {
    if (previousView.current !== view) headingRef.current?.focus();
    previousView.current = view;
  }, [view]);
  const back = () => {
    clearPractice();
    const { obstacle, ...withoutObstacle } = answers;
    if (obstacle) setAnswers(withoutObstacle);
    else if (answers.combo_route) setAnswers({ issue: answers.issue });
    else setAnswers({});
  };
  const completePractice = () => {
    setCheckedPractice(current => current.includes(activePractice) ? current : [...current, activePractice]);
    if (plan && activePractice < plan.items.length - 1) setActivePractice(activePractice + 1);
  };
  const activeItem = plan?.items[activePractice];
  const characterName = characters.find(c => c.slug === character)?.name;
  const questionNumber = question?.id === 'issue' ? 1 : question?.id === 'combo_route' ? 2 : answers.issue === 'combo' ? 3 : 2;
  return <main className={`site-shell page-stack ${styles.runner}`}>
    <h1>キャラ別お悩み診断</h1>
    <p>今の困りごとから、今日の練習を決めましょう。</p>
    <div className={styles.settings}>
      <label>使用キャラクター<select value={character} onChange={e => { setCharacter(e.target.value); reset(); }}>
        <option value="">選んでください</option>{characters.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
      </select></label>
      <label>操作タイプ<select value={control} onChange={e => { setControl(e.target.value as Control); setInputPath('manual'); reset(); }}>
        <option value="CLASSIC">クラシック</option><option value="MODERN">モダン</option>
      </select></label>
      {control === 'MODERN' && <label>入力方法<select value={inputPath} onChange={e => { setInputPath(e.target.value as InputPath); reset(); }}>
        <option value="manual">手動入力</option><option value="SP">SP</option><option value="Assist">アシスト</option>
      </select></label>}
    </div>
    {error && <section role="alert"><h2 ref={headingRef} tabIndex={-1}>回答を表示できませんでした</h2>
      <button type="button" onClick={reset}>最初から選ぶ</button></section>}
    {question && <section aria-labelledby="consultation-question-title">
      <p>質問 {questionNumber}{answers.issue === 'combo' ? ' / 3' : answers.issue ? ' / 2' : ''}</p>
      <h2 id="consultation-question-title" ref={headingRef} tabIndex={-1}>{question.prompt}</h2>
      <fieldset className={styles.options}><legend className={styles.srOnly}>{question.prompt}</legend>
        {question.options.map(o => <button type="button" key={o.id} onClick={() => setAnswers(changeAnswer(answers, question!.id, o.id))}>{o.label}</button>)}
      </fieldset>
    </section>}
    {result && !plan && <section aria-labelledby="consultation-result-title">
      <h2 id="consultation-result-title" ref={headingRef} tabIndex={-1}>{characterName}の今回の課題</h2>
      <p>{result.currentIssue}</p>
      <h3>まず覚えること</h3><p>{result.firstLearning}</p>
      {result.relationNotice && <p role="status">{result.relationNotice}</p>}
      <h3>おすすめの技</h3><ConsultationCardReferences relations={result.moves} payloads={payloads} kind="Move" />
      <h3>おすすめのコンボ</h3><ConsultationCardReferences relations={result.combos} payloads={payloads} kind="Combo" />
      <h3>今日の練習</h3><p>5分ずつ、3項目を順に確認します。</p>
      <button type="button" onClick={() => setPractice(true)}>今日の15分練習を始める</button>
      <h3>参考にする選手</h3>
      {result.players.length ? <ul>{result.players.map(r => <li key={r.id}><p>{r.condition}</p><a href={r.href}>選手プロフィールを見る</a></li>)}</ul>
        : <p>この課題に合う選手は確認中です。今日の練習はそのまま始められます。</p>}
      <h3>参考動画</h3>
      {result.videos.length ? <ul>{result.videos.map(r => <li key={r.id}><p>{r.condition}</p><a href={r.href}>参考動画を見る</a></li>)}</ul>
        : <p>この課題に合う動画は確認中です。まずは練習で困った場面を整理しましょう。</p>}
    </section>}
    {plan && activeItem && <section id="consultation-daily15" aria-labelledby="consultation-practice-title">
      <h2 id="consultation-practice-title" ref={headingRef} tabIndex={-1}>今日の15分練習</h2>
      <p>{characterName}・{control === 'CLASSIC' ? 'クラシック' : 'モダン'} / {result?.currentIssue}</p>
      <nav aria-label="練習項目"><ol className={styles.practiceSteps}>
        {plan.items.map((item, i) => <li key={item.id}><button type="button" aria-current={i === activePractice ? 'step' : undefined} onClick={() => setActivePractice(i)}>
          {i + 1}. {item.detail.title}（5分）{checkedPractice.includes(i) ? '・確認済み' : ''}
        </button></li>)}
      </ol></nav>
      <p role="status">確認済み {checkedPractice.length} / 3項目</p>
      <article className={styles.practiceCard}>
        <h3>{activePractice + 1}. {activeItem.detail.title}（5分）</h3><p>{activeItem.detail.why}</p>
        {activeItem.relations.length > 0 && <ConsultationCardReferences relations={activeItem.relations} payloads={activeItem.payloads} />}
        {([
          ['準備', activeItem.detail.setup], ['0〜1分', activeItem.detail.minute01],
          ['1〜3分', activeItem.detail.minute13], ['3〜5分', activeItem.detail.minute35],
          ['成功条件', activeItem.detail.successCondition], ['よくある失敗', activeItem.detail.commonFailure],
          ['難しいとき', activeItem.detail.adjustment], ['実戦で意識すること', activeItem.detail.matchFocus],
        ] as const).map(([title, lines]) => <section key={title}><h4>{title}</h4><ul>{lines.map(line => <li key={line}>{line}</li>)}</ul></section>)}
      </article>
      <div className={styles.actions}>
        <button type="button" onClick={completePractice}>{activePractice < plan.items.length - 1 ? 'この項目を確認して次へ' : 'この項目を確認する'}</button>
        <button type="button" onClick={() => setPractice(false)}>診断結果に戻る</button>
      </div>
      {checkedPractice.length === plan.items.length && <section className={styles.summary} aria-label="練習の振り返り" role="status">
        <h3>3項目を確認しました</h3><p>次の対戦で試すことを1つに絞りましょう。</p>
        <ul>{plan.items[2].detail.matchFocus.map(line => <li key={line}>{line}</li>)}</ul>
      </section>}
    </section>}
    {result && <p>この画面の回答・練習メニュー・確認状況は保存されません。再読み込みすると最初に戻ります。</p>}
    {!plan && Object.keys(answers).length > 0 && <button type="button" onClick={back}>前の質問に戻る</button>}
  </main>;
}

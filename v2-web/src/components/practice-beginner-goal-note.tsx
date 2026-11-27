import { BEGINNER_GOAL_NOTICE, getPracticeBeginnerGoal } from "@/lib/practice-beginner-goals";

/**
 * 15分練習カードの「初めての人向け」補足（表示専用）。仮目標・練習の選び方・保存は変えない。
 * 接続先（承認後）: daily-training-quality-card.tsx の「成功の目安」の直後。
 */
export function PracticeBeginnerGoalNote({ focus }: { focus: unknown }) {
  const goal = getPracticeBeginnerGoal(focus);
  if (!goal) return null;
  return <details className="practice-beginner-goal-note">
    <summary>初めての人向けの進め方</summary>
    <ol>
      <li><strong>最初の形：</strong>{goal.firstStep}</li>
      {goal.dummyPlain ? <li><strong>相手役の準備：</strong>{goal.dummyPlain}</li> : null}
      <li><strong>最初の目安：</strong>{goal.beginnerTarget}</li>
      <li><strong>うまくいかないとき：</strong>{goal.firstCheck}</li>
    </ol>
    {goal.kind === "count" ? <p className="muted">{BEGINNER_GOAL_NOTICE}</p> : null}
  </details>;
}

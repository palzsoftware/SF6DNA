import { VisualIcon } from "@/components/visual-icon";
// Original geometric helpers; decorative because adjacent text carries the meaning.
export function MiniIllustration({ kind }: { kind: "training" | "saved" | "history" }) {
  return <span className="mini-illustration" data-kind={kind} aria-hidden="true">
    <i /><span><VisualIcon kind={kind} /></span><i />
  </span>;
}

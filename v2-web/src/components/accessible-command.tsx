import { commandAccessibleName } from "@/lib/command-accessibility";

/** Text remains visible if media or styles fail; one spoken equivalent, no tab stop. */
export function AccessibleCommand({ text }: { text: string }) {
  return <code data-command-display role="img" aria-label={commandAccessibleName(text)}><span aria-hidden="true">{text}</span></code>;
}

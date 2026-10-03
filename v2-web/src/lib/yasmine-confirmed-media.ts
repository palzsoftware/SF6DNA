import manifest from "@/data/SF6DNA_VER1_YASMINE_MEDIA_MANIFEST_20261003.json";
import canonical from "@/data/YASMINE_OFFICIAL_CAPTURE_PREVIEW_20261003.json";
import type { DevicePreviewMoveMotionMedia } from "@/lib/device-preview";

/** Explicit local approvals only; remote records and blanket clip approvals cannot enter this path. */
export function getYasmineConfirmedMedia(moveId: string): DevicePreviewMoveMotionMedia | null {
  if (process.env.VERCEL_ENV !== "preview" || manifest.identity_approval_status !== "PARTIAL_CANONICAL_APPROVAL") return null;
  const move = canonical.moves.find(row => row.id === moveId);
  const matches = manifest.clips.filter(row => row.move_id === moveId && row.verification_status === "approved_for_preview");
  if (!move || matches.length !== 1 || move.identityStatus !== "READABLE_OFFICIAL_CAPTURE") return null;
  const clip = matches[0];
  if (!("canonical_review" in clip) || !("visual_review" in clip)) return null;
  const review = clip.canonical_review;
  const visual = clip.visual_review;
  if (!review || !visual) return null;
  const command = move.commands.find(row => row.scheme === "classic")?.commandText;
  if (clip.cut_review_status !== "CUT_REVIEW_PASS" || clip.move_slug !== move.slug
    || review.status !== "CONFIRMED" || review.moveId !== move.id || review.moveSlug !== move.slug
    || review.name !== move.name || review.category !== move.moveType || review.command !== command
    || visual.status !== "PASS" || visual.moveId !== move.id || visual.moveSlug !== move.slug
    || visual.sourceFile !== clip.source_file || visual.startMs !== clip.source_start_ms || visual.endMs !== clip.source_end_ms
    || visual.observedCommand !== command || clip.command_snapshot !== command
    || !manifest.source_files.some(row => row.filename === clip.source_file)) return null;
  return {
    id: `yasmine-confirmed-${move.slug}`, moveId: move.id, mediaType: "video",
    mediaUrl: clip.media_url, posterUrl: clip.poster_url, sourceUrl: null,
    sourceLabel: "ユーザー録画（Preview）", status: "approved_for_preview", displayOrder: move.displayOrder,
  };
}

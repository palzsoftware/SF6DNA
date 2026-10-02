export const beginnerMediaIds = ["guard", "anti-air", "impact", "parry", "rush", "cancel-rush", "super", "combo"] as const;
export type BeginnerMediaId = typeof beginnerMediaIds[number];
export type BeginnerMediaAsset = {
  id: BeginnerMediaId;
  tutorialStep: BeginnerMediaId;
  mediaType: "video" | "image";
  mediaUrl: string;
  posterUrl?: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  source: "USER_CAPTURED_GAMEPLAY";
  status: "draft" | "approved_for_preview" | "approved_for_public";
};

// No capture has been supplied for this batch. Never substitute character footage.
export const beginnerMediaManifest: readonly BeginnerMediaAsset[] = [];

export function validateBeginnerMedia(assets: readonly BeginnerMediaAsset[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const localPath = /^\/media\/beginner\/[a-z0-9-]+\.(mp4|webm|webp|png|jpg|gif)$/;
  for (const asset of assets) {
    if (!beginnerMediaIds.includes(asset.id) || asset.id !== asset.tutorialStep) errors.push(`step:${asset.id}`);
    if (ids.has(asset.id)) errors.push(`duplicate:${asset.id}`);
    ids.add(asset.id);
    if (!localPath.test(asset.mediaUrl)) errors.push(`url:${asset.id}`);
    if (asset.mediaType === "video" && (!/\.(mp4|webm)$/.test(asset.mediaUrl) || !asset.posterUrl)) errors.push(`video:${asset.id}`);
    // Animated GIFs need a separate pause/reduced-motion implementation; do not activate them here.
    if (asset.mediaType === "image" && !/\.(webp|png|jpg)$/.test(asset.mediaUrl)) errors.push(`image:${asset.id}`);
    if (asset.posterUrl && (!localPath.test(asset.posterUrl) || !/\.(webp|png|jpg)$/.test(asset.posterUrl))) errors.push(`poster:${asset.id}`);
    if (!Number.isInteger(asset.width) || !Number.isInteger(asset.height) || asset.width <= 0 || asset.height <= 0) errors.push(`size:${asset.id}`);
    if (!asset.alt.trim() || !asset.caption.trim() || asset.source !== "USER_CAPTURED_GAMEPLAY") errors.push(`description:${asset.id}`);
    if (!["draft", "approved_for_preview", "approved_for_public"].includes(asset.status)) errors.push(`status:${asset.id}`);
  }
  return errors;
}

export function resolveBeginnerMedia(id: string, environment: string | undefined, assets = beginnerMediaManifest): BeginnerMediaAsset | null {
  if (validateBeginnerMedia(assets).length) return null;
  return assets.find((asset) => asset.id === id && (asset.status === "approved_for_public" || (environment === "preview" && asset.status === "approved_for_preview"))) ?? null;
}

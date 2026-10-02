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

// User captures reviewed on 2026-10-03. Preview approval does not promote to Production.
export const beginnerMediaManifest: readonly BeginnerMediaAsset[] = [
  {
    "id": "guard",
    "tutorialStep": "guard",
    "mediaType": "video",
    "mediaUrl": "/media/beginner/beginner-guard.mp4",
    "posterUrl": "/media/beginner/beginner-guard.webp",
    "width": 960,
    "height": 540,
    "alt": "しゃがみガードで攻撃を受ける実演",
    "caption": "攻撃をガードする例",
    "source": "USER_CAPTURED_GAMEPLAY",
    "status": "approved_for_preview"
  },
  {
    "id": "anti-air",
    "tutorialStep": "anti-air",
    "mediaType": "video",
    "mediaUrl": "/media/beginner/beginner-anti-air.mp4",
    "posterUrl": "/media/beginner/beginner-anti-air.webp",
    "width": 960,
    "height": 540,
    "alt": "相手のジャンプに対空を合わせる実演",
    "caption": "ジャンプに対空を合わせる例",
    "source": "USER_CAPTURED_GAMEPLAY",
    "status": "approved_for_preview"
  },
  {
    "id": "impact",
    "tutorialStep": "impact",
    "mediaType": "video",
    "mediaUrl": "/media/beginner/beginner-drive-impact.mp4",
    "posterUrl": "/media/beginner/beginner-drive-impact.webp",
    "width": 960,
    "height": 540,
    "alt": "ドライブインパクトを使う実演",
    "caption": "ドライブインパクトの例",
    "source": "USER_CAPTURED_GAMEPLAY",
    "status": "approved_for_preview"
  },
  {
    "id": "parry",
    "tutorialStep": "parry",
    "mediaType": "video",
    "mediaUrl": "/media/beginner/beginner-drive-parry.mp4",
    "posterUrl": "/media/beginner/beginner-drive-parry.webp",
    "width": 960,
    "height": 540,
    "alt": "ドライブパリィで攻撃を受ける実演",
    "caption": "パリィで攻撃を受ける例",
    "source": "USER_CAPTURED_GAMEPLAY",
    "status": "approved_for_preview"
  },
  {
    "id": "rush",
    "tutorialStep": "rush",
    "mediaType": "video",
    "mediaUrl": "/media/beginner/beginner-drive-rush.mp4",
    "posterUrl": "/media/beginner/beginner-drive-rush.webp",
    "width": 960,
    "height": 540,
    "alt": "パリィから前進するドライブラッシュの実演",
    "caption": "パリィからのドライブラッシュ",
    "source": "USER_CAPTURED_GAMEPLAY",
    "status": "approved_for_preview"
  },
  {
    "id": "cancel-rush",
    "tutorialStep": "cancel-rush",
    "mediaType": "video",
    "mediaUrl": "/media/beginner/beginner-cancel-drive-rush.mp4",
    "posterUrl": "/media/beginner/beginner-cancel-drive-rush.webp",
    "width": 960,
    "height": 540,
    "alt": "通常技からキャンセルドライブラッシュで次の攻撃につなぐ実演",
    "caption": "通常技からのキャンセルドライブラッシュ",
    "source": "USER_CAPTURED_GAMEPLAY",
    "status": "approved_for_preview"
  },
  {
    "id": "super",
    "tutorialStep": "super",
    "mediaType": "video",
    "mediaUrl": "/media/beginner/beginner-super-art.mp4",
    "posterUrl": "/media/beginner/beginner-super-art.webp",
    "width": 960,
    "height": 540,
    "alt": "リュウのSAの実演",
    "caption": "SAの演出例（リュウ）",
    "source": "USER_CAPTURED_GAMEPLAY",
    "status": "approved_for_preview"
  },
  {
    "id": "combo",
    "tutorialStep": "combo",
    "mediaType": "video",
    "mediaUrl": "/media/beginner/beginner-simple-combo.mp4",
    "posterUrl": "/media/beginner/beginner-simple-combo.webp",
    "width": 960,
    "height": 540,
    "alt": "リュウの小技から必殺技につなぐ実演",
    "caption": "シンプルコンボの例（リュウ。全キャラ共通のレシピではありません）",
    "source": "USER_CAPTURED_GAMEPLAY",
    "status": "approved_for_preview"
  }
];

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

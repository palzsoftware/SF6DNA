type SourcePresentation = {
  badge: string;
  cta: string;
};

function hostname(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function presentSource(sourceType: string, publisher: string | null, url: string): SourcePresentation {
  const type = sourceType.trim().toLowerCase();
  const provider = publisher?.trim().toLowerCase() ?? "";
  const host = hostname(url);

  if (host === "youtube.com" || host === "youtu.be" || host?.endsWith(".youtube.com")) {
    return { badge: "YouTube", cta: "YouTubeで見る" };
  }

  if (type.includes("frame")) {
    return { badge: "フレームデータ", cta: "フレームデータを見る" };
  }

  if (type.includes("player") || type.includes("profile")) {
    return { badge: "プロフィール", cta: "プロフィールを見る" };
  }

  if (type.includes("official") || provider.includes("capcom") || host?.endsWith("capcom.com")) {
    return { badge: "CAPCOM公式", cta: "公式情報を見る" };
  }

  if (type.includes("article") || type.includes("guide") || type.includes("report")) {
    return { badge: "記事", cta: "記事を読む" };
  }

  return { badge: "情報源", cta: "情報源を見る" };
}

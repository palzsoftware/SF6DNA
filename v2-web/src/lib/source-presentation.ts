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

export function presentSource(sourceType: string, _publisher: string | null, url: string): SourcePresentation {
  const type = sourceType.trim().toLowerCase();
  const host = hostname(url);
  const isCapcomSite = host === "capcom.com" || host?.endsWith(".capcom.com") ||
    host === "streetfighter.com" || host?.endsWith(".streetfighter.com");
  const path = (() => {
    try { return new URL(url).pathname.toLowerCase(); } catch { return ""; }
  })();

  if (host === "youtube.com" || host === "youtu.be" || host?.endsWith(".youtube.com")) {
    return { badge: "YouTube", cta: "関連動画を見る" };
  }

  if (type.includes("frame") || path.includes("/frame")) {
    return isCapcomSite
      ? { badge: "CAPCOM公式", cta: "公式フレームデータを見る" }
      : { badge: "フレームデータ", cta: "フレームデータを見る" };
  }

  if (type.includes("player") || type.includes("profile") || path.includes("/character/")) {
    return isCapcomSite
      ? { badge: "CAPCOM公式", cta: "公式プロフィールを見る" }
      : { badge: "プロフィール", cta: "プロフィールを見る" };
  }

  if (type.includes("change") || type.includes("patch") || path.includes("battle_change")) {
    return isCapcomSite
      ? { badge: "CAPCOM公式", cta: "バトル調整内容を見る" }
      : { badge: "調整情報", cta: "調整内容を見る" };
  }

  if (type.includes("command") || type.includes("movelist") || path.includes("/command")) {
    return isCapcomSite
      ? { badge: "CAPCOM公式", cta: "公式技表を見る" }
      : { badge: "技表", cta: "技表を見る" };
  }

  if (isCapcomSite) {
    return { badge: "CAPCOM公式", cta: "公式情報を見る" };
  }

  if (type.includes("article") || type.includes("guide") || type.includes("report")) {
    return { badge: "記事", cta: "記事を読む" };
  }

  return { badge: "情報源", cta: "情報源を見る" };
}

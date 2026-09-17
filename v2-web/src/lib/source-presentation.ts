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
  const path = (() => {
    try { return new URL(url).pathname.toLowerCase(); } catch { return ""; }
  })();

  if (host === "youtube.com" || host === "youtu.be" || host?.endsWith(".youtube.com")) {
    return { badge: "YouTube", cta: "関連動画を見る" };
  }

  if (type.includes("frame") || path.includes("/frame")) {
    return { badge: "CAPCOM公式", cta: "公式フレームデータを見る" };
  }

  if (type.includes("player") || type.includes("profile") || path.includes("/character/")) {
    return { badge: "CAPCOM公式", cta: "公式プロフィールを見る" };
  }

  if (type.includes("change") || type.includes("patch") || path.includes("battle_change")) {
    return { badge: "CAPCOM公式", cta: "バトル調整内容を見る" };
  }

  if (type.includes("command") || type.includes("movelist") || path.includes("/command")) {
    return { badge: "CAPCOM公式", cta: "公式技表を見る" };
  }

  if (type.includes("official") || provider.includes("capcom") || host?.endsWith("capcom.com")) {
    return { badge: "CAPCOM公式", cta: "公式情報を見る" };
  }

  if (type.includes("article") || type.includes("guide") || type.includes("report")) {
    return { badge: "記事", cta: "記事を読む" };
  }

  return { badge: "情報源", cta: "情報源を見る" };
}

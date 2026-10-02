type Kind = "search" | "character" | "player" | "video" | "saved" | "history" | "source";
export function VisualIcon({ kind }: { kind: Kind }) {
 const shapes = {
 search: <><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></>,
 character: <><circle cx="12" cy="7" r="3"/><path d="M5 21v-3a7 7 0 0 1 14 0v3M8 14l4 4 4-4"/></>,
 player: <><circle cx="12" cy="7" r="3"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
 video: <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z"/></>,
 saved: <path d="M6 3h12v18l-6-4-6 4z"/>,
 history: <><path d="M4 8a9 9 0 1 1-1 7M3 3v6h6M12 7v5l3 2"/></>,
 source: <><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
 };
 return <svg className="visual-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{shapes[kind]}</svg>;
}
export function destinationIcon(href: string): Kind {
 if (href.startsWith("/videos")) return "video";
 if (href.startsWith("/players")) return "player";
 if (href.startsWith("/search")) return "search";
 if (href.startsWith("/favorites")) return "saved";
 if (href.includes("history")) return "history";
 if (href.startsWith("/sources")) return "source";
 return "character";
}

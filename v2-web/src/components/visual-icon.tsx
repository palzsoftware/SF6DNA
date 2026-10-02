type Kind = "search" | "character" | "player" | "video" | "saved" | "history" | "source" | "training" | "diagnosis" | "home" | "check" | "attention";
export function VisualIcon({ kind }: { kind: Kind }) {
 const shapes = {
 home: <><path d="m3 11 9-8 9 8M5 10v11h14V10M10 21v-7h4v7"/></>,
 training: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 9v3l2 2"/></>,
 diagnosis: <><path d="M8 3c8 4 0 14 8 18M16 3C8 7 16 17 8 21M8 6h8M9 12h6M8 18h8"/></>,
 check: <><circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/></>,
 attention: <><path d="m12 3 10 18H2zM12 9v5M12 17h.01"/></>,
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

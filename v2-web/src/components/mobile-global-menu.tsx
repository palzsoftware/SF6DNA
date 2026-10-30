"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function MobileGlobalMenu({ children }: { children: ReactNode }) {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (menuRef.current) menuRef.current.open = false;
  }, [pathname]);

  function closeOnSelection(event: MouseEvent<HTMLDetailsElement>) {
    if (event.defaultPrevented || event.button !== 0
      || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (link && event.currentTarget.contains(link)) event.currentTarget.open = false;
  }

  return (
    <details ref={menuRef} className="mobile-global-menu" name="site-header-panels"
      onClickCapture={closeOnSelection}>
      <summary>メニュー</summary>
      {children}
    </details>
  );
}

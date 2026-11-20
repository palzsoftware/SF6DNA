"use client";

import { useEffect, useRef, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function MobileGlobalMenu({ children }: { children: ReactNode }) {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (menuRef.current) menuRef.current.open = false;
  }, [pathname]);

  // Close the open menu when the user taps or clicks anywhere outside it.
  useEffect(() => {
    function closeOnOutsidePointer(event: PointerEvent) {
      const menu = menuRef.current;
      if (!menu?.open || !(event.target instanceof Node) || menu.contains(event.target)) return;
      menu.open = false;
    }
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, []);

  function closeOnSelection(event: MouseEvent<HTMLDetailsElement>) {
    if (event.defaultPrevented || event.button !== 0
      || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (link && event.currentTarget.contains(link)) event.currentTarget.open = false;
  }

  function closeOnEscape(event: KeyboardEvent<HTMLDetailsElement>) {
    const menu = event.currentTarget;
    if (event.key !== "Escape" || !menu.open || event.defaultPrevented) return;
    event.preventDefault();
    menu.open = false;
    menu.querySelector("summary")?.focus();
  }

  return (
    <details ref={menuRef} className="mobile-global-menu" name="site-header-panels"
      onClickCapture={closeOnSelection} onKeyDown={closeOnEscape}>
      <summary>メニュー</summary>
      {children}
    </details>
  );
}

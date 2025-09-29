"use client";

import { useEffect } from "react";

type Hotkey = { keys: string[]; handler: () => void };

/**
 * PUBLIC_INTERFACE
 * Hook for simple global hotkeys, e.g. '/', 'c', 'Escape'.
 */
export function useHotkeys(hotkeys: Hotkey[]) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key;
      for (const h of hotkeys) {
        if (h.keys.includes(k)) {
          // do not trigger in inputs if it's a printable character
          const target = e.target as HTMLElement | null;
          const isContentEditable = (el: HTMLElement | null): boolean =>
            !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || (el as HTMLElement).isContentEditable === true);
          const isTyping = isContentEditable(target);
          if (isTyping && k !== "Escape") return;
          e.preventDefault();
          h.handler();
          break;
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hotkeys]);
}

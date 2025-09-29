"use client";

import { useEffect, useRef, useState } from "react";
import { api, type SearchItem } from "@/lib/api";

type Props = {
  provider?: string;
  tenantId: string;
  connectionId: string;
  authHeader?: string;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
};

export function Typeahead({ provider, tenantId, connectionId, authHeader, value, onChange, onSubmit }: Props) {
  const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!provider) { setOpen(false); return; }
    const q = value.trim();
    if (!q) { setOpen(false); return; }

    // Debounce search
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      try {
        const res = await api.search({ provider, query: q, tenant_id: tenantId, connection_id: connectionId, limit: 5 }, authHeader);
        setSuggestions(res.items ?? []);
        setOpen(true);
      } catch {
        setSuggestions([]);
        setOpen(false);
      }
    }, 250);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [value, provider, tenantId, connectionId, authHeader]);

  return (
    <div style={{ position: "relative", flex: 1 }}>
      <input
        className="input"
        placeholder={provider ? `Message or search with ${provider}...` : "Select a connector to enable search"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSubmit();
            setOpen(false);
          }
        }}
      />
      {open && suggestions.length > 0 && (
        <div className="card" style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, padding: 8, zIndex: 30 }}>
          {suggestions.map((s) => (
            <div key={s.id} className="row" style={{ justifyContent: "space-between", padding: 8, borderRadius: 10 }}>
              <div className="col" style={{ gap: 4 }}>
                <strong style={{ fontSize: 14 }}>{s.title}</strong>
                {s.snippet && <span className="subtitle" style={{ fontSize: 12 }}>{s.snippet}</span>}
              </div>
              {s.url && <a className="btn" href={s.url} target="_blank" rel="noreferrer">Open</a>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

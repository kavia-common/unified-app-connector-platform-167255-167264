"use client";

import { useState } from "react";
import { api, type SearchItem } from "@/lib/api";

type Props = {
  tenantId: string;
  authHeader?: string | null;
  onClose: () => void;
  onSelectProvider: (p: string) => void;
};

export function SearchOverlay({ tenantId, authHeader, onClose, onSelectProvider }: Props) {
  const [provider, setProvider] = useState<string>("jira");
  const [connectionId, setConnectionId] = useState<string>("default-connection");
  const [q, setQ] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runSearch = async (next?: string | null) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await api.search({
        provider, query: q.trim(), tenant_id: tenantId, connection_id: connectionId, limit: 10, cursor: next ?? undefined,
      }, authHeader || undefined);
      setItems(next ? [...items, ...(res.items ?? [])] : (res.items ?? []));
      setCursor(res.next_cursor ?? null);
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay" role="dialog" aria-label="Search">
      <div className="modal">
        <div style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, borderBottom: "1px solid rgba(17,24,39,0.06)" }}>
          <input className="input" placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runSearch()} />
          <select className="input" value={provider} onChange={(e) => { setProvider(e.target.value); onSelectProvider(e.target.value); }}>
            <option value="jira">jira</option>
            <option value="confluence">confluence</option>
          </select>
          <input className="input" placeholder="connection id" value={connectionId} onChange={(e) => setConnectionId(e.target.value)} />
          <button className="btn primary" onClick={() => runSearch()}>Search</button>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
        <div style={{ padding: 12, maxHeight: "60vh", overflowY: "auto" }}>
          {items.length === 0 && !loading && <div className="subtitle">No results.</div>}
          {items.map((s) => (
            <div key={s.id} className="row" style={{ justifyContent: "space-between", padding: 8, borderRadius: 10 }}>
              <div className="col" style={{ gap: 4 }}>
                <strong style={{ fontSize: 14 }}>{s.title}</strong>
                {s.snippet && <span className="subtitle" style={{ fontSize: 12 }}>{s.snippet}</span>}
              </div>
              {s.url && <a className="btn" href={s.url} target="_blank" rel="noreferrer">Open</a>}
            </div>
          ))}
          {cursor && (
            <div className="row" style={{ marginTop: 8 }}>
              <button className="btn" onClick={() => runSearch(cursor)}>Load more</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

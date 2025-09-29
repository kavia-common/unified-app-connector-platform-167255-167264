"use client";

import { useState } from "react";

export type Connectors = Record<string, { name?: string; description?: string } | undefined>;

type Props = {
  connectors: Connectors | null;
  selected: string | null;
  onSelect: (provider: string) => void;
};

export function ConnectorSelector({ connectors, selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  const keys = connectors ? Object.keys(connectors) : [];

  return (
    <>
      <button className="btn" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
        {selected ? `Connector: ${selected}` : "Select connector"}
      </button>
      {open && (
        <div className="overlay" role="dialog" aria-label="Select a connector">
          <div className="modal">
            <div style={{ display: "flex", justifyContent: "space-between", padding: 16 }}>
              <strong>Select Connector</strong>
              <button className="btn" onClick={() => setOpen(false)} aria-label="Close connector selector">Close</button>
            </div>
            <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {keys.length === 0 && <div className="subtitle">No connectors found.</div>}
              {keys.map((k) => (
                <button
                  key={k}
                  className="btn"
                  onClick={() => { onSelect(k); setOpen(false); }}
                  style={{ justifyContent: "space-between" }}
                >
                  <span>{connectors?.[k]?.name ?? k}</span>
                  <span className="badge">Select</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import { api, type CreateResponse } from "@/lib/api";

type Props = {
  tenantId: string;
  authHeader?: string | null;
  provider?: string;
  onClose: () => void;
};

export function CreateOverlay({ tenantId, authHeader, provider: initialProvider, onClose }: Props) {
  const [provider, setProvider] = useState<string>(initialProvider || "jira");
  const [connectionId, setConnectionId] = useState<string>("default-connection");
  const [kind, setKind] = useState<string>("issue");
  const [payload, setPayload] = useState<string>('{"title":"New item","description":"Created from UI"}');
  const [result, setResult] = useState<CreateResponse | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const onCreate = async () => {
    setStatus("Creating...");
    try {
      const body = JSON.parse(payload) as Record<string, unknown>;
      const res = await api.create({ provider, tenant_id: tenantId, connection_id: connectionId, kind, payload: body }, authHeader || undefined);
      setResult(res);
      setStatus("Created.");
    } catch {
      setStatus("Create failed. Ensure JSON payload is valid.");
    }
  };

  return (
    <div className="overlay" role="dialog" aria-label="Create">
      <div className="modal">
        <div style={{ display: "flex", justifyContent: "space-between", padding: 12, borderBottom: "1px solid rgba(17,24,39,0.06)" }}>
          <strong>Create</strong>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: 12 }}>
          <div className="col">
            <label className="subtitle">Provider</label>
            <select className="input" value={provider} onChange={(e) => setProvider(e.target.value)}>
              <option value="jira">jira</option>
              <option value="confluence">confluence</option>
            </select>

            <label className="subtitle">Connection ID</label>
            <input className="input" value={connectionId} onChange={(e) => setConnectionId(e.target.value)} />

            <label className="subtitle">Kind</label>
            <input className="input" value={kind} onChange={(e) => setKind(e.target.value)} />

            <label className="subtitle">Payload (JSON)</label>
            <textarea className="input" rows={8} value={payload} onChange={(e) => setPayload(e.target.value)} />
            <div className="row">
              <button className="btn primary" onClick={onCreate}>Create</button>
            </div>
            {status && <div className="subtitle">{status}</div>}
          </div>

          <div className="col">
            <label className="subtitle">Result</label>
            <div className="card" style={{ padding: 12, minHeight: 120, overflowX: "auto" }}>
              <pre style={{ fontSize: 12, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {result ? JSON.stringify(result, null, 2) : "—"}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

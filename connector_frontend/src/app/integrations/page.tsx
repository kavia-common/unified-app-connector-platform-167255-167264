"use client";

import { useEffect, useMemo, useState } from "react";
import { api, type ConnectorsMap } from "@/lib/api";
import { defaultTenant, defaultAuth } from "@/lib/config";
import { ConnectorSelector } from "@/components/ConnectorSelector";

/**
 * Integrations Admin: manage API keys and quick OAuth kickoff for selected connectors.
 */
export default function IntegrationsPage() {
  const [tenantId] = useState(defaultTenant.tenantId);
  const [authHeader] = useState(defaultAuth.authorization);
  const [connectors, setConnectors] = useState<ConnectorsMap | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [connectionId, setConnectionId] = useState("default-connection");

  const [apiKey, setApiKey] = useState("");
  const [verifyKey, setVerifyKey] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    api.listConnectors(tenantId, authHeader).then(setConnectors).catch(() => setConnectors({}));
  }, [tenantId, authHeader]);

  const canSubmit = useMemo(() => !!tenantId && !!connectionId && !!apiKey, [tenantId, connectionId, apiKey]);

  const onSaveApiKey = async () => {
    setStatus("Saving API key...");
    try {
      await api.setApiKey({ tenant_id: tenantId, connection_id: connectionId, api_key: apiKey }, authHeader);
      setStatus("API key stored.");
    } catch {
      setStatus("Failed to store API key.");
    }
  };

  const onVerifyApiKey = async () => {
    setStatus("Verifying...");
    try {
      const res = await api.verifyApiKey({ tenant_id: tenantId, connection_id: connectionId, api_key: verifyKey }, authHeader);
      setStatus(res.valid ? "Valid API key." : "Invalid API key.");
    } catch {
      setStatus("Verification failed.");
    }
  };

  return (
    <div className="col" style={{ gap: 16 }}>
      <section className="card" style={{ padding: 16 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2 style={{ fontWeight: 700 }}>Integrations</h2>
          <ConnectorSelector connectors={connectors} selected={provider} onSelect={setProvider} />
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <label className="subtitle" style={{ width: 140 }}>Connection ID</label>
          <input className="input" value={connectionId} onChange={(e) => setConnectionId(e.target.value)} placeholder="default-connection" />
        </div>
      </section>

      <section className="card" style={{ padding: 16 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 8 }}>API Key</h3>
        <div className="row">
          <label className="subtitle" style={{ width: 140 }}>Store API Key</label>
          <input className="input" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Paste API key..." />
          <button className="btn primary" disabled={!canSubmit} onClick={onSaveApiKey}>Save</button>
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <label className="subtitle" style={{ width: 140 }}>Verify Key</label>
          <input className="input" value={verifyKey} onChange={(e) => setVerifyKey(e.target.value)} placeholder="Key to verify..." />
          <button className="btn" onClick={onVerifyApiKey}>Verify</button>
        </div>
        {status && <div className="subtitle" style={{ marginTop: 12 }}>{status}</div>}
      </section>

      <section className="card" style={{ padding: 16 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 8 }}>OAuth</h3>
        <p className="subtitle">Use the OAuth page to initiate provider authorization for Jira or Confluence.</p>
      </section>
    </div>
  );
}

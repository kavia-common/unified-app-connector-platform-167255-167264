"use client";

import { useEffect, useState } from "react";
import { api, type ConnectorsMap, type OAuthLoginResponse } from "@/lib/api";
import { defaultTenant, defaultAuth } from "@/lib/config";
import { ConnectorSelector } from "@/components/ConnectorSelector";

export default function OAuthPage() {
  const [tenantId] = useState(defaultTenant.tenantId);
  const [authHeader] = useState(defaultAuth.authorization);
  const [connectors, setConnectors] = useState<ConnectorsMap | null>(null);
  const [provider, setProvider] = useState<string | null>("jira");
  const [connectionId, setConnectionId] = useState("default-connection");

  const [authorizeUrl, setAuthorizeUrl] = useState("");
  const [clientId, setClientId] = useState("");
  const [scopes, setScopes] = useState("read:xyz,write:xyz");
  const [redirectUri, setRedirectUri] = useState("");

  const [loginState, setLoginState] = useState<OAuthLoginResponse | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    api.listConnectors(tenantId, authHeader).then(setConnectors).catch(() => setConnectors({}));
  }, [tenantId, authHeader]);

  const startLogin = async () => {
    setStatus("Starting OAuth...");
    if (!provider) { setStatus("Select a connector."); return; }
    try {
      const res = await api.oauthLogin({
        connector: provider as "jira" | "confluence",
        tenant_id: tenantId,
        connection_id: connectionId,
        authorize_url: authorizeUrl,
        client_id: clientId,
        scopes: scopes.split(",").map(s => s.trim()).filter(Boolean),
        redirect_uri: redirectUri || undefined,
      }, authHeader);
      setLoginState(res);
      setStatus("Open the authorize URL to continue.");
    } catch {
      setStatus("OAuth start failed.");
    }
  };

  return (
    <div className="col" style={{ gap: 16 }}>
      <section className="card" style={{ padding: 16 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2 style={{ fontWeight: 700 }}>OAuth</h2>
          <ConnectorSelector connectors={connectors} selected={provider} onSelect={setProvider} />
        </div>

        <div className="col" style={{ marginTop: 12 }}>
          <div className="row">
            <label className="subtitle" style={{ width: 160 }}>Connection ID</label>
            <input className="input" placeholder="default-connection" value={connectionId} onChange={(e) => setConnectionId(e.target.value)} />
          </div>
          <div className="row">
            <label className="subtitle" style={{ width: 160 }}>Authorize URL</label>
            <input className="input" placeholder="https://provider.com/oauth/authorize" value={authorizeUrl} onChange={(e) => setAuthorizeUrl(e.target.value)} />
          </div>
          <div className="row">
            <label className="subtitle" style={{ width: 160 }}>Client ID</label>
            <input className="input" placeholder="client_id" value={clientId} onChange={(e) => setClientId(e.target.value)} />
          </div>
          <div className="row">
            <label className="subtitle" style={{ width: 160 }}>Scopes</label>
            <input className="input" placeholder="scope1,scope2" value={scopes} onChange={(e) => setScopes(e.target.value)} />
          </div>
          <div className="row">
            <label className="subtitle" style={{ width: 160 }}>Redirect URI (optional)</label>
            <input className="input" placeholder="https://yourapp.com/oauth/callback" value={redirectUri} onChange={(e) => setRedirectUri(e.target.value)} />
          </div>
          <div className="row" style={{ marginTop: 8 }}>
            <button className="btn primary" onClick={startLogin}>Start OAuth</button>
          </div>
        </div>

        {status && <div className="subtitle" style={{ marginTop: 12 }}>{status}</div>}

        {loginState && (
          <div className="card" style={{ padding: 12, marginTop: 12 }}>
            <div className="col">
              <div className="subtitle">State</div>
              <code style={{ fontSize: 12, wordBreak: "break-all" }}>{loginState.state}</code>
              <div className="subtitle" style={{ marginTop: 8 }}>Authorize URL</div>
              <a className="btn" href={loginState.authorize_url} target="_blank" rel="noreferrer">Open Provider</a>
            </div>
          </div>
        )}
      </section>

      <section className="card" style={{ padding: 16 }}>
        <h3 style={{ fontWeight: 700 }}>Callback</h3>
        <p className="subtitle">The backend handles /auth/oauth/callback and returns JSON with connection_id, tenant_id, and optional expires_at. Ensure your provider configuration points to the backend callback URL.</p>
      </section>
    </div>
  );
}

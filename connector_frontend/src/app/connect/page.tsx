"use client";

import { useState } from "react";
import { api } from "@lib/api";
import { SuccessModal } from "@components/modals/SuccessModal";
import { ErrorModal } from "@components/modals/ErrorModal";

type Provider = "jira" | "confluence";

export default function ConnectPage() {
  const [provider, setProvider] = useState<Provider>("jira");
  const [apiKey, setApiKey] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const startOAuth = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/oauth/login?provider=${provider}`);
      if (data?.auth_url) {
        window.location.href = data.auth_url;
      } else {
        throw new Error("No auth url provided");
      }
    } catch (e: any) {
      setErr(e.message || "Failed to start OAuth");
    } finally {
      setLoading(false);
    }
  };

  const submitApiKey = async () => {
    try {
      setLoading(true);
      const { data } = await api.post(`/connect/${provider}/api-key`, { api_key: apiKey, domain });
      if (data?.status === "connected") {
        setOk(`${provider} connected with API key`);
        setApiKey("");
      } else {
        throw new Error(data?.message || "Failed to connect");
      }
    } catch (e: any) {
      setErr(e.message || "Failed to connect with API key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-lg border p-5 bg-white">
        <h2 className="text-lg font-semibold text-ocean-text">Connect Provider</h2>
        <p className="text-sm text-gray-600">Connect Jira or Confluence using OAuth or API Key.</p>
        <div className="mt-4 flex gap-2">
          <ProviderPill label="Jira" active={provider === "jira"} onClick={() => setProvider("jira")} />
          <ProviderPill label="Confluence" active={provider === "confluence"} onClick={() => setProvider("confluence")} />
        </div>
      </div>
      <div className="rounded-lg border p-5 bg-white space-y-4">
        <h3 className="font-medium">OAuth</h3>
        <button className="btn btn-primary" onClick={startOAuth} disabled={loading}>
          {loading ? "Starting..." : "Start OAuth"}
        </button>
      </div>
      <div className="rounded-lg border p-5 bg-white space-y-3">
        <h3 className="font-medium">API Key</h3>
        <div className="grid gap-2">
          <input
            className="input"
            placeholder="Domain (e.g., your-domain.atlassian.net)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <input
            className="input"
            placeholder="API Key / Token"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        <button className="btn btn-amber" onClick={submitApiKey} disabled={loading || !apiKey}>
          {loading ? "Connecting..." : "Connect with API Key"}
        </button>
      </div>

      {ok && <SuccessModal title="Connected" message={ok} onClose={() => setOk(null)} />}
      {err && <ErrorModal title="Connection Failed" message={err} onClose={() => setErr(null)} />}
    </div>
  );
}

function ProviderPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full border text-sm transition ${active ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-gray-200 text-gray-700 hover:border-blue-200"}`}
    >
      {label}
    </button>
  );
}

"use client";

import useSWR from "swr";
import { api, fetcher } from "@lib/api";
import { SuccessModal } from "@components/modals/SuccessModal";
import { ErrorModal } from "@components/modals/ErrorModal";
import { useState } from "react";

export default function AdminConnectorsPage() {
  const { data, isLoading, error, mutate } = useSWR("/connectors", fetcher);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const disconnect = async (provider: string) => {
    try {
      await api.post(`/connect/${provider}/disconnect`, {});
      setOk(`${provider} disconnected`);
      mutate();
    } catch (e: any) {
      setErr(e.message || "Failed to disconnect");
    }
  };

  const refreshToken = async (provider: string) => {
    try {
      await api.post(`/connect/${provider}/refresh`, {});
      setOk(`${provider} token refresh requested`);
    } catch (e: any) {
      setErr(e.message || "Failed to refresh token");
    }
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Integrations</h2>
        <button className="btn btn-ghost" onClick={() => mutate()}>Refresh</button>
      </header>
      <div className="rounded-lg border bg-white">
        {isLoading && <div className="p-4 text-gray-600">Loading connectors...</div>}
        {error && <div className="p-4 text-red-600">Failed to load connectors</div>}
        <ul className="divide-y">
          {(data?.connectors || []).map((c: any) => (
            <li key={c.name} className="p-4 grid md:grid-cols-[1fr_auto] gap-3">
              <div>
                <div className="font-medium">{c.display_name || c.name}</div>
                <div className="text-sm text-gray-600">
                  Status: <span className={c.connected ? "text-green-700" : "text-gray-700"}>{c.connected ? "Connected" : "Not connected"}</span>
                </div>
              </div>
              <div className="flex gap-2 md:justify-end">
                <a className="btn btn-primary" href={`/connect`}>Connect</a>
                <button className="btn btn-amber" onClick={() => refreshToken(c.name)}>Refresh Token</button>
                <button className="btn btn-ghost" onClick={() => disconnect(c.name)}>Disconnect</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {ok && <SuccessModal title="Success" message={ok} onClose={() => setOk(null)} />}
      {err && <ErrorModal title="Error" message={err} onClose={() => setErr(null)} />}
    </div>
  );
}

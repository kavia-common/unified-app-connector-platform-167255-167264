"use client";

import { useEffect, useState } from "react";
import { ConnectorSelector } from "@/components/ConnectorSelector";
import { SearchOverlay } from "@/components/SearchOverlay";
import { CreateOverlay } from "@/components/CreateOverlay";
import { Chat } from "@/components/chat/Chat";
import { api, type ConnectorsMap } from "@/lib/api";
import { useHotkeys } from "@/hooks/useHotkeys";
import { defaultTenant, defaultAuth } from "@/lib/config";

export default function Home() {
  const [provider, setProvider] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [connectors, setConnectors] = useState<ConnectorsMap | null>(null);
  const [tenantId] = useState(defaultTenant.tenantId);
  const [authHeader] = useState(defaultAuth.authorization);

  useHotkeys([
    { keys: ["/"], handler: () => setShowSearch(true) },
    { keys: ["c"], handler: () => setShowCreate(true) },
    { keys: ["Escape"], handler: () => { setShowSearch(false); setShowCreate(false); } },
  ]);

  useEffect(() => {
    api.listConnectors(tenantId, authHeader).then(setConnectors).catch(() => setConnectors({}));
  }, [tenantId, authHeader]);

  return (
    <div className="col" style={{ gap: 16 }}>
      <section className="card" style={{ padding: 16 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="row">
            <button className="btn secondary" onClick={() => setShowSearch(true)} aria-label="Open search overlay">
              Search <span className="kbd">/</span>
            </button>
            <button className="btn" onClick={() => setShowCreate(true)} aria-label="Open create overlay">
              Create <span className="kbd">c</span>
            </button>
          </div>
          <ConnectorSelector
            connectors={connectors}
            selected={provider}
            onSelect={(p) => setProvider(p)}
          />
        </div>
      </section>

      <section className="card" style={{ padding: 0 }}>
        <Chat
          provider={provider ?? undefined}
          tenantId={tenantId}
          connectionId="default-connection"
          authHeader={authHeader ?? undefined}
        />
      </section>

      {showSearch && (
        <SearchOverlay
          tenantId={tenantId}
          authHeader={authHeader}
          onClose={() => setShowSearch(false)}
          onSelectProvider={(p) => setProvider(p)}
        />
      )}

      {showCreate && (
        <CreateOverlay
          tenantId={tenantId}
          authHeader={authHeader}
          onClose={() => setShowCreate(false)}
          provider={provider ?? undefined}
        />
      )}
    </div>
  );
}

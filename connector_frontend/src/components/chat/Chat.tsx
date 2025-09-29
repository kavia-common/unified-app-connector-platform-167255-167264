"use client";

import { useEffect, useRef, useState } from "react";
import { api, type SearchItem } from "@/lib/api";
import { Typeahead } from "./Typeahead";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Props = {
  provider?: string;
  tenantId: string;
  connectionId: string;
  authHeader?: string | null;
};

/**
 * PUBLIC_INTERFACE
 * Chat component provides a simple chat UI with typeahead search integration and simulated real-time responses.
 */
export function Chat({ provider, tenantId, connectionId, authHeader }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "m1", role: "assistant", content: "Hello! Select a connector and ask me to search or create." },
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages.length]);

  const send = async () => {
    if (!input.trim()) return;
    const current = input.trim();
    setInput("");
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: current };
    setMessages((m) => [...m, userMsg]);

    // Simulate "real-time" assistant typing followed by search if user typed "search ..."
    const assistantTyping: Message = { id: crypto.randomUUID(), role: "assistant", content: "…" };
    setMessages((m) => [...m, assistantTyping]);

    let reply = "Okay. What provider should I use? You can also press / to search.";
    if (provider && current.toLowerCase().startsWith("search ")) {
      const q = current.slice(7);
      try {
        const res = await api.search({
          provider,
          query: q,
          tenant_id: tenantId,
          connection_id: connectionId,
          limit: 5,
        }, authHeader || undefined);
        const lines = res.items?.map((it: SearchItem) => `• ${it.title}${it.url ? ` (${it.url})` : ""}`) ?? [];
        reply = lines.length ? `Top results:\n${lines.join("\n")}` : "No results.";
      } catch {
        reply = "Search failed. Check connection and credentials.";
      }
    }

    // Replace typing with the actual reply
    setMessages((m) => m.filter((x) => x.id !== assistantTyping.id).concat({ id: crypto.randomUUID(), role: "assistant", content: reply }));
  };

  return (
    <div className="chat">
      <div className="chat-messages" ref={listRef} aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className="msg">
            <div className={`msg-role ${m.role}`}>{m.role === "user" ? "U" : "A"}</div>
            <div className="msg-bubble" style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
          </div>
        ))}
      </div>
      <div className="row" style={{ padding: 12, borderTop: "1px solid rgba(17,24,39,0.06)" }}>
        <Typeahead
          provider={provider}
          tenantId={tenantId}
          connectionId={connectionId}
          authHeader={authHeader || undefined}
          value={input}
          onChange={setInput}
          onSubmit={send}
        />
        <button className="btn primary" onClick={send} aria-label="Send message">Send</button>
      </div>
    </div>
  );
}

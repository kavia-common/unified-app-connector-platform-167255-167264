"use client";

import { useEffect, useRef, useState } from "react";
import { ChatBubble } from "@components/chat/ChatBubble";
import { ToolChip } from "@components/chat/ToolChip";
import { ChatInput } from "@components/chat/ChatInput";
import { useChat } from "@lib/hooks/useChat";

export default function ChatPage() {
  const { messages, sendMessage, sending } = useChat();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const atIdx = query.lastIndexOf("@");
    if (atIdx >= 0) {
      const prefix = query.slice(atIdx + 1).toLowerCase();
      const base = ["jira", "confluence"]; // could fetch from registry
      const s = base.filter((b) => b.startsWith(prefix)).map((b) => `@${b}_`);
      setSuggestions(s.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSend = async () => {
    if (!query.trim()) return;
    await sendMessage(query);
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="grid grid-rows-[1fr_auto] h-[calc(100vh-112px)] gap-4">
      <div className="overflow-y-auto space-y-3 pr-1">
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} />
        ))}
      </div>
      <div className="space-y-2">
        <div className="flex gap-2 flex-wrap">
          <ToolChip label="@jira_ search" />
          <ToolChip label="@jira_ create" />
          <ToolChip label="@confluence_ search" />
        </div>
        <ChatInput
          ref={inputRef}
          value={query}
          onChange={setQuery}
          onSend={handleSend}
          loading={sending}
          suggestions={suggestions}
          onSuggestionClick={(s) => setQuery((q) => q.replace(/@[^ ]*$/, s))}
        />
      </div>
    </div>
  );
}

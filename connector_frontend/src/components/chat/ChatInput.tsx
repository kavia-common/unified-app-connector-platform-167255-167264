"use client";

import { forwardRef } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  loading?: boolean;
  suggestions?: string[];
  onSuggestionClick?: (s: string) => void;
};

export const ChatInput = forwardRef<HTMLInputElement, Props>(function ChatInput(
  { value, onChange, onSend, loading, suggestions = [], onSuggestionClick },
  ref
) {
  return (
    <div className="relative">
      <input
        ref={ref}
        className="input"
        placeholder="Ask with @jira_ or @confluence_ ..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <div className="mt-2 flex justify-end">
        <button className="btn btn-primary" onClick={onSend} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
      {suggestions.length > 0 && (
        <div className="absolute z-10 left-0 right-0 top-full mt-2 bg-white border rounded-md shadow-sm overflow-hidden">
          {suggestions.map((s) => (
            <button
              key={s}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
              onClick={() => onSuggestionClick?.(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

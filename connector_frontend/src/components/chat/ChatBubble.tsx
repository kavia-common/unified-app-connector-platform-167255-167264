"use client";

import { ChatMessage } from "@types/chat";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] rounded-lg border p-3 ${isUser ? "bg-blue-50 border-blue-200" : "bg-white"}`}>
        {!isUser && <div className="text-xs text-gray-500 mb-1">Kavia AI</div>}
        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
        {message.references?.length ? (
          <div className="mt-2 text-xs text-gray-600">
            References:
            <ul className="list-disc pl-4">
              {message.references.map((r, idx) => (
                <li key={idx}>
                  <a className="text-blue-700" href={r.url || "#"}>{r.title || r.id}</a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

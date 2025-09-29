"use client";

import Link from "next/link";

export function Topbar() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <span className="badge">Tenant: Demo Org</span>
        <span className="text-sm text-gray-600">Environment: Dev</span>
      </div>
      <nav className="flex items-center gap-2">
        <Link href="/chat" className="btn btn-primary">Chat</Link>
        <Link href="/admin/connectors" className="btn btn-ghost">Integrations</Link>
      </nav>
    </header>
  );
}

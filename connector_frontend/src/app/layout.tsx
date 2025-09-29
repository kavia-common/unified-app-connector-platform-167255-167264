import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unified Connector Platform",
  description: "Chat with your tools. Connect Jira & Confluence. Ocean Professional UI.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: new URL("http://localhost"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="container-app">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
              <div className="row">
                <div className="badge" aria-label="App Brand">
                  <span style={{ width: 8, height: 8, borderRadius: 9999, background: "var(--color-primary)" }} />
                  Unified
                </div>
              </div>
            </div>
            <nav className="col" aria-label="Main Navigation">
              <Link className="btn" href="/">Chat</Link>
              <Link className="btn" href="/integrations">Integrations</Link>
              <Link className="btn" href="/oauth">OAuth</Link>
            </nav>
            <div style={{ marginTop: "auto" }} className="col">
              <div className="subtitle" style={{ fontSize: 12 }}>Keyboard</div>
              <div className="row" style={{ fontSize: 12 }}>
                <span className="kbd">/</span> Search
                <span className="kbd">c</span> Create
              </div>
            </div>
          </aside>

          {/* Topbar with Tenant/Org context */}
          <header className="topbar">
            <div className="row">
              <strong>Ocean Professional</strong>
              <span className="badge" title="Environment">Frontend</span>
            </div>
            <div className="row" aria-label="Tenant context">
              <span className="subtitle">Organization:</span>
              <span className="badge" id="tenant-badge">Acme Inc.</span>
              <span className="subtitle">Tenant:</span>
              <span className="badge" id="tenant-id-badge">tenant-demo</span>
            </div>
          </header>

          {/* Main content */}
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}

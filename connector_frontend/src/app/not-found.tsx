import React from "react";

export default function NotFound() {
  return (
    <main className="main">
      <section className="card" role="alert" aria-live="assertive" style={{ padding: 20 }}>
        <header className="col">
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>404 – Page Not Found</h1>
          <p className="subtitle">The page you’re looking for doesn’t exist.</p>
        </header>
      </section>
    </main>
  );
}

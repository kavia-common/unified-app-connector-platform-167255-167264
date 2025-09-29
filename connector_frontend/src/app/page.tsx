import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-gray-50 p-6 border border-blue-100 shadow-sm">
        <h1 className="text-2xl font-semibold text-ocean-primary">Connector Platform</h1>
        <p className="text-sm text-gray-600 mt-1">
          Connect Jira and Confluence, manage tokens, and use chat tools to search and create content.
        </p>
        <div className="mt-4 flex gap-3">
          <Link href="/chat" className="btn btn-primary">Open Chat</Link>
          <Link href="/admin/connectors" className="btn btn-ghost">Manage Integrations</Link>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Projects" href="/projects" description="Browse Jira projects and run quick actions." />
        <Card title="Spaces" href="/spaces" description="Explore Confluence spaces and content." />
        <Card title="Connect Provider" href="/connect" description="Connect via OAuth or API Key." />
      </div>
    </div>
  );
}

function Card({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link href={href} className="block rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition p-4 bg-white">
      <div className="font-medium text-ocean-text">{title}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </Link>
  );
}

"use client";

import useSWR from "swr";
import { api, fetcher } from "@lib/api";

export default function ProjectsPage() {
  const { data, isLoading, error, mutate } = useSWR("/projects", fetcher);

  const refresh = () => mutate();

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Projects</h2>
        <button className="btn btn-ghost" onClick={refresh}>Refresh</button>
      </header>
      <div className="rounded-lg border bg-white">
        {isLoading && <div className="p-4 text-gray-600">Loading projects...</div>}
        {error && <div className="p-4 text-red-600">Failed to load projects</div>}
        <ul className="divide-y">
          {(data?.projects || []).map((p: any) => (
            <li key={p.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-600">{p.key || p.id}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-amber" onClick={() => quickCreateIssue(p)}>Quick Create</button>
                <button className="btn btn-ghost" onClick={() => searchIssues(p)}>Search</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

async function quickCreateIssue(project: any) {
  try {
    await api.post("/create", { provider: "jira", type: "issue", project: project.key || project.id, title: "Sample issue", description: "Created from UI" });
    alert("Issue created");
  } catch {
    alert("Failed to create issue");
  }
}
async function searchIssues(project: any) {
  try {
    const { data } = await api.get(`/search?provider=jira&type=issue&project=${encodeURIComponent(project.key || project.id)}&q=${encodeURIComponent("status:open")}`);
    alert(`Found ${data?.count ?? 0} issues`);
  } catch {
    alert("Search failed");
  }
}

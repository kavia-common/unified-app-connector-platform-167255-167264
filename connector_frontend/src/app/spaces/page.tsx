"use client";

import useSWR from "swr";
import { fetcher } from "@lib/api";

export default function SpacesPage() {
  const { data, isLoading, error, mutate } = useSWR("/spaces", fetcher);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Spaces</h2>
        <button className="btn btn-ghost" onClick={() => mutate()}>Refresh</button>
      </header>
      <div className="rounded-lg border bg-white">
        {isLoading && <div className="p-4 text-gray-600">Loading spaces...</div>}
        {error && <div className="p-4 text-red-600">Failed to load spaces</div>}
        <ul className="divide-y">
          {(data?.spaces || []).map((s: any) => (
            <li key={s.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-gray-600">{s.key || s.id}</div>
              </div>
              <button className="btn btn-amber" onClick={() => alert("Open space actions...")}>Actions</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

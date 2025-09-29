"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const items = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "Chat" },
  { href: "/projects", label: "Projects" },
  { href: "/spaces", label: "Spaces" },
  { href: "/connect", label: "Connect" },
  { href: "/admin/connectors", label: "Admin" }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-56 border-r bg-white flex-col">
      <div className="px-4 py-4 border-b">
        <div className="font-semibold text-ocean-primary">Connector</div>
        <div className="text-xs text-gray-600">Ocean Professional</div>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {items.map((i) => {
          const active = pathname === i.href;
          return (
            <Link
              key={i.href}
              href={i.href}
              className={clsx(
                "block px-3 py-2 rounded-md text-sm",
                active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
              )}
            >
              {i.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t text-xs text-gray-500">© {new Date().getFullYear()}</div>
    </aside>
  );
}

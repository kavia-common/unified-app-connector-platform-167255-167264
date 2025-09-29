import "./globals.css";
import { ReactNode } from "react";
import { Sidebar } from "@components/layout/Sidebar";
import { Topbar } from "@components/layout/Topbar";

export const metadata = {
  title: "Connector Platform",
  description: "Unified modular platform for connecting external apps",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ocean-bg text-ocean-text antialiased">
        <div className="min-h-screen flex">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Topbar />
            <main className="p-4 md:p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}

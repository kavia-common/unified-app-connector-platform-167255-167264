"use client";

export function ToolChip({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="badge hover:brightness-95">{label}</button>
  );
}

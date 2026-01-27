"use client";
import useSWR from "swr";
import Link from "next/link";


export default function Breadcrumbs({ items }: { items: { label: string, href?: string }[] }) {
  return (
    <nav className="text-sm text-gray-600 mb-4">
      {items.map((it, i) => (
        <span key={i}>
          {it.href ? <Link href={it.href} className="underline">{it.label}</Link> : <span>{it.label}</span>}
          {i < items.length - 1 && <span className="px-2">›</span>}
        </span>
      ))}
    </nav>
  );
}


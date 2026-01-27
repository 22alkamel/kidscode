"use client";

import useSWR from "swr";
import api from "@/lib/api";
import Link from "next/link";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function Programs() {
  const { data, error } = useSWR("/programs", fetcher);

  if (!data) return "Loading...";
  return (
    <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.data.map((p: any) => (
        <Link key={p.id} href={`/programs/${p.slug}`}>
          <div className="border p-5 rounded shadow hover:bg-gray-50 cursor-pointer">
            <h2 className="text-xl font-bold">{p.title}</h2>
            <p>{p.description?.slice(0, 80)}...</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

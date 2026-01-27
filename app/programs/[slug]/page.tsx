"use client";

import { useParams } from "next/navigation";

export default function ProgramPage() {
  const params = useParams(); // هذا صحيح
  return <div>Program: {params.slug}</div>; // استعملي slug مباشرة
}

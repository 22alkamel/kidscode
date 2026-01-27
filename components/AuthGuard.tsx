"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AuthGuard({ children }: any) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await api.get("/me");
        setAllowed(true);
      } catch {
        window.location.href = "/login";
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!allowed) return null;

  return children;
}

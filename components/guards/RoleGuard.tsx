"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type Role = "admin" | "trainer" | "student";

interface RoleGuardProps {
  allow: Role[];        // الأدوار المسموح لها
  children: React.ReactNode;
}

export default function RoleGuard({ allow, children }: RoleGuardProps) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/me");
        const role: Role = res.data.role;

        if (allow.includes(role)) {
          setAllowed(true);
        } else {
          // Redirect ذكي حسب الدور
          if (role === "admin") window.location.href = "/admin";
          if (role === "trainer") window.location.href = "/trainer";
          if (role === "student") window.location.href = "/dashboard";
        }
      } catch (err) {
        window.location.href = "/login";
      }

      setLoading(false);
    })();
  }, [allow]);

  if (loading) return <p className="p-10">Loading...</p>;
  if (!allowed) return null;

  return <>{children}</>;
}

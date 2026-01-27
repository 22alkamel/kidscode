"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type Role = "admin" | "trainer" | "student";

interface RoleGuardProps {
  allow: Role[];        // الأدوار المسموح لها
  children: React.ReactNode;
}

export default function RoleGuard({ allow, children }: RoleGuardProps) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // إذا ما فيه توكن، نعيد التوجيه للّوجين مباشرة
          router.replace("/login");
          return;
        }

        // جلب بيانات المستخدم مع Authorization header
        const res = await api.get("/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const role: Role = res.data.role;

        if (allow.includes(role)) {
          setAllowed(true);
        } else {
          // إعادة توجيه ذكي حسب الدور
          if (role === "admin") router.replace("/admin");
          else if (role === "trainer") router.replace("/trainer");
          else if (role === "student") router.replace("/dashboard");
          return;
        }
      } catch (err) {
        router.replace("/login");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [allow, router]);

  if (loading) return <p className="p-10 text-center">جارٍ التحميل...</p>;
  if (!allowed) return null;

  return <>{children}</>;
}

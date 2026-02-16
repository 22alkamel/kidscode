"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RoleGuard from "@/components/guards/RoleGuard";
import api from "@/lib/api";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {}
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <RoleGuard allow={["student"]}>
      <div className="min-h-screen bg-[#F4F6FF]" dir="rtl">

        <div className="flex">

          {/* ===== Sidebar ===== */}
          <aside
            className={`
              fixed top-0 right-0 z-40
              h-screen w-72 bg-white
              border-l shadow-xl
              p-6 flex flex-col
              transition-transform duration-300
              ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
              lg:translate-x-0
            `}
          >
            <h2 className="text-2xl font-extrabold text-indigo-600 mb-10">
              KidsCode 🚀
            </h2>

            <nav className="flex-1 space-y-3 text-gray-600 font-medium">
              <Link href="/dashboard" className="block p-3 rounded-xl hover:bg-indigo-50">
                🏠 الرئيسية
              </Link>

              <Link href="/dashboard/programs" className="block p-3 rounded-xl hover:bg-indigo-50">
                📚 برامجي
              </Link>

              <Link href="/profile/edit" className="block p-3 rounded-xl hover:bg-indigo-50">
                ⚙️ الإعدادات
              </Link>
            </nav>

            <div className="space-y-3 pt-6 border-t">
              <a
                href="https://wa.me/967773398837"
                target="_blank"
                className="block text-center py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600"
              >
                💬 الدعم الفني
              </a>

              <button
                onClick={logout}
                className="w-full py-3 rounded-xl text-indigo-600 font-semibold hover:bg-indigo-50"
              >
                🚪 تسجيل الخروج
              </button>
            </div>
          </aside>

          {/* ===== Content ===== */}
          <div className="flex-1 lg:mr-72 p-4 md:p-8">
            {/* Mobile topbar */}
            <div className="lg:hidden flex justify-between items-center bg-white p-4 rounded-2xl shadow mb-6">
              <h1 className="font-bold text-indigo-600">لوحة التحكم</h1>
              <button onClick={() => setSidebarOpen(true)}>☰</button>
            </div>

            {children}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

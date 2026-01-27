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
      <div className="flex min-h-screen bg-[#EEF0FF] p-6 gap-6" dir="rtl">

        {/* ===== Sidebar ===== */}
        <aside
          className={`
            fixed top-0 right-0 h-full w-64 bg-white rounded-l-2xl shadow-lg p-6
            transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
            md:translate-x-0 md:static md:flex md:flex-col
          `}
        >
          {/* Top Bar Close Button for Mobile */}
          <div className="flex justify-between items-center mb-8 md:hidden">
            <h2 className="text-xl font-bold text-indigo-600">القائمة</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-2xl font-bold"
            >
              &times;
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 space-y-4 text-gray-600">
            <h2 className="text-xl font-bold mb-8 text-indigo-600">البروفايل</h2>

            <Link href="/dashboard" className="block hover:text-indigo-800">
              🏠 الرئيسية
            </Link>

            <Link href="/dashboard/programs" className="block hover:text-indigo-800">
              📚 البرامج
            </Link>

            <Link href="/profile/edit" className="block hover:text-indigo-800">
              ⚙️ الإعدادات
            </Link>
          </nav>

          {/* Support & Logout */}
          <div className="pt-6 border-t space-y-3">
            <a
              href="https://wa.me/967773398837"
              target="_blank"
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
            >
              💬 الدعم الفني
            </a>

            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-indigo-600 font-semibold hover:bg-indigo-50 transition"
            >
              🚪 تسجيل الخروج
            </button>
          </div>
        </aside>

        {/* ===== Main Content ===== */}
        <div className="flex-1 flex flex-col md:ml-0">
          {/* Top Bar for Mobile only */}
          <div className="flex items-center justify-between bg-white shadow p-4 mb-6 md:hidden rounded-2xl">
            <h1 className="text-lg font-bold text-indigo-600">لوحة التحكم</h1>
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-2xl font-bold"
            >
              &#9776;
            </button>
          </div>

          {/* Content */}
          <main className="flex-1 space-y-6">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (href: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition
     ${
       path === href
         ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
         : "text-gray-700 hover:bg-blue-50"
     }`;

  return (
    <>
      {/* ===== Mobile Top Bar ===== */}
      <div className="lg:hidden fixed top-0 right-0 left-0 h-14 bg-white border-b shadow flex items-center justify-between px-4 z-50">
        <button
          onClick={() => setOpen(true)}
          className="text-2xl font-bold"
        >
          ☰
        </button>

        <h1 className="font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Kidscode
        </h1>
      </div>

      {/* ===== Overlay (Mobile) ===== */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* ===== Sidebar ===== */}
      <aside
        className={`
          fixed top-0 right-0 h-screen w-64 bg-white border-l shadow-lg z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
          lg:translate-x-0 lg:flex
          flex-col
        `}
      >
        {/* ===== Header ===== */}
        <div className="px-6 py-6 border-b flex items-center justify-between">
          <div className="text-center w-full">
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Kidscode
            </h1>
            <p className="text-xs text-gray-500 mt-1">لوحة التحكم</p>
          </div>

          {/* Close button (mobile) */}
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden absolute left-4 top-6 text-xl"
          >
            ✖
          </button>
        </div>

        {/* ===== Navigation ===== */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link onClick={() => setOpen(false)} href="/admin" className={linkClass("/admin")}>
            🏠 لوحة التحكم
          </Link>

          <Link onClick={() => setOpen(false)} href="/admin/users" className={linkClass("/admin/users")}>
            👥 إدارة المستخدمين
          </Link>

          <Link onClick={() => setOpen(false)} href="/admin/programs" className={linkClass("/admin/programs")}>
            📚 إدارة البرامج
          </Link>

          <Link onClick={() => setOpen(false)} href="/admin/enrollments" className={linkClass("/admin/enrollments")}>
            📝 طلبات التسجيل
          </Link>

          <Link onClick={() => setOpen(false)} href="/admin/stats" className={linkClass("/admin/stats")}>
            📊 الإحصائيات
          </Link>
        </nav>

        {/* ===== Logout ===== */}
        <div className="px-4 py-6 border-t">
          <button
            onClick={() => {
              console.log("logout");
              setOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                       bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition"
          >
            🚪 تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  );
}

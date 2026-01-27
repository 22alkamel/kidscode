"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const path = usePathname();

  const linkClass = (href: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition
     ${
       path === href
         ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
         : "text-gray-700 hover:bg-blue-50"
     }`;

  return (
    <aside className="fixed top-0 right-0 h-screen w-64 bg-white border-l border-gray-200 shadow-lg flex flex-col">
      
      {/* ===== Logo / Brand ===== */}
      <div className="px-6 py-6 border-b">
        <h1 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
          Kidscode
        </h1>
        <p className="text-xs text-gray-500 text-center mt-1">
          لوحة التحكم
        </p>
      </div>

      {/* ===== Navigation ===== */}
      <nav className="flex-1 px-4 py-6 space-y-2">

        <Link href="/admin" className={linkClass("/admin")}>
          🏠 لوحة التحكم
        </Link>

        <Link href="/admin/users" className={linkClass("/admin/users")}>
          👥 إدارة المستخدمين
        </Link>

        <Link href="/admin/programs" className={linkClass("/admin/programs")}>
          📚 إدارة البرامج
        </Link>

        <Link href="/admin/enrollments" className={linkClass("/admin/enrollments")}>
          📝 طلبات التسجيل
        </Link>

        <Link href="/admin/stats" className={linkClass("/admin/stats")}>
          📊 الإحصائيات
        </Link>

      </nav>

      {/* ===== Logout Button ===== */}
      <div className="px-4 py-6 border-t">
        <button
          onClick={() => {
            // لاحقًا: logout logic
            console.log("logout");
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                     bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition"
        >
          🚪 تسجيل الخروج
        </button>
      </div>

    </aside>
  );
}

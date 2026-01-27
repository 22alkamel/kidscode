"use client";

import RoleGuard from "@/components/guards/RoleGuard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

        {/* Sidebar ثابتة */}
        <aside className="w-64 bg-white rounded-2xl p-6 shadow flex flex-col justify-between">

          <nav className="space-y-4 text-gray-600">
            <h2 className="text-xl font-bold mb-8 text-indigo-600">البروفايل</h2>

            <Link href="/dashboard" className="block hover:text-indigo-800">
              🏠 الرئيسية
            </Link>

            <Link href="/dashboard/programs" className="block hover:text-indigo-800">
              📚 البرامج
            </Link>

            {/* <Link href="/student/progress" className="block hover:text-indigo-800">
              📈 التقدم
            </Link>

            <Link href="/student/messages" className="block hover:text-indigo-800">
              💬 الرسائل
            </Link> */}

            <Link href="/profile/edit" className="block hover:text-indigo-800">
              ⚙️ الإعدادات
            </Link>
          </nav>

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

        {/* المحتوى المتغير */}
        <main className="flex-1 space-y-6">
          {children}
        </main>

      </div>
    </RoleGuard>
  );
}

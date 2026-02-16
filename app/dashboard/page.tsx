"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

const DAYS_MAP: Record<string, string> = {
  sat_tue: "السبت و الثلاثاء",
  sun_wed: "الأحد و الأربعاء",
  mon_thu: "الاثنين و الخميس",
};

const TIME_MAP: Record<string, string> = {
  "08-10": "8 إلى 10 صباحا",
  "10-12": "10 إلى 12 مساء",
  "13-15": "1 إلى 3 مساء",
  "15-17": "3 إلى 5 مساء",
  "19-21": "7 إلى 9 مساء",
};

export default function Dashboard() {
  const { user } = useAuth()!;
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [programsCount, setProgramsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    api.get("/my-registrations").then((res) => {
      setProgramsCount(res.data.programs_count);
      setRegistrations(res.data.registrations);
      setLoading(false);
    });

    api.get("/notifications").then((res) => setNotifications(res.data));
  }, []);

  const hasUnread = notifications.some((n) => !n.read_at);

  return (
    <div dir="rtl" className="min-h-screen bg-[#EEF0FF] p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ===== Main ===== */}
        <main className="flex-1 space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                مرحبًا {user?.name} 👋
              </h1>
              <p className="text-sm opacity-90 mt-1">
                أهلاً بك في عالم العباقرة الصغار
              </p>
            </div>
            <img src="/logoo.png" alt="logo" className="h-20 sm:h-24" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { title: "البرامج", value: programsCount },
              { title: "المكتملة", value: "" },
              { title: "النقاط", value: "" },
              { title: "الشارة", value: " " },
            ].map((c, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 shadow text-center"
              >
                <p className="text-sm text-gray-500">{c.title}</p>
                <p className="text-lg font-bold mt-1">{c.value}</p>
              </div>
            ))}
          </div>

          {/* Programs */}

          {/* PROGRAMS */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-indigo-900">
              برامجي التعليمية
            </h2>

            {loading && <p className="text-center">جاري التحميل...</p>}

            {!loading && registrations.length === 0 && (
              <p className="text-center text-gray-500">
                لا توجد برامج مسجلة بعد
              </p>
            )}

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {registrations.map((reg) => (
                <div
                  key={reg.id}
                  className="border rounded-2xl p-5 hover:shadow-xl transition"
                >
                  <h3 className="font-bold text-indigo-900 mb-2">
                    {reg.program?.title}
                  </h3>

                  <p className="text-sm text-gray-600">
                    {DAYS_MAP[reg.preferred_days]} |{" "}
                    {TIME_MAP[reg.preferred_time]}
                  </p>

                  <span
                    className={`inline-block mt-3 px-3 py-1 text-xs rounded-full font-semibold
                ${
                  reg.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : reg.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
                  >
                    {reg.status === "confirmed" && "مؤكد"}
                    {reg.status === "pending" && "قيد المراجعة"}
                    {reg.status === "cancelled" && "ملغي"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* ===== Sidebar ===== */}
        <aside className="w-full lg:w-72 space-y-6">
          {/* Profile */}
          <div className="bg-white rounded-2xl p-4 shadow text-center">
            <img
              src={
                user?.avatar
                  ? `http://localhost:8000${user.avatar}`
                  : "/default.jpg"
              }
              className="w-16 h-16 rounded-full mx-auto mb-2"
            />
            <p className="font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-400">طالب</p>
            <Link
              href="/profile/edit"
              className="text-sm text-indigo-600 hover:underline"
            >
              تعديل الملف الشخصي
            </Link>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl p-4 shadow">
            <h3 className="font-bold mb-3 flex justify-between">
              الإشعارات
              {hasUnread && (
                <span className="w-2 h-2 bg-red-500 rounded-full" />
              )}
            </h3>

            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500">لا توجد إشعارات</p>
            ) : (
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {notifications.slice(0, 5).map((n) => (
                  <li
                    key={n.id}
                    className={`p-2 rounded text-sm ${
                      n.read_at ? "bg-gray-50" : "bg-indigo-100"
                    }`}
                  >
                    {n.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

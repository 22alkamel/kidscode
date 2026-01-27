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

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (e) {}
    localStorage.removeItem("token");
    router.replace("/login");
  };

  const markAsRead = async (id: string) => {
    await api.post(`/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date() } : n))
    );
  };

  useEffect(() => {
    api
      .get("/my-registrations")
      .then((res) => {
        setProgramsCount(res.data.programs_count);
        setRegistrations(res.data.registrations);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    api
      .get("/notifications")
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error(err));
  }, []);

  const hasUnread = notifications.some((n) => !n.read_at);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#EEF0FF] p-4 md:p-6 gap-6" dir="rtl">
      {/* ===== Main Content ===== */}
      <main className="flex-1 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">مرحبا بك {user?.name} 👋</h1>
            <p className="text-sm opacity-90 pt-2 sm:pt-4">
              اهلا بك في عالم العباقره الصغار
            </p>
          </div>
          <img src="/logoo.png" alt="illustration" className="h-24" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "البرامج", value: programsCount },
            { title: "المكتمله", value: "3" },
            { title: "النقاط", value: "120" },
            { title: "الشاره", value: "صانع الالعاب" },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow">
              <p className="text-xl font-bold pb-2">{card.title}</p>
              <h3 className="text-gray-500 text-lg">{card.value}</h3>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow overflow-x-auto">
          <h2 className="font-bold mb-4 text-lg">مسارات التعلم</h2>
          <table className="w-full text-sm text-right min-w-[400px]">
            <thead className="text-gray-400 border-b">
              <tr>
                <th className="py-2 px-3">البرنامج</th>
                <th className="py-2 px-3">الحاله</th>
                <th className="py-2 px-3">موعد البرنامج</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading && (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    جاري التحميل...
                  </td>
                </tr>
              )}

              {!loading && registrations.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    لا يوجد برامج مسجّل فيها حاليًا
                  </td>
                </tr>
              )}

              {!loading &&
                registrations.map((reg) => (
                  <tr key={reg.id} className="text-right">
                    <td className="py-2 px-3">{reg.program?.title}</td>
                    <td
                      className={`py-2 px-3 font-semibold ${
                        reg.status === "confirmed"
                          ? "text-green-600"
                          : reg.status === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {reg.status === "pending" && "قيد المراجعة"}
                      {reg.status === "confirmed" && "مؤكد"}
                      {reg.status === "cancelled" && "ملغي"}
                    </td>
                    <td className="py-2 px-3 text-gray-600">
                      {DAYS_MAP[reg.preferred_days] || "—"} |{" "}
                      {TIME_MAP[reg.preferred_time] || "—"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* ===== Sidebar / Right Panel ===== */}
      <aside className="w-full md:w-72 flex-shrink-0 flex flex-col gap-6">
        {/* Profile */}
        <div className="bg-white rounded-2xl p-4 shadow text-center">
          <img
            src={
              user?.avatar ? `http://localhost:8000${user.avatar}` : "/default.jpg"
            }
            className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
            alt={user?.name}
          />
          <p className="font-semibold">{user?.name}</p>
          <p className="text-xs text-gray-400">طالب</p>
          <Link
            href="/profile/edit"
            className="text-gray-400 hover:text-indigo-600 text-sm mt-1 inline-block"
            title="تعديل الملف الشخصي"
          >
            ✏️ تعديل الملف الشخصي
          </Link>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl p-4 shadow relative">
          <h3 className="font-bold mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔔</span>
              <span>الإشعارات</span>
            </div>
            {hasUnread && <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>}
          </h3>

          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">لا توجد إشعارات جديدة</p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {notifications.slice(0, 5).map((notif) => (
                <li
                  key={notif.id}
                  className={`flex items-start justify-between gap-2 p-3 rounded ${
                    !notif.read_at ? "bg-indigo-100" : "bg-gray-50"
                  }`}
                >
                  <p className="text-sm text-gray-700 leading-snug">{notif.message}</p>
                  {!notif.read_at && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="text-gray-400 hover:text-red-500 text-xs"
                      title="تعليم كمقروء"
                    >
                      ✕
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          {notifications.length > 5 && (
            <div className="text-center mt-2">
              <Link
                href="/notifications"
                className="text-indigo-600 text-sm hover:underline"
              >
                عرض جميع الإشعارات
              </Link>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

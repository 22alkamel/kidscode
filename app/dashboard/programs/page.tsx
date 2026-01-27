"use client";

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

export default function StudentProgramsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/my-registrations")
      .then((res) => {
        setRegistrations(res.data.registrations);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#EEF0FF] p-6" dir="rtl">
      <div className="bg-white rounded-2xl p-6 shadow">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600">
            📚 برامجي التعليمية
          </h1>

        </div>

        <table className="w-full text-sm">
          <thead className="text-gray-400">
            <tr className="text-right">
              <th>البرنامج</th>
              <th>الحالة</th>
              <th>الموعد</th>
            </tr>
          </thead>

          <tbody className="divide-y">

            {loading && (
              <tr>
                <td colSpan={3} className="text-center py-6">
                  جاري تحميل البرامج...
                </td>
              </tr>
            )}

            {!loading && registrations.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  لا يوجد برامج مسجّل فيها حالياً
                </td>
              </tr>
            )}

            {!loading &&
              registrations.map((reg) => (
                <tr key={reg.id} className="text-right">

                  <td className="font-semibold">
                    {reg.program?.title}
                  </td>

                  <td
                    className={
                      reg.status === "confirmed"
                        ? "text-green-600"
                        : reg.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }
                  >
                    {reg.status === "pending" && "قيد المراجعة"}
                    {reg.status === "confirmed" && "مؤكد"}
                    {reg.status === "cancelled" && "ملغي"}
                  </td>

                  <td className="text-gray-600">
                    {DAYS_MAP[reg.preferred_days] || "—"} |{" "}
                    {TIME_MAP[reg.preferred_time] || "—"}
                  </td>

                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

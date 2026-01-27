"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";

const DAYS_OPTIONS: Record<string, string> = {
  sat_tue: "السبت و الثلاثاء",
  sun_wed: "الأحد و الأربعاء",
  mon_thu: "الاثنين و الخميس",
};

const TIME_OPTIONS: Record<string, string> = {
  "08-10": "8 إلى 10 صباحا",
  "10-12": "10 إلى 12 صباحا",
  "13-15": "1 إلى 3 مساء",
  "15-17": "3 إلى 5 مساء",
  "19-21": "7 إلى 9 مساء",
};

export default function SelectSchedulePage() {
  const searchParams = useSearchParams();
  const programId = searchParams.get("program_id");

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitSchedule = async () => {
    if (!selectedDay || !selectedTime) {
      return alert("الرجاء اختيار اليوم والوقت");
    }

    if (!programId) {
      return alert("لم يتم تحديد البرنامج");
    }

    setLoading(true);
    try {
      await api.post(
        "/registrations",
        {
          program_id: Number(programId),
          preferred_days: selectedDay,
          preferred_time: selectedTime,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("تم حفظ الاختيار بنجاح!");
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("خطأ عند إنشاء التسجيل:", err.response?.data || err);
      alert(err.response?.data?.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      dir="rtl"
    >
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          اختيار موعد الحصص
        </h1>

        {/* اختيار اليوم */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">اختر اليوم</h2>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(DAYS_OPTIONS).map(([key, label]) => (
              <div
                key={key}
                onClick={() => setSelectedDay(key)}
                className={`p-4 border rounded-xl cursor-pointer transition
                  ${
                    selectedDay === key
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "border-gray-200"
                  }
                `}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* اختيار الوقت */}
        {selectedDay && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">اختر الوقت</h2>
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(TIME_OPTIONS).map(([key, label]) => (
                <div
                  key={key}
                  onClick={() => setSelectedTime(key)}
                  className={`p-4 border rounded-xl cursor-pointer transition
                    ${
                      selectedTime === key
                        ? "border-blue-600 bg-blue-50 shadow-md"
                        : "border-gray-200"
                    }
                  `}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={submitSchedule}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded-lg text-lg font-semibold mt-4 disabled:opacity-50"
        >
          {loading ? "جاري الحفظ..." : "حفظ ومتابعة"}
        </button>
      </div>
    </div>
  );
}

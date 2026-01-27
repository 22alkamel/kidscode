"use client";

import { useState } from "react";
import useSWR from "swr";
import api from "@/lib/api";
import Image from "next/image";

const grades = [
  { id: 1, label: "(7-9)", age: 8 },
  { id: 2, label: "(9-11)", age: 10 },
  { id: 3, label: "(11-13)", age: 12 },
  { id: 4, label: "(13-15)", age: 14 },
  { id: 5, label: "(15-17)", age: 16 },
];

const plans = [
  {
    level: "مبتدئ",
    price: "20$",
    features: ["تعلم الأساسيات", "تمارين قصيرة", "دعم محدود"],
  },
  {
    level: "متوسط",
    price: "40$",
    features: ["مشاريع متقدمة", "دعم متوسط", "شهادات جزئية"],
  },
  {
    level: "متقدم",
    price: "50$",
    features: ["مشاريع كاملة", "دعم كامل", "مزايا إضافية"],
  },
];

export default function HorizontalTimeline() {
  const [selectedGrade, setSelectedGrade] = useState(1);
  const selectedAge = grades.find((g) => g.id === selectedGrade)?.age ?? 8;

  const fetcher = (url: string) => api.get(url).then((res) => res.data?.data);

  const { data: program, error, isLoading } = useSWR(
    () => `/programs?age=${selectedAge}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const tracks = program?.tracks ?? [];

  return (
    <section
      dir="rtl"
      className="py-20 bg-gradient-to-b from-blue-50 via-white to-purple-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* العنوان */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-10">
          ابدأ بصناعة مستقبل طفلك 🚀
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {grades.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGrade(g.id)}
              className={`px-5 py-2 rounded-full text-sm sm:text-base font-semibold transition
                ${
                  selectedGrade === g.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                    : "bg-white text-gray-700 border hover:border-purple-400"
                }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {isLoading && (
          <p className="text-center text-gray-600 mb-6 animate-pulse">
            جاري تحميل البرنامج...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500 mb-6">
            حدث خطأ أثناء جلب البيانات
          </p>
        )}

        <h3 className="text-xl sm:text-2xl font-bold text-center text-indigo-900 mb-14">
          {program
            ? program.title
            : `لا يوجد برنامج للفئة ${grades.find(
                (g) => g.id === selectedGrade
              )?.label}`}
        </h3>

        {/* ================= Timeline ================= */}

        {/* 🟣 نسخة الجوال والآيباد (عمودية) */}
        <div className="lg:hidden relative space-y-10">
          {tracks.map((track: any) => {
            const imageURL = track.track_img
              ? `http://localhost:8000/storage/${track.track_img}`
              : "/default.png";

            return (
              <div key={track.id} className="relative flex gap-4">
                {/* الخط */}
                <div className="flex flex-col items-center">
                  <span className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
                  <span className="flex-1 w-[2px] bg-purple-300" />
                </div>

                {/* الكرت */}
                <div className="bg-white rounded-2xl shadow-lg p-4 flex gap-4 w-full">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={imageURL}
                      alt={track.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h4 className="font-bold text-indigo-900">
                      {track.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {track.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 🟣 نسخة الديسكتوب (أفقية) */}
        <div className="hidden lg:block relative pt-48 pb-48">
          {/* الخط */}
          <div className="absolute inset-x-0 top-70 h-[2px] bg-gradient-to-r from-blue-300 to-purple-400 rounded-full" />

          <div
            className="grid relative"
            style={{
              gridTemplateColumns: `repeat(${tracks.length}, minmax(0, 1fr))`,
            }}
          >
            {tracks.map((track: any, index: number) => {
              const isTop = index % 2 === 0;
              const imageURL = track.track_img
                ? `http://localhost:8000/storage/${track.track_img}`
                : "/default.png";

              return (
                <div key={track.id} className="relative flex flex-col items-center">
                  {/* النقطة */}
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg z-10" />

                  {/* الكرت */}
                  <div
                    className={`absolute w-80 bg-white rounded-3xl shadow-2xl p-6
                      ${isTop ? "-top-52" : "top-20"}`}
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                        <Image
                          src={imageURL}
                          alt={track.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <h4 className="font-bold text-indigo-900">
                          {track.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {track.description}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`absolute left-1/2 -translate-x-1/2 w-[2px] h-14 bg-gradient-to-b from-blue-400 to-purple-500
                        ${isTop ? "top-full" : "-top-14"}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= Pricing ================= */}
        {program && (
          <div className="mt-24 pt-42">
            <h3 className="text-2xl font-bold text-center text-indigo-900 mb-12">
              خطط الاشتراك 🎓
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.level}
                  className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition"
                >
                  <h4 className="text-xl font-bold text-indigo-900 mb-2">
                    {plan.level}
                  </h4>

                  <p className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-5">
                    {plan.price}
                  </p>

                  <ul className="space-y-2 text-gray-700 mb-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex justify-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition">
                    اشترك الآن
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

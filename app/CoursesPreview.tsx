"use client";

import { useState } from "react";
import useSWR from "swr";
import api from "@/lib/api";
import Image from "next/image";
import { useRouter } from "next/navigation";

const grades = [
  { id: 1, label: "(7-9)", age: 8 },
  { id: 2, label: "(9-11)", age: 10 },
  { id: 3, label: "(11-13)", age: 12 },
  { id: 4, label: "(13-15)", age: 14 },
  { id: 5, label: "(15-17)", age: 16 },
];

export default function HorizontalTimeline() {
  const [selectedGrade, setSelectedGrade] = useState(1);
  const selectedAge = grades.find((g) => g.id === selectedGrade)?.age ?? 8;
  const router = useRouter();

  const fetcher = (url: string) => api.get(url).then((res) => res.data?.data);

  const {
    data: program,
    error,
    isLoading,
  } = useSWR(() => `/programs?age=${selectedAge}`, fetcher, {
    revalidateOnFocus: false,
  });

  const tracks = program?.tracks ?? [];
  const handleSubscribe = () => {
    const token = localStorage.getItem("token");

    if (!program?.id) return;

    // المستخدم غير مسجل
    if (!token) {
      router.push(`/login?redirect=/select-schedule?program_id=${program.id}`);
      return;
    }

    // المستخدم مسجل
    router.push(`/register/select-schedule?program_id=${program.id}`);
  };

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
            : `لا يوجد برنامج للفئة ${
                grades.find((g) => g.id === selectedGrade)?.label
              }`}
        </h3>

        {program && (
          <div className="flex justify-center mb-16">
            <button
              onClick={() => handleSubscribe()}
              className="bg-gradient-to-r from-blue-600 to-purple-600
      hover:scale-105 transition text-white font-bold
      px-8 py-4 rounded-2xl shadow-xl text-lg"
            >
              اشترك في البرنامج مقابل {program.price} دولار 🚀
            </button>
          </div>
        )}
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
                    <h4 className="font-bold text-indigo-900">{track.title}</h4>
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
                <div
                  key={track.id}
                  className="relative flex flex-col items-center"
                >
                  {/* النقطة */}
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg z-10" />

                  {/* الكرت */}
                  <div
                    className={`absolute w-80 bg-white rounded-3xl shadow-2xl p-6 flex flex-col justify-between h-[170px]

                      ${isTop ? "-top-52" : "top-20"}`}
                  >
                    <div className="grid grid-cols-[96px_1fr] gap-4 items-start">
                      <div className="relative w-24 h-24 min-w-[96px] rounded-xl overflow-hidden">
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
      </div>
    </section>
  );
}

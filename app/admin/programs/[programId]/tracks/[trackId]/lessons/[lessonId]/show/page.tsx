"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useParams } from "next/navigation";

export default function LessonShowPage() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/admin/lessons/${lessonId}`)
      .then((res) => setLesson(res.data))
      .finally(() => setLoading(false));
  }, [lessonId]);

  if (loading)
    return (
      <p className="text-center text-lg text-gray-500 mt-20 animate-pulse">
        جاري التحميل...
      </p>
    );
  if (!lesson)
    return (
      <p className="text-center text-lg text-red-500 mt-20">
        ❌ الدرس غير موجود
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* عنوان الدرس */}
      <h1 className="text-3xl font-extrabold text-purple-700 mb-4 border-b-2 pb-2 border-purple-200">
        📘 {lesson.title}
      </h1>

      {/* محتوى الدرس */}
      <p className="text-gray-700 bg-purple-50 p-4 rounded-xl shadow-sm">
        {lesson.content}
      </p>

      {/* معلومات الدرس */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <p className="bg-indigo-100 px-3 py-1 rounded-full">
          المدة: {lesson.duration_minutes ?? "-"} دقيقة
        </p>
        <p
          className={`px-3 py-1 rounded-full ${
            lesson.is_published
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          الحالة: {lesson.is_published ? "منشور ✅" : "مخفي ❌"}
        </p>
      </div>

      {/* الميديا */}
      <h2 className="text-2xl font-semibold mb-4 text-indigo-600">🎬 الميديا</h2>
      {lesson.media?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lesson.media.map((m: any, i: number) => (
            <div
              key={i}
              className="p-2 bg-indigo-50 rounded-xl shadow hover:bg-indigo-100 transition"
            >
              {m.type === "image" && (
                <img
                  src={m.url}
                  alt={m.caption || `Image ${i + 1}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
              {m.type === "video" && (
                <video
                  src={m.url}
                  controls
                  className="w-full h-40 rounded-lg object-cover"
                />
              )}
              {m.type === "pdf" && (
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-3 py-2 bg-indigo-200 text-indigo-800 rounded-lg hover:bg-indigo-300 transition"
                >
                  📄 {m.caption || "فتح الملف"}
                </a>
              )}
              {m.caption && m.type !== "file" && (
                <p className="mt-2 text-sm text-gray-700">{m.caption}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">لا توجد ميديا</p>
      )}

      {/* الأسئلة */}
      <h2 className="text-2xl font-semibold mt-6 mb-4 text-pink-600">❓ الأسئلة</h2>
      {lesson.questions?.length ? (
        <div className="space-y-4">
          {lesson.questions.map((q: any, i: number) => (
            <div
              key={i}
              className="p-4 bg-pink-50 rounded-xl shadow hover:bg-pink-100 transition"
            >
              <p className="font-medium text-gray-800">س: {q.question}</p>
              {q.correct_answer && (
                <p className="mt-2 text-green-700 font-semibold">ج: {q.correct_answer}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">لا توجد أسئلة</p>
      )}
    </div>
  );
}

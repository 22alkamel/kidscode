"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

export default function TrackLessonsPage() {
  const { programId, trackId } = useParams();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    api
      .get(`/admin/tracks/${trackId}/lessons`)
      .then((res) => setLessons(res.data))
      .finally(() => setLoading(false));
  }, [trackId]);

  /* ===== Filter + Search ===== */
  const filteredLessons = useMemo(() => {
    if (!lessons) return [];
    return lessons.filter((lesson) =>
      lesson.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [lessons, search]);

  /* ===== Pagination ===== */
  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
  const paginatedLessons = filteredLessons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 space-y-6">

      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-extrabold text-indigo-900">دروس المسار</h1>

        <Link
          href={`/admin/programs/${programId}/tracks/${trackId}/lessons/create`}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600
                     text-white font-semibold shadow hover:scale-105 transition"
        >
          + إضافة درس
        </Link>
      </div>

      {/* ===== Search & Items Per Page ===== */}
      <div className=" flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="🔍 بحث بالعنوان"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm w-64
                     focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <select
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          {ITEMS_PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} / صفحة
            </option>
          ))}
        </select>
      </div>

      {/* ===== Lessons List ===== */}
      {paginatedLessons.length === 0 ? (
        <div className="text-center bg-gray-50 p-10 rounded-2xl">
          <p className="mb-4 text-gray-500 text-lg">لا توجد دروس لهذا المسار</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {paginatedLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-2xl shadow hover:shadow-md transition"
            >
              {/* ===== Lesson Info ===== */}
              <div className="space-y-1">
                <h3 className="font-semibold text-indigo-900">{lesson.title}</h3>
                <p className="text-sm text-gray-500">
                  المدة: {lesson.duration_minutes ?? "-"} دقيقة
                </p>
                <p className="text-sm">
                  الحالة:
                  <span
                    className={`ml-2 font-semibold ${
                      lesson.is_published ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {lesson.is_published ? "منشور" : "مخفي"}
                  </span>
                </p>
              </div>

              {/* ===== Actions ===== */}
              <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <Link
                  href={`/admin/programs/${programId}/tracks/${trackId}/lessons/${lesson.id}/edit`}
                  className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-semibold transition"
                >
                  تعديل
                </Link>

                <Link
                  href={`/admin/programs/${programId}/tracks/${trackId}/lessons/${lesson.id}/show`}
                  className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-semibold transition"
                >
                  عرض
                </Link>

                <button
                  onClick={async () => {
                    if (!confirm("هل أنت متأكدة من حذف الدرس؟")) return;
                    await api.delete(`/lessons/${lesson.id}`);
                    setLessons((prev) =>
                      prev.filter((l) => l.id !== lesson.id)
                    );
                  }}
                  className="px-4 py-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 text-sm font-semibold transition"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== Pagination ===== */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-full text-sm font-semibold
                ${
                  currentPage === i + 1
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "bg-white border hover:bg-gray-100"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

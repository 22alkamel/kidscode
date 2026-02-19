"use client";

import { use } from "react";
import useSWR from "swr";
import api from "@/lib/api";
import Link from "next/link";
import { useState } from "react";

import AddTrackModal from "@/components/tracks/AddTrackModal";
import EditTrackModal from "@/components/tracks/EditTrackModal";

export default function ProgramDetails({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const { programId } = use(params);

  /* ===== Program Data ===== */
  const { data: programData } = useSWR(`/admin/programs/${programId}`, (url) =>
    api.get(url).then((res) => res.data)
  );

  /* ===== Tracks ===== */
  const {
    data: tracksData,
    mutate: mutateTracks,
    isValidating: tracksLoading,
  } = useSWR(
    () => (programId ? `/programs/${programId}/tracks` : null),
    (url) => api.get(url).then((res) => res.data),
    { revalidateOnFocus: false }
  );

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "";
  if (!programData)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        جاري تحميل بيانات البرنامج...
      </div>
    );

  const program = programData.program ?? programData;
  const tracks = tracksData?.data ?? [];

  /* ===== Delete Track ===== */
  async function handleDelete(trackId: number) {
    if (!confirm("هل أنت متأكد من حذف هذا المسار؟")) return;

    try {
      setDeletingId(trackId);
      await api.delete(`/admin/tracks/${trackId}`);
      mutateTracks();
    } catch {
      alert("حدث خطأ أثناء الحذف");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">

      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-indigo-900">
            📘 {program.title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            تفاصيل البرنامج وإدارة المسارات
          </p>
        </div>

        <Link
          href="/admin/programs"
          className="px-6 py-3 rounded-full bg-gray-800 text-white text-sm font-semibold
                     hover:bg-gray-900 transition"
        >
          ← الرجوع للبرامج
        </Link>
      </div>

      {/* ===== Program Card ===== */}
      <div className="bg-white rounded-3xl shadow p-6 flex flex-col lg:flex-row gap-6">

        <img
          src={
            program.image
              ? `${backendUrl}/storage/${program.image}`
              : "/default.png"
          }
          className="w-48 h-48 rounded-2xl object-cover border"
        />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><span className="font-semibold">المستوى:</span> {program.level}</p>
          <p><span className="font-semibold">العمر:</span> {program.agemin} - {program.agemax}</p>
          <p><span className="font-semibold">المدة:</span> {program.duration_weeks} أسبوع</p>
          <p>
            <span className="font-semibold">السعر:</span>
            <span className="text-green-600 font-bold"> {program.price} $</span>
          </p>
        </div>
      </div>

      {/* ===== Tracks Header ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-indigo-900">
          🛤️ المسارات التعليمية
        </h2>

        <button
          onClick={() => setShowAdd(true)}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600
                     text-white font-semibold shadow hover:scale-105 transition"
        >
          + إضافة مسار
        </button>
      </div>

      {/* ===== Tracks Table ===== */}
      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">الصورة</th>
                <th className="p-4">العنوان</th>
                <th className="p-4">المدة</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              {tracks.map((track: any, idx: number) => (
                <tr
                  key={track.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4">{idx + 1}</td>

                  <td className="p-4">
                    <img
                      src={
                        track.track_img
                          ? `${backendUrl}/storage/${track.track_img}`
                          : "/default.png"
                      }
                      className="w-12 h-12 rounded-xl object-cover border"
                    />
                  </td>

                  <td className="p-4 font-semibold text-indigo-900">
                    {track.title}
                  </td>

                  <td className="p-4 text-gray-600">
                    {track.estimated_time ?? "-"} دقيقة
                  </td>

                  <td className="p-4">
                    {track.is_published ? (
                      <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                        منشور
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs bg-gray-200 text-gray-600">
                        غير منشور
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-3 text-xs font-semibold">

                      <button
                        onClick={() => setEditing(track)}
                        className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        تعديل
                      </button>

                      <button
                        disabled={deletingId === track.id}
                        onClick={() => handleDelete(track.id)}
                        className="px-4 py-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200
                                   disabled:opacity-50"
                      >
                        {deletingId === track.id ? "جارٍ الحذف..." : "حذف"}
                      </button>

                      <Link
                        href={`/admin/programs/${program.id}/tracks/${track.id}/lessons`}
                        className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      >
                        عرض الدروس
                      </Link>

                    </div>
                  </td>
                </tr>
              ))}

              {tracks.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-400">
                    لا توجد مسارات لهذا البرنامج بعد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {tracksLoading && (
        <p className="text-center text-gray-500">جارٍ تحميل المسارات...</p>
      )}

      {/* ===== Modals ===== */}
      {showAdd && (
        <AddTrackModal
          programId={program.id}
          onClose={() => setShowAdd(false)}
          mutate={mutateTracks}
        />
      )}

      {editing && (
        <EditTrackModal
          track={editing}
          programId={program.id}
          onClose={() => setEditing(null)}
          mutate={mutateTracks}
        />
      )}
    </div>
  );
}

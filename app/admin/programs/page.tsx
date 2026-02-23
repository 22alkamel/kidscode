"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import api from "@/lib/api";
import AddProgramModal from "@/components/AddProgramModal";
import EditProgramModal from "@/components/EditProgramModal";
import Link from "next/link";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

export default function ProgramsPage() {
  const { data, mutate } = useSWR("/admin/programs", (url) =>
    api.get(url).then((res) => res.data)
  );

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

   const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "";

  /* ===== Filter + Search ===== */
  const filteredPrograms = useMemo(() => {
    if (!data?.data) return [];
    let programs = data.data;

    if (search) {
      programs = programs.filter(
        (p: any) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.slug.toLowerCase().includes(search.toLowerCase())
      );
    }

    return programs;
  }, [data, search]);

  /* ===== Pagination ===== */
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const paginatedPrograms = filteredPrograms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-indigo-900">
            📚 إدارة البرامج
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            إنشاء وتحرير وإدارة برامج Kidscode
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600
                     text-white font-semibold shadow hover:scale-105 transition"
        >
          + إضافة برنامج
        </button>
      </div>

      {/* ===== Search & Controls ===== */}
      <div className="bg-white rounded-2xl p-4 shadow flex flex-col sm:flex-row gap-4 sm:items-center">
        <input
          type="text"
          placeholder="🔍 بحث بعنوان البرنامج أو الـ slug"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm w-full sm:w-72
                     focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <select
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm w-full sm:w-auto"
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

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded-3xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4">العنوان</th>
                <th className="p-4">الوصف</th>
                <th className="p-4">الصورة</th>
                <th className="p-4">المستوى</th>
                <th className="p-4">العمر</th>
                <th className="p-4">المدة</th>
                <th className="p-4">السعر</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">التحكم</th>
              </tr>
            </thead>

            <tbody>
              {paginatedPrograms.map((item: any) => (
                <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4 font-semibold text-indigo-900">{item.title}</td>
                  <td className="p-4 text-gray-500">{item.description}</td>

                  <td className="p-4">
                    <img
                      src={
                        item.image
                          ? `${backendUrl}/storage/${item.image}`
                          : "/default.png"
                      }
                      className="w-12 h-12 rounded-xl object-cover border"
                    />
                  </td>

                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                      {item.level}
                    </span>
                  </td>

                  <td className="p-4">{item.agemin} - {item.agemax}</td>
                  <td className="p-4">{item.duration_weeks} أسبوع</td>
                  <td className="p-4 font-semibold text-green-600">{item.price} $</td>

                  <td className="p-4">
                    {item.is_published ? (
                      <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                        منشور
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs bg-gray-200 text-gray-600">
                        مسودة
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <Actions item={item} setEditing={setEditing} mutate={mutate} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="grid gap-4 md:hidden">
        {paginatedPrograms.map((item: any) => (
          <div key={item.id} className="bg-white rounded-2xl p-4 shadow space-y-3">

            <div className="flex items-center gap-3">
              <img
                src={
                  item.image
                    ? `${backendUrl}/storage/${item.image}`
                    : "/default.png"
                }
                className="w-14 h-14 rounded-xl object-cover border"
              />
              <div>
                <h3 className="font-bold text-indigo-900">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.slug}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                {item.level}
              </span>
              <span className="px-3 py-1 rounded-full bg-gray-100">
                العمر {item.agemin}-{item.agemax}
              </span>
              <span className="px-3 py-1 rounded-full bg-gray-100">
                {item.duration_weeks} أسبوع
              </span>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
                {item.price} $
              </span>
            </div>

            {item.is_published ? (
              <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 w-fit">
                منشور
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs bg-gray-200 text-gray-600 w-fit">
                مسودة
              </span>
            )}

            <Actions item={item} setEditing={setEditing} mutate={mutate} />
          </div>
        ))}
      </div>

      {/* ===== Pagination ===== */}
      <div className="flex justify-center gap-2">
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

      {showAdd && (
        <AddProgramModal onClose={() => setShowAdd(false)} mutate={mutate} />
      )}

      {editing && (
        <EditProgramModal
          program={editing}
          onClose={() => setEditing(null)}
          mutate={mutate}
        />
      )}
    </div>
  );
}

/* ===== Actions (نفس أزرارك بالضبط) ===== */
function Actions({ item, setEditing, mutate }: any) {
  return (
    <div className="flex flex-wrap gap-3 text-xs font-semibold">
      <Link
        href={`/admin/programs/${item.slug}`}
        className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
      >
        عرض
      </Link>

      <Link
        href={`/admin/programs/${item.slug}/groups`}
        className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200"
      >
        👥 الجروبات
      </Link>

      <button
        onClick={() => setEditing(item)}
        className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
      >
        تعديل
      </button>

      {!item.is_published && (
        <button
          onClick={async () => {
            await api.post(`/admin/programs/${item.id}/publish`);
            mutate();
          }}
          className="px-4 py-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
        >
          نشر
        </button>
      )}

      <button
        onClick={async () => {
          if (!confirm("هل تريد حذف البرنامج؟")) return;
          await api.delete(`/admin/programs/${item.slug}`);
          mutate();
        }}
        className="px-4 py-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
      >
        حذف
      </button>
    </div>
  );
}

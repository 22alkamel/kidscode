"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import api from "@/lib/api";

export default function GroupsListPage() {
  const { programId } = useParams();
  const router = useRouter();

  const { data, isLoading, mutate } = useSWR(
    programId ? `/admin/programs/${programId}/groups` : null,
    async (url) => {
      const res = await api.get(url);
      console.log("groups API response:", res.data);
      return res.data;
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        جاري تحميل الجروبات...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-indigo-900">
            👥 إدارة الجروبات
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            تنظيم الطلاب وتوزيعهم على المجموعات
          </p>
        </div>

        <Link
          href={`/admin/programs/${programId}/groups/create`}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold shadow hover:scale-105 transition"
        >
          ➕ إنشاء جروب
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4">اسم الجروب</th>
                <th className="p-4">المدرب</th>
                <th className="p-4 text-center">عدد الطلاب</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              {data?.length ? (
                data.map((group: any) => (
                  <tr
                    key={group.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-semibold text-indigo-900">
                      {group.name}
                    </td>
                    <td className="p-4 text-gray-700">
                      {group.trainer?.name || "—"}
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                        {group.students?.length ?? 0}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3 text-xs font-semibold">
                        <Link
                          href={`/admin/programs/${programId}/groups/${group.id}/students`}
                          className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                        >
                          👥 الطلاب
                        </Link>
                        <Link
                          href={`/admin/programs/${programId}/groups/${group.id}/sessions`}
                          className="px-4 py-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
                        >
                          📚 الحصص
                        </Link>

                        <Link
                          href={`/admin/programs/${programId}/groups/${group.id}/edit`}
                          className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        >
                          ✏️ تعديل
                        </Link>
                        <button
                          onClick={async () => {
                            if (!confirm("هل أنت متأكد من حذف الجروب؟")) return;
                            await api.delete(`/groups/${group.id}`);
                            mutate();
                          }}
                          className="px-4 py-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                        >
                          🗑 حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-400">
                    لا توجد جروبات بعد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

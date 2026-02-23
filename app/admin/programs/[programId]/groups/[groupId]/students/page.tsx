"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import api from "@/lib/api";
import Link from "next/link";

export default function GroupStudentsPage() {
  const { programId, groupId } = useParams();

  // Fetch students of this group
  const {
    data: students,
    isLoading,
    mutate,
  } = useSWR(
    groupId ? `/admin/groups/${groupId}/students` : null,
    async (url) => {
      const res = await api.get(url);
      console.log("API RESPONSE:", res.data);
      return res.data;
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        جاري تحميل الطلاب...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-indigo-900">
          👥 الطلاب في هذا الجروب
        </h1>
        <Link
          href={`/admin/programs/${programId}/groups/${groupId}/add-student`}
          className="px-4 py-2 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600"
        >
          ➕ إضافة طالب
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4">اسم الطالب</th>
                <th className="p-4">البريد الإلكتروني</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {students?.length ? (
                students.map((student: any) => (
                  <tr
                    key={student.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-semibold text-indigo-900">
                      {student.name}
                    </td>
                    <td className="p-4 text-gray-700">{student.email}</td>
                    <td className="p-4 text-center">
                      <button
                        className="px-4 py-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                        onClick={async () => {
                          if (!confirm("هل تريد إزالة هذا الطالب من الجروب؟"))
                            return;
                          await api.post(
                            `/api/admin/groups/${groupId}/remove-student`,
                            { student_id: student.id }
                          );
                          mutate(); // تحديث البيانات بعد الإزالة
                        }}
                      >
                        🗑 إزالة
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-gray-400">
                    لا يوجد طلاب بعد
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

'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import api from '@/lib/api';

export default function SessionsPage() {
  const { programId, groupId } = useParams();

  const { data, isLoading, mutate } = useSWR(
    `/groups/${groupId}/class-sessions`,
    async url => (await api.get(url)).data
  );

  if (isLoading) {
    return <div className="text-center py-20 text-gray-400">جاري تحميل الحصص...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-indigo-900">📚 حصص الجروب</h1>

        <Link
          href={`/admin/programs/${programId}/groups/${groupId}/sessions/create`}
          className="px-6 py-3 rounded-full bg-green-600 text-white font-semibold shadow hover:scale-105"
        >
          ➕ إنشاء حصة
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">الدرس</th>
              <th className="p-4">تاريخ النشر</th>
              <th className="p-4 text-center">الحالة</th>
              <th className="p-4 text-center">الإجراءات</th>
            </tr>
          </thead>

          <tbody>
            {data?.length ? data.map((s: any) => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-semibold">{s.lesson.title}</td>
                <td className="p-4 text-gray-600">
                  {new Date(s.publish_at).toLocaleString()}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    new Date(s.publish_at) <= new Date()
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {new Date(s.publish_at) <= new Date() ? 'منشورة' : 'قادمة'}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2 text-xs font-semibold">
                    <Link
                      href={`/admin/programs/${programId}/groups/${groupId}/sessions/${s.id}/report`}
                      className="px-3 py-2 rounded-full bg-blue-100 text-blue-700"
                    >
                      📊 المتابعة
                    </Link>

                    <button
                      onClick={async () => {
                        if (!confirm('هل أنت متأكد من حذف الحصة؟')) return;
                        await api.delete(`/class-sessions/${s.id}`);
                        mutate();
                      }}
                      className="px-3 py-2 rounded-full bg-red-100 text-red-600"
                    >
                      🗑 حذف
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">
                  لا توجد حصص بعد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

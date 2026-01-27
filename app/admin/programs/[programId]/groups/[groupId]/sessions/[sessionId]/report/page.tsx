'use client';

import { useParams } from 'next/navigation';
import useSWR from 'swr';
import api from '@/lib/api';

export default function SessionReport() {
  const { sessionId } = useParams();

  const { data, isLoading } = useSWR(
    `/class-sessions/${sessionId}/report`,
    async url => (await api.get(url)).data
  );

  if (isLoading) {
    return <div className="text-center py-20">جاري تحميل التقرير...</div>;
  }

  return (
    <div className="bg-white rounded-3xl shadow overflow-hidden">
      <h1 className="text-xl font-bold p-6 text-indigo-900">📊 تقرير الحصة</h1>

      <table className="w-full text-sm text-right">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4">الطالب</th>
            <th className="p-4 text-center">شاهد الدرس</th>
            <th className="p-4 text-center">حل الأسئلة</th>
            <th className="p-4 text-center">الدرجة</th>
          </tr>
        </thead>

        <tbody>
          {data.map((r: any) => (
            <tr key={r.id} className="border-t">
              <td className="p-4 font-semibold">{r.student.name}</td>
              <td className="p-4 text-center">
                {r.watched_at ? '✅' : '❌'}
              </td>
              <td className="p-4 text-center">
                {r.submitted_at ? '✅' : '❌'}
              </td>
              <td className="p-4 text-center">
                {r.score ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

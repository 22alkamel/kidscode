'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';

interface Student {
  id: number;
  name: string;
}

export default function AddStudentPage() {
  const params = useParams();
  const router = useRouter();

  // ✅ حل مشكلة string | string[]
  const programId = Array.isArray(params.programId)
    ? params.programId[0]
    : params.programId;

  const groupId = Array.isArray(params.groupId)
    ? params.groupId[0]
    : params.groupId;

  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     Fetch available students
  ========================= */
  const endpoint =
    programId && groupId
      ? `/programs/${programId}/groups/${groupId}/available-students` // ⚡️ بدون /api هنا
      : null;

  const { data: students, isLoading, error: swrError } = useSWR<Student[]>(
    endpoint,
    async (url: string) => {
      try {
        const res = await api.get(url);
        console.log('Students fetched:', res.data); // ⚡️ تحقق من البيانات في الكونسول
        return res.data;
      } catch (err) {
        console.error('Error fetching students:', err);
        throw err;
      }
    }
  );

  /* =========================
     Submit
  ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!studentId) {
      setError('اختر الطالب أولاً');
      return;
    }

    try {
      setLoading(true);

      await api.post(`/groups/${groupId}/add-student`, {
        student_id: Number(studentId),
      });

      router.push(`/admin/programs/${programId}/groups/${groupId}/students`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 p-6 bg-white rounded-3xl shadow">
      <h1 className="text-2xl font-extrabold text-indigo-900">
        ➕ إضافة طالب للجروب
      </h1>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}

      {swrError && (
        <div className="bg-red-50 text-red-600 p-3 rounded">
          خطأ في تحميل الطلاب
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            اختر الطالب
          </label>

          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            <option value="">اختر الطالب</option>

            {students?.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>

          {isLoading && (
            <p className="text-gray-500 text-sm mt-1">جارٍ تحميل الطلاب...</p>
          )}

          {!isLoading && students && students.length === 0 && (
            <p className="text-gray-400 text-sm mt-1">
              لا يوجد طلاب متاحين للإضافة.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-semibold"
          >
            إلغاء
          </button>

          <button
            type="submit"
            disabled={loading || !studentId}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold shadow hover:scale-105 transition disabled:opacity-60"
          >
            {loading ? 'جارٍ الإضافة...' : 'إضافة الطالب'}
          </button>
        </div>
      </form>
    </div>
  );
}

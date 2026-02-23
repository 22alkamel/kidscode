'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';

export default function EditGroupPage() {
  const { programId, groupId } = useParams();
  const router = useRouter();

  const [name, setName] = useState('');
  const [trainerId, setTrainerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch group details
const { data: group, error: swrError } = useSWR(
  groupId ? `/admin/groups/${groupId}` : null,
  async url => {
    try {
      const res = await api.get(url);
      console.log('✅ API Response:', res.data);
      return res.data.data; // ⚡️ الجروب فقط
    } catch (err: any) {
      console.error('❌ API Error:', err.response?.status, err.response?.data);
      throw err;
    }
  }
);



  // Fetch all trainers
  const { data: usersData } = useSWR('/admin/users', url =>
    api.get(url).then(res => res.data)
  );
  const trainers = Array.isArray(usersData) ? usersData.filter((u: any) => u.role === 'trainer') : [];

  // Fill the form when group data loads
  useEffect(() => {
  if (group) {
    setName(group.name);
    setTrainerId(group.trainer_id);
  }
}, [group]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !trainerId) {
      setError('جميع الحقول مطلوبة');
      return;
    }

    try {
      setLoading(true);
      await api.put(`/admin/groups/${groupId}`, {
        name,
        trainer_id: trainerId
      });
      router.push(`/admin/programs/${programId}/groups`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ ما');
    } finally {
      setLoading(false);
    }
  };

  if (!group) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        جاري تحميل بيانات الجروب...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-extrabold text-indigo-900">✏️ تعديل الجروب</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow p-8 space-y-6">
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">اسم الجروب</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">المدرب</label>
          <select
            value={trainerId}
            onChange={e => setTrainerId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">اختر المدرب</option>
            {trainers.map((t: any) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
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
            disabled={loading}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold shadow hover:scale-105 transition disabled:opacity-60"
          >
            {loading ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
          </button>
        </div>
      </form>
    </div>
  );
}

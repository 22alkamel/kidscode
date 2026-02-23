'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';

export default function CreateGroupPage() {
  const { programId } = useParams();
  const router = useRouter();

  const [name, setName] = useState('');
  const [trainerId, setTrainerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===== Fetch all users =====
  const { data: usersData } = useSWR('/admin/users', url =>
    api.get(url).then(res => res.data.data)
  );

  // ===== Filter trainers only =====
  const trainers = Array.isArray(usersData)
    ? usersData.filter((user: any) => user.role === 'trainer')
    : [];

  // ===== Submit =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !trainerId) {
      setError('جميع الحقول مطلوبة');
      return;
    }

    try {
      setLoading(true);
      await api.post(`/admin/programs/${programId}/groups`, {
        name,
        trainer_id: trainerId,
      });
      router.push(`/admin/programs/${programId}/groups`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ ما');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-indigo-900">➕ إنشاء جروب جديد</h1>
        <p className="text-sm text-gray-500 mt-1">إنشاء مجموعة جديدة داخل البرنامج</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow p-8 space-y-6">
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">اسم الجروب</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500"
            placeholder="مثال: جروب المبتدئين"
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
            {trainers.map(trainer => (
              <option key={trainer.id} value={trainer.id}>
                {trainer.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-semibold">
            إلغاء
          </button>
          <button type="submit" disabled={loading} className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold shadow hover:scale-105 transition disabled:opacity-60">
            {loading ? 'جارٍ الحفظ...' : 'حفظ الجروب'}
          </button>
        </div>
      </form>
    </div>
  );
}

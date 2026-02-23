"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import api from "@/lib/api";

export default function CreateSession() {
  const { programId, groupId } = useParams();
  const router = useRouter();

  const { data: tracksResponse } = useSWR(
    `/programs/${programId}/tracks`,
    (url) => api.get(url).then((res) => res.data)
  );

  const tracks = tracksResponse?.data;
  const [trackId, setTrackId] = useState("");

  const { data: lessons } = useSWR(
    trackId ? `/admin/tracks/${trackId}/lessons` : null,
    (url) => api.get(url).then((res) => res.data)
  );

  const [form, setForm] = useState({
    lesson_id: "",
    is_active: true,
  });

  const submit = async () => {
    if (!form.lesson_id) {
      alert("يرجى اختيار الدرس");
      return;
    }

    try {
      await api.post("/admin/class-sessions", {
        lesson_id: form.lesson_id,
        group_id: groupId,
        is_active: form.is_active,
      });
    } catch (error: any) {
      console.error(error.response?.data);
      alert("حدث خطأ في السيرفر");
    }

    router.push(`/admin/programs/${programId}/groups/${groupId}/sessions`);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow space-y-6">
      <h1 className="text-2xl font-bold text-indigo-900">➕ إنشاء حصة جديدة</h1>

      {/* المسار */}
      <select
        className="w-full p-3 border rounded-xl"
        onChange={(e) => setTrackId(e.target.value)}
      >
        <option value="">اختر المسار</option>
        {tracks?.map((t: any) => (
          <option key={t.id} value={t.id}>
            {t.title}
          </option>
        ))}
      </select>

      {/* الدرس */}
      <select
        className="w-full p-3 border rounded-xl"
        onChange={(e) => setForm({ ...form, lesson_id: e.target.value })}
        disabled={!trackId}
      >
        <option value="">اختر الدرس</option>
        {lessons?.map((l: any) => (
          <option key={l.id} value={l.id}>
            {l.title}
          </option>
        ))}
      </select>

      {/* تفعيل الحصة */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
        />
        <span className="font-semibold">الحصة مفعّلة</span>
      </div>

      <button
        onClick={submit}
        className="w-full py-3 rounded-full bg-green-600 text-white font-bold hover:scale-105 transition"
      >
        نشر الحصة الآن
      </button>
    </div>
  );
}

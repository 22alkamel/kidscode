"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function AddTrackModal({ onClose, programId, mutate }: any) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    estimated_time: "",
    track_img: null as File | null,
    is_published: false,
  });

  const submit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("program_id", programId);
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("estimated_time", form.estimated_time);
    formData.append("is_published", form.is_published ? "1" : "0");

    if (form.track_img) {
      formData.append("track_img", form.track_img);
    }

    await api.post(`/programs/${programId}/tracks`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    mutate();  // إعادة تحميل المسارات
    onClose(); // إغلاق المودال
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[2000]">
     <div className=" bg-white p-6 rounded rounded-2xl shadow w-96 w-full max-w-4xl">
         <div className="bg-gradient-to-r from-indigo-600 to-pink-500 p-6 mb-4 rounded-2xl text-white">
           <h2 className="text-xl font-bold">إضافة مسار جديد</h2>
        </div>

        

        <form onSubmit={submit}>

          <input
            className="border p-2 w-full mb-3"
            placeholder="عنوان المسار"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            className="border p-2 w-full mb-3"
            placeholder="وصف المسار"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            className="border p-2 w-full mb-3"
            placeholder="المدة التقديرية بالدقائق"
            type="number"
            onChange={(e) => setForm({ ...form, estimated_time: e.target.value })}
          />

          <input
            type="file"
            accept="image/*"
            className="border p-2 w-full mb-3"
            onChange={(e) =>
              setForm({ ...form, track_img: e.target.files ? e.target.files[0] : null })
            }
          />

          <label className="flex items-center gap-2 mb-3 cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) =>
                setForm({ ...form, is_published: e.target.checked })
              }
            />
            نشر المسار مباشرة
          </label>

          <div className="flex justify-between">
            <button className="px-10 py-2 rounded-lg bg-indigo-600 text-white font-semibold w-full sm:w-auto hover:bg-indigo-700 transition">
              حفظ
            </button>

            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 w-full sm:w-auto">
              إلغاء
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

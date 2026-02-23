"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function EditTrackModal({
  track,
  programId,
  onClose,
  mutate,
}: any) {
  const [form, setForm] = useState({
    title: track.title,
    track_img: null as File | string | null,
    estimated_time: track.estimated_time,
    is_published: track.is_published,
  });

  const submit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("_method", "PUT");

    // ارسلي العنوان دائمًا
    formData.append("title", form.title);

    formData.append("estimated_time", String(form.estimated_time));
    formData.append("is_published", form.is_published ? "1" : "0");
    formData.append("program_id", String(programId));

    // الصورة فقط إذا مستخدم رفع صورة جديدة
    if (form.track_img instanceof File) {
      formData.append("track_img", form.track_img);
    }

    try {
      await api.post(`/admin/tracks/${track.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      mutate();
      onClose();
    } catch (error: any) {
      console.log("Laravel Errors:", error.response?.data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
       <div className=" bg-white p-6 rounded rounded-2xl shadow w-96 w-full max-w-4xl">
         <div className="bg-gradient-to-r from-indigo-600 to-pink-500 p-6 mb-4 rounded-2xl text-white">
          <h2 className="text-xl font-bold">تعديل المسار</h2>
        </div>
        

        <form onSubmit={submit}>
          <input
            className="border p-2 w-full mb-3"
            defaultValue={track.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            type="file"
            accept="image/*"
            className="border p-2 w-full mb-3"
            onChange={(e) =>
              setForm({
                ...form,
                track_img: e.target.files ? e.target.files[0] : null,
              })
            }
          />

          <input
            className="border p-2 w-full mb-3"
            type="number"
            defaultValue={track.estimated_time}
            onChange={(e) =>
              setForm({ ...form, estimated_time: Number(e.target.value) })
            }
          />

          <label className="flex items-center gap-2 mb-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={track.is_published}
              onChange={(e) =>
                setForm({ ...form, is_published: e.target.checked })
              }
            />
            نشر المسار
          </label>

          <div className="flex justify-between">
            <button className="px-10 py-2 rounded-lg bg-indigo-600 text-white font-semibold w-full sm:w-auto hover:bg-indigo-700 transition">
              حفظ التعديلات
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

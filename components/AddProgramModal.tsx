"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function AddProgramModal({ onClose, mutate }: any) {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    image: null as File | null,
    level: "beginner",
    agemin: "",
    agemax: "",
    duration_weeks: "",
    price: "",
    is_published: false,
  });

  const submit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("slug", form.slug);
    formData.append("description", form.description);
    formData.append("level", form.level);
    formData.append("agemin", form.agemin);
    formData.append("agemax", form.agemax);
    formData.append("duration_weeks", form.duration_weeks);
    formData.append("price", form.price);
    formData.append("is_published", form.is_published ? "1" : "0");

    if (form.image) {
      formData.append("image", form.image);
    }

    await api.post("/admin/programs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    mutate();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center  ">
      <div className="bg-white p-6 rounded rounded-2xl shadow w-96 w-full max-w-4xl">
        <div className="bg-gradient-to-r from-indigo-600 to-pink-500 p-6 mb-4 rounded-2xl text-white">
          <h2 className="text-xl font-bold ">إضافة برنامج جديد</h2>
        </div>
        <form onSubmit={submit}>
          <input
            className="border p-2 w-full mb-3"
            placeholder="عنوان البرنامج"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="border p-2 w-full mb-3"
            placeholder="الشعار"
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />

          <textarea
            className="border p-2 w-full mb-3"
            placeholder="الوصف"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            type="file"
            accept="image/*"
            className="border p-2 w-full mb-3"
            onChange={(e) =>
              setForm({
                ...form,
                image: e.target.files ? e.target.files[0] : null,
              })
            }
          />

          <select
            className="border p-2 w-full mb-3"
            onChange={(e) => setForm({ ...form, level: e.target.value })}
          >
            <option value="beginner">مبتدئ</option>
            <option value="intermediate">متوسط</option>
            <option value="advanced">متقدم</option>
          </select>

          <div className="flex gap-2 mb-3">
            <input
              className="border p-2 w-full"
              placeholder="الحد الأدنى للعمر"
              type="number"
              onChange={(e) => setForm({ ...form, agemin: e.target.value })}
            />

            <input
              className="border p-2 w-full"
              placeholder="الحد الأعلى للعمر"
              type="number"
              onChange={(e) => setForm({ ...form, agemax: e.target.value })}
            />
          </div>

          <input
            className="border p-2 w-full mb-3"
            placeholder="عدد الأسابيع"
            type="number"
            onChange={(e) =>
              setForm({ ...form, duration_weeks: e.target.value })
            }
          />

          <input
            className="border p-2 w-full mb-3"
            placeholder="السعر "
            type="number"
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <label className="flex items-center gap-2 mb-3 cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) =>
                setForm({ ...form, is_published: e.target.checked })
              }
            />
            نشر البرنامج مباشرة
          </label>

          <div className="flex justify-between">
            <button  className="px-10 py-2 rounded-lg bg-indigo-600 text-white font-semibold w-full sm:w-auto hover:bg-indigo-700 transition">
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

"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function EditProgramModal({ program, onClose, mutate }: any) {
  const [form, setForm] = useState({
    title: program.title,
    slug: program.slug,
    description: program.description,
    image: null as File | string | null,
    level: program.level,
    agemin: program.agemin,
    agemax: program.agemax,
    duration_weeks: program.duration_weeks,
    price: program.price,
    is_published: program.is_published,
  });

  const submit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("_method", "PUT");

    // فقط إذا تغيّر عن البيانات القديمة
    if (form.title !== program.title) formData.append("title", form.title);
    if (form.slug !== program.slug) formData.append("slug", form.slug);
    if (form.description !== program.description)
      formData.append("description", form.description);

    formData.append("level", form.level);
    formData.append("agemin", String(form.agemin));
    formData.append("agemax", String(form.agemax));
    formData.append("duration_weeks", String(form.duration_weeks));
    formData.append("price", String(form.price));
    formData.append("is_published", form.is_published ? "1" : "0");

    // الصورة فقط إذا رفع صورة جديدة
    if (form.image instanceof File) {
      formData.append("image", form.image);
    } else {
      formData.append("image", ""); // مهم جداً
    }

    try {
      await api.post(`/admin/programs/${program.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      mutate();
      onClose();
    } catch (error: any) {
      console.log("Laravel Errors:", error.response?.data);
    }

    mutate();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow w-96 w-full max-w-4xl">
        <div className="bg-gradient-to-r from-indigo-600 to-pink-500 p-6 mb-4 rounded-2xl text-white">
          <h2 className="text-xl font-bold ">تعديل البرنامج</h2>
        </div>
        <form onSubmit={submit}>
          <input
            className="border p-2 w-full mb-3"
            defaultValue={program.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            className="border p-2 w-full mb-3"
            defaultValue={program.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />

          <textarea
            className="border p-2 w-full mb-3"
            defaultValue={program.description}
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
            defaultValue={program.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
          >
            <option value="beginner">مبتدئ</option>
            <option value="intermediate">متوسط</option>
            <option value="advanced">متقدم</option>
          </select>

          <div className="flex gap-2 mb-3">
            <input
              className="border p-2 w-full"
              type="number"
              defaultValue={program.agemin}
              onChange={(e) => setForm({ ...form, agemin: e.target.value })}
            />

            <input
              className="border p-2 w-full"
              type="number"
              defaultValue={program.agemax}
              onChange={(e) => setForm({ ...form, agemax: e.target.value })}
            />
          </div>

          <input
            className="border p-2 w-full mb-3"
            type="number"
            defaultValue={program.duration_weeks}
            onChange={(e) =>
              setForm({ ...form, duration_weeks: e.target.value })
            }
          />

          <input
            className="border p-2 w-full mb-3"
            type="number"
            defaultValue={program.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <label className="flex items-center gap-2 mb-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={program.is_published}
              onChange={(e) =>
                setForm({ ...form, is_published: e.target.checked })
              }
            />
            نشر البرنامج
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

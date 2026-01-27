"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function AddUserModal({ onClose, mutate }: any) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    avatar: null as File | null,
    otp_code: "",
    otp_verified: false,
    role: "student",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("role", form.role);
    if (form.avatar) formData.append("avatar", form.avatar);
    if (form.otp_code) formData.append("otp_code", form.otp_code);
    formData.append("otp_verified", String(form.otp_verified));

    await api.post("/admin/users", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    mutate();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className=" bg-white p-6 rounded rounded-2xl shadow w-96 w-full max-w-4xl">
         <div className="bg-gradient-to-r from-indigo-600 to-pink-500 p-6 mb-4 rounded-2xl text-white">
           <h2 className="text-xl font-bold mb-4">إضافة مستخدم جديد</h2>
        </div>
       
        <form onSubmit={submit}>
          <input
            className="border p-2 w-full mb-3"
            placeholder="الاسم"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border p-2 w-full mb-3"
            placeholder="الإيميل"
            type="email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="border p-2 w-full mb-3"
            placeholder="كلمة المرور"
            type="password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            className="border p-2 w-full mb-3"
            onChange={(e) =>
              setForm({ ...form, avatar: e.target.files ? e.target.files[0] : null })
            }
          />
          <select
            className="border p-2 w-full mb-3"
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="student">طالب</option>
            <option value="trainer">مدرب</option>
            <option value="admin">أدمن</option>
          </select>
          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              onChange={(e) => setShowAdvanced(e.target.checked)}
            />
            إظهار حقول OTP
          </label>
          {showAdvanced && (
            <>
              <input
                className="border p-2 w-full mb-3"
                placeholder="OTP Code"
                onChange={(e) => setForm({ ...form, otp_code: e.target.value })}
              />
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setForm({ ...form, otp_verified: e.target.checked })
                  }
                />
                OTP Verified
              </label>
            </>
          )}
          <div className="flex justify-between">
            <button  className="px-10 py-2 rounded-lg bg-indigo-600 text-white font-semibold w-full sm:w-auto hover:bg-indigo-700 transition">حفظ</button>
            <button type="button" className="px-6 py-2 rounded-lg bg-gray-200 w-full sm:w-auto" onClick={onClose}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}

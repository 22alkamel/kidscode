"use client";

import { useState } from "react";
import api from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // const submit = async (e: any) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     await api.post("/register", form);
  //     window.location.href = `/verify-otp?email=${form.email}`;
  //   } catch (err: any) {
  //     alert(err.response?.data?.message || "Error");
  //   }

  //   setLoading(false);
  // };

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/register", form);
    } catch (err: any) {
      console.warn("Register request failed or delayed:", err);
    } finally {
      // ننتقل لصفحة OTP دائماً
      window.location.href = `/verify-otp?email=${form.email}`;
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        {/* شعار المنصة */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png" // ← غيره لمسار شعارك
            width={100}
            height={100}
            alt="Logo"
            className="rounded-xl"
          />
        </div>

        {/* العنوان */}
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          ابداء رحلتك في عالم البرمجة
        </h1>

        {/* الفورم */}
        <form onSubmit={submit} className="space-y-4" dir="rtl">
          <input
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="الاسم الكامل"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="البريد الإلكتروني"
            type="email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="كلمة المرور"
            type="password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded-lg text-lg font-semibold transition"
          >
            {loading ? "جاري الإنشاء..." : "التالي "}
          </button>
        </form>

        {/* رابط تسجيل الدخول */}
        <p className="text-center mt-6 text-gray-600">
          لديك حساب؟
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline ml-1"
          >
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}

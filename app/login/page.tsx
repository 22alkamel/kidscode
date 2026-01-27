"use client";

import { useState } from "react";
import api from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  const login = async (e: any) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;

      if (role === "admin") window.location.href = "/admin";
      else if (role === "trainer") window.location.href = "/trainer";
      else if (role === "student") window.location.href = "/dashboard";
      else window.location.href = "/dashboard";

    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        {/* شعار المنصة */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png" // ← غيره لمسار شعارك
            width={90}
            height={90}
            alt="Logo"
            className="rounded-xl"
          />
        </div>

        {/* عنوان */}
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          تسجيل الدخول
        </h1>

        {/* الفورم */}
        <form onSubmit={login} className="space-y-4" dir="rtl">

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

          <button className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded-lg text-lg font-semibold transition">
            دخول
          </button>
        </form>

        {/* رابط إنشاء حساب */}
        <p className="text-center mt-6 text-gray-600">
          ليس لديك حساب؟
          <Link
            href="/register"
            className="text-blue-600 font-semibold hover:underline ml-1"
          >
            إنشاء حساب
          </Link>
        </p>
      </div>
    </div>
  );
}

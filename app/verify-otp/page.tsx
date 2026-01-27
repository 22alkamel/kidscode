"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  // 📌 قراءة الإيميل من الرابط
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get("email") || "";
    setEmail(userEmail);

    // بدء العداد
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ✔️ إرسال الكود للتحقق
  const submit = async () => {
    if (!otp) return alert("Please enter the OTP");

    setLoading(true);
    try {
      const res = await api.post("/verify-otp", { email, otp });

      // حفظ التوكن
      localStorage.setItem("token", res.data.token);

      document.cookie = "reg_step=otp_verified; path=/";
      // 🚀 الانتقال لصفحة استكمال التسجيل
      window.location.href = "/register/complete-register";

    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
    setLoading(false);
  };

  // ✔️ إعادة إرسال الكود
  const resendOtp = async () => {
    if (timer > 0) return;

    setResendLoading(true);
    try {
      await api.post("/resend-otp", { email });
      alert("A new verification code has been sent!");
      setTimer(60); // إعادة تشغيل العداد
    } catch {
      alert("Failed to resend the code.");
    }
    setResendLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Verify Your Email</h1>

      <p className="text-gray-600 mb-6">
        Enter the 6-digit code sent to:
        <span className="font-semibold block mt-1">{email}</span>
      </p>

      <input
        className="border p-3 w-full mb-4 text-center tracking-widest text-2xl rounded-lg"
        maxLength={6}
        placeholder="••••••"
        onChange={(e) => setOtp(e.target.value)}
      />

      <button
        className="bg-green-600 text-white p-3 w-full rounded-lg text-lg disabled:opacity-60"
        onClick={submit}
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify"}
      </button>

      {/* إعادة الإرسال */}
      <div className="mt-6">
        {timer > 0 ? (
          <p className="text-gray-500">
            You can resend the code in{" "}
            <span className="font-semibold">{timer}</span> seconds
          </p>
        ) : (
          <button
            onClick={resendOtp}
            disabled={resendLoading}
            className="text-blue-600 font-semibold"
          >
            {resendLoading ? "Sending..." : "Resend Code"}
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    alert("تم إرسال الرسالة ✅");
  };

  return (
    <div className="w-full">
         <Header />
      {/* ====== Hero Section ====== */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 text-center relative">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">تواصل معنا</h1>
          <p className="text-lg max-w-2xl mx-auto">
            نحن هنا لمساعدتك في كل ما يتعلق برحلة تعلم البرمجة لطفلك. تواصل معنا في أي وقت
            وسنكون سعداء للإجابة على جميع استفساراتك.
          </p>
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <span>📞 دعم 24/7</span>
            <span>👨‍💻 فريق متخصص</span>
          </div>
        </div>
      </section>

      {/* ====== Contact Form + Info ====== */}
      <section className="py-16" dir="rtl">
        <div className="container mx-auto grid md:grid-cols-2 gap-10 px-6">
          {/* Form */}
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6">أرسل لنا رسالة</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="الاسم الكامل"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="البريد الإلكتروني"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="رقم الهاتف"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                name="subject"
                placeholder="نوع الاستفسار"
                value={form.subject}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
              <textarea
                name="message"
                placeholder="اكتب رسالتك هنا..."
                value={form.message}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded-lg px-4 py-2"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition"
              >
                ✈️ إرسال الرسالة
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white shadow-md rounded-2xl p-4 flex items-center gap-4">
              <span className="text-2xl">📞</span>
              <div>
                <h4 className="font-bold" >اتصل بنا</h4>
                <p>+967 773 398 837 (السبت - الخميس 9:00 ص - 6:00 م)</p>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-2xl p-4 flex items-center gap-4">
              <span className="text-2xl">📧</span>
              <div>
                <h4 className="font-bold">راسلنا</h4>
                <p>info@kidscode.ye (متاح طوال 24 ساعة)</p>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-2xl p-4 flex items-center gap-4">
              <span className="text-2xl">📍</span>
              <div>
                <h4 className="font-bold">زرنا</h4>
                <p>تعز ، اليمن</p>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-2xl p-4 flex items-center gap-4">
              <span className="text-2xl">⏰</span>
              <div>
                <h4 className="font-bold">ساعات العمل</h4>
                <p>السبت - الخميس: 9:00 ص - 6:00 م</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 text-xl mt-4">
              <a href="#" className="text-red-500">◉ YouTube</a>
              <a href="#" className="text-pink-500">◉ Instagram</a>
              <a href="#" className="text-blue-500">◉ Facebook</a>
              <a href="#" className="text-sky-500">◉ Twitter</a>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.999999!2d46.6753!3d24.7136"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

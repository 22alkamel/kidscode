"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8" dir="rtl">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <i className="ri-code-s-slash-line text-white text-lg"></i>
              </div>
              <span
                className="text-2xl font-bold"
                style={{ fontFamily: "Pacifico, serif" }}
              >
                Kidscode
              </span>
            </Link>
            <p className="text-gray-300 mb-4">
              نجعل البرمجة ممتعة وسهلة المنال للأطفال من خلال تجارب تعلم
              تفاعلية.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <i className="ri-instagram-fill text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <i className="ri-youtube-fill text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  من نحن
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  الدورات
                </Link>
              </li>
              <li>
                <Link
                  href="/playground"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  ساحة البرمجة
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  المدونة
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">الدعم</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  مركز المساعدة
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  شروط الخدمة
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  الأسئلة الشائعة
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">النشرة البريدية</h3>
            <p className="text-gray-300 mb-4">
              اشترك للحصول على نصائح البرمجة والتحديثات!
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 px-4 py-2 rounded-r-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
              <button className="bg-pink-500 px-4 py-2 rounded-l-lg hover:bg-pink-600 transition-colors whitespace-nowrap">
                <i className="ri-send-plane-fill"></i>
              </button>
            </div>
          </div>
        </div>

        {/* قسم الشعارات */}
        <div className="bg-white mt-20 pb-6">
         

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
            <img
              src="/Dukan.png"
              alt="logo1"
              className="w-full h-20 object-contain opacity-80 hover:opacity-100 transition"
            />
            <img
              src="/UnWomen.png"
              alt="logo2"
              className="w-full h-10 object-contain opacity-80 hover:opacity-100 transition"
            />
            <img
              src="/Women peace.png"
              alt="logo3"
              className="w-full h-14 object-contain opacity-80 hover:opacity-100 transition"
            />
            <img
              src="/Yodet.png"
              alt="logo4"
              className="w-full h-24 object-contain opacity-80 hover:opacity-100 transition"
            />
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300" dir="rtl">
            © 2025 منصة Kidscode. جميع الحقوق محفوظة!
          </p>
          <p className="text-gray-300" dir="rtl">
            إصنع مستقبل طفلك!
          </p>
        </div>
      </div>
    </footer>
  );
}

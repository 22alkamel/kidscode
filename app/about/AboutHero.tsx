"use client";

export default function AboutHero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/abouthero.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/80 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full">
          <div className="max-w-3xl ml-auto text-right" dir="rtl">
            <h1 className="text-5xl md:text-6xl font-bold text-indigo-900 mb-6 leading-tight">
              من نحن؟
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              نحن فريق من المعلمين والمطورين المتحمسين الذين يؤمنون بأن البرمجة
              يجب أن تكون متاحة ومليئة بالمرح لجميع الأطفال. هدفنا هو إلهام
              الجيل القادم من المبدعين والمبتكرين من خلال تعليم البرمجة بطريقة
              تفاعلية وممتعة.
            </p>
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/80 p-6 rounded-2xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  2020
                </div>
                <div className="text-gray-700">سنة التأسيس</div>
              </div>
              <div className="bg-white/80 p-6 rounded-2xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-pink-500 mb-2">
                  50,000+
                </div>
                <div className="text-gray-700">طالب متخرج</div>
              </div>
              <div className="bg-white/80 p-6 rounded-2xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-purple-500 mb-2">
                  25+
                </div>
                <div className="text-gray-700">دولة حول العالم</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}

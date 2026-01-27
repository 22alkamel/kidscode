
'use client';

export default function CoursesHero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
           style={{
             backgroundImage: `url('/courses.jpg')`
           }}>
        <div className="absolute inset-0 bg-gradient-to-l from-white/85 via-white/75 to-transparent"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full">
          <div className="max-w-3xl ml-auto text-right" dir="rtl">
            <h1 className="text-5xl md:text-6xl font-bold text-indigo-900 mb-6 leading-tight">
            برامجنا التدريبيه
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              اكتشف مجموعة متنوعة من البرامج التدريبيه المصممة خصيصًا لتناسب أعمار ومستويات مختلفة. من الأساسيات إلى المستوى المتقدم، نوفر رحلة تعلم شاملة وممتعة.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {/* <div className="bg-white/80 p-6 rounded-2xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-blue-500 mb-2">25+</div>
                <div className="text-gray-700">دورة متنوعة</div>
              </div> */}
              <div className="bg-white/80 p-6 rounded-2xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-pink-500 mb-2">7-16</div>
                <div className="text-gray-700">سنة (الفئة العمرية)</div>
              </div>
              <div className="bg-white/80 p-6 rounded-2xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-purple-500 mb-2">100%</div>
                <div className="text-gray-700">تعلم تفاعلي</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

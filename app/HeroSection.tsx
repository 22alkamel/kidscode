
'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className=" min-h-screen relative bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
           style={{
             backgroundImage: `url('/hero.jpg')`
           }}>
        <div className="absolute inset-0 bg-gradient-to-l from-white/85 via-white/70 to-transparent"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full">
          <div className="max-w-2xl ml-auto text-right pt-24" dir="rtl">
            <h1 className="text-xl md:text-4xl font-bold text-indigo-900 mb-6 leading-tight">
               كيدزكود kidscode  
              
            </h1>
            <h1 className="text-xl md:text-4xl font-bold text-indigo-900 mb-6 leading-tight">
              
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500"> معا نصنع مستقبل طفلك! </span>
            </h1>
            {/* <p className="text-xl text-gray-700 mb-2 leading-relaxed font-bold pt-6">
             معا نصنع مستقبل طفلك
            </p> */}
            <p className="text-xl text-gray-700 mb-8 leading-relaxed pt-6">
             نواكب تطور العالم المتزايد يوما بعد اخر و نجعل استخدام الاطفال للتكنولوجيا مفيدا لحياتهم و المستقبل
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8 pt-8">
              <Link href="/courses" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 text-center whitespace-nowrap">
                ابدأ التعلم الآن
              </Link>
              <Link href="/playground" className="border-2 border-pink-500 text-pink-500 px-8 py-4 rounded-full font-semibold hover:bg-pink-500 hover:text-white transition-all text-center whitespace-nowrap">
                تعرف على ابطال كيدزكود
              </Link>
            </div>
            {/* <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <i className="ri-star-fill text-yellow-500"></i>
                <span className="font-semibold">تقييم 4.9/5</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="ri-user-3-fill text-blue-500"></i>
                <span className="font-semibold">+50,000 طالب</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="ri-trophy-fill text-pink-500"></i>
                <span className="font-semibold">حائز على جوائز</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}

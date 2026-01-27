
'use client';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'سارة أحمد',
      role: 'أم لفاطمة، 8 سنوات',
      avatar: '/profile4.jpg',
      content: 'فاطمة تحب الدروس التفاعلية! انتقلت من عدم معرفة أي شيء عن البرمجة إلى إنشاء ألعابها البسيطة. طريقة البرمجة المرئية مثالية لعمرها.',
      rating: 5
    },
    {
      name: 'أحمد محمود',
      role: 'طالب، 12 سنة',
      avatar:'/profile3.jpg',
      content: 'منصة Kidscode رائعة! بنيت أول موقع ويب لي وتعلمت كيفية صنع الألعاب. المعلمون لطيفون جداً ويشرحون كل شيء بوضوح. لا أستطيع الانتظار للدورة القادمة!',
      rating: 5
    },
    {
      name: 'خالد العلي',
      role: 'أب لصوفيا، 10 سنوات',
      avatar: '/profile2.jpg',
      content: 'لوحة تحكم الوالدين رائعة! يمكنني تتبع تقدم صوفيا ورؤية مقدار ما تتعلمه. طورت مهارات حل المشكلات التي تساعدها في المدرسة أيضاً.',
      rating: 5
    },
    {
      name: 'ليلى حسن',
      role: 'معلمة',
      avatar: '/profile1.jpg',
      content: 'كمعلمة، أقدر كيف تتماشى منصة Kidscode مع المعايير التعليمية بينما تحافظ على المتعة في التعلم. المنهج منظم جيداً ومناسب للعمر.',
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" dir="rtl">
          <h2 className="text-4xl font-bold text-indigo-900 mb-4">
            ما يقوله الأهل والطلاب
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            لا تأخذ كلامنا فقط - اسمع من مجتمعنا المذهل من الأهل والطلاب والمعلمين.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4" dir="rtl">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover object-top ml-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <i key={i} className="ri-star-fill text-yellow-500 text-sm"></i>
                ))}
              </div>
              
              <p className="text-gray-700 leading-relaxed" dir="rtl">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

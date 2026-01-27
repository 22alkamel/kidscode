
'use client';

export default function TeamSection() {
  const team = [
    {
      name: 'لينا عبدالواحد الكامل',
      role: 'المؤسس والرئيس التنفيذي',
      bio: 'مهندسة تقنية معلومات مهتم في تطوير البرمجيات التعليمية مع أكثر من 2 عامًا من الخبرة في مجال التعليم والتقنية.',
      image: 'leena.png',
      social: {
        linkedin: '#',
        twitter: '#',
        github:'#',
        dribbble:'#'

      }
    },
  
  ];

  return (
    <section className="py-20 bg-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" dir="rtl">
          <h2 className="text-4xl font-bold text-indigo-900 mb-4">
            فريقنا
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            تعرف على الفريق المتحمس والمبدع الذي يعمل بجد لجعل تعلم البرمجة ممتعًا وسهلاً لجميع الأطفال.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={member.image} 
                alt={member.name}
                className="w-full h-64 object-cover object-top"
              />
              <div className="p-6" dir="rtl">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-pink-500 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>
                <div className="flex space-x-3 space-x-reverse">
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} className="text-blue-600 hover:text-blue-800 transition-colors">
                      <i className="ri-linkedin-fill text-xl"></i>
                    </a>
                  )}
                  {member.social.twitter && (
                    <a href={member.social.twitter} className="text-blue-400 hover:text-blue-600 transition-colors">
                      <i className="ri-twitter-fill text-xl"></i>
                    </a>
                  )}
                  {member.social.github && (
                    <a href={member.social.github} className="text-gray-700 hover:text-gray-900 transition-colors">
                      <i className="ri-github-fill text-xl"></i>
                    </a>
                  )}
                  {member.social.dribbble && (
                    <a href={member.social.dribbble} className="text-pink-500 hover:text-pink-700 transition-colors">
                      <i className="ri-dribbble-fill text-xl"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

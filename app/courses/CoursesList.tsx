"use client";

import Link from "next/link";
import useSWR from "swr";
import api from "@/lib/api";

interface CoursesListProps {
  selectedAge: number;
}

const fetcher = (url: string) =>
  api.get(url).then((res) => {
    const data = res.data?.data;
    // تأكد أن النتيجة دائمًا مصفوفة
    if (Array.isArray(data)) return data;
    if (data) return [data]; // لو رجع كائن واحد
    return [];
  });

export default function CoursesList({ selectedAge }: CoursesListProps) {
  const { data: allPrograms = [], error, isLoading } = useSWR(
    "/programs",
    fetcher,
    { revalidateOnFocus: false }
  );

  // فلترة حسب العمر
  const programs = allPrograms.filter(
    (p: any) => selectedAge >= p.agemin && selectedAge <= p.agemax
  );

  if (isLoading) {
    return (
      <p className="text-center py-20 text-gray-600 animate-pulse">
        جاري تحميل البرامج...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center py-20 text-red-500">
        حدث خطأ أثناء جلب البيانات
      </p>
    );
  }

  return (
    <section className="py-20 bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {programs.length} برنامج تدريبي
          </h2>
          <p className="text-gray-600">
            اختر البرنامج المناسب لعمر طفلك
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program: any) => {
            const imageURL = program.image
              ? `http://localhost:8000/storage/${program.image}`
              : "/default.png";

            return (
              <div
                key={program.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={imageURL}
                  alt={program.title}
                  className="w-full h-48 object-cover object-top"
                />

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {program.title}
                  </h3>

                  <p className="text-gray-600 mb-4">{program.description}</p>

                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>
                      العمر: {program.agemin}-{program.agemax}
                    </span>
                    <span>{program.duration_weeks} أسابيع</span>
                  </div>

                  <p className="text-lg font-bold text-indigo-600 mb-4">
                    {program.price}$
                  </p>

                  <Link
                    href={`/courses/${program.slug}`}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center"
                  >
                    عرض البرنامج
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {programs.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              لا توجد برامج متاحة
            </h3>
          </div>
        )}
      </div>
    </section>
  );
}

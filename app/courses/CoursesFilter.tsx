'use client';

interface CoursesFilterProps {
  selectedAge: number;
  onAgeChange: (age: number) => void;
}

export default function CoursesFilter({ selectedAge, onAgeChange }: CoursesFilterProps) {
  const ageGroups = [
    { id: 1, label: "(7-9)", age: 8 },
    { id: 2, label: "(9-11)", age: 10 },
    { id: 3, label: "(11-13)", age: 12 },
    { id: 4, label: "(13-15)", age: 14 },
    { id: 5, label: "(15-17)", age: 16 },
  ];

  return (
    <section className="py-12 bg-white border-b" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">

          <div className="flex flex-col md:flex-row gap-6 items-center">
            <span className="text-lg font-semibold text-gray-900">
              اختر العمر:
            </span>

            <div className="flex items-center gap-3 flex-wrap">
              {ageGroups.map(age => (
                <button
                  key={age.id}
                  onClick={() => onAgeChange(age.age)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition
                    ${selectedAge === age.age
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {age.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

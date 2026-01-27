"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

type Program = {
  id: number;
  title: string;
  description: string;
  agemin: number;
  agemax: number;
};

export default function CompleteRegisterPage() {
  const [form, setForm] = useState({
    age: "",
    school: "",
    grade: "",
    guardian_name: "",
    guardian_phone: "",
    interests: [],
  });

  const [loading, setLoading] = useState(false);

  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  const ages = Array.from({ length: 12 }, (_, i) => i + 6); // 6 → 17

  /* =======================
     جلب كل البرامج مرة واحدة
     ======================= */
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await api.get("/programs");
        setPrograms(res.data.data || []);
      } catch (err) {
        console.error("فشل جلب البرامج", err);
      } finally {
        setLoadingPrograms(false);
      }
    };

    fetchPrograms();
  }, []);

  /* =======================
     تحديد البرنامج المناسب عند اختيار العمر
     ======================= */
  useEffect(() => {
    if (!form.age || programs.length === 0) return;

    const age = Number(form.age);

    const recommended = programs.find(
      (p) => age >= p.agemin && age <= p.agemax
    );

    if (recommended) {
      setSelectedProgram(recommended.id);
    }
  }, [form.age, programs]);

  /* =======================
     إرسال البيانات
     ======================= */
  const submit = async () => {
    if (!form.age || !form.guardian_phone) {
      return alert("الرجاء تعبئة الحقول المطلوبة");
    }

    if (!selectedProgram) {
      return alert("الرجاء اختيار برنامج");
    }

    setLoading(true);
    try {
      await api.put("/profile", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      document.cookie = "reg_step=profile_completed; path=/";

      window.location.href = `/register/select-schedule?program_id=${selectedProgram}`;
    } catch (err: any) {
      alert(err.response?.data?.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          استكمال التسجيل
        </h1>

        <div className="space-y-5" dir="rtl">
          {/* العمر */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              العمر *
            </label>
            <select
              value={form.age}
              required
              onChange={(e) =>
                setForm({ ...form, age: e.target.value })
              }
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">اختر العمر</option>
              {ages.map((age) => (
                <option key={age} value={age}>
                  {age} سنة
                </option>
              ))}
            </select>
          </div>

          {/* رقم ولي الأمر */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              رقم ولي الأمر *
            </label>
            <input
              type="tel"
              required
              placeholder="مثال: 777123456"
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
              value={form.guardian_phone}
              onChange={(e) =>
                setForm({ ...form, guardian_phone: e.target.value })
              }
            />
          </div>

          {/* البرامج */}
          {form.age && (
            <div>
              <h2 className="font-semibold mb-3 text-gray-800">
                اختر البرنامج
              </h2>

              {loadingPrograms ? (
                <p className="text-gray-500">جاري تحميل البرامج...</p>
              ) : (
                <div className="space-y-3">
                  {programs.map((program) => {
                    const age = Number(form.age);

                    const isRecommended =
                      age >= program.agemin &&
                      age <= program.agemax;

                    const isSelected =
                      selectedProgram === program.id;

                    return (
                      <div
                        key={program.id}
                        onClick={() =>
                          setSelectedProgram(program.id)
                        }
                        className={`p-4 border rounded-xl cursor-pointer transition
                          ${
                            isSelected
                              ? "border-blue-600 bg-blue-50 shadow-md"
                              : "border-gray-200"
                          }
                          ${
                            isRecommended
                              ? "ring-2 ring-blue-300"
                              : "opacity-80"
                          }
                        `}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-gray-900">
                            {program.title}
                          </h3>

                          {isRecommended && (
                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                              مقترح لعمر الطالب
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mt-1">
                          {program.description}
                        </p>

                        <p className="text-xs text-gray-500 mt-2">
                          العمر المناسب: {program.agemin} –{" "}
                          {program.agemax}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded-lg text-lg font-semibold mt-6 disabled:opacity-50"
          >
            {loading ? "جاري المتابعة..." : "التالي"}
          </button>
        </div>
      </div>
    </div>
  );
}

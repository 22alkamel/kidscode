"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import api from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function ProgramPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuth()!;

     const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "";
  /* ================= PROGRAM ================= */
  const { data: programData, isLoading: programLoading } = useSWR(
    slug ? `/programs/${slug}` : null,
    fetcher
  );

  // استخراج البرنامج من الـ response
  const program = programData?.data ?? programData;

  /* ================= TRACKS ================= */
  const { data: tracksData } = useSWR(
    () => (program?.slug ? `/programs/${program.slug}/tracks` : null),
    fetcher
  );
  const tracks = tracksData?.data ?? [];

  // رابط الصورة الافتراضية
  const imageURL = program?.image
    ? `${backendUrl}/storage/${program.image}`
    : "/default.png";

  /* ================= SUBSCRIBE ================= */
  const handleSubscribe = () => {
    if (!program?.id) return; // حماية إضافية

    const token = localStorage.getItem("token");
    if (!token) {
      router.push(`/login?redirect=/select-schedule?program_id=${program.id}`);
      return;
    }

    router.push(`/register/select-schedule?program_id=${program.id}`);
  };

  if (programLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        جاري تحميل البرنامج...
      </div>
    );

  if (!program)
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        البرنامج غير موجود
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div dir="rtl" className="bg-[#F7F8FF]">
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={imageURL}
              className="w-full h-[420px] object-cover blur-sm scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          <div className="relative max-w-6xl mx-auto px-6 py-24 text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
              {program.title}
            </h1>

            <p className="max-w-2xl opacity-90 mb-6">{program.description}</p>

            <div className="flex flex-wrap gap-4 text-sm mb-6">
              <span className="bg-white/20 px-4 py-2 rounded-full">
                👶 العمر {program.agemin}-{program.agemax}
              </span>

              <span className="bg-white/20 px-4 py-2 rounded-full">
                ⏱ {program.duration_weeks} أسابيع
              </span>

              <span className="bg-white/20 px-4 py-2 rounded-full">
                🎓 المستوى {program.level}
              </span>
            </div>

            <button
              onClick={handleSubscribe}
              className="bg-gradient-to-r from-pink-500 to-purple-600
              px-10 py-4 rounded-2xl font-bold text-lg shadow-xl
              hover:scale-105 transition"
            >
              اشترك الآن مقابل {program.price}$
            </button>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              "تعلم البرمجة بطريقة ممتعة",
              "مشاريع حقيقية للأطفال",
              "مدربين متخصصين",
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition"
              >
                <p className="font-semibold text-indigo-900">{f}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= TRACKS ================= */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <h2 className="text-2xl font-extrabold mb-10 text-indigo-900">
            المسارات التعليمية
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tracks.map((track: any, index: number) => (
              <div
                key={track.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition group"
              >
                <div className="relative">
                  <img
                    src={
                      track.track_img
                        ? `${backendUrl}/storage/${track.track_img}`
                        : "/default.png"
                    }
                    className="w-full h-44 object-cover group-hover:scale-105 transition"
                  />

                  <span className="absolute top-3 right-3 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                    المسار {index + 1}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-indigo-900 mb-2">
                    {track.title}
                  </h3>
                  <p className="font-bold text-gray-700 mb-2">
                    {track.description}
                  </p>

                  <p className="text-sm text-gray-500">
                    مدة تقديرية: {track.estimated_time ?? "-"} دقيقة
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CTA ================= */}
    
      </div>
      <Footer />
    </div>
  );
}

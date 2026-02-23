"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useParams } from "next/navigation";

/* =========================
   Stepper Component
========================= */
function Stepper({ step }: { step: number }) {
  const steps = ["معلومات الدرس", "الميديا", "الأسئلة"];

  return (
    <div className="flex items-center gap-4 m-10">
      {steps.map((label, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold
              ${
                step >= index + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
          >
            {index + 1}
          </div>
          <span
            className={`text-sm ${step === index + 1 ? "font-semibold" : "text-gray-500"}`}
          >
            {label}
          </span>
          {index < steps.length - 1 && <div className="w-10 h-px bg-gray-300 mx-2" />}
        </div>
      ))}
    </div>
  );
}

/* =========================
   Main Page
========================= */
export default function CreateLessonStepperPage() {
  const { trackId } = useParams();

  const [step, setStep] = useState(1);
  const [lessonId, setLessonId] = useState<number | null>(null);

  /* -------- Step 1 -------- */
  const [lessonForm, setLessonForm] = useState({
    title: "",
    content: "",
    duration_minutes: "",
    is_published: false,
  });

  /* -------- Step 2 -------- */
  const [mediaForm, setMediaForm] = useState({
    type: "video",
    url: "",
    caption: "",
  });
  const [mediaSource, setMediaSource] = useState<"file" | "link">("file");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaList, setMediaList] = useState<any[]>([]);

  /* -------- Step 3 -------- */
  const [questionType, setQuestionType] = useState("multiple_choice");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  /* =========================
     STEP 1 – CREATE LESSON
  ========================= */
  const createLesson = async () => {
    const res = await api.post(`/admin/tracks/${trackId}/lessons`, {
      ...lessonForm,
      duration_minutes: lessonForm.duration_minutes ? Number(lessonForm.duration_minutes) : null,
    });

    setLessonId(res.data.id);
    setStep(2);
  };

  /* =========================
     STEP 2 – ADD MEDIA
  ========================= */
  const addMedia = async () => {
    if (!lessonId) return;

    const formData = new FormData();
    formData.append("type", mediaForm.type);
    formData.append("caption", mediaForm.caption);

    if (mediaSource === "file" && mediaFile) {
      formData.append("file", mediaFile);
    }

    if (mediaSource === "link" && mediaForm.url) {
      formData.append("url", mediaForm.url);
    }

    const res = await api.post(`/admin/lessons/${lessonId}/media`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setMediaList([...mediaList, res.data]);
    setMediaFile(null);
    setMediaForm({ type: "video", url: "", caption: "" });
  };

  /* =========================
     STEP 3 – ADD QUESTION
  ========================= */
  const addQuestion = async () => {
    if (!lessonId) return;

    try {
      await api.post(`/admin/lessons/${lessonId}/questions`, {
        type: questionType,
        question: questionText,
        options: questionType === "multiple_choice" ? options : null,
        correct_answer: correctAnswer,
      });
      alert("تمت إضافة السؤال ✅");
    } catch (error: any) {
      console.log(error.response?.data);
      alert(JSON.stringify(error.response?.data));
    }

    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
  };

  return (
    <div className="max-w-5xl mx-auto py-12 bg-gradient-to-br from-indigo-100 to-pink-100 min-h-screen rounded-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">إضافة درس جديد</h1>

      <Stepper step={step} />

      {/* =========================
         STEP 1 – BASIC INFO
      ========================= */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-3xl shadow space-y-4 m-8">
          <input
            placeholder="عنوان الدرس"
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            value={lessonForm.title}
            onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
          />
          <textarea
            placeholder="محتوى الدرس"
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            rows={4}
            value={lessonForm.content}
            onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
          />
          <input
            type="number"
            placeholder="مدة الدرس (بالدقائق)"
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            value={lessonForm.duration_minutes}
            onChange={(e) => setLessonForm({ ...lessonForm, duration_minutes: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={lessonForm.is_published}
              onChange={(e) => setLessonForm({ ...lessonForm, is_published: e.target.checked })}
            />
            نشر الدرس
          </label>
          <button
            onClick={createLesson}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
          >
            حفظ & متابعة
          </button>
        </div>
      )}

      {/* =========================
         STEP 2 – MEDIA
      ========================= */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-3xl shadow space-y-4">
          <select
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            value={mediaForm.type}
            onChange={(e) => setMediaForm({ ...mediaForm, type: e.target.value })}
          >
            <option value="video">فيديو</option>
            <option value="image">صورة</option>
            <option value="file">ملف / PDF</option>
          </select>

          <div className="flex gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={mediaSource === "file"}
                onChange={() => setMediaSource("file")}
              />
              رفع ملف
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={mediaSource === "link"}
                onChange={() => setMediaSource("link")}
              />
              رابط خارجي
            </label>
          </div>

          {mediaSource === "file" && (
            <input
              type="file"
              accept="video/*,image/*,.pdf"
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
              onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
            />
          )}
          {mediaSource === "link" && (
            <input
              placeholder="رابط يوتيوب أو رابط خارجي"
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
              value={mediaForm.url}
              onChange={(e) => setMediaForm({ ...mediaForm, url: e.target.value })}
            />
          )}
          <input
            placeholder="وصف (اختياري)"
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            value={mediaForm.caption}
            onChange={(e) => setMediaForm({ ...mediaForm, caption: e.target.value })}
          />
          <button
            onClick={addMedia}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            + إضافة ميديا
          </button>

          {mediaList.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm">
              {mediaList.map((m, i) => (
                <div key={i} className="flex justify-between items-center border p-2 rounded-lg bg-white">
                  <span>• {m.type} — {m.caption || m.url}</span>
                  {/* ✏️ تعديل / 🗑️ حذف أيقونات */}
                  <div className="flex gap-2">
                    <button className="text-indigo-600 hover:text-indigo-800">✏️</button>
                    <button className="text-red-500 hover:text-red-700">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setStep(3)}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
          >
            متابعة → الأسئلة
          </button>
        </div>
      )}

      {/* =========================
         STEP 3 – QUESTIONS
      ========================= */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-3xl shadow space-y-4">
          <select
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="multiple_choice">اختيارات</option>
            <option value="true_false">صح / خطأ</option>
            <option value="fill_blank">إجابة نصية</option>
          </select>

          <textarea
            placeholder="نص السؤال"
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />

          {questionType === "multiple_choice" &&
            options.map((opt, i) => (
              <input
                key={i}
                placeholder={`الخيار ${i + 1}`}
                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                value={opt}
                onChange={(e) => {
                  const copy = [...options];
                  copy[i] = e.target.value;
                  setOptions(copy);
                }}
              />
            ))}

          <input
            placeholder="الإجابة الصحيحة"
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
          />

          <button
            onClick={addQuestion}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
          >
            + إضافة سؤال
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

/* ================= Types ================= */
type TabType = "lesson" | "media" | "questions";

/* ================= Page ================= */
export default function LessonEditPage() {
  const { lessonId, trackId } = useParams();
  const router = useRouter();

  const [tab, setTab] = useState<TabType>("lesson");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  /* ===== Lesson ===== */
  const [lessonForm, setLessonForm] = useState({
    title: "",
    content: "",
    duration_minutes: "",
    is_published: false,
  });

  /* ===== Media ===== */
  const [mediaForm, setMediaForm] = useState({
    type: "video",
    url: "",
    caption: "",
  });
  const [mediaSource, setMediaSource] = useState<"file" | "link">("file");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaList, setMediaList] = useState<any[]>([]);

  /* ===== Questions ===== */
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionType, setQuestionType] = useState("mcq");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  /* ================= Fetch ================= */
  useEffect(() => {
    api.get(`/lessons/${lessonId}`).then((res) => {
      const l = res.data;
      setLessonForm({
        title: l.title,
        content: l.content,
        duration_minutes: l.duration_minutes || "",
        is_published: l.is_published,
      });
      setMediaList(l.media || []);
      setQuestions(l.questions || []);
    });
  }, [lessonId]);

  /* ================= Actions ================= */
  const saveLesson = async () => {
    try {
      setSaving(true);
      await api.put(`/lessons/${lessonId}`, {
        ...lessonForm,
        duration_minutes: lessonForm.duration_minutes
          ? Number(lessonForm.duration_minutes)
          : null,
        track_id: trackId,
      });
      toastMsg("✅ تم حفظ بيانات الدرس");
      setTab("media");
    } finally {
      setSaving(false);
    }
  };

  const addMedia = async () => {
    const form = new FormData();
    form.append("type", mediaForm.type);
    form.append("caption", mediaForm.caption);

    if (mediaSource === "file" && mediaFile) form.append("file", mediaFile);
    if (mediaSource === "link") form.append("url", mediaForm.url);

    const res = await api.post(`/lessons/${lessonId}/media`, form);
    setMediaList((prev) => [...prev, res.data]);
    setMediaFile(null);
    setMediaForm({ type: "video", url: "", caption: "" });
    toastMsg("📎 تمت إضافة الميديا");
  };

  const deleteMedia = async (id: number) => {
    await api.delete(`/lessons/${lessonId}/media/${id}`);
    setMediaList((prev) => prev.filter((m) => m.id !== id));
    toastMsg("🗑️ تم حذف الميديا");
  };

  const addQuestion = async () => {
    const payload: any = {
      type: questionType === "mcq" ? "multiple_choice" : questionType,
      question: questionText,
      correct_answer: correctAnswer,
      options: questionType === "mcq" ? options : undefined,
    };

    const res = await api.post(`/lessons/${lessonId}/questions`, payload);
    setQuestions((prev) => [...prev, res.data]);
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
    toastMsg("❓ تمت إضافة السؤال");
  };

  const deleteQuestion = async (id: number) => {
    await api.delete(`/lessons/${lessonId}/questions/${id}`);
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    toastMsg("🗑️ تم حذف السؤال");
  };

  const editQuestion = (q: any) => {
    setQuestionType(q.type === "multiple_choice" ? "mcq" : q.type);
    setQuestionText(q.question);
    setOptions(q.options || ["", "", "", ""]);
    setCorrectAnswer(q.correct_answer);
  };

  const toastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  /* ================= UI ================= */
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-indigo-100 to-pink-100 flex justify-center p-4 sm:p-6"
    >
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-pink-500 p-6 text-white">
          <h2 className="text-2xl font-bold pb-6">✏️ تعديل الدرس</h2>
          <p className="opacity-90 text-sm">
            إدارة محتوى الدرس – الميديا – الأسئلة
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b text-sm pt-2">
          <Tab label="📘 الدرس" active={tab === "lesson"} onClick={() => setTab("lesson")} />
          <Tab label="🎬 الميديا" active={tab === "media"} onClick={() => setTab("media")} />
          <Tab label="❓ الأسئلة" active={tab === "questions"} onClick={() => setTab("questions")} />
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* ===== LESSON ===== */}
          {tab === "lesson" && (
            <>
              <Input
                label="عنوان الدرس"
                value={lessonForm.title}
                onChange={(e: any) =>
                  setLessonForm({ ...lessonForm, title: e.target.value })
                }
              />
              <Textarea
                label="محتوى الدرس"
                value={lessonForm.content}
                onChange={(e: any) =>
                  setLessonForm({ ...lessonForm, content: e.target.value })
                }
              />
              <Input
                type="number"
                label="مدة الدرس (دقائق)"
                value={lessonForm.duration_minutes}
                onChange={(e: any) =>
                  setLessonForm({
                    ...lessonForm,
                    duration_minutes: e.target.value,
                  })
                }
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={lessonForm.is_published}
                  onChange={(e) =>
                    setLessonForm({
                      ...lessonForm,
                      is_published: e.target.checked,
                    })
                  }
                />
                نشر الدرس
              </label>
            </>
          )}

          {/* ===== MEDIA ===== */}
          {tab === "media" && (
            <>
              {/* Existing Media */}
              {mediaList.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-indigo-600">
                    🎞️ الميديا الحالية
                  </h3>
                  {mediaList.map((m) => (
                    <div
                      key={m.id}
                      className="border rounded-xl p-3 text-sm bg-gray-50 flex justify-between items-start"
                    >
                      <div>
                        <div>📁 النوع: {m.type}</div>
                        {m.caption && <div>📝 الوصف: {m.caption}</div>}
                        {m.url && (
                          <a
                            href={m.url}
                            target="_blank"
                            className="text-indigo-600 underline"
                          >
                            فتح الميديا
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => deleteMedia(m.id)}
                        className="text-red-600 font-bold px-2 py-1 rounded bg-red-100"
                      >
                        🗑️ حذف
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Media */}
              <Select
                label="نوع الميديا"
                value={mediaForm.type}
                onChange={(e: any) =>
                  setMediaForm({ ...mediaForm, type: e.target.value })
                }
              >
                <option value="video">فيديو</option>
                <option value="image">صورة</option>
                <option value="file">ملف / PDF</option>
              </Select>

              <div className="flex gap-6 text-sm">
                <Radio
                  checked={mediaSource === "file"}
                  onChange={() => setMediaSource("file")}
                  label="رفع ملف"
                />
                <Radio
                  checked={mediaSource === "link"}
                  onChange={() => setMediaSource("link")}
                  label="رابط خارجي"
                />
              </div>

              {mediaSource === "file" && (
                <input
                  type="file"
                  className="w-full border rounded-xl px-4 py-2"
                  onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                />
              )}

              {mediaSource === "link" && (
                <Input
                  label="الرابط"
                  value={mediaForm.url}
                  onChange={(e: any) =>
                    setMediaForm({ ...mediaForm, url: e.target.value })
                  }
                />
              )}

              <Input
                label="وصف الميديا"
                value={mediaForm.caption}
                onChange={(e: any) =>
                  setMediaForm({ ...mediaForm, caption: e.target.value })
                }
              />
            </>
          )}

          {/* ===== QUESTIONS ===== */}
          {tab === "questions" && (
            <>
              {/* Existing Questions */}
              {questions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-indigo-600">
                    ❓ الأسئلة الحالية
                  </h3>
                  {questions.map((q) => (
                    <div
                      key={q.id}
                      className="border rounded-xl p-4 bg-gray-50 text-sm space-y-1 flex justify-between"
                    >
                      <div>
                        <div>📌 {q.question}</div>
                        <div className="text-xs text-gray-500">
                          النوع: {q.type}
                        </div>
                        {q.options && (
                          <ul className="list-disc pr-5">
                            {q.options.map((o: string, i: number) => (
                              <li key={i}>{o}</li>
                            ))}
                          </ul>
                        )}
                        <div className="text-green-600">
                          ✔ الإجابة: {q.correct_answer}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => editQuestion(q)}
                          className="text-blue-600 font-bold px-2 py-1 rounded bg-blue-100"
                        >
                          ✏️ تعديل
                        </button>
                        <button
                          onClick={() => deleteQuestion(q.id)}
                          className="text-red-600 font-bold px-2 py-1 rounded bg-red-100"
                        >
                          🗑️ حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Question */}
              <Select
                label="نوع السؤال"
                value={questionType}
                onChange={(e: any) => setQuestionType(e.target.value)}
              >
                <option value="mcq">اختيارات</option>
                <option value="true_false">صح / خطأ</option>
                <option value="text">نصي</option>
              </Select>

              <Textarea
                label="نص السؤال"
                value={questionText}
                onChange={(e: any) => setQuestionText(e.target.value)}
              />

              {questionType === "mcq" &&
                options.map((o, i) => (
                  <Input
                    key={i}
                    label={`الخيار ${i + 1}`}
                    value={o}
                    onChange={(e: any) => {
                      const copy = [...options];
                      copy[i] = e.target.value;
                      setOptions(copy);
                    }}
                  />
                ))}

              <Input
                label="الإجابة الصحيحة"
                value={correctAnswer}
                onChange={(e: any) => setCorrectAnswer(e.target.value)}
              />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-between">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-200 rounded-lg"
          >
            رجوع
          </button>

          {tab === "lesson" && (
            <button
              onClick={saveLesson}
              className="px-8 py-2 bg-indigo-600 text-white rounded-lg"
            >
              💾 حفظ
            </button>
          )}
          {tab === "media" && (
            <button
              onClick={addMedia}
              className="px-8 py-2 bg-indigo-600 text-white rounded-lg"
            >
              ➕ إضافة
            </button>
          )}
          {tab === "questions" && (
            <button
              onClick={addQuestion}
              className="px-8 py-2 bg-indigo-600 text-white rounded-lg"
            >
              ➕ إضافة سؤال
            </button>
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ================= Components ================= */
function Tab({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 font-semibold border-b-2 ${
        active
          ? "border-indigo-600 text-indigo-600"
          : "border-transparent text-gray-400"
      }`}
    >
      {label}
    </button>
  );
}
function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="text-sm text-gray-500 mb-1 block">{label}</label>
      <input
        {...props}
        className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  );
}
function Textarea({ label, ...props }: any) {
  return (
    <div>
      <label className="text-sm text-gray-500 mb-1 block">{label}</label>
      <textarea
        {...props}
        rows={4}
        className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  );
}
function Select({ label, children, ...props }: any) {
  return (
    <div>
      <label className="text-sm text-gray-500 mb-1 block">{label}</label>
      <select
        {...props}
        className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
      >
        {children}
      </select>
    </div>
  );
}
function Radio({ label, checked, onChange }: any) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="radio" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

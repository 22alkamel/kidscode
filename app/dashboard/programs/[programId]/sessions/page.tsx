"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

/* ================= TYPES ================= */

interface Media {
  id: number;
  type: "image" | "video" | "pdf";
  url: string;
  caption?: string;
}

interface Question {
  id: number;
  question: string;
  type: "mcq" | "true_false";
  options: string[];
  correct_answer: string;
}

interface Lesson {
  id: number;
  title: string;
  content?: string;
  media?: Media[];
  questions?: Question[];
}

interface Session {
  id: number;
  group_id: number;
  lesson?: Lesson;
  publish_at: string;
}

interface Group {
  id: number;
  name: string;
}

/* ================= QUESTION RENDERER ================= */

function QuestionRenderer({
  question,
  value,
  result,
  onSelect,
}: {
  question: Question;
  value?: string;
  result?: boolean;
  onSelect: (val: string) => void;
}) {
  const getClass = (option: string) => {
    if (result === true && option === value) return "bg-green-100 border-green-400";
    if (result === false && option === value) return "bg-red-100 border-red-400";
    return value ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-50";
  };

  return (
    <div className="space-y-2">
      {question.options.map((opt, i) => (
        <label
          key={i}
          className={`flex items-center gap-2 border rounded-lg p-2 cursor-pointer ${getClass(opt)}`}
        >
          <input
            type="radio"
            name={`q-${question.id}`}
            checked={value === opt}
            disabled={!!value} // يمنع إعادة الاختيار
            onChange={() => onSelect(opt)}
          />
          {question.type === "true_false"
            ? opt === "true"
              ? "✅ صح"
              : "❌ خطأ"
            : opt}
        </label>
      ))}

      {/* إذا كانت الإجابة خاطئة، عرض الإجابة الصحيحة */}
      {result === false && (
        <p className="mt-2 text-red-600 font-semibold">
          ❌ إجابتك خاطئة. الإجابة الصحيحة: {question.correct_answer}
        </p>
      )}

      {result === true && (
        <p className="mt-2 text-green-600 font-semibold">
          ✅ إجابتك صحيحة
        </p>
      )}
    </div>
  );
}

/* ================= PAGE ================= */

export default function ProgramSessionsPage() {
  const { programId } = useParams();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [groupsMap, setGroupsMap] = useState<Record<number, Group>>({});
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    async function load() {
      // جلب الجلسات
      const sessionsRes = await api.get(`/class-sessions/student?program_id=${programId}`);
      const sessionsData = sessionsRes.data.sessions ?? sessionsRes.data ?? [];
      setSessions(sessionsData);

      // جلب الجروبات
      const groupsRes = await api.get(`/student/groups`);
      const groups: Group[] = groupsRes.data.groups ?? [];
      const map: Record<number, Group> = {};
      groups.forEach((g) => (map[g.id] = g));
      setGroupsMap(map);
      setLoading(false);
    }
    load();
  }, [programId]);

  /* ================= جلب النتيجة المحفوظة ================= */

  useEffect(() => {
    async function loadSavedAnswers() {
      if (!activeSession) return;

      try {
        const res = await api.get(`/session-student/${activeSession.id}`);
        const saved = res.data; // { answers: {question_id: "val"}, results: {...}, score: number }
        setAnswers(saved.answers ?? {});
        setResults(saved.results ?? {});
        setScore(saved.score ?? null);

        // حساب شريط التقدم على أساس الإجابات الصحيحة
        const total = activeSession.lesson?.questions?.length || 1;
        const correctCount = Object.values(saved.results ?? {}).filter(Boolean).length;
        setProgress(Math.round((correctCount / total) * 100));
      } catch (err) {
        console.error("Error loading saved answers:", err);
      }
    }
    loadSavedAnswers();
  }, [activeSession]);

  /* ================= ANSWERS ================= */

  async function selectAnswer(question: Question, value: string) {
    if (answers[question.id]) return; // منع إعادة الاختيار

    const isCorrect = value === question.correct_answer;

    const newAnswers = { ...answers, [question.id]: value };
    const newResults = { ...results, [question.id]: isCorrect };

    setAnswers(newAnswers);
    setResults(newResults);

    // تحديث شريط التقدم
    const total = activeSession?.lesson?.questions?.length || 1;
    const correctCount = Object.values(newResults).filter(Boolean).length;
    setProgress(Math.round((correctCount / total) * 100));

    // حساب النتيجة النهائية (على 10)
    const calculatedScore = Math.round((correctCount / total) * 10);
    setScore(calculatedScore);

    // إرسال النتيجة والإجابات للباك إند
    try {
      await api.post("/session-student/submit", {
        session_id: activeSession?.id,
        score: calculatedScore,
        answers: Object.entries(newAnswers).map(([question_id, answer]) => ({ question_id, answer })),
      });
    } catch (err) {
      console.error("Error saving score:", err);
    }
  }

  if (loading)
    return <p className="text-center py-10">جاري التحميل...</p>;

  /* ================= SESSION LIST ================= */

  if (!activeSession)
    return (
      <div className="min-h-screen p-6 bg-[#EEF0FF]" dir="rtl">
        <h1 className="text-2xl font-bold text-indigo-600 mb-6">
          الحصص المنشورة
        </h1>

        {sessions.map((session) => {
          const group = groupsMap[session.group_id];
          return (
            <div
              key={session.id}
              className="bg-white p-5 rounded-2xl shadow mb-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => {
                setActiveSession(session);
                setProgress(0);
                setAnswers({});
                setResults({});
                setScore(null);
              }}
            >
              <p className="text-xs text-indigo-500">
                👥 {group?.name ?? "جروب"}
              </p>
              <h2 className="text-lg font-semibold mt-1">
                {session.lesson?.title}
              </h2>
              <p className="text-sm text-gray-500">
                {new Date(session.publish_at).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    );

  /* ================= LESSON VIEW ================= */

  const lesson = activeSession.lesson;

  return (
    <div className="min-h-screen bg-[#EEF0FF] p-6" dir="rtl">
      <button
        onClick={() => {
          setActiveSession(null);
          setAnswers({});
          setResults({});
          setProgress(0);
          setScore(null);
        }}
        className="mb-4 text-indigo-600"
      >
        ← الرجوع للحصص
      </button>

      <div className="bg-white rounded-2xl shadow p-6 space-y-6">
        <h1 className="text-3xl font-bold text-indigo-700">{lesson?.title}</h1>

        {lesson?.content && (
          <p className="bg-indigo-50 p-4 rounded-xl">{lesson.content}</p>
        )}

        {/* PROGRESS BAR */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>تقدم الحصة</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-3 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* QUIZ */}
        {lesson?.questions?.length ? (
          <div>
            <h2 className="text-xl font-bold mb-6">🧠 الاختبار</h2>

            {lesson.questions.map((q, index) => (
              <div key={q.id} className="mb-6 p-5 bg-purple-50 rounded-2xl">
                <p className="font-semibold mb-3">
                  {index + 1}. {q.question}
                </p>

                <QuestionRenderer
                  question={q}
                  value={answers[q.id]}
                  result={results[q.id]}
                  onSelect={(val) => selectAnswer(q, val)}
                />
              </div>
            ))}

            {/* النتيجة النهائية */}
            {score !== null && (
              <div className="mt-6 text-xl font-bold text-indigo-700 bg-indigo-50 p-4 rounded-xl">
                🎯 نتيجتك: {score} / 10
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
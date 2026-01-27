"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { DAYS_OPTIONS, TIME_OPTIONS } from "@/lib/registrationConstants";

/* ================= TYPES ================= */
type Registration = {
  id: number;
  status: string;
  preferred_days: string;
  preferred_time: string;
  user: {
    name: string;
    email: string;
    student_profile?: {
      guardian_phone?: string;
    };
  };
  program: {
    title: string;
  };
};

/* ================= CONSTANTS ================= */
const TABS = [
  { key: "all", label: "الكل" },
  { key: "pending", label: "قيد الانتظار" },
  { key: "confirmed", label: "مقبول" },
  { key: "cancelled", label: "ملغي" },
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

/* ================= PAGE ================= */
export default function AdminEnrollmentsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [toast, setToast] = useState<string | null>(null);

  /* ===== Edit ===== */
  const [editing, setEditing] = useState<Registration | null>(null);
  const [form, setForm] = useState({
    preferred_days: "",
    preferred_time: "",
    status: "",
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    const res = await api.get("/admin/registrations");
    setRegistrations(res.data);
    setLoading(false);
  };

  /* ================= TOAST ================= */
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  /* ================= ACTIONS ================= */
  const updateStatus = async (id: number, status: string) => {
    await api.put(`/admin/registrations/${id}`, { status });
    showToast("✅ تم تحديث حالة الطلب");
    fetchRegistrations();
  };

  const openEdit = (r: Registration) => {
    setEditing(r);
    setForm({
      preferred_days: r.preferred_days,
      preferred_time: r.preferred_time,
      status: r.status,
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    await api.put(`/admin/registrations/${editing.id}`, form);
    showToast("✅ تم تحديث بيانات التسجيل");
    setEditing(null);
    fetchRegistrations();
  };

  /* ================= FILTER + SEARCH ================= */
  const filteredRegistrations = useMemo(() => {
    let data = registrations;

    if (activeTab !== "all") {
      data = data.filter((r) => r.status === activeTab);
    }

    if (search) {
      data = data.filter(
        (r) =>
          r.user.name.toLowerCase().includes(search.toLowerCase()) ||
          r.user.email.toLowerCase().includes(search.toLowerCase()) ||
          r.program.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    return data;
  }, [registrations, activeTab, search]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);

  const paginatedData = filteredRegistrations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast} />}

      {/* ===== Header ===== */}
      <div>
        <h1 className="text-2xl font-extrabold text-indigo-900">
          📝 إدارة طلبات التسجيل
        </h1>
        <p className="text-sm text-gray-500 mt-1">متابعة وتحديث طلبات الطلاب</p>
      </div>

      {/* ===== Tabs ===== */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setCurrentPage(1);
            }}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition
              ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow"
                  : "bg-white border hover:bg-gray-100"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== Filters ===== */}
      <div className="bg-white rounded-2xl p-4 shadow flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="🔍 بحث بالاسم، الإيميل أو البرنامج"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-xl px-4 py-2 text-sm w-72
                     focus:ring-2 focus:ring-purple-400 outline-none"
        />

        <select
          className="border rounded-xl px-4 py-2 text-sm"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          {ITEMS_PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} / صفحة
            </option>
          ))}
        </select>
      </div>

      {/* ===== Table ===== */}
      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4">الطالب</th>
                <th className="p-4">الايميل</th>
                <th className="p-4">رقم الهاتف</th>
                <th className="p-4">البرنامج</th>
                <th className="p-4">الأيام</th>
                <th className="p-4">الوقت</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4 font-semibold">{r.user.name}</td>
                  <td className="p-4 font-semibold">{r.user.email}</td>
                  <td className="p-4 font-semibold">
                    {" "}
                    {r.user.student_profile?.guardian_phone || "—"}
                  </td>
                  <td className="p-4">{r.program.title}</td>
                  <td className="p-4">{DAYS_OPTIONS[r.preferred_days]}</td>
                  <td className="p-4">{TIME_OPTIONS[r.preferred_time]}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          r.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : r.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => openEdit(r)}
                      className="px-4 py-2 rounded-full text-xs bg-yellow-100 text-yellow-700"
                    >
                      تعديل
                    </button>

                    {r.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(r.id, "confirmed")}
                          className="px-4 py-2 rounded-full text-xs bg-green-100 text-green-700"
                        >
                          قبول
                        </button>
                        <button
                          onClick={() => updateStatus(r.id, "cancelled")}
                          className="px-4 py-2 rounded-full text-xs bg-red-100 text-red-600"
                        >
                          إلغاء
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}

              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-400">
                    لا توجد نتائج
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Pagination ===== */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded-full text-sm font-semibold
              ${
                currentPage === i + 1
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "bg-white border hover:bg-gray-100"
              }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* ===== Modal ===== */}
      {editing && (
        <EditModal
          form={form}
          setForm={setForm}
          onClose={() => setEditing(null)}
          onSave={saveEdit}
        />
      )}
    </div>
  );
}

/* ================= MODAL ================= */
function EditModal({ form, setForm, onClose, onSave }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className=" bg-white p-6 rounded rounded-2xl shadow w-96 w-full max-w-4xl">
        <div className="bg-gradient-to-r from-indigo-600 to-pink-500 p-6 mb-4 rounded-2xl text-white">
          <h2 className="text-lg font-bold">تعديل طلب التسجيل</h2>
        </div>

        {["preferred_days", "preferred_time", "status"].map((field) => (
          <select
            key={field}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="w-full border rounded-xl p-2 mb-3"
          >
            {field === "preferred_days" &&
              Object.entries(DAYS_OPTIONS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}

            {field === "preferred_time" &&
              Object.entries(TIME_OPTIONS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}

            {field === "status" && (
              <>
                <option value="pending">قيد الانتظار</option>
                <option value="confirmed">مقبول</option>
                <option value="cancelled">ملغي</option>
              </>
            )}
          </select>
        ))}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-full"
          >
            إلغاء
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-full"
          >
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= TOAST ================= */
function Toast({ message }: { message: string }) {
  return (
    <div className="fixed top-6 right-6 bg-black text-white px-4 py-2 rounded-full shadow z-50">
      {message}
    </div>
  );
}

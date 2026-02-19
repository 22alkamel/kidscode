"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import api from "@/lib/api";
import AddUserModal from "@/components/AddUserModal";
import EditUserModal from "@/components/EditUserModal";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

export default function UsersPage() {
  const { data, mutate } = useSWR("/admin/users", (url) =>
    api.get(url).then((res) => res.data)
  );

  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [filterRole, setFilterRole] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

     const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "";
  /* ===== Filter + Search ===== */
  const filteredUsers = useMemo(() => {
    if (!data?.data) return [];

    let users = data.data;

    if (filterRole) {
      users = users.filter((u: any) => u.role === filterRole);
    }

    if (search) {
      users = users.filter(
        (u: any) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    return users;
  }, [data, filterRole, search]);

  /* ===== Pagination ===== */
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-indigo-900">
            👥 إدارة المستخدمين
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            التحكم الكامل بحسابات المستخدمين
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto px-6 py-3 rounded-full
                     bg-gradient-to-r from-blue-500 to-purple-600
                     text-white font-semibold shadow hover:scale-105 transition"
        >
          + إضافة مستخدم
        </button>
      </div>

      {/* ===== Filters ===== */}
      <div className="bg-white rounded-2xl p-4 shadow flex flex-col sm:flex-row gap-3 sm:gap-4">

        <input
          type="text"
          placeholder="🔍 بحث بالاسم أو الإيميل"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm w-full sm:w-64
                     focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <select
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm w-full sm:w-auto"
          value={filterRole}
          onChange={(e) => {
            setFilterRole(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">كل الأدوار</option>
          <option value="student">طالب</option>
          <option value="trainer">مدرب</option>
          <option value="admin">أدمن</option>
        </select>

        <select
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm w-full sm:w-auto"
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

      {/* ================= TABLE (Desktop) ================= */}
      <div className="hidden lg:block bg-white rounded-3xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4">الصورة</th>
                <th className="p-4">الاسم</th>
                <th className="p-4">الإيميل</th>
                <th className="p-4">الدور</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">OTP</th>
                <th className="p-4">التحكم</th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.map((user: any) => (
                <tr key={user.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4">
                    <img
                      src={
                        user.avatar
                          ? `${backendUrl}/storage/${user.avatar}`
                          : "/default.png"
                      }
                      className="w-10 h-10 rounded-full border"
                    />
                  </td>

                  <td className="p-4 font-semibold">{user.name}</td>
                  <td className="p-4 text-gray-600">{user.email}</td>

                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs
                      ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="p-4 text-xs">
                    {user.otp_verified ? "✓ محقق" : "✗ غير محقق"}
                  </td>

                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => setEditUser(user)}
                      className="px-4 py-2 rounded-full text-xs bg-yellow-100 text-yellow-700"
                    >
                      تعديل
                    </button>

                    <button
                      onClick={async () => {
                        if (!confirm("هل تريد حذف هذا المستخدم؟")) return;
                        await api.delete(`/admin/users/${user.id}`);
                        mutate();
                      }}
                      className="px-4 py-2 rounded-full text-xs bg-red-100 text-red-600"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= CARDS (Mobile) ================= */}
      <div className="lg:hidden space-y-4">
        {paginatedUsers.map((user: any) => (
          <div
            key={user.id}
            className="bg-white rounded-2xl p-4 shadow flex gap-4"
          >
            <img
              src={
                user.avatar
                  ? `${backendUrl}/storage/${user.avatar}`
                  : "/default.png"
              }
              className="w-14 h-14 rounded-full border"
            />

            <div className="flex-1 space-y-1">
              <h3 className="font-bold text-indigo-900">{user.name}</h3>
              <p className="text-xs text-gray-500">{user.email}</p>

              <div className="flex flex-wrap gap-2 text-xs mt-2">
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  {user.role}
                </span>

                <span
                  className={`px-2 py-1 rounded-full
                    ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {user.status}
                </span>

                <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                  {user.otp_verified ? "OTP ✓" : "OTP ✗"}
                </span>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setEditUser(user)}
                  className="flex-1 py-2 rounded-full text-xs bg-yellow-100 text-yellow-700"
                >
                  تعديل
                </button>

                <button
                  onClick={async () => {
                    if (!confirm("هل تريد حذف هذا المستخدم؟")) return;
                    await api.delete(`/admin/users/${user.id}`);
                    mutate();
                  }}
                  className="flex-1 py-2 rounded-full text-xs bg-red-100 text-red-600"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Pagination ===== */}
      <div className="flex flex-wrap justify-center gap-2">
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

      {/* ===== Modals ===== */}
      {showModal && (
        <AddUserModal onClose={() => setShowModal(false)} mutate={mutate} />
      )}

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          mutate={mutate}
        />
      )}
    </div>
  );
}

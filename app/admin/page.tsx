"use client";

import useUser from "@/hooks/useUser";

export default function AdminHome() {
  const user = useUser();

  if (!user)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        جاري التحميل...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* ===== Welcome Card ===== */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-5 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-lg gap-4">
          <div className="text-center md:text-right">
            <h1 className="text-xl sm:text-3xl font-extrabold mb-2">
              مرحبًا {user.name} 👋
            </h1>
            <p className="opacity-90 text-sm sm:text-base">
              سعداء بعودتك، هذه لوحة التحكم الخاصة بك
            </p>
          </div>

          <img
            src="/logoo.png"
            alt="Dashboard"
            className="hidden md:block w-24 lg:w-32"
          />
        </div>

        {/* ===== User Info Card ===== */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <img
            src={
              user.avatar
                ? `http://localhost:8000/storage/${user.avatar}`
                : "/default.png"
            }
            alt="Avatar"
            className="w-20 h-20 rounded-full border-4 border-purple-200"
          />

          <div className="text-center sm:text-right">
            <h2 className="text-lg sm:text-xl font-bold text-indigo-900">
              {user.name}
            </h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              الدور:{" "}
              <span className="font-semibold text-purple-600">
                {user.role}
              </span>
            </p>
          </div>
        </div>

        {/* ===== Stats Cards ===== */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { title: "البرامج", value: 12, color: "from-blue-500 to-blue-600" },
            { title: "المسارات", value: 34, color: "from-purple-500 to-purple-600" },
            { title: "الطلاب", value: 120, color: "from-pink-500 to-pink-600" },
            { title: "المدربين", value: 8, color: "from-indigo-500 to-indigo-600" },
          ].map((item, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${item.color} text-white rounded-2xl p-4 sm:p-5 shadow-md`}
            >
              <p className="text-xs sm:text-sm opacity-80">{item.title}</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-2">
                {item.value}
              </h3>
            </div>
          ))}
        </div>

        {/* ===== Quick Actions ===== */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md">
          <h3 className="text-base sm:text-lg font-bold text-indigo-900 mb-4">
            إجراءات سريعة
          </h3>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:scale-105 transition">
              إضافة برنامج
            </button>

            <button className="w-full sm:w-auto px-6 py-3 rounded-full border border-purple-300 text-purple-600 font-semibold hover:bg-purple-50 transition">
              إدارة المستخدمين
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

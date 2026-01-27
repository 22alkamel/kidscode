"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type TabType = "general" | "guardian" | "security";

export default function EditProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>({});
  const [tab, setTab] = useState<TabType>("general");

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // جلب بيانات المستخدم عند تحميل الصفحة
  useEffect(() => {
    api.get("/profile").then((res) => {
      const userData = res.data.user;
      setUser(userData);
      setProfile(res.data.profile || {});
      // إضافة timestamp لتحديث الصورة فورياً وتجاوز cache
      setAvatarPreview(
        userData.avatar ? `${userData.avatar}?t=${new Date().getTime()}` : null
      );
    });
  }, []);

  const handleProfileChange = (e: any) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    // عرض الصورة المختارة مباشرة قبل رفعها
    setAvatarPreview(URL.createObjectURL(file));
  };

  const saveProfile = async () => {
    try {
      setSaving(true);

      // تحديث البيانات العامة
      await api.put("/profile", profile);

      // رفع الصورة
      if (avatarFile) {
        const form = new FormData();
        form.append("avatar", avatarFile);
        const res = await api.post("/profile/avatar", form);

        // تحديث الصورة مباشرة مع إضافة timestamp لتجاوز cache
        const newAvatar = res.data.avatar + "?t=" + new Date().getTime();
        setUser((prev: any) => ({ ...prev, avatar: newAvatar }));
        setAvatarPreview(newAvatar);
      }

      // تغيير كلمة المرور (إن وجد)
      if (tab === "security" && passwords.new_password) {
        await api.put("/profile/change-password", {
          current_password: passwords.current_password,
          new_password: passwords.new_password,
          new_password_confirmation: passwords.new_password_confirmation,
        });
      }

      setToast("✅ تم تحديث الملف الشخصي بنجاح");
      setTimeout(() => {
        setToast(null);
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <p className="p-6">جاري التحميل...</p>;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-100 to-pink-100 flex justify-center p-4 sm:p-6"
      dir="rtl"
    >
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-pink-500 p-6 text-white flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div className="relative">
            <img
              src={
                user?.avatar
                  ? `http://localhost:8000${user.avatar}`
                  : "/default.jpg"
              }
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-white text-indigo-600 text-xs px-2 py-1 rounded-full cursor-pointer shadow">
              ✏️
              <input type="file" hidden onChange={handleAvatarChange} />
            </label>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-sm opacity-90">تعديل الملف الشخصي</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b text-sm overflow-x-auto">
          <Tab
            label="👤 المعلومات العامة"
            active={tab === "general"}
            onClick={() => setTab("general")}
          />
          {user.role !== "trainer" && (
            <Tab
              label="👨‍👩‍👧 ولي الأمر"
              active={tab === "guardian"}
              onClick={() => setTab("guardian")}
            />
          )}
          <Tab
            label="🔐 الأمان"
            active={tab === "security"}
            onClick={() => setTab("security")}
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {tab === "general" && (
            <>
              <Input label="الاسم" value={user.name} disabled />
              <Input
                label="العمر"
                name="age"
                value={profile.age || ""}
                onChange={handleProfileChange}
              />
              <Input
                label="المدرسة"
                name="school"
                value={profile.school || ""}
                onChange={handleProfileChange}
              />
              <Input
                label="الصف"
                name="grade"
                value={profile.grade || ""}
                onChange={handleProfileChange}
              />
            </>
          )}

          {tab === "guardian" && (
            <>
              <Input
                label="اسم ولي الأمر"
                name="guardian_name"
                value={profile.guardian_name || ""}
                onChange={handleProfileChange}
              />
              <Input
                label="رقم ولي الأمر"
                name="guardian_phone"
                value={profile.guardian_phone || ""}
                onChange={handleProfileChange}
              />
            </>
          )}

          {tab === "security" && (
            <>
              <Input
                type="password"
                label="كلمة المرور الحالية"
                value={passwords.current_password}
                onChange={(e: any) =>
                  setPasswords({
                    ...passwords,
                    current_password: e.target.value,
                  })
                }
              />
              <Input
                type="password"
                label="كلمة المرور الجديدة"
                value={passwords.new_password}
                onChange={(e: any) =>
                  setPasswords({ ...passwords, new_password: e.target.value })
                }
              />
              <Input
                type="password"
                label="تأكيد كلمة المرور"
                value={passwords.new_password_confirmation}
                onChange={(e: any) =>
                  setPasswords({
                    ...passwords,
                    new_password_confirmation: e.target.value,
                  })
                }
              />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 bg-gray-50">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 rounded-lg bg-gray-200 w-full sm:w-auto"
          >
            إلغاء
          </button>
          <button
            onClick={saveProfile}
            disabled={saving}
            className="px-10 py-2 rounded-lg bg-indigo-600 text-white font-semibold w-full sm:w-auto hover:bg-indigo-700 transition"
          >
            {saving ? "جاري الحفظ..." : "💾 حفظ التعديلات"}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 sm:right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg transition">
          {toast}
        </div>
      )}
    </div>
  );
}

/* Components */
function Tab({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-semibold border-b-2 transition whitespace-nowrap ${
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
      <label className="block text-sm text-gray-500 mb-1">{label}</label>
      <input
        {...props}
        className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
      />
    </div>
  );
}

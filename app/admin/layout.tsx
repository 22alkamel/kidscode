import RoleGuard from "@/components/guards/RoleGuard";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allow={["admin"]}>
      <div className="min-h-screen bg-gray-100" dir="rtl">

        <Sidebar />

        {/* Content */}
        <main className="pt-16 lg:pt-0 p-4 sm:p-6 lg:mr-64">
          {children}
        </main>

      </div>
    </RoleGuard>
  );
}

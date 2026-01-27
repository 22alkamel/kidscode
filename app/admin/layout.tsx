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
        
        {/* Sidebar */}
        <Sidebar />

        {/* Content */}
        <main className="mr-64 p-6">
          {children}
        </main>

      </div>
    </RoleGuard>
  );
}

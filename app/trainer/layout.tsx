import RoleGuard from "@/components/guards/RoleGuard";

export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allow={["trainer"]}>
      {children}
    </RoleGuard>
  );
}

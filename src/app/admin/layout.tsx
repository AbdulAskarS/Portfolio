import { AdminLayout } from "@/features/admin/components/AdminLayout";

export const metadata = {
  title: "Admin Panel | Portfolio Settings",
  description: "Secure administration page for updating portfolio showcase data.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

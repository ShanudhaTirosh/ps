import AdminGuard from '@/components/admin/AdminGuard';
import DashboardClient from '@/components/admin/DashboardClient';

export default function DashboardPage() {
  return (
    <AdminGuard>
      <DashboardClient />
    </AdminGuard>
  );
}

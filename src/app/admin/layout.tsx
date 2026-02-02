'use client';

import { AdminHeader, Navigation } from '@/components/molecules';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireRole="admin" loginPath="/merchant/login">
      <Navigation />
      <AdminHeader />
      {children}
    </AuthGuard>
  );
}
'use client';

import { AdminHeader, Navigation } from '@/components/molecules';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function MerchantAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireRole="merchant" loginPath="/merchant/login">
      <Navigation />
      <AdminHeader />
      {children}
    </AuthGuard>
  );
}
'use client';

import { AdminHeader, Navigation } from '@/components/molecules';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { TourProvider } from '@/contexts/TourContext';
import { HelpButton } from '@/components/atoms';

export default function MerchantAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireRole="merchant" loginPath="/merchant/login">
      <TourProvider>
        <Navigation />
        <AdminHeader />
        {children}
        <HelpButton />
      </TourProvider>
    </AuthGuard>
  );
}
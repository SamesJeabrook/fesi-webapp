import { AdminHeader, Navigation } from '@/components/molecules';

export default function MerchantAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <Navigation />
        <AdminHeader />
        {children}
    </>
  );
}
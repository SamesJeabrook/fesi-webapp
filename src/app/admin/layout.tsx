import { AdminHeader, Navigation } from '@/components/molecules';

export default function AdminLayout({
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
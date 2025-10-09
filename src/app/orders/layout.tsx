import type { Metadata } from 'next';
import { fontVariables } from '@/styles/fonts';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Order Status - Fesi',
  description: 'Track your order status in real-time',
  robots: 'noindex, nofollow', // Don't index public order displays
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <div style={{ 
          minHeight: '100vh',
          background: 'var(--color-background)',
          fontFamily: 'var(--font-sans)'
        }}>
          {children}
        </div>
      </body>
    </html>
  );
}
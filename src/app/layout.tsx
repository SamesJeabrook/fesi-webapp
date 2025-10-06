import type { Metadata, Viewport } from 'next';
import { fontVariables } from '@/styles/fonts';
import AuthProvider from '@/components/providers/AuthProvider';
import Navigation from '@/components/auth/Navigation';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Fesi - Food Ordering Platform',
  description: 'Order food from your favorite local restaurants',
  keywords: ['food delivery', 'restaurant', 'ordering', 'takeaway'],
  authors: [{ name: 'James Seabrook' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <AuthProvider>
          <Navigation />
          <div id="root">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

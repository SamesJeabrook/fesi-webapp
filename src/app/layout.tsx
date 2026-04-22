import type { Metadata, Viewport } from 'next';
import { fontVariables } from '@/styles/fonts';
import AuthProvider from '@/components/providers/AuthProvider';
import { AdminProvider } from '@/components/providers/AdminProvider';
import { NotificationProvider } from '@/contexts/NotificationContext';
import CsrfInit from '@/components/providers/CsrfProvider';
import CookieBanner from '@/components/molecules/CookieBanner';
import '@/styles/globals.scss';
import 'mapbox-gl/dist/mapbox-gl.css';

export const metadata: Metadata = {
  title: 'Fesi - Food Ordering Platform',
  description: 'Order food from your favorite local restaurants',
  keywords: ['food delivery', 'restaurant', 'ordering', 'takeaway'],
  authors: [{ name: 'James Seabrook' }],
  manifest: '/manifest.json',
  themeColor: '#6366f1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Fesi',
  },
  openGraph: {
    title: 'Fesi - Food Ordering Platform',
    description: 'Order food from your favorite local restaurants',
    images: [
      {
        url: '/images/Fesi-logo.png',
        width: 1200,
        height: 630,
        alt: 'Fesi Logo',
      },
    ],
    siteName: 'Fesi',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fesi - Food Ordering Platform',
    description: 'Order food from your favorite local restaurants',
    images: ['/images/Fesi-logo.png'],
  },
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
          <AdminProvider>
            <NotificationProvider>
              <CsrfInit />
              <div id="root">
                {children}
              </div>
              <CookieBanner />
            </NotificationProvider>
          </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

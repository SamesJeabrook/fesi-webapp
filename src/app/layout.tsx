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
  themeColor: '#FF6B35',
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/icons/apple-icon-57x57.png', sizes: '57x57', type: 'image/png' },
      { url: '/icons/apple-icon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/icons/apple-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/icons/apple-icon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/icons/apple-icon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/icons/apple-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/icons/apple-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/icons/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome', url: '/icons/android-icon-192x192.png', sizes: '192x192' },
      { rel: 'icon', url: '/icons/android-icon-36x36.png', sizes: '36x36' },
      { rel: 'icon', url: '/icons/android-icon-48x48.png', sizes: '48x48' },
      { rel: 'icon', url: '/icons/android-icon-72x72.png', sizes: '72x72' },
      { rel: 'icon', url: '/icons/android-icon-96x96.png', sizes: '96x96' },
      { rel: 'icon', url: '/icons/android-icon-144x144.png', sizes: '144x144' },
    ],
  },
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

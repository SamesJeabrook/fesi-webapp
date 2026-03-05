import { Metadata } from 'next';

interface Props {
  params: Promise<{
    merchantId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Await params in Next.js 15
  const { merchantId } = await params;
  
  // You could fetch merchant data here for dynamic metadata
  // For now, using static metadata with Fesi logo
  
  return {
    title: 'Fesi - Complete menu and ordering experience',
    description: 'Point of sales and order management system',
    openGraph: {
      title: 'Fesi - Complete menu and ordering experience',
      description: 'Point of sales and order management system',
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
      title: 'Fesi - Complete menu and ordering experience',
      description: 'Point of sales and order management system',
      images: ['/images/Fesi-logo.png'],
    },
  };
}

export default function DisplayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

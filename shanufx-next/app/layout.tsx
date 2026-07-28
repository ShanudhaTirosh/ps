import type { Metadata } from 'next';
import '@/styles/globals.css';
import '@/styles/admin.css';
import { AuthProvider } from '@/lib/context/AuthContext';
import RightClickProtector from '@/components/layout/RightClickProtector';
import AdBlockDetector from '@/components/layout/AdBlockDetector';
import ParticleCanvasWrapper from '@/components/layout/ParticleCanvasWrapper';
import ConsoleWarning from '@/components/layout/ConsoleWarning';
import JsonLd from '@/components/seo/JsonLd';
import MaintenanceGuard from '@/components/layout/MaintenanceGuard';

export const metadata: Metadata = {
  title: {
    default: 'Shanudha Tirosh — Full-Stack Developer & System Innovator',
    template: '%s | Shanudha Tirosh',
  },
  description: 'Shanudha Tirosh - Full-Stack Developer specializing in Web & Desktop Development, Android Systems, IoT Solutions, and Hosting Platforms. Operating under the SHANUTECHX brand from Sri Lanka.',
  keywords: ['Shanudha Tirosh', 'SHANUTECHX', 'SHANUFX', 'ShanuFx', 'Full-Stack Developer', 'Web Development', 'Desktop Development', 'Android System Developer', 'IoT Solutions', 'Hosting Platform', 'Developer Portfolio', 'React', 'Firebase', 'Web Developer Sri Lanka', 'Cloud Hosting'],
  authors: [{ name: 'Shanudha Tirosh', url: 'https://www.linkedin.com/in/shanudhatirosh/' }],
  metadataBase: new URL('https://info.shanutechx.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'si-LK': '/si-LK',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'SHANUTECHX Portfolio',
    title: 'Shanudha Tirosh — Full-Stack Developer & Hosting Platform',
    description: 'Shanudha Tirosh - Full-Stack Developer building Web & Desktop Applications, Android Systems, IoT Solutions, and comprehensive Hosting Services under the SHANUTECHX brand.',
    url: 'https://info.shanutechx.com/',
    emails: ['info@shanutechx.com', 'info.shanudhatirosh@gmail.com'],
    phoneNumbers: ['+94765749332'],
    countryName: 'Sri Lanka',
    images: [
      {
        url: '/assets/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Shanudha Tirosh — SHANUTECHX Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ShanuFx',
    creator: '@ShanuFx',
    title: 'Shanudha Tirosh — Full-Stack Developer & Hosting Platform',
    description: 'Full-Stack Developer creating Web & Desktop Apps, Android Systems, IoT Solutions, and Hosting Services under SHANUTECHX from Sri Lanka.',
    images: ['/assets/og-image.webp'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SHANUTECHX',
  },
  verification: {
    google: 'google674d98d6ab0d9910',
  },
  category: 'technology',
  classification: 'Portfolio, Technology, Software Development',
  creator: 'Shanudha Tirosh',
  publisher: 'Shanudha Tirosh - SHANUTECHX',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  other: {
    'geo.region': 'LK-11',
    'geo.placename': 'Ambalangoda, Sri Lanka',
    'geo.position': '6.2341;80.0523',
    'ICBM': '6.2341, 80.0523',
    'color-scheme': 'dark light',
    'MobileOptimized': '375',
  },
  icons: {
    icon: [
      { url: '/assets/img/favicon-48.png', sizes: '48x48' },
      { url: '/assets/img/favicon-96.png', sizes: '96x96' },
    ],
    apple: '/assets/img/apple-touch-icon.png',
    shortcut: '/assets/img/icon.ico',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <meta name="google-site-verification" content="google674d98d6ab0d9910" />
        <link rel="author" href="/humans.txt" />
        <link rel="security" href="/.well-known/security.txt" />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <MaintenanceGuard>
            <RightClickProtector>
              <AdBlockDetector>
                <ConsoleWarning />
                <JsonLd />
                <div className="bg-noise" />
                <div className="grid-bg" />
                <ParticleCanvasWrapper />
                {children}
              </AdBlockDetector>
            </RightClickProtector>
          </MaintenanceGuard>
        </AuthProvider>
      </body>
    </html>
  );
}

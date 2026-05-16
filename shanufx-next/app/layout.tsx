import type { Metadata } from 'next';
import '@/styles/globals.css';
import '@/styles/admin.css';
import { AuthProvider } from '@/lib/context/AuthContext';
import RightClickProtector from '@/components/layout/RightClickProtector';
import AdBlockDetector from '@/components/layout/AdBlockDetector';
import ParticleCanvasWrapper from '@/components/layout/ParticleCanvasWrapper';
import ConsoleWarning from '@/components/layout/ConsoleWarning';
export const metadata: Metadata = {
  title: {
    default: 'ShanuFx — Developer Portfolio',
    template: '%s | ShanuFx',
  },
  description: 'Full-Stack Developer, Android Innovator & IoT Engineer from Sri Lanka. Building high-performance tools and platforms.',
  keywords: ['ShanuFx', 'Shanudha Tirosh', 'Developer Portfolio', 'Full-Stack', 'Android', 'IoT', 'React', 'Firebase'],
  authors: [{ name: 'Shanudha Tirosh' }],
  metadataBase: new URL('https://shanudhatirosh.github.io'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'ShanuFx Portfolio',
    images: [{ url: '/assets/og-image.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
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
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <RightClickProtector>
            <AdBlockDetector>
              <ConsoleWarning />
              <div className="bg-noise" />
              <div className="grid-bg" />
              <ParticleCanvasWrapper />
              {children}
            </AdBlockDetector>
          </RightClickProtector>
        </AuthProvider>
      </body>
    </html>
  );
}

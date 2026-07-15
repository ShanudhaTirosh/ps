import type { Metadata } from 'next';
import '../styles/globals.css';
import { AuthProvider } from '@/lib/context/AuthContext';
import { UIProvider } from '@/lib/context/UIContext';
import NotificationTracker from '@/components/layout/NotificationTracker';

export const metadata: Metadata = {
  title: 'ShanuFx Community',
  description: 'Developer community platform by ShanuFx — forum, real-time chat, and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning>
        <div className="bg-noise" />
        <div className="grid-bg" />
        <UIProvider>
          <AuthProvider>
            <NotificationTracker />
            {children}
          </AuthProvider>
        </UIProvider>
      </body>
    </html>
  );
}

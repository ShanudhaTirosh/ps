import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TestimonialsClient from '@/components/testimonials/TestimonialsClient';

export const metadata: Metadata = {
  title: 'Testimonials',
  description: 'Read what clients and collaborators say about working with Shanudha Tirosh (SHANUTECHX / SHANUFX), or share your own experience.',
  keywords: ['Client Reviews', 'Testimonials', 'SHANUTECHX Reviews', 'Developer Feedback', 'Portfolio Reviews'],
  authors: [{ name: 'Shanudha Tirosh', url: 'https://www.linkedin.com/in/shanudhatirosh/' }],
  openGraph: {
    title: 'SHANUTECHX Testimonials | Shanudha Tirosh',
    description: 'Community feedback and testimonials for Shanudha Tirosh (SHANUTECHX / SHANUFX).',
    url: 'https://info.shanutechx.com/testimonials',
    type: 'website',
    images: [
      { 
        url: '/assets/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'SHANUTECHX Client Testimonials'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHANUTECHX Testimonials | Shanudha Tirosh',
    description: 'Community feedback and testimonials for Shanudha Tirosh.',
    images: ['/assets/og-image.webp'],
  },
  alternates: {
    canonical: '/testimonials',
  },
};

export const revalidate = 300;

export default function TestimonialsPage() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content-pt">
        <div className="container-1100">
          <TestimonialsClient />
        </div>
      </main>
      <Footer />
    </div>
  );
}

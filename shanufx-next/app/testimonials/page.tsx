import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TestimonialsClient from '@/components/testimonials/TestimonialsClient';

export const metadata: Metadata = {
  title: 'Testimonials',
  description: 'Read what clients and collaborators say about working with Shanudha Tirosh (SHANUTECHX / SHANUFX), or share your own experience.',
  openGraph: {
    title: 'SHANUTECHX Testimonials | Shanudha Tirosh',
    description: 'Community feedback and testimonials for Shanudha Tirosh (SHANUTECHX / SHANUFX).',
    images: [{ url: '/assets/img/og-index.webp' }],
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

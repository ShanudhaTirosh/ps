import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TestimonialsClient from '@/components/testimonials/TestimonialsClient';

export const metadata: Metadata = {
  title: 'Testimonials',
  description: 'Read what clients and collaborators say about working with ShanuFx, or share your own experience.',
  openGraph: {
    title: 'ShanuFx Testimonials',
    description: 'Community feedback and testimonials for ShanuFx.',
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

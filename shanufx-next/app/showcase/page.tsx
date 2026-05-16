import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ShowcaseClient from '@/components/showcase/ShowcaseClient';

export const metadata: Metadata = {
  title: 'Showcase',
  description: 'Browse the full collection of ShanuFx projects — Android tools, web platforms, IoT solutions, and more.',
  openGraph: {
    title: 'ShanuFx Showcase',
    description: 'A curated collection of projects spanning Android, IoT, full-stack, and bot development.',
    images: [{ url: '/assets/img/og-showcase.webp' }],
  },
};

export const revalidate = 300;

export default function ShowcasePage() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content-showcase">
        <div className="container-1200">
          <ShowcaseClient />
        </div>
      </main>
      <Footer />
    </div>
  );
}

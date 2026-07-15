import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ShowcaseClient from '@/components/showcase/ShowcaseClient';

export const metadata: Metadata = {
  title: 'Showcase',
  description: 'Browse the full collection of SHANUTECHX projects — Android tools, web platforms, IoT solutions, and more by Shanudha Tirosh.',
  openGraph: {
    title: 'SHANUTECHX Showcase | Shanudha Tirosh',
    description: 'A curated collection of projects by Shanudha Tirosh spanning Android, IoT, full-stack, and bot development under SHANUTECHX and SHANUFX.',
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

import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ShowcaseClient from '@/components/showcase/ShowcaseClient';

export const metadata: Metadata = {
  title: 'Showcase',
  description: 'Browse the full collection of SHANUTECHX projects — Android tools, web platforms, IoT solutions, and more by Shanudha Tirosh.',
  keywords: ['SHANUTECHX Projects', 'Portfolio', 'Android Apps', 'IoT Solutions', 'Web Development', 'NovaMesh', 'NovaNetX', 'SocialGrab'],
  authors: [{ name: 'Shanudha Tirosh', url: 'https://www.linkedin.com/in/shanudhatirosh/' }],
  openGraph: {
    title: 'SHANUTECHX Showcase | Shanudha Tirosh',
    description: 'A curated collection of projects by Shanudha Tirosh spanning Android, IoT, full-stack, and bot development under SHANUTECHX and SHANUFX.',
    url: 'https://info.shanutechx.com/showcase',
    type: 'website',
    images: [
      { 
        url: '/assets/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'SHANUTECHX Project Showcase'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHANUTECHX Showcase | Shanudha Tirosh',
    description: 'A curated collection of projects by Shanudha Tirosh spanning Android, IoT, full-stack, and bot development.',
    images: ['/assets/og-image.webp'],
  },
  alternates: {
    canonical: '/showcase',
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

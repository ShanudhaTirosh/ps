import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config/seo';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
}

/**
 * Generate comprehensive SEO metadata for pages
 * @param props - SEO configuration for the page
 * @returns Metadata object for Next.js
 */
export function generateSEO(props: SEOProps = {}): Metadata {
  const {
    title = siteConfig.title,
    description = siteConfig.description,
    image = siteConfig.ogImage,
    path = '',
    noIndex = false,
  } = props;

  const url = `${siteConfig.url}${path}`;
  const imageUrl = image.startsWith('http') ? image : `${siteConfig.url}${image}`;

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: path || '/',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@ShanuFx',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Generate breadcrumb structured data
 * @param items - Array of breadcrumb items
 * @returns JSON-LD structured data
 */
export function generateBreadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

/**
 * Generate article structured data
 * @param article - Article metadata
 * @returns JSON-LD structured data
 */
export function generateArticleStructuredData(article: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: `${siteConfig.url}${article.image}`,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Person',
      name: siteConfig.creator.name,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/assets/img/favicon-96.png`,
      },
    },
  };
}

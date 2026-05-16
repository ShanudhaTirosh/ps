import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://shanu-fx.web.app';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/showcase', '/testimonials'],
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

/**
 * SEO Configuration for SHANUTECHX Portfolio
 * Contact: info@shanutechx.com
 * Phone: +94765749332
 */

export const siteConfig = {
  name: 'SHANUTECHX',
  title: 'Shanudha Tirosh — Full-Stack Developer & System Innovator',
  description: 'Shanudha Tirosh - Full-Stack Developer building Web & Desktop Applications, Android Systems, IoT Solutions, and comprehensive Hosting Services under the SHANUTECHX brand.',
  url: 'https://info.shanutechx.com',
  ogImage: '/assets/og-image.webp',
  links: {
    linkedin: 'https://www.linkedin.com/in/shanudhatirosh/',
    github: 'https://github.com/ShanudhaTirosh',
    facebook: 'https://www.facebook.com/tirosh.shanudha',
    instagram: 'https://www.instagram.com/shanudha_tirosh/',
    whatsapp: 'https://wa.me/94765749332',
  },
  contact: {
    email: 'info@shanutechx.com',
    phone: '+94765749332',
    location: 'Ambalangoda, Sri Lanka',
  },
  creator: {
    name: 'Shanudha Tirosh',
    role: 'Full-Stack Developer & System Innovator',
    company: 'SHANUTECHX',
  },
};

/**
 * Platform-specific OG image configurations
 */
export const ogImageSizes = {
  facebook: {
    width: 1200,
    height: 630,
    description: 'Facebook, LinkedIn, Twitter Large Card',
  },
  twitter: {
    width: 1200,
    height: 675,
    description: 'Twitter/X Summary Large Image',
  },
  instagram: {
    width: 1080,
    height: 1080,
    description: 'Instagram Square Post',
  },
  linkedin: {
    width: 1200,
    height: 627,
    description: 'LinkedIn Shared Post',
  },
  whatsapp: {
    width: 400,
    height: 400,
    description: 'WhatsApp Link Preview',
  },
};

/**
 * Structured data for different page types
 */
export const structuredData = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/assets/img/favicon-96.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.contact.phone,
      contactType: 'Customer Service',
      email: siteConfig.contact.email,
      availableLanguage: ['English', 'Sinhala'],
    },
    sameAs: Object.values(siteConfig.links),
  },
  person: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.creator.name,
    jobTitle: siteConfig.creator.role,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    url: siteConfig.url,
    sameAs: Object.values(siteConfig.links),
  },
};

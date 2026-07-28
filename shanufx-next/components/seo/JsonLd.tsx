import Script from 'next/script';

export default function JsonLd() {
  const schemas = [
    // WebSite
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'SHANUTECHX Portfolio',
      alternateName: 'Shanudha Tirosh (SHANUTECHX / SHANUFX) Portfolio',
      url: 'https://info.shanutechx.com/',
      description: 'Official portfolio of Shanudha Tirosh, Full-Stack Developer operating the SHANUTECHX brand — specializing in Web & Desktop Development, Android Systems, IoT Engineering, and Hosting Platforms from Sri Lanka.',
      inLanguage: 'en',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://info.shanutechx.com/?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    // Person
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Shanudha Tirosh',
      alternateName: ['SHANUTECHX', 'SHANUFX', 'ShanuFx'],
      url: 'https://info.shanutechx.com/',
      image: {
        '@type': 'ImageObject',
        url: 'https://info.shanutechx.com/assets/og-image.webp',
        width: 1200,
        height: 630,
      },
      jobTitle: 'Full-Stack Developer & System Innovator',
      description: 'Full-Stack Developer specializing in Web & Desktop Development, Android System Internals, IoT Automation, and hosting platforms. Building comprehensive solutions under the SHANUTECHX brand.',
      email: 'info@shanutechx.com',
      telephone: '+94765749332',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ambalangoda',
        addressRegion: 'Southern Province',
        addressCountry: 'LK',
      },
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'G/Dharmashoka College, Ambalangoda',
      },
      nationality: {
        '@type': 'Country',
        name: 'Sri Lanka',
      },
      knowsAbout: [
        'Full-Stack Web Development',
        'Desktop Application Development',
        'Android System Development',
        'IoT Automation',
        'Hosting Platform Management',
        'WhatsApp Bot Development',
        'Firebase',
        'Node.js',
        'Python',
        'React',
        'Network Optimization',
        'VPN Platform Engineering',
        'Cloud Hosting',
        'DevOps',
      ],
      knowsLanguage: ['en', 'si'],
      sameAs: [
        'https://www.linkedin.com/in/shanudhatirosh/',
        'https://github.com/ShanudhaTirosh',
        'https://www.facebook.com/tirosh.shanudha',
        'https://www.instagram.com/shanudha_tirosh/',
        'https://wa.me/94765749332',
      ],
    },
    // Organization
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SHANUTECHX',
      alternateName: ['SHANUFX', 'ShanuFx', 'Shanudha Tirosh', 'Netch Solutions'],
      url: 'https://info.shanutechx.com/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://info.shanutechx.com/assets/img/favicon-96.png',
        width: 96,
        height: 96,
      },
      founder: {
        '@type': 'Person',
        name: 'Shanudha Tirosh',
        url: 'https://info.shanutechx.com/',
      },
      foundingDate: '2023',
      foundingLocation: {
        '@type': 'Place',
        name: 'Ambalangoda, Sri Lanka',
      },
      description: 'Full-service software development and hosting platform offering Web Development, Desktop Applications, Android System Development, IoT Solutions, and comprehensive hosting services.',
      areaServed: ['Sri Lanka', 'Worldwide'],
      email: 'info@shanutechx.com',
      telephone: '+94765749332',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ambalangoda',
        addressRegion: 'Southern Province',
        addressCountry: 'LK',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+94765749332',
        contactType: 'Customer Service',
        email: 'info@shanutechx.com',
        availableLanguage: ['English', 'Sinhala'],
      },
      sameAs: [
        'https://github.com/ShanudhaTirosh',
        'https://www.linkedin.com/in/shanudhatirosh/',
        'https://www.facebook.com/tirosh.shanudha',
        'https://www.instagram.com/shanudha_tirosh/',
        'https://wa.me/94765749332',
      ],
    },
    // BreadcrumbList
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://info.shanutechx.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Projects',
          item: 'https://info.shanutechx.com/#projects',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Contact',
          item: 'https://info.shanutechx.com/#contact',
        },
      ],
    },
    // ProfilePage
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: 'Shanudha Tirosh — Full-Stack Developer Portfolio',
      url: 'https://info.shanutechx.com/',
      dateCreated: '2023-01-01T00:00:00+05:30',
      dateModified: new Date().toISOString(),
      inLanguage: 'en',
      isPartOf: {
        '@type': 'WebSite',
        name: 'SHANUTECHX Portfolio',
        url: 'https://info.shanutechx.com/',
      },
      mainEntity: {
        '@type': 'Person',
        name: 'Shanudha Tirosh',
        alternateName: ['SHANUTECHX', 'SHANUFX', 'ShanuFx'],
        url: 'https://info.shanutechx.com/',
        jobTitle: 'Full-Stack Developer & System Innovator',
        worksFor: {
          '@type': 'Organization',
          name: 'SHANUTECHX',
        },
      },
    },
  ];

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={index}
          id={`json-ld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          strategy="worker" // Load in the background to not block main thread
        />
      ))}
    </>
  );
}

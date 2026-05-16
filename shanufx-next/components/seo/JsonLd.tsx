import Script from 'next/script';

export default function JsonLd() {
  const schemas = [
    // WebSite
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'ShanuFx Portfolio',
      alternateName: 'Shanudha Tirosh Portfolio',
      url: 'https://shanu-fx.web.app/',
      description: 'Official portfolio of Shanudha Tirosh (ShanuFx) — Android System Developer & IoT Engineer from Sri Lanka.',
      inLanguage: 'en',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://shanu-fx.web.app/?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    // Person
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Shanudha Tirosh',
      alternateName: 'ShanuFx',
      url: 'https://shanu-fx.web.app/',
      image: {
        '@type': 'ImageObject',
        url: 'https://shanu-fx.web.app/assets/og-image.webp',
        width: 1200,
        height: 630,
      },
      jobTitle: 'Android System Developer & IoT Engineer',
      description: 'Full-stack software engineer specializing in Android System Internals, IoT Automation, and high-performance mobile networking.',
      email: 'info.shanudhatirosh@gmail.com',
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'G/Dharmashoka College, Ambalangoda',
      },
      nationality: {
        '@type': 'Country',
        name: 'Sri Lanka',
      },
      knowsAbout: [
        'Android System Development',
        'IoT Automation',
        'Full-stack Web Engineering',
        'WhatsApp Bot Development',
        'Firebase',
        'Node.js',
        'Python',
        'React',
        'Network Optimization',
        'VPN Platform Engineering',
      ],
      knowsLanguage: ['en', 'si'],
      sameAs: [
        'https://www.linkedin.com/in/shanudhatirosh/',
        'https://github.com/ShanudhaTirosh',
        'https://web.facebook.com/tirosh.shanudha/',
        'https://www.instagram.com/shanudha_tirosh/',
      ],
    },
    // Organization
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Netch Solutions',
      alternateName: ['ShanuFx', 'ShanudhaTirosh'],
      url: 'https://shanu-fx.web.app/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://shanu-fx.web.app/assets/img/favicon-96.png',
        width: 96,
        height: 96,
      },
      founder: {
        '@type': 'Person',
        name: 'Shanudha Tirosh',
        url: 'https://shanu-fx.web.app/',
      },
      foundingDate: '2023',
      foundingLocation: {
        '@type': 'Place',
        name: 'Ambalangoda, Sri Lanka',
      },
      description: 'Sri Lankan software engineering brand specializing in Android system internals, IoT automation, VPN platforms, and web applications.',
      areaServed: ['Sri Lanka', 'Worldwide'],
      email: 'info.shanudhatirosh@gmail.com',
      sameAs: [
        'https://github.com/ShanudhaTirosh',
        'https://www.linkedin.com/in/shanudhatirosh/',
        'https://web.facebook.com/tirosh.shanudha/',
        'https://www.instagram.com/shanudha_tirosh/',
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
          item: 'https://shanu-fx.web.app/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Projects',
          item: 'https://shanu-fx.web.app/#projects',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Contact',
          item: 'https://shanu-fx.web.app/#contact',
        },
      ],
    },
    // ProfilePage
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: 'ShanuFx | Shanudha Tirosh – Developer Portfolio',
      url: 'https://shanu-fx.web.app/',
      dateCreated: '2023-01-01T00:00:00+05:30',
      dateModified: new Date().toISOString(),
      inLanguage: 'en',
      isPartOf: {
        '@type': 'WebSite',
        name: 'ShanuFx Portfolio',
        url: 'https://shanu-fx.web.app/',
      },
      mainEntity: {
        '@type': 'Person',
        name: 'Shanudha Tirosh',
        alternateName: 'ShanuFx',
        url: 'https://shanu-fx.web.app/',
        jobTitle: 'Android System Developer & IoT Engineer',
        worksFor: {
          '@type': 'Organization',
          name: 'Netch Solutions',
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

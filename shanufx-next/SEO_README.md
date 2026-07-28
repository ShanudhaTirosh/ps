# SHANUTECHX Portfolio - SEO Documentation

## Overview

This document provides a comprehensive overview of the SEO implementation for the SHANUTECHX portfolio website (info.shanutechx.com).

## Contact Information

- **Website**: https://info.shanutechx.com
- **Email**: info@shanutechx.com
- **Phone**: +94765749332 (WhatsApp)
- **Owner**: Shanudha Tirosh
- **Company**: Netch Solutions

## Social Media Profiles

- **LinkedIn**: https://www.linkedin.com/in/shanudhatirosh/
- **GitHub**: https://github.com/ShanudhaTirosh
- **Facebook**: https://www.facebook.com/tirosh.shanudha
- **Instagram**: https://www.instagram.com/shanudha_tirosh/
- **WhatsApp**: https://wa.me/94765749332

---

## 📁 File Structure

### SEO Configuration Files

```
/app
  ├── layout.tsx                 # Global metadata & SEO tags
  ├── page.tsx                   # Homepage
  ├── showcase/page.tsx          # Showcase page with metadata
  └── testimonials/page.tsx      # Testimonials page with metadata

/components
  └── seo/
      └── JsonLd.tsx             # Structured data (JSON-LD)

/lib
  ├── config/
  │   └── seo.ts                 # SEO configuration constants
  └── utils/
      └── seo.ts                 # SEO utility functions

/public
  ├── robots.txt                 # Robot directives
  ├── sitemap.xml                # XML sitemap
  ├── manifest.json              # PWA manifest
  ├── humans.txt                 # Team information
  └── .well-known/
      └── security.txt           # Security policy

/assets
  └── og-image.webp              # Open Graph image (1200×630px)
```

---

## 🔧 Implementation Details

### 1. Meta Tags (layout.tsx)

The root layout includes comprehensive metadata:
- Page titles with template
- Meta descriptions
- Keywords
- Author information
- Canonical URLs
- Language alternates
- Open Graph tags
- Twitter Card tags
- Robots configuration
- Apple Web App tags
- Geographic tags
- Icons and manifest

### 2. Structured Data (JsonLd.tsx)

Implements Schema.org structured data:
- **WebSite**: Basic site information with search action
- **Person**: Information about Shanudha Tirosh
- **Organization**: SHANUTECHX brand details
- **BreadcrumbList**: Site navigation structure
- **ProfilePage**: Portfolio page information
- **ContactPoint**: Contact details for search engines

### 3. Robots.txt

Configured to:
- Allow all search engines and AI bots
- Allow specific AI bots (GPTBot, Claude, Gemini, etc.)
- Disallow admin and API routes
- Reference sitemap
- Set crawl delay for polite crawling

### 4. Sitemap.xml

Contains:
- All public pages with priorities
- Last modification dates
- Change frequencies
- Image references with captions

### 5. Social Media Optimization

#### Open Graph Tags
- Optimized for Facebook, LinkedIn, and general social sharing
- 1200×630px images
- Descriptive titles and descriptions
- Contact information included

#### Twitter Cards
- summary_large_image card type
- Platform-specific titles and descriptions
- Optimized images

---

## 🎨 Open Graph Images

### Current Images
- **Primary**: `/assets/og-image.webp` (1200×630px)
- Used across all social media platforms

### Recommended Additional Images
1. **Twitter**: 1200×675px (16:9 aspect ratio)
2. **Instagram**: 1080×1080px (1:1 square)
3. **WhatsApp**: 400×400px (small square)

See `OG_IMAGES_GUIDE.md` for detailed specifications.

---

## 🤖 AI Bot Optimization

### Allowed Bots
The robots.txt explicitly allows these AI bots:
- **GPTBot** - OpenAI's crawler
- **ChatGPT-User** - ChatGPT browsing
- **CCBot** - Common Crawl
- **Google-Extended** - Google's AI training
- **anthropic-ai** - Anthropic's crawler
- **Claude-Web** - Claude browsing
- **ClaudeBot** - Claude's crawler
- **Googlebot** - Google Search
- **Bingbot** - Bing Search
- **DuckDuckBot** - DuckDuckGo

All bots can freely index public pages for training and search purposes.

---

## 📊 Key SEO Features

### Technical SEO
✅ Clean URL structure  
✅ Proper HTML semantics  
✅ Mobile-responsive design  
✅ Fast page load times  
✅ HTTPS enabled  
✅ Canonical URLs  
✅ XML sitemap  
✅ robots.txt configuration  

### On-Page SEO
✅ Unique page titles  
✅ Meta descriptions  
✅ Header hierarchy (H1, H2, H3)  
✅ Alt text for images  
✅ Internal linking  
✅ Keyword optimization  

### Structured Data
✅ WebSite schema  
✅ Person schema  
✅ Organization schema  
✅ ContactPoint schema  
✅ BreadcrumbList schema  
✅ ProfilePage schema  

### Social Media
✅ Open Graph tags  
✅ Twitter Cards  
✅ Optimized images  
✅ Social profile links  

---

## 🚀 Testing & Validation

### Recommended Tools

1. **Google Search Console**
   - Submit sitemap
   - Monitor indexing
   - Check coverage
   - URL: https://search.google.com/search-console

2. **Rich Results Test**
   - Validate structured data
   - URL: https://search.google.com/test/rich-results

3. **PageSpeed Insights**
   - Test performance
   - URL: https://pagespeed.web.dev/

4. **Facebook Sharing Debugger**
   - Test OG tags
   - URL: https://developers.facebook.com/tools/debug/

5. **Twitter Card Validator**
   - Test Twitter Cards
   - URL: https://cards-dev.twitter.com/validator

6. **LinkedIn Post Inspector**
   - Test LinkedIn shares
   - URL: https://www.linkedin.com/post-inspector/

---

## 📈 Monitoring & Maintenance

### Regular Tasks

#### Weekly
- Monitor search rankings
- Check for 404 errors
- Review analytics (if setup)

#### Monthly
- Update sitemap if new pages added
- Review and update meta descriptions
- Check broken links
- Update content

#### Quarterly
- Full SEO audit
- Update OG images if needed
- Review structured data
- Competitor analysis

---

## 🔗 Important Links

### Documentation
- [SEO Checklist](./SEO_CHECKLIST.md)
- [OG Images Guide](./OG_IMAGES_GUIDE.md)

### Configuration Files
- [Global Layout](/app/layout.tsx)
- [SEO Config](/lib/config/seo.ts)
- [SEO Utils](/lib/utils/seo.ts)
- [Structured Data](/components/seo/JsonLd.tsx)

### Public Files
- [robots.txt](/public/robots.txt)
- [sitemap.xml](/public/sitemap.xml)
- [manifest.json](/public/manifest.json)
- [humans.txt](/public/humans.txt)
- [security.txt](/public/.well-known/security.txt)

---

## 🛠️ Development Guidelines

### Adding New Pages

When creating new pages, ensure:
1. Add unique metadata in page.tsx
2. Update sitemap.xml with new URL
3. Add breadcrumb to JsonLd.tsx if needed
4. Create page-specific OG image if needed
5. Test social media previews

### Updating Content

When updating content:
1. Update lastmod date in sitemap.xml
2. Review and update meta descriptions
3. Check structured data is still accurate
4. Test rich results
5. Clear social media caches

### Best Practices

1. **Unique Titles**: Every page should have a unique title
2. **Descriptive URLs**: Use clean, descriptive URLs
3. **Alt Text**: All images should have descriptive alt text
4. **Mobile-First**: Always test on mobile devices
5. **Performance**: Optimize images and code
6. **Accessibility**: Follow WCAG guidelines

---

## 📞 Support

For questions or issues related to SEO:

**Shanudha Tirosh**  
Email: info@shanutechx.com  
Phone/WhatsApp: +94765749332  
LinkedIn: https://www.linkedin.com/in/shanudhatirosh/

---

## 📝 Changelog

### 2026-07-28
- ✅ Updated all contact information to info@shanutechx.com
- ✅ Added phone number +94765749332 to metadata
- ✅ Updated social media links (Facebook, Instagram)
- ✅ Enhanced robots.txt with AI bot permissions
- ✅ Updated sitemap.xml with current dates
- ✅ Added ContactPoint schema with phone and email
- ✅ Created humans.txt and security.txt
- ✅ Enhanced manifest.json with shortcuts
- ✅ Created SEO documentation and guides
- ✅ Added SEO utility functions
- ✅ Improved structured data

---

**Last Updated**: July 28, 2026  
**Version**: 2.0  
**Maintained by**: Shanudha Tirosh (SHANUTECHX)

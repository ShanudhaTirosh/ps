# OG Image Guidelines for SHANUTECHX

This guide provides specifications for creating Open Graph (OG) images optimized for different social media platforms.

## Contact Information
- **Email**: info@shanutechx.com
- **Phone**: +94765749332
- **Website**: https://info.shanutechx.com

## Platform-Specific Sizes

### 1. Facebook & LinkedIn (Primary)
- **Size**: 1200 × 630 pixels
- **Aspect Ratio**: 1.91:1
- **Format**: WebP, PNG, or JPG
- **Max File Size**: 8 MB
- **File Location**: `/public/assets/og-image.webp`
- **Use Case**: General social sharing, Facebook posts, LinkedIn shares

### 2. Twitter/X
- **Size**: 1200 × 675 pixels
- **Aspect Ratio**: 16:9
- **Format**: WebP, PNG, or JPG
- **Max File Size**: 5 MB
- **File Location**: `/public/assets/og-twitter.webp`
- **Card Type**: summary_large_image

### 3. Instagram
- **Size**: 1080 × 1080 pixels
- **Aspect Ratio**: 1:1 (Square)
- **Format**: WebP, PNG, or JPG
- **Max File Size**: 8 MB
- **File Location**: `/public/assets/og-instagram.webp`
- **Use Case**: Instagram posts and stories

### 4. WhatsApp
- **Size**: 400 × 400 pixels
- **Aspect Ratio**: 1:1 (Square)
- **Format**: WebP, PNG, or JPG
- **Max File Size**: 300 KB
- **File Location**: `/public/assets/og-whatsapp.webp`
- **Use Case**: WhatsApp link previews

## Design Guidelines

### Brand Elements
- **Primary Color**: #7c3aed (Purple)
- **Secondary Color**: #04040a (Dark background)
- **Logo**: Include SHANUTECHX logo
- **Typography**: Syne font family for headlines

### Content Requirements
1. **Main Text**: "Shanudha Tirosh" or "SHANUTECHX"
2. **Subtitle**: "Full-Stack Developer | Android Innovator | IoT Engineer"
3. **Domain**: "info.shanutechx.com"
4. **Optional**: Social media icons or project showcase

### Safe Zones
- Keep important text and logos within the center 80% of the image
- Avoid placing critical content near edges (may be cropped)
- Leave 5% padding on all sides

## Current Images

### Primary OG Image
- **File**: `/public/assets/og-image.webp`
- **Size**: 1200 × 630 pixels
- **Usage**: Default for all social media platforms

### Logo
- **File**: `/public/assets/shanufx_logo.webp`
- **Usage**: Brand identity, favicons

## Testing Tools

1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
4. **WhatsApp Link Preview**: Share link in WhatsApp to test

## Image Optimization

### Recommended Tools
- **Sharp**: Installed in project for image processing
- **TinyPNG**: https://tinypng.com/ for compression
- **Squoosh**: https://squoosh.app/ for format conversion

### Optimization Steps
1. Design image at 2x resolution for Retina displays
2. Export as WebP for better compression
3. Provide PNG/JPG fallback for older platforms
4. Compress to reduce file size while maintaining quality
5. Test on actual devices and platforms

## Implementation

All OG images are referenced in:
- `/app/layout.tsx` - Global metadata
- `/app/showcase/page.tsx` - Showcase page metadata
- `/app/testimonials/page.tsx` - Testimonials page metadata
- `/components/seo/JsonLd.tsx` - Structured data

## Social Media Profiles

Include these in all OG images where relevant:
- **LinkedIn**: https://www.linkedin.com/in/shanudhatirosh/
- **GitHub**: https://github.com/ShanudhaTirosh
- **Facebook**: https://www.facebook.com/tirosh.shanudha
- **Instagram**: https://www.instagram.com/shanudha_tirosh/
- **WhatsApp**: https://wa.me/94765749332

## Best Practices

1. **Consistency**: Use the same visual style across all platforms
2. **Clarity**: Ensure text is readable at small sizes
3. **Relevance**: Image should represent page content
4. **Testing**: Always test images on actual platforms
5. **Updates**: Refresh images when branding changes
6. **Performance**: Optimize file sizes for faster loading
7. **Accessibility**: Include descriptive alt text in metadata

## Version Control

When updating OG images:
1. Keep original high-resolution source files
2. Document changes in git commits
3. Update this guide if specifications change
4. Test on all platforms after updates
5. Clear social media caches using debugging tools

---

**Last Updated**: July 28, 2026  
**Contact**: info@shanutechx.com  
**Maintained by**: Shanudha Tirosh (SHANUTECHX)

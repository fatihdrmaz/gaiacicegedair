import type { MetadataRoute } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cicegedair.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/portal/', '/admin/', '/api/'],
    },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}

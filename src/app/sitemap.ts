import type { MetadataRoute } from 'next';
import { SERVICE_DETAILS, BLOG_POSTS } from '@/lib/content';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cicegedair.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    '',
    '/hizmetler',
    '/hakkimizda',
    '/galeri',
    '/iletisim',
    '/blog',
    '/ozel-gunlerim',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.8,
  }));

  const serviceEntries: MetadataRoute.Sitemap = Object.keys(SERVICE_DETAILS).map(
    (slug) => ({
      url: `${SITE}/hizmetler/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }),
  );

  const blogEntries: MetadataRoute.Sitemap = (BLOG_POSTS as { slug: string; date?: string }[]).map(
    (p) => ({
      url: `${SITE}/blog/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : now,
      changeFrequency: 'monthly',
      priority: 0.6,
    }),
  );

  return [...staticEntries, ...serviceEntries, ...blogEntries];
}

import type { MetadataRoute } from 'next';
import { SERVICE_DETAILS } from '@/lib/content';
import { getPublishedPosts } from '@/lib/blog';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cicegedair.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await getPublishedPosts();

  const staticPaths = [
    '',
    '/hizmetler',
    '/hakkimizda',
    '/galeri',
    '/iletisim',
    '/blog',
    '/ozel-gunlerim',
    '/gizlilik',
    '/kvkk',
    '/cerez-politikasi',
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

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE}/blog/${p.slug}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticEntries, ...serviceEntries, ...blogEntries];
}

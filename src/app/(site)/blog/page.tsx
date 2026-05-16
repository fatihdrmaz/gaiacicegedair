import type { Metadata } from 'next';
import { getPublishedPosts } from '@/lib/blog';
import { BlogListPage } from '@/components/site/blog';

// ISR — blog listesi saatte bir yenilenir
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog · GAIA Çiçeğe Dair',
  description:
    'Düğün, kurumsal çiçek, teklif sahnesi ve rehber yazıları — GAIA atölyesinden.',
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return <BlogListPage posts={posts} />;
}

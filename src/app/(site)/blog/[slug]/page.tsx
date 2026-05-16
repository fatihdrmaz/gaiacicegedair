import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '@/lib/content';
import { BlogDetailClient } from '@/components/site/blog-detail-client';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cicegedair.com';

// ISR — blog içeriği saatte bir yeniden oluşturulur.
export const revalidate = 3600;

type BlogPost = {
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  author?: { name?: string };
};

export function generateStaticParams() {
  return (BLOG_POSTS as BlogPost[]).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = (BLOG_POSTS as BlogPost[]).find((x) => x.slug === slug);
  if (!p) return { title: 'Yazı bulunamadı — GAIA Çiçeğe Dair' };
  return {
    title: `${p.title} — GAIA Çiçeğe Dair`,
    description: p.excerpt || '',
    alternates: { canonical: `${SITE}/blog/${slug}` },
    openGraph: {
      title: p.title,
      description: p.excerpt || '',
      url: `${SITE}/blog/${slug}`,
      type: 'article',
    },
  };
}

export default async function BlogDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = (BLOG_POSTS as BlogPost[]).find((x) => x.slug === slug);
  if (!p) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    description: p.excerpt || '',
    datePublished: p.date,
    author: {
      '@type': 'Person',
      name: p.author?.name || 'GAIA Çiçeğe Dair',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GAIA Çiçeğe Dair',
      url: SITE,
    },
    url: `${SITE}/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetailClient slug={slug} />
    </>
  );
}

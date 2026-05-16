import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedPosts, getPostBySlug, type BlogPost } from '@/lib/blog';
import { BlogDetailPage } from '@/components/site/blog';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cicegedair.com';

// ISR — blog içeriği saatte bir yeniden oluşturulur.
export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPostBySlug(slug);
  if (!p) return { title: 'Yazı bulunamadı — GAIA Çiçeğe Dair' };
  return {
    title: `${p.title} — GAIA Çiçeğe Dair`,
    description: p.excerpt,
    alternates: { canonical: `${SITE}/blog/${slug}` },
    openGraph: {
      title: p.title,
      description: p.excerpt,
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
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const all = await getPublishedPosts();
  let related: BlogPost[] = post.related
    .map((s) => all.find((x) => x.slug === s))
    .filter((x): x is BlogPost => Boolean(x));
  // İlgili yazı tanımlı değilse en yeni 3 yazıyı göster
  if (related.length === 0) {
    related = all.filter((x) => x.slug !== post.slug).slice(0, 3);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'GAIA Çiçeğe Dair', url: SITE },
    url: `${SITE}/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetailPage post={post} related={related} />
    </>
  );
}

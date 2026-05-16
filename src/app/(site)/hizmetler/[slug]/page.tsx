import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SERVICE_DETAILS } from '@/lib/content';
import { ServiceDetailClient } from '@/components/site/service-detail-client';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cicegedair.com';

type ServiceDetail = { title: string; summary?: string; tagline?: string };

export function generateStaticParams() {
  return Object.keys(SERVICE_DETAILS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = (SERVICE_DETAILS as Record<string, ServiceDetail>)[slug];
  if (!s) return { title: 'Hizmet bulunamadı — GAIA Çiçeğe Dair' };
  const description = s.summary || s.tagline || '';
  return {
    title: `${s.title} — GAIA Çiçeğe Dair`,
    description,
    alternates: { canonical: `${SITE}/hizmetler/${slug}` },
    openGraph: {
      title: `${s.title} — GAIA Çiçeğe Dair`,
      description,
      url: `${SITE}/hizmetler/${slug}`,
      type: 'website',
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = (SERVICE_DETAILS as Record<string, ServiceDetail>)[slug];
  if (!s) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.title,
    description: s.summary || s.tagline || '',
    serviceType: s.title,
    areaServed: 'İstanbul',
    provider: {
      '@type': 'LocalBusiness',
      name: 'GAIA Çiçeğe Dair',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'İstanbul',
        addressCountry: 'TR',
      },
      url: SITE,
    },
    url: `${SITE}/hizmetler/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServiceDetailClient serviceKey={slug} />
    </>
  );
}

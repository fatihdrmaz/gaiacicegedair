'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Reveal, SectionTitle } from '@/components/ui';
import { Icons } from '@/components/shared/icons';
import { PHOTOS, PhotoImage } from '@/components/site/images';
import { SERVICE_CATEGORIES, SERVICE_DETAILS, PRODUCTS } from '@/lib/content';

export function Services({ variant = 'image-card', onQuote, preview = false }: { variant?: string; onQuote?: (t?: string) => void; preview?: boolean }) {
  if (preview) return <ServicesPreview variant={variant} onQuote={onQuote} />;
  return <ServicesCategorized onQuote={onQuote} />;
}

export function ServicesCategorized({ onQuote }: { onQuote?: (t?: string) => void }) {
  const cats: any[] = Object.values(SERVICE_CATEGORIES as any);
  return (
    <>
      <section style={{ padding: '20px 0', borderBottom: '1px solid var(--line)', position: 'sticky', top: 70, zIndex: 30, backdropFilter: 'saturate(140%) blur(10px)', background: 'rgba(250, 249, 246, 0.92)' }}>
        <div className="container" style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
          {cats.map(c => (
            <a key={c.id} href={`#${c.id}`} style={{
              fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--ink)', padding: '6px 0',
              borderBottom: '1px solid transparent', transition: 'all 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderBottomColor = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.borderBottomColor = 'transparent')}
            >
              {c.label}
            </a>
          ))}
        </div>
      </section>

      {cats.map((c, i) => (
        <CategorySection key={c.id} cat={c} index={i} onQuote={onQuote} />
      ))}
    </>
  );
}

export function CategorySection({ cat, index, onQuote }: { cat: any; index: number; onQuote?: (t?: string) => void }) {
  const bg = index % 2 === 0 ? 'var(--paper)' : 'var(--paper-warm)';
  return (
    <section id={cat.id} style={{ padding: '120px 0', background: bg, scrollMarginTop: 110 }}>
      <div className="container">
        <div style={{ maxWidth: 760, marginBottom: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22 }}>
            <span style={{
              width: 48, height: 48, borderRadius: '50%', background: 'var(--accent)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500,
            }}>
              {String.fromCharCode(0x41 + index)}
            </span>
            <div className="overline" style={{ color: 'var(--accent)' }}>{cat.sublabel}</div>
          </div>
          <h2 className="serif" style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em' }}>
            {cat.label}
          </h2>
          <p style={{ marginTop: 22, fontSize: 17, color: 'var(--ink-60)', lineHeight: 1.65, maxWidth: 640 }}>
            {cat.intro}
          </p>
        </div>

        {cat.services && <ServicesGrid services={cat.services} onQuote={onQuote} />}
        {cat.products && <ProductsGrid products={cat.products} catId={cat.id} />}
      </div>
    </section>
  );
}

export function ServicesGrid({ services, onQuote }: { services: string[]; onQuote?: (t?: string) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 }}>
      {services.map((sk, i) => {
        const s = (SERVICE_DETAILS as any)[sk];
        if (!s) return null;
        return <ServiceCardNew key={sk} s={s} i={i} />;
      })}
    </div>
  );
}

export function ServiceCardNew({ s, i }: { s: any; i: number }) {
  const [hover, setHover] = useState(false);
  const router = useRouter();
  return (
    <Reveal delay={i * 0.05}>
      <article onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onClick={() => router.push(`/hizmetler/${s.key}`)}
        style={{ cursor: 'pointer', transition: 'transform 0.4s' }}>
        <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/5' }}>
          <div style={{ transform: hover ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.7s ease', height: '100%' }}>
            <PhotoImage src={(PHOTOS as any)[s.photo]} ratio="4/5" />
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.55))' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, color: '#fff' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.3em', opacity: 0.85, textTransform: 'uppercase' }}>0{i + 1}</div>
            <h3 className="serif" style={{ fontSize: 26, fontWeight: 400, marginTop: 6, lineHeight: 1.2 }}>{s.title}</h3>
          </div>
          <div style={{
            position: 'absolute', right: 18, top: 18,
            background: 'var(--paper)', color: 'var(--accent)',
            width: 36, height: 36, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: hover ? 'rotate(-45deg)' : 'rotate(0)',
            transition: 'transform 0.35s ease',
          }}>
            <Icons.Arrow size={13} />
          </div>
        </div>
        <p style={{ marginTop: 14, fontSize: 14.5, color: 'var(--ink-60)', lineHeight: 1.55 }}>
          {s.tagline}
        </p>
      </article>
    </Reveal>
  );
}

export function ProductsGrid({ products, catId }: { products: string[]; catId: string }) {
  const list = products.map(pk => (PRODUCTS as any[]).find(p => p.key === pk)).filter(Boolean);
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24, marginBottom: 50 }}>
        {list.map((p: any, i) => <ProductCard key={p.key} p={p} i={i} />)}
      </div>
      <ProductsCTA />
    </>
  );
}

export function ProductCard({ p, i }: { p: any; i: number }) {
  const [hover, setHover] = useState(false);
  const router = useRouter();
  return (
    <Reveal delay={i * 0.04}>
      <article onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onClick={() => router.push('/ozel-gunlerim')}
        style={{ cursor: 'pointer' }}>
        <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1/1', background: 'var(--paper)' }}>
          <div style={{ transform: hover ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.6s', height: '100%' }}>
            <PhotoImage src={(PHOTOS as any)[p.photo]} ratio="1/1" />
          </div>
          <div style={{
            position: 'absolute', inset: 0, padding: 22,
            background: 'rgba(31,35,32,0.78)', color: '#fff',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            opacity: hover ? 1 : 0, transition: 'opacity 0.3s',
          }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {p.bullets.map((b: string, j: number) => (
                <li key={j} style={{ fontSize: 12.5, display: 'flex', gap: 8 }}>
                  <span style={{ color: 'var(--accent-soft)' }}>✦</span>
                  <span style={{ lineHeight: 1.4 }}>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ paddingTop: 16 }}>
          <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.2 }}>{p.title}</h3>
          <p style={{ fontSize: 13, color: 'var(--accent)', marginTop: 4, fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>{p.tagline}</p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-60)', marginTop: 8, lineHeight: 1.55 }}>{p.desc}</p>
        </div>
      </article>
    </Reveal>
  );
}

export function ProductsCTA() {
  return (
    <div style={{
      padding: 40, background: 'var(--accent-deep)', color: '#fff',
      display: 'grid', gridTemplateColumns: '1fr auto', gap: 30, alignItems: 'center',
    }} className="products-cta">
      <div>
        <div className="overline" style={{ color: 'var(--accent-soft)', marginBottom: 12 }}>GAIA Hatırlasın</div>
        <h3 className="serif" style={{ fontSize: 28, fontWeight: 400, lineHeight: 1.2 }}>
          Bu koleksiyon, sevdiklerinizin özel anlarına eşlik etmek için tasarlandı.
        </h3>
        <p style={{ marginTop: 12, fontSize: 15, opacity: 0.85, lineHeight: 1.6, maxWidth: 580 }}>
          <strong>Özel Günlerim</strong> akışıyla yıllık çiçek takviminizi bir kez oluşturun;
          zamanı geldiğinde biz sizin adınıza gönderelim.
        </p>
      </div>
      <Link href="/ozel-gunlerim" style={{ textDecoration: 'none' }}>
        <Button variant="white" size="lg" iconRight={<Icons.Arrow size={14} />}>
          Özel Günlerim
        </Button>
      </Link>
      <style>{`@media (max-width: 720px){ .products-cta { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

export function ServicesPreview({ variant, onQuote }: { variant?: string; onQuote?: (t?: string) => void }) {
  const featured = [
    'wedding',
    'lobi-aranjmani',
    'venue',
    'karsilama-buketi',
    'tekne-susleme',
    'kurumsal-hediye',
  ];
  return (
    <section style={{ padding: '120px 0', background: 'var(--paper)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 70, flexWrap: 'wrap', gap: 30 }}>
          <SectionTitle
            eyebrow="Hizmetlerimiz"
            title={<>Her anın bir <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>çiçeği</em> var.</>}
            subtitle="Kurumsaldan düğüne, özel günden hediyeye — her proje tek tek tasarlanır."
          />
          <Link href="/hizmetler" style={{ textDecoration: 'none' }}>
            <Button variant="outlined" iconRight={<Icons.Arrow size={14} />}>Tümünü Gör</Button>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 28 }}>
          {featured.map((sk, i) => {
            const s = (SERVICE_DETAILS as any)[sk];
            if (!s) return null;
            return <ServiceCardNew key={sk} s={s} i={i} />;
          })}
        </div>
      </div>
    </section>
  );
}

export function SpecialtiesBand() {
  const items = [
    { icon: 'Bouquet',  title: 'Karşılama Buketleri',     desc: 'Lobi ve ortak alan aranjmanları' },
    { icon: 'Hall',     title: 'Toplantı & Etkinlik',      desc: 'Masa ve alan düzenlemeleri' },
    { icon: 'Gift',     title: 'Kurumsal Hediye',          desc: 'Kutlama çiçekleri ve sunumlar' },
    { icon: 'Leaf',     title: 'Kurutulmuş Çiçek',         desc: 'Promosyon ve hediye ürünleri' },
  ];
  return (
    <section style={{ background: 'var(--accent-soft)', padding: '80px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
          {items.map((it, i) => {
            const I = (Icons as any)[it.icon] || (Icons as any).Flower;
            return (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '12px 0' }}>
                  <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--accent)', color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <I size={20} />
                  </div>
                  <h4 className="serif" style={{ fontSize: 22, fontWeight: 500, color: 'var(--accent-deep)' }}>{it.title}</h4>
                  <p style={{ fontSize: 14, color: 'var(--ink-60)', lineHeight: 1.5 }}>{it.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

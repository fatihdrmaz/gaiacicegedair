'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Reveal, SectionTitle } from '@/components/ui';
import { Icons } from '@/components/shared/icons';
import { PHOTOS, PhotoImage } from '@/components/site/images';
import { SERVICE_DETAILS } from '@/lib/content';
import { CTAStrip } from '@/components/site/showcase';

export function ServiceDetailPage({ serviceKey, onQuote }: { serviceKey: string; onQuote?: (title?: string) => void }) {
  const s: any = (SERVICE_DETAILS as any)[serviceKey];
  const router = useRouter();

  useEffect(() => {
    if (!s) return;
    document.title = `${s.title} · GAIA Çiçeğe Dair`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) (meta as HTMLMetaElement).content = s.summary;
  }, [serviceKey]);

  if (!s) return null;

  return (
    <>
      <section style={{ position: 'relative', minHeight: '80vh', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <PhotoImage src={(PHOTOS as any)[s.heroPhoto]} ratio="auto" style={{ width: '100%', height: '100%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)' }} />
        </div>
        <div className="container" style={{ position: 'relative', paddingTop: 180, paddingBottom: 80, color: '#fff' }}>
          <Breadcrumbs items={[
            { label: 'Ana Sayfa', href: '/' },
            { label: 'Hizmetler', href: '/hizmetler' },
            { label: s.title }
          ]} light />
          <div className="overline" style={{ opacity: 0.85, marginTop: 24, marginBottom: 18 }}>◦ Hizmet ◦</div>
          <h1 className="serif" style={{ fontSize: 'clamp(46px, 7vw, 100px)', fontWeight: 300, lineHeight: 1.02, letterSpacing: '-0.02em', maxWidth: 900 }}>
            {s.title}
          </h1>
          <p style={{ marginTop: 22, fontSize: 22, fontStyle: 'italic', opacity: 0.9, fontFamily: 'var(--font-display)', maxWidth: 720 }}>
            {s.tagline}
          </p>
          <p style={{ marginTop: 18, fontSize: 17, opacity: 0.88, maxWidth: 640, lineHeight: 1.6 }}>
            {s.summary}
          </p>
          <div style={{ marginTop: 36, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" onClick={() => onQuote && onQuote(s.title)} iconRight={<Icons.Arrow size={14} />}>Teklif Al</Button>
            <Link href="/iletisim" style={{ textDecoration: 'none' }}>
              <Button variant="white" size="lg">İletişime Geç</Button>
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '120px 0', background: 'var(--paper)' }}>
        <div className="container">
          <SectionTitle eyebrow="Kapsam" title={<>Bu hizmette neler <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>yapıyoruz</em>?</>} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, marginTop: 60 }}>
            {s.capabilities.map((c: any, i: number) => (
              <Reveal key={i} delay={i * 0.05}>
                <div>
                  <div className="serif" style={{ fontSize: 24, color: 'var(--accent)', opacity: 0.4 }}>0{i + 1}</div>
                  <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, marginTop: 8, color: 'var(--accent-deep)' }}>{c.title}</h3>
                  <p style={{ marginTop: 10, fontSize: 14.5, color: 'var(--ink-60)', lineHeight: 1.6 }}>{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '120px 0', background: 'var(--accent-soft)' }}>
        <div className="container">
          <SectionTitle eyebrow="Süreç" title={<>Nasıl <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>çalışıyoruz</em>?</>} />
          <div style={{ marginTop: 60, borderTop: '1px solid var(--line)' }}>
            {s.process.map((p: any, i: number) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 2fr', gap: 24, padding: '30px 0', borderBottom: '1px solid var(--line)', alignItems: 'center' }}>
                <div className="serif" style={{ fontSize: 38, color: 'var(--accent)', opacity: 0.6 }}>0{i + 1}</div>
                <h3 className="serif" style={{ fontSize: 28, fontWeight: 400 }}>{p.step}</h3>
                <p style={{ color: 'var(--ink-60)', fontSize: 15, lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section style={{ padding: '120px 0', background: 'var(--paper-warm)' }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <SectionTitle eyebrow="SSS" title={<>Sıkça sorulanlar.</>} />
          <div style={{ marginTop: 50 }}>
            {s.faq.map((f: any, i: number) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {s.related && s.related.length > 0 && (
        <section style={{ padding: '100px 0', background: 'var(--paper)' }}>
          <div className="container">
            <SectionTitle eyebrow="Ayrıca" title="İlgili hizmetler." />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginTop: 40 }}>
              {s.related.map((rk: string) => {
                const r: any = (SERVICE_DETAILS as any)[rk];
                if (!r) return null;
                return (
                  <Link key={rk} href={`/hizmetler/${rk}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                      <PhotoImage src={(PHOTOS as any)[r.photo]} ratio="4/3" />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.65))', padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#fff' }}>
                        <h3 className="serif" style={{ fontSize: 22, fontWeight: 400 }}>{r.title}</h3>
                        <div style={{ fontSize: 11, letterSpacing: '0.2em', marginTop: 6, opacity: 0.85 }}>DETAYLAR →</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <CTAStrip onQuote={() => onQuote && onQuote(s.title)} onB2C={() => router.push('/ozel-gunlerim')} />
    </>
  );
}

export function Breadcrumbs({ items, light }: { items: { label: string; href?: string }[]; light?: boolean }) {
  return (
    <nav style={{ display: 'flex', gap: 10, fontSize: 11.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: light ? 'rgba(255,255,255,0.85)' : 'var(--ink-60)', flexWrap: 'wrap' }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {it.href ? (
            <Link href={it.href} style={{ cursor: 'pointer', opacity: 0.85, color: 'inherit', textDecoration: 'none' }}>
              {it.label}
            </Link>
          ) : (
            <span style={{ fontWeight: 500 }}>{it.label}</span>
          )}
          {i < items.length - 1 && <span style={{ opacity: 0.5 }}>›</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}

export function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--line)' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', textAlign: 'left', padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
        <span className="serif" style={{ fontSize: 22, fontWeight: 500, color: 'var(--ink)' }}>{q}</span>
        <span style={{ fontSize: 22, color: 'var(--accent)', transition: 'transform 0.3s', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 400 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
        <p style={{ padding: '0 0 24px', fontSize: 15.5, color: 'var(--ink-60)', lineHeight: 1.7, maxWidth: 720 }}>{a}</p>
      </div>
    </div>
  );
}

export function CTAStripDetail({ onQuote, onB2C, title = 'Bir proje mi konuşmak istersiniz?' }: { onQuote?: () => void; onB2C?: () => void; title?: string }) {
  return (
    <section style={{ padding: '100px 0', background: 'var(--accent-deep)', color: 'var(--paper)' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: 720 }}>
        <h2 className="serif" style={{ fontSize: 'clamp(34px, 4vw, 52px)', fontWeight: 400, lineHeight: 1.1 }}>{title}</h2>
        <div style={{ marginTop: 30, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="white" size="lg" onClick={onQuote}>Teklif Al</Button>
          <Button variant="outlined" size="lg" onClick={onB2C} style={{ color: '#fff', borderColor: '#fff' }}>Özel Günlerim</Button>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Button, Reveal, SectionTitle } from '@/components/ui';
import { Icons } from '@/components/shared/icons';
import { createClient } from '@/lib/supabase/client';

type ShowcaseItem = { id: string; url: string; title: string; category: string };

export function Showcase() {
  const [items, setItems] = useState<ShowcaseItem[] | null>(null);

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    supabase
      .from('gallery_images')
      .select('id, image_url, title, gallery_categories(name)')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (!active) return;
        const mapped: ShowcaseItem[] = (data || []).map((r: any) => ({
          id: r.id,
          url: r.image_url,
          title: r.title || '',
          category: r.gallery_categories?.name || '',
        }));
        setItems(mapped);
      });
    return () => { active = false; };
  }, []);

  // Öne çıkan görsel yoksa bölümü gösterme
  if (!items || items.length === 0) return null;

  return (
    <section style={{ padding: '120px 0', background: 'var(--paper-warm)' }}>
      <div className="container">
        <SectionTitle
          eyebrow="Son Yaptıklarımız"
          title={<>Atölyeden <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>kareler.</em></>}
          subtitle="Gerçek etkinlikler, gerçek mekânlar — her projede tek tek tasarlanan konseptler."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 60 }} className="showcase-grid">
          {items.map((it) => (
            <div key={it.id} style={{ position: 'relative', overflow: 'hidden', borderRadius: 4, aspectRatio: '4/3' }}
              className="showcase-item">
              <img src={it.url} alt={it.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20,
                background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.72))',
                color: '#fff',
              }}>
                {it.category && <div style={{ fontSize: 10, letterSpacing: '0.25em', opacity: 0.85 }}>{it.category.toUpperCase()}</div>}
                {it.title && <div className="serif" style={{ fontSize: 22, marginTop: 4 }}>{it.title}</div>}
              </div>
            </div>
          ))}
        </div>
        <style>{`
          @media (max-width: 860px) { .showcase-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 520px) { .showcase-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </div>
    </section>
  );
}

type GoogleReview = { author: string; photo: string; rating: number; text: string; time: string };

export function Testimonials() {
  const [data, setData] = useState<{ reviews: GoogleReview[]; rating: number; total: number; mapsUrl: string } | null>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let active = true;
    fetch('/api/yorumlar')
      .then(r => r.json())
      .then(d => { if (active) setData(d); })
      .catch(() => { if (active) setData({ reviews: [], rating: 0, total: 0, mapsUrl: '' }); });
    return () => { active = false; };
  }, []);

  const reviews = data?.reviews || [];

  useEffect(() => {
    if (reviews.length < 2) return;
    const t = setInterval(() => setIdx(i => (i + 1) % reviews.length), 8000);
    return () => clearInterval(t);
  }, [reviews.length]);

  if (!data || reviews.length === 0) return null;

  const r = reviews[idx];
  const text = r.text.length > 320 ? r.text.slice(0, 320).trimEnd() + '…' : r.text;

  return (
    <section style={{ padding: '140px 0', background: 'var(--accent-deep)', color: 'var(--paper)' }}>
      <div className="container" style={{ maxWidth: 900, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
          <span style={{ color: '#f5c542', fontSize: 20, letterSpacing: 2 }}>{'★'.repeat(Math.round(data.rating || 5))}</span>
          <span style={{ fontSize: 14, opacity: 0.85 }}>
            Google&apos;da {data.rating.toFixed(1)} · {data.total} değerlendirme
          </span>
        </div>

        <blockquote key={idx} className="serif fade-in" style={{ fontSize: 'clamp(20px, 2.6vw, 34px)', fontWeight: 300, lineHeight: 1.4, letterSpacing: '-0.01em', fontStyle: 'italic' }}>
          “{text}”
        </blockquote>

        <div style={{ marginTop: 36 }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{r.author}</div>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.7, marginTop: 6 }}>
            {'★'.repeat(Math.round(r.rating))} · {r.time}
          </div>
        </div>

        {reviews.length > 1 && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 40 }}>
            {reviews.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} style={{
                width: i === idx ? 32 : 8, height: 2, background: i === idx ? '#fff' : 'rgba(255,255,255,0.4)',
                border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.4s',
              }} />
            ))}
          </div>
        )}

        {data.mapsUrl && (
          <a href={data.mapsUrl} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 36,
            fontSize: 13, letterSpacing: '0.04em', color: '#fff',
            borderBottom: '1px solid rgba(255,255,255,0.4)', paddingBottom: 4, textDecoration: 'none',
          }}>
            Google&apos;da tüm yorumları gör →
          </a>
        )}
      </div>
    </section>
  );
}

export function PressLogos() {
  const logos = [
    'Mimar Sinan Üniversitesi',
    'Armada Otel',
    'Kent Üniversitesi',
    'Notre Dame de Sion Fransız Lisesi',
    'Dersaadet Restaurant',
    'Casa Kilyos',
    'Galata Olympos Restoran',
  ];
  return (
    <section style={{ padding: '60px 0', background: 'var(--paper)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
          <span className="overline" style={{ color: 'var(--ink-40)' }}>Güvenilen Markalar</span>
          {logos.map(l => (
            <span key={l} className="serif" style={{ fontSize: 22, color: 'var(--ink-40)', opacity: 0.75, fontStyle: l.length > 7 ? 'italic' : 'normal' }}>{l}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Process() {
  const steps = [
    { n: '01', title: 'Dinliyoruz', desc: 'Hikâyenizi, mekânınızı ve hayalinizi dikkatle dinliyoruz.' },
    { n: '02', title: 'Tasarlıyoruz', desc: 'Size özel konsept ve moodboard’u birlikte şekillendiriyoruz.' },
    { n: '03', title: 'Uyguluyoruz', desc: 'Atölyeden mekâna; her detayı zamanında ve özenle hayata geçiriyoruz.' },
    { n: '04', title: 'Anılarınızda oluyoruz', desc: 'Bir kare, kurutulmuş bir demet ya da gelecek yıl bir sürprizle yanınızdayız.' },
  ];
  return (
    <section style={{ padding: '120px 0', background: 'var(--paper)' }}>
      <div className="container">
        <SectionTitle eyebrow="Süreç" title={<>Tasarım gibi <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>çiçek.</em></>} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, marginTop: 70 }}>
          {steps.map((st, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div>
                <div className="serif" style={{ fontSize: 72, color: 'var(--accent)', opacity: 0.25, lineHeight: 1 }}>{st.n}</div>
                <h3 className="serif" style={{ fontSize: 26, marginTop: 16, fontWeight: 400 }}>{st.title}</h3>
                <p style={{ marginTop: 10, fontSize: 15, color: 'var(--ink-60)', lineHeight: 1.6 }}>{st.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTAStrip({ onQuote, onB2C }: { onQuote?: () => void; onB2C?: () => void }) {
  return (
    <section style={{ padding: '120px 0', color: 'var(--paper)', position: 'relative', overflow: 'hidden' }}>
      <img
        src="https://images.unsplash.com/photo-1608935387815-8963f8d5cf88?w=1900&q=80"
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(42,67,53,0.80), rgba(42,67,53,0.92))' }} />
      <div className="container" style={{ position: 'relative', textAlign: 'center', maxWidth: 820 }}>
        <h2 className="serif" style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
          Hayalindeki günü <em style={{ fontStyle: 'italic' }}>çiçekle</em> yaz.
        </h2>
        <p style={{ marginTop: 22, fontSize: 17, opacity: 0.88, maxWidth: 540, margin: '22px auto 0' }}>
          Kurumsal bir organizasyon mu, kişisel bir sürpriz mi — ne olursa olsun, ilham dinliyoruz.
        </p>
        <div style={{ display: 'flex', gap: 14, marginTop: 44, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="white" size="lg" onClick={onQuote} iconRight={<Icons.Arrow size={14} />}>Teklif Al</Button>
          <Button variant="ghost" size="lg" onClick={onB2C} style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.5)' }} iconRight={<Icons.Arrow size={14} />}>Özel Günlerim</Button>
        </div>
      </div>
    </section>
  );
}

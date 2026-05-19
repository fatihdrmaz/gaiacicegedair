'use client';

import { useEffect, useState } from 'react';
import { Button, FloralImage, Reveal, SectionTitle } from '@/components/ui';
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

export function Testimonials() {
  const items = [
    { text: 'Düğünümüzü bir hikâye gibi yaşadık. GAIA ekibinin her detaydaki özeni, misafirlerimiz tarafından bile fark edildi.', name: 'Ezgi & Can', role: 'Villa Melisa Düğünü' },
    { text: 'Lobi düzenlemelerimizde istikrarı ve yaratıcılığı bir arada bulmak kolay değil. GAIA ile çalışmak nefes aldırıyor.', name: 'Regnum Hotels',    role: 'Kurumsal Müşteri' },
    { text: 'Yıl dönümümüz için hazırladıkları masa düzenlemesi, evdeki o akşamı bir restorandan daha özel kıldı.', name: 'Burak A.', role: 'Özel Davet' },
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ padding: '140px 0', background: 'var(--accent-deep)', color: 'var(--paper)' }}>
      <div className="container" style={{ maxWidth: 900, textAlign: 'center' }}>
        <div style={{ color: 'var(--accent-soft)', marginBottom: 40 }}>
          <Icons.Quote size={36} />
        </div>
        <blockquote key={idx} className="serif fade-in" style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 300, lineHeight: 1.35, letterSpacing: '-0.01em', fontStyle: 'italic' }}>
          "{items[idx].text}"
        </blockquote>
        <div style={{ marginTop: 40 }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{items[idx].name}</div>
          <div style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.7, marginTop: 6 }}>{items[idx].role}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 48 }}>
          {items.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{
              width: i === idx ? 32 : 8, height: 2, background: i === idx ? '#fff' : 'rgba(255,255,255,0.4)',
              border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.4s',
            }} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function PressLogos() {
  const logos = ['Regnum', 'Maxx Royal', 'Akbank', 'TAV', 'Garanti BBVA', 'Limak Hotels', 'Kempinski', 'Koton'];
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
    <section style={{ padding: '120px 0', background: 'var(--accent)', color: 'var(--paper)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -80, right: -80, opacity: 0.18 }}>
        <FloralImage palette="sage" seed={100} ratio="1/1" style={{ width: 400, height: 400 }} />
      </div>
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

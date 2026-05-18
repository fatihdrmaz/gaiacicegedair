'use client';

import { useState, useEffect, useRef } from 'react';
import { SectionTitle } from '@/components/ui';
import { Icons } from '@/components/shared/icons';
import type { GalleryData } from '@/lib/gallery';

const BATCH = 12;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Gallery({ data }: { data: GalleryData }) {
  const [cat, setCat] = useState('all');
  const [lb, setLb] = useState<number | null>(null);
  const [imgs, setImgs] = useState(data.images);
  const [visible, setVisible] = useState(BATCH);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const tabs = [{ id: 'all', name: 'Tümü' }, ...data.categories];
  const catName = (id: string) => data.categories.find(c => c.id === id)?.name || '';
  const filtered = cat === 'all' ? imgs : imgs.filter(i => i.categoryId === cat);
  const shown = filtered.slice(0, visible);

  // Görselleri istemcide bir kez karıştır
  useEffect(() => { setImgs(shuffle(data.images)); }, [data.images]);

  // Kategori değişince listeyi başa al
  useEffect(() => { setVisible(BATCH); }, [cat]);

  // Sayfa sonuna yaklaşınca daha fazla görsel yükle
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) setVisible(v => Math.min(v + BATCH, filtered.length));
    }, { rootMargin: '500px' });
    io.observe(el);
    return () => io.disconnect();
  }, [filtered.length]);

  // Lightbox açıkken arka plan kaymasını kilitle + klavye desteği
  useEffect(() => {
    if (lb === null) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLb(null);
      else if (e.key === 'ArrowRight') setLb(i => (i === null ? i : (i + 1) % filtered.length));
      else if (e.key === 'ArrowLeft') setLb(i => (i === null ? i : (i - 1 + filtered.length) % filtered.length));
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [lb, filtered.length]);

  const current = lb !== null ? filtered[lb] : null;

  return (
    <section style={{ padding: '120px 0', background: 'var(--paper)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 30, marginBottom: 40 }}>
          <SectionTitle eyebrow="Galeri" title={<>Yapılan <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>işler.</em></>} />
        </div>

        {data.images.length === 0 ? (
          <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--ink-60)', fontSize: 16 }}>
            Galeri yakında — çalışmalarımız yükleniyor.
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 40 }}>
              {tabs.map(c => (
                <button key={c.id} onClick={() => setCat(c.id)} style={{
                  padding: '9px 18px', borderRadius: 999,
                  fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase',
                  background: cat === c.id ? 'var(--accent)' : 'transparent',
                  color: cat === c.id ? 'var(--paper)' : 'var(--ink)',
                  border: cat === c.id ? '1px solid var(--accent)' : '1px solid var(--line)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>{c.name}</button>
              ))}
            </div>

            <div style={{ columnCount: 4, columnGap: 14 }} className="masonry">
              {shown.map((it, idx) => (
                <div key={it.id} onClick={() => setLb(idx)} style={{ breakInside: 'avoid', marginBottom: 14, position: 'relative', overflow: 'hidden', borderRadius: 4, cursor: 'pointer' }}
                  className="masonry-item">
                  <img src={it.url} alt={it.title} loading="lazy" style={{ width: '100%', display: 'block' }} />
                  <div style={{
                    position: 'absolute', inset: 0, padding: 16,
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    color: '#fff', background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7))',
                    opacity: 0, transition: 'opacity 0.3s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
                    <div style={{ fontSize: 10, letterSpacing: '0.25em', opacity: 0.9 }}>{catName(it.categoryId).toUpperCase()}</div>
                    {it.title && <div className="serif" style={{ fontSize: 19, marginTop: 4 }}>{it.title}</div>}
                  </div>
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--ink-60)' }}>Bu kategoride henüz görsel yok.</div>
            )}
            {/* Sona yaklaşınca yeni görseller yüklenir */}
            <div ref={sentinelRef} style={{ height: 1 }} />
            {visible < filtered.length && (
              <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--ink-60)', fontSize: 13, letterSpacing: '0.1em' }}>
                Daha fazla yükleniyor…
              </div>
            )}
            <style>{`
              @media (min-width: 1500px){ .masonry { column-count: 5 !important; } }
              @media (max-width: 1024px){ .masonry { column-count: 3 !important; } }
              @media (max-width: 720px){ .masonry { column-count: 2 !important; } }
              @media (max-width: 460px){ .masonry { column-count: 1 !important; } }
            `}</style>
          </>
        )}
      </div>

      {current && (
        <div
          onClick={() => setLb(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(15,17,15,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
          }}
        >
          <button onClick={() => setLb(null)} aria-label="Kapat" style={{
            position: 'absolute', top: 20, right: 24, width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)', color: '#fff', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icons.Close size={22} />
          </button>

          {filtered.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLb((lb! - 1 + filtered.length) % filtered.length); }}
                aria-label="Önceki"
                style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Icons.ChevronLeft size={22} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLb((lb! + 1) % filtered.length); }}
                aria-label="Sonraki"
                style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Icons.Chevron size={22} />
              </button>
            </>
          )}

          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '88vh', textAlign: 'center' }}>
            <img src={current.url} alt={current.title} style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: 4 }} />
            <div style={{ marginTop: 14, color: '#fff' }}>
              <div style={{ fontSize: 11, letterSpacing: '0.22em', opacity: 0.7 }}>{catName(current.categoryId).toUpperCase()}</div>
              {current.title && <div className="serif" style={{ fontSize: 20, marginTop: 4 }}>{current.title}</div>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function FAQ() {
  const qs = [
    { q: 'Ne kadar önceden rezervasyon yapmalıyım?', a: 'Düğün gibi büyük etkinlikler için 3-6 ay önceden, küçük etkinlikler için 2-4 hafta önceden iletişime geçmenizi öneriyoruz. Yoğun sezon (Mayıs-Eylül) için erken rezervasyon önemli.' },
    { q: 'Hangi şehirlerde hizmet veriyorsunuz?', a: 'Ana atölyemiz İstanbul Beyoğlu\'nda. İstanbul, Ankara, İzmir, Bursa ve Antalya bölgelerinde düzenli olarak hizmet veriyoruz. Diğer şehirler için özel fiyatlandırma yapıyoruz.' },
    { q: 'Konsept tasarımı ücretli mi?', a: 'İlk görüşme ve moodboard tamamen ücretsiz. Detaylı konsept dosyası ve teknik çizim gerekiyorsa, paket kapsamına göre değerlendirme yapıyoruz.' },
    { q: 'Kurutulmuş çiçek hediye setleri için minimum sipariş var mı?', a: 'Kurumsal kurutulmuş çiçek hediyeleri için minimum 10 adet sipariş alıyoruz. Butik hediyelerde minimum yok.' },
    { q: 'Özel Günlerim abonelik sistemini nasıl iptal ederim?', a: 'Takviminizi dilediğiniz zaman düzenleyebilir veya tamamen iptal edebilirsiniz. Henüz gönderilmemiş çiçekler için iade yapıyoruz.' },
    { q: 'Son dakika sipariş alıyor musunuz?', a: 'İstanbul içi aynı gün teslimat yapabiliyoruz (siparişe göre). Diğer şehirler için en az 48 saat önceden bilgi almamız gerekir.' },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section style={{ padding: '120px 0', background: 'var(--paper-warm)' }}>
      <div className="container" style={{ maxWidth: 860 }}>
        <SectionTitle eyebrow="SSS" title={<>Sık sorulan <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>sorular.</em></>} align="center" maxWidth={700} />
        <div style={{ marginTop: 60 }}>
          {qs.map((it, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--line)' }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                padding: '26px 0', textAlign: 'left', cursor: 'pointer',
              }}>
                <span className="serif" style={{ fontSize: 22, fontWeight: 400 }}>{it.q}</span>
                <span style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.3s', color: 'var(--accent)' }}>
                  <Icons.Plus size={20} />
                </span>
              </button>
              <div style={{ maxHeight: open === i ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease, padding 0.4s', paddingBottom: open === i ? 26 : 0 }}>
                <p style={{ fontSize: 16, color: 'var(--ink-60)', lineHeight: 1.7, maxWidth: 680 }}>{it.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

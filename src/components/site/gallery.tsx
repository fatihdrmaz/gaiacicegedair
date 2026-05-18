'use client';

import { useState } from 'react';
import { SectionTitle } from '@/components/ui';
import { Icons } from '@/components/shared/icons';
import type { GalleryData } from '@/lib/gallery';

export function Gallery({ data }: { data: GalleryData }) {
  const [cat, setCat] = useState('all');
  const tabs = [{ id: 'all', name: 'Tümü' }, ...data.categories];
  const catName = (id: string) => data.categories.find(c => c.id === id)?.name || '';
  const filtered = cat === 'all' ? data.images : data.images.filter(i => i.categoryId === cat);

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

            <div style={{ columnCount: 3, columnGap: 16 }} className="masonry">
              {filtered.map((it) => (
                <div key={it.id} style={{ breakInside: 'avoid', marginBottom: 16, position: 'relative', overflow: 'hidden', borderRadius: 4 }}
                  className="masonry-item">
                  <img src={it.url} alt={it.title} style={{ width: '100%', display: 'block' }} />
                  <div style={{
                    position: 'absolute', inset: 0, padding: 18,
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    color: '#fff', background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7))',
                    opacity: 0, transition: 'opacity 0.3s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
                    <div style={{ fontSize: 10, letterSpacing: '0.25em', opacity: 0.9 }}>{catName(it.categoryId).toUpperCase()}</div>
                    {it.title && <div className="serif" style={{ fontSize: 22, marginTop: 4 }}>{it.title}</div>}
                  </div>
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--ink-60)' }}>Bu kategoride henüz görsel yok.</div>
            )}
            <style>{`@media (max-width: 900px){ .masonry { column-count: 2 !important; } } @media (max-width: 520px){ .masonry { column-count: 1 !important; } }`}</style>
          </>
        )}
      </div>
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

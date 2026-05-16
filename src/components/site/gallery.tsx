'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, FloralImage, Reveal, SectionTitle } from '@/components/ui';
import { Icons } from '@/components/shared/icons';
import { IMAGES } from '@/components/site/images';

export function Gallery({ preview = false }: { preview?: boolean }) {
  const categories = ['Tümü', 'Düğün', 'Kurumsal', 'Tekne', 'Mekan', 'Doğum Günü', 'Kurutulmuş'];
  const [cat, setCat] = useState('Tümü');

  const items = [
    { cat: 'Düğün',       img: 'wedding',   title: 'Villa Melisa', meta: 'Kır Düğünü · Antalya' },
    { cat: 'Kurumsal',    img: 'corporate', title: 'Regnum Lobi',   meta: 'Karşılama Düzenlemesi' },
    { cat: 'Tekne',       img: 'venue',     title: 'Boğaz Teknesi', meta: 'Düğün Organizasyonu' },
    { cat: 'Kurutulmuş',  img: 'dried',     title: 'Akbank Set',    meta: 'Kurumsal Hediye' },
    { cat: 'Düğün',       img: 'aisle',     title: 'Gelin Yolu',     meta: 'Tören Alanı' },
    { cat: 'Doğum Günü',  img: 'birthday',  title: 'Pastel Gün',     meta: 'Doğum Günü' },
    { cat: 'Kurumsal',    img: 'lobby',     title: 'Otel Lobisi',    meta: 'Haftalık Abonelik' },
    { cat: 'Peyzaj',      img: 'landscape', title: 'Teras Bahçe',    meta: 'Dış Alan Tasarım' },
    { cat: 'Düğün',       img: 'arch',      title: 'Nikah Arkı',     meta: 'Dini Nikâh' },
    { cat: 'Kurumsal',    img: 'welcome',   title: 'Açılış Buketi',  meta: 'Kutlama' },
    { cat: 'Kurutulmuş',  img: 'gift',      title: 'Butik Hediye',   meta: 'Promosyon' },
    { cat: 'Düğün',       img: 'centerpc',  title: 'Sunum Masası',   meta: 'Düğün Detayı' },
  ];
  const filtered = cat === 'Tümü' ? items : items.filter(i => i.cat === cat);
  const list = preview ? filtered.slice(0, 6) : filtered;

  return (
    <section style={{ padding: '120px 0', background: 'var(--paper)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 30, marginBottom: 40 }}>
          <SectionTitle eyebrow="Galeri" title={<>Yapılan <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>işler.</em></>} />
        </div>

        {!preview && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 40 }}>
            {categories.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: '9px 18px', borderRadius: 999,
                fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase',
                background: cat === c ? 'var(--accent)' : 'transparent',
                color: cat === c ? 'var(--paper)' : 'var(--ink)',
                border: cat === c ? '1px solid var(--accent)' : '1px solid var(--line)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>{c}</button>
            ))}
          </div>
        )}

        <div style={{ columnCount: 3, columnGap: 16 }} className="masonry">
          {list.map((it, i) => {
            const im: any = (IMAGES as any)[it.img];
            if (!im) return null;
            return (
              <div key={i} style={{ breakInside: 'avoid', marginBottom: 16, position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
                className="masonry-item">
                <FloralImage palette={im.palette} seed={im.seed + i * 2} photo={im.photo} ratio={i % 3 === 0 ? '3/4' : i % 3 === 1 ? '1/1' : '4/5'} />
                <div style={{
                  position: 'absolute', inset: 0, padding: 18,
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  color: '#fff', background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7))',
                  opacity: 0, transition: 'opacity 0.3s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
                  <div style={{ fontSize: 10, letterSpacing: '0.25em', opacity: 0.9 }}>{it.cat.toUpperCase()}</div>
                  <div className="serif" style={{ fontSize: 22, marginTop: 4 }}>{it.title}</div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{it.meta}</div>
                </div>
              </div>
            );
          })}
        </div>
        <style>{`@media (max-width: 900px){ .masonry { column-count: 2 !important; } } @media (max-width: 520px){ .masonry { column-count: 1 !important; } }`}</style>

        {preview && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
            <Link href="/galeri" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" iconRight={<Icons.Arrow size={14} />}>Tüm Galeriyi Gör</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function InstagramFeed() {
  const posts = ['wedding','corporate','venue','dried','birthday','lobby'];
  return (
    <section style={{ padding: '100px 0', background: 'var(--paper)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
          <SectionTitle eyebrow="Instagram" title="@gaia.cicegedair" />
          <a style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent)' }}>
            <Icons.Instagram size={18} /> Takip Et
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }} className="ig-grid">
          {posts.map((p, i) => {
            const im: any = (IMAGES as any)[p];
            return (
              <div key={i} style={{ aspectRatio: '1/1', position: 'relative', cursor: 'pointer', overflow: 'hidden' }}>
                <FloralImage palette={im.palette} seed={im.seed + 50} photo={im.photo} ratio="1/1" />
              </div>
            );
          })}
        </div>
        <style>{`@media (max-width: 760px){ .ig-grid { grid-template-columns: repeat(3, 1fr) !important; } }`}</style>
      </div>
    </section>
  );
}

export function FAQ() {
  const qs = [
    { q: 'Ne kadar önceden rezervasyon yapmalıyım?', a: 'Düğün gibi büyük etkinlikler için 3-6 ay önceden, küçük etkinlikler için 2-4 hafta önceden iletişime geçmenizi öneriyoruz. Yoğun sezon (Mayıs-Eylül) için erken rezervasyon önemli.' },
    { q: 'Hangi şehirlerde hizmet veriyorsunuz?', a: 'Ana atölyemiz Antalya\'da. Antalya, İstanbul, İzmir, Bodrum ve Muğla bölgelerinde düzenli olarak hizmet veriyoruz. Diğer şehirler için özel fiyatlandırma yapıyoruz.' },
    { q: 'Konsept tasarımı ücretli mi?', a: 'İlk görüşme ve moodboard tamamen ücretsiz. Detaylı konsept dosyası ve teknik çizim gerekiyorsa, paket kapsamına göre değerlendirme yapıyoruz.' },
    { q: 'Kurutulmuş çiçek hediye setleri için minimum sipariş var mı?', a: 'Kurumsal kurutulmuş çiçek hediyeleri için minimum 10 adet sipariş alıyoruz. Butik hediyelerde minimum yok.' },
    { q: 'Özel Günlerim abonelik sistemini nasıl iptal ederim?', a: 'Takviminizi dilediğiniz zaman düzenleyebilir veya tamamen iptal edebilirsiniz. Henüz gönderilmemiş çiçekler için iade yapıyoruz.' },
    { q: 'Son dakika sipariş alıyor musunuz?', a: 'Antalya içi aynı gün teslimat yapabiliyoruz (siparişe göre). Diğer şehirler için en az 48 saat önceden bilgi almamız gerekir.' },
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

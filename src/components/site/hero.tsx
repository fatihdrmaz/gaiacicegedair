'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, FloralImage } from '@/components/ui';
import { Icons } from '@/components/shared/icons';
import { IMAGES } from '@/components/site/images';

type HeroProps = {
  onCTA?: (k: string) => void;
  variant?: 'slideshow' | 'split' | 'editorial';
};

export function Hero({ onCTA, variant = 'slideshow' }: HeroProps) {
  if (variant === 'split') return <HeroSplit onCTA={onCTA} />;
  if (variant === 'editorial') return <HeroEditorial onCTA={onCTA} />;
  return <HeroSlideshow onCTA={onCTA} />;
}

export function HeroSlideshow({ onCTA }: { onCTA?: (k: string) => void }) {
  const [idx, setIdx] = useState(0);
  const slides = [
    { img: 'wedding',   tag: 'Düğün Organizasyonu', title: 'Hayatının anlamını\nçiçeklerle anlat.', sub: 'Nikâh masasından gelin buketine — her detay bir duygu.' },
    { img: 'corporate', tag: 'Kurumsal',            title: 'Mekânınıza\nnefes verin.',          sub: 'Lobi, toplantı masası, açılış organizasyonları.' },
    { img: 'venue',     tag: 'Mekan Süsleme',       title: 'Mekânı, anının\nbir parçası kıl.',   sub: 'Restoran, teras, villa — sezonluk veya tek seferlik.' },
    { img: 'dried',     tag: 'Kurutulmuş Çiçek',    title: 'Zamanı durduran\nbir hediye.',       sub: 'Kurumsal promosyon ve butik hediyeler.' },
  ];
  const s = slides[idx];

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ position: 'relative', height: '100vh', minHeight: 640, overflow: 'hidden' }}>
      {slides.map((sl, i) => {
        const im: any = (IMAGES as any)[sl.img];
        return (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            opacity: i === idx ? 1 : 0,
            transition: 'opacity 1.2s ease',
          }}>
            <div style={{ position: 'absolute', inset: 0, animation: i === idx ? 'slowZoom 8s ease-out both' : 'none' }}>
              <FloralImage palette={im.palette} seed={im.seed + i * 3} photo={im.photo} ratio="auto" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.55) 100%)' }} />
          </div>
        );
      })}

      <div style={{ position: 'absolute', top: 110, left: 0, right: 0, textAlign: 'center', zIndex: 2 }}>
        <span style={{ color: 'rgba(255,255,255,0.92)', fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
          ◦ &nbsp; {s.tag} &nbsp; ◦
        </span>
      </div>

      <div className="container" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', zIndex: 2 }}>
        <div style={{ maxWidth: 780 }}>
          <h1 key={idx} className="serif fade-in" style={{
            fontSize: 'clamp(48px, 8vw, 110px)',
            fontWeight: 400,
            lineHeight: 1.02,
            color: '#fff',
            letterSpacing: '-0.015em',
            whiteSpace: 'pre-line',
          }}>
            {s.title}
          </h1>
          <p key={'s' + idx} className="fade-in" style={{
            marginTop: 28,
            color: 'rgba(255,255,255,0.92)',
            fontSize: 'clamp(16px, 1.4vw, 19px)',
            lineHeight: 1.55,
            maxWidth: 520,
            animationDelay: '0.15s',
          }}>
            {s.sub}
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 44, flexWrap: 'wrap' }}>
            <Button variant="white" size="lg" onClick={() => onCTA && onCTA('quote')} iconRight={<Icons.Arrow size={14} />}>
              Teklif Al
            </Button>
            <Link href="/ozel-gunlerim" style={{ textDecoration: 'none' }}>
              <Button variant="ghost" size="lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)', borderWidth: 1, borderStyle: 'solid' }}
                iconRight={<Icons.Arrow size={14} />}>
                Özel Günlerim
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 50, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 3 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{
            width: i === idx ? 40 : 14, height: 2,
            background: i === idx ? '#fff' : 'rgba(255,255,255,0.4)',
            transition: 'all 0.4s', cursor: 'pointer', border: 'none', padding: 0,
          }} />
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 40, right: 40, color: '#fff', display: 'flex', alignItems: 'center', gap: 10, zIndex: 3 }}>
        <span style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Keşfet</span>
        <div style={{ width: 1, height: 40, background: '#fff', animation: 'pulse 2s ease-in-out infinite' }} />
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity: 1; transform: scaleY(1); transform-origin: top; } 50% { opacity: 0.3; transform: scaleY(0.3); } }
      `}</style>
    </section>
  );
}

export function HeroSplit({ onCTA }: { onCTA?: (k: string) => void }) {
  return (
    <section style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.1fr 1fr', paddingTop: 90 }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '60px 40px 60px 60px' }}>
        <div style={{ maxWidth: 620 }}>
          <div className="overline" style={{ color: 'var(--accent)', marginBottom: 24 }}>◦ Çiçeğe Dair Her Şey</div>
          <h1 className="serif" style={{ fontSize: 'clamp(48px, 6.2vw, 96px)', fontWeight: 400, lineHeight: 1.02, letterSpacing: '-0.02em' }}>
            Anınızı<br />
            <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>çiçekle</span> yazın.
          </h1>
          <p style={{ marginTop: 28, fontSize: 18, color: 'var(--ink-60)', lineHeight: 1.6, maxWidth: 480 }}>
            Düğünden kurumsal lobiye, mekan süslemesinden kurutulmuş hediyelere — GAIA atölyesi, her etkinliğinizi tasarım gibi düşünür.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 44, flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" onClick={() => onCTA && onCTA('quote')} iconRight={<Icons.Arrow size={14} />}>Teklif Al</Button>
            <Link href="/ozel-gunlerim" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" size="lg">Özel Günlerim</Button>
            </Link>
          </div>

          <div style={{ marginTop: 70, display: 'flex', gap: 40 }}>
            {[['12+','Yıl'],['580+','Etkinlik'],['36+','Kurumsal Müşteri']].map(([n, l]) => (
              <div key={l}>
                <div className="serif" style={{ fontSize: 42, color: 'var(--accent)' }}>{n}</div>
                <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-40)', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <FloralImage palette="creamPink" seed={3} ratio="auto" style={{ height: '100%' }} photo="heroWedding" />
        <div style={{ position: 'absolute', right: 30, bottom: 30, background: 'rgba(250,249,246,0.92)', backdropFilter: 'blur(10px)', padding: '18px 24px', maxWidth: 240 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--accent)', marginBottom: 8 }}>
            <Icons.Star size={14} /><Icons.Star size={14} /><Icons.Star size={14} /><Icons.Star size={14} /><Icons.Star size={14} />
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink-60)', lineHeight: 1.5 }}>"GAIA düğünümü şiir gibi yaşattı."</p>
          <p style={{ fontSize: 11, color: 'var(--ink-40)', marginTop: 6, letterSpacing: '0.1em' }}>— Ezgi & Can</p>
        </div>
      </div>
      <style>{`@media (max-width: 900px){ section[style*="grid-template-columns"]{ grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

export function HeroEditorial({ onCTA }: { onCTA?: (k: string) => void }) {
  return (
    <section style={{ minHeight: '100vh', paddingTop: 140, paddingBottom: 80, position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 1100, margin: '0 auto' }}>
          <div className="overline" style={{ color: 'var(--accent)', marginBottom: 20 }}>Est. Antalya · 2013</div>
          <h1 className="serif" style={{ fontSize: 'clamp(60px, 11vw, 170px)', fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.03em' }}>
            Çiçeğe <span style={{ fontStyle: 'italic' }}>Dair</span><br />
            her <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>his.</span>
          </h1>
          <p style={{ marginTop: 30, fontSize: 19, color: 'var(--ink-60)', maxWidth: 520, margin: '30px auto 0', lineHeight: 1.6 }}>
            Bir atölye, bir duygu dili. Düğünlerden kurumsal alanlara, özel günlerinizden günlük sürprizlere — çiçeği tasarlıyoruz.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 70 }}>
          {['wedding','corporate','dried','lobby'].map((k, i) => {
            const im: any = (IMAGES as any)[k];
            return (
              <div key={k} style={{ aspectRatio: '3/4', overflow: 'hidden', transform: i % 2 ? 'translateY(40px)' : 'none' }}>
                <FloralImage palette={im.palette} seed={im.seed} photo={im.photo} style={{ height: '100%' }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 80, justifyContent: 'center' }}>
          <Button variant="primary" size="lg" onClick={() => onCTA && onCTA('quote')} iconRight={<Icons.Arrow size={14} />}>Teklif Al</Button>
          <Link href="/hizmetler" style={{ textDecoration: 'none' }}>
            <Button variant="outlined" size="lg">Hizmetler</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

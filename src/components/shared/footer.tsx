'use client';

import Link from 'next/link';
import { Icons } from '@/components/shared/icons';
import { Logo as GaiaLogo } from '@/components/shared/logo';

type Col = { title: string; items: [string, string][] };

const cols: Col[] = [
  { title: 'Hizmetler', items: [
    ['Düğün Organizasyonu', '/hizmetler/wedding'],
    ['Kurumsal Organizasyon', '/hizmetler/corporate'],
    ['Doğum Günü', '/hizmetler/birthday'],
    ['Peyzaj Düzenleme', '/hizmetler/landscape'],
  ]},
  { title: 'Kurumsal', items: [
    ['Hakkımızda', '/hakkimizda'],
    ['Galeri', '/galeri'],
    ['Blog & Rehber', '/blog'],
    ['Özel Günlerim', '/ozel-gunlerim'],
    ['İletişim', '/iletisim'],
  ]},
];

function PaymentLogos() {
  const chip: import('react').CSSProperties = {
    background: '#fff', borderRadius: 4, padding: '6px 12px',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 32,
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <img src="/payment/iyzico.svg" alt="iyzico ile Öde" style={{ height: 30, opacity: 0.95 }} />
      <span style={chip}><img src="/payment/visa.svg" alt="Visa" style={{ height: 18, display: 'block' }} /></span>
      <span style={chip}><img src="/payment/mastercard.svg" alt="MasterCard" style={{ height: 24, display: 'block' }} /></span>
    </div>
  );
}

export function Footer({ onQuote }: { onQuote?: () => void }) {
  return (
    <footer style={{ background: 'var(--accent-deep)', color: 'var(--paper)', paddingTop: 90, paddingBottom: 30 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 50 }} className="footer-grid">
          <div>
            <div style={{ color: '#fff' }}>
              <GaiaLogo size={42} color="#fff" stacked={false} tagline />
            </div>
            <p style={{ marginTop: 20, fontSize: 15, lineHeight: 1.6, opacity: 0.78, maxWidth: 360 }}>
              Çiçeği bir tasarım nesnesi olarak düşünen butik atölye. İstanbul'dan Türkiye'ye.
            </p>
            <div style={{ marginTop: 20, fontSize: 14, lineHeight: 1.7, opacity: 0.8 }}>
              <div>Gümüşsuyu Mah. Mebusan Yokuşu No: 6/B, Beyoğlu/İstanbul</div>
              <div>
                <a href="tel:+905312123267" style={{ color: 'inherit', textDecoration: 'none' }}>+90 531 212 32 67</a>
                {' · '}
                <a href="mailto:info@cicegedair.com" style={{ color: 'inherit', textDecoration: 'none' }}>info@cicegedair.com</a>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <SocialIcon icon="Instagram" href="https://instagram.com/gaiacicegedair" />
              <SocialIcon icon="Whatsapp" href="https://wa.me/905312123267" />
              <SocialIcon icon="Mail" href="mailto:info@cicegedair.com" />
            </div>
            {onQuote && (
              <button onClick={onQuote} style={{ marginTop: 24, fontSize: 13, color: '#fff', opacity: 0.85, background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                Teklif Al
              </button>
            )}
          </div>
          {cols.map((c, i) => (
            <div key={i}>
              <div className="overline" style={{ marginBottom: 18, opacity: 0.7 }}>{c.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {c.items.map(([label, href], j) => (
                  <li key={j}>
                    <Link href={href} style={{ cursor: 'pointer', fontSize: 14, opacity: 0.85, color: 'inherit', textDecoration: 'none' }}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 60, paddingTop: 30, borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }} className="footer-payment">
          <div>
            <div className="overline" style={{ marginBottom: 10, opacity: 0.7, fontSize: 11 }}>Güvenli Ödeme</div>
            <PaymentLogos />
          </div>
          <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.55, textAlign: 'right', maxWidth: 360 }}>
            Kredi kartı ödemeleriniz iyzico altyapısı üzerinden 256-bit SSL ile şifrelenerek alınır. Kart bilgileriniz sitemizde saklanmaz.
          </div>
        </div>
        <div style={{ marginTop: 30, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, fontSize: 12, opacity: 0.7, letterSpacing: '0.08em' }}>
          <div>© 2026 GAIA Çiçeğe Dair · Tüm Hakları Saklıdır</div>
          <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
            <Link href="/gizlilik" style={{ color: 'inherit', textDecoration: 'none' }}>Gizlilik</Link>
            <Link href="/kvkk" style={{ color: 'inherit', textDecoration: 'none' }}>KVKK</Link>
            <Link href="/cerez-politikasi" style={{ color: 'inherit', textDecoration: 'none' }}>Çerezler</Link>
            <Link href="/mesafeli-satis-sozlesmesi" style={{ color: 'inherit', textDecoration: 'none' }}>Mesafeli Satış Sözleşmesi</Link>
            <Link href="/teslimat-iade" style={{ color: 'inherit', textDecoration: 'none' }}>Teslimat ve İade</Link>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px){ .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 520px){ .footer-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 700px){ .footer-payment { flex-direction: column; align-items: flex-start !important; } .footer-payment > div:last-child { text-align: left !important; } }
      `}</style>
    </footer>
  );
}

function SocialIcon({ icon, href }: { icon: string; href?: string }) {
  const I = (Icons as any)[icon];
  return (
    <a
      href={href}
      target={href && href.startsWith('http') ? '_blank' : undefined}
      rel={href && href.startsWith('http') ? 'noopener noreferrer' : undefined}
      style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}
    >
      <I size={16} />
    </a>
  );
}

'use client';

import { useState } from 'react';
import { Button, Field, Input, TextArea } from '@/components/ui';
import { Icons } from '@/components/shared/icons';

export function Contact({ full = false }: { full?: boolean }) {
  const [sent, setSent] = useState(false);
  return (
    <section style={{ padding: full ? '160px 0 100px' : '120px 0', background: 'var(--paper)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'flex-start' }} className="contact-grid">
          <div>
            <div className="overline" style={{ color: 'var(--accent)', marginBottom: 18 }}>İletişim</div>
            <h2 className="serif" style={{ fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em' }}>
              Çiçek gibi,<br/><em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>hikâyenizi</em> dinleyelim.
            </h2>
            <p style={{ marginTop: 20, color: 'var(--ink-60)', fontSize: 16, lineHeight: 1.6, maxWidth: 440 }}>
              Atölyeye uğrayın, arayın ya da yazın — size en uygun yolu seçin.
            </p>

            <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <ContactRow icon="MapPin" label="Atölye" value="Konyaaltı, Antalya · Liman Mah. No:14" />
              <ContactRow icon="Phone" label="Telefon" value="+90 532 000 00 00" />
              <ContactRow icon="Mail" label="E-posta" value="merhaba@cicegedair.com" />
              <ContactRow icon="Clock" label="Çalışma Saatleri" value="Pzt–Cmt · 09:00 – 19:00" />
              <ContactRow icon="Instagram" label="Instagram" value="@gaia.cicegedair" />
            </div>
          </div>

          <div style={{ background: 'var(--paper-warm)', padding: '48px 44px' }}>
            <div className="overline" style={{ color: 'var(--accent)', marginBottom: 16 }}>Hızlı Mesaj</div>
            <h3 className="serif" style={{ fontSize: 30, fontWeight: 400, marginBottom: 30 }}>Bize yazın</h3>
            {sent ? (
              <div style={{ padding: '30px 0', textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, margin: '0 auto', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.Check size={26} />
                </div>
                <div className="serif" style={{ fontSize: 24, marginTop: 20 }}>Mesajınız ulaştı</div>
                <p style={{ color: 'var(--ink-60)', marginTop: 8 }}>24 saat içinde size döneceğiz.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: 'grid', gap: 24 }}>
                <Field label="Ad Soyad"><Input placeholder="Adınız" required /></Field>
                <Field label="E-posta"><Input type="email" placeholder="ornek@email.com" required /></Field>
                <Field label="Telefon"><Input placeholder="+90" /></Field>
                <Field label="Mesaj"><TextArea placeholder="Nasıl yardımcı olabiliriz?" rows={4} /></Field>
                <Button variant="primary" type="submit" size="lg" iconRight={<Icons.Arrow size={14} />}>Gönder</Button>
              </form>
            )}
          </div>
        </div>
        <style>{`@media (max-width: 860px){ .contact-grid { grid-template-columns: 1fr !important; gap: 50px !important; } }`}</style>
      </div>
    </section>
  );
}

export function ContactRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  const I = (Icons as any)[icon];
  return (
    <div style={{ display: 'flex', gap: 18 }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid var(--accent)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <I size={18} />
      </div>
      <div>
        <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-40)' }}>{label}</div>
        <div style={{ fontSize: 16, marginTop: 4 }}>{value}</div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Field, Input, Select, TextArea } from '@/components/ui';
import { Icons } from '@/components/shared/icons';

export const PACKAGES = [
  { id: 'mini',    name: 'Mini',    price: 450,  desc: 'Küçük, zarif bir buket · tek odak çiçek',  items: ['7-9 gövde taze çiçek', 'El sarımı', 'Kart & not', 'Standart teslimat'] },
  { id: 'klasik',  name: 'Klasik',  price: 850,  desc: 'Klasik butik buket · mevsimin en iyisi',     items: ['15-20 gövde mevsim çiçeği', 'Kraft + saten sunum', 'Kart & kişisel not', 'Tercih edilen saate teslimat'] },
  { id: 'premium', name: 'Premium', price: 1600, desc: 'Özel tasarım aranjman · sandığında servis',  items: ['Özel tasarım aranjman', 'Premium sunum kutusu', 'Kişisel mesaj kartı', 'Çiçek + çikolata / mum seçeneği', 'Dakikası takip edilebilir teslimat'] },
  { id: 'luks',    name: 'Lüks',    price: 3200, desc: 'Unutulmaz bir sahne · özel konsept',          items: ['Özel konsept aranjman', 'Seramik / cam vazo hediyeli', 'Premium hediye setleri', 'Kişiye özel video kart', 'VIP randevulu teslimat'] },
];

export const OCCASIONS = [
  { id: 'birthday', label: 'Doğum Günü', icon: 'Cake' },
  { id: 'anniv',    label: 'Yıl Dönümü', icon: 'Heart' },
  { id: 'mom',      label: 'Annem',      icon: 'Flower' },
  { id: 'dad',      label: 'Babam',      icon: 'Flower' },
  { id: 'val',      label: 'Sevgililer Günü', icon: 'Heart' },
  { id: 'thanks',   title: 'Teşekkür',   icon: 'Gift' },
  { id: 'other',    label: 'Diğer',      icon: 'Sparkle' },
];

type Day = {
  id: number; name: string; date: string; occasion: string;
  recipient: string; address: string; time: string; note: string;
  concept: string; package: string;
};

export function B2CPage() {
  const [step, setStep] = useState(0);
  const [days, setDays] = useState<Day[]>([
    { id: 1, name: 'Eşimin Doğum Günü', date: '2026-05-16', occasion: 'Doğum Günü', recipient: '',  address: '', time: '10:00', note: '', concept: 'Romantik', package: 'klasik' },
  ]);
  const [confirmed, setConfirmed] = useState(false);

  // iyzico ödeme dönüşünde ?odeme=basarili ile gelir
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('odeme') === 'basarili') {
      setConfirmed(true);
      window.history.replaceState({}, '', '/ozel-gunlerim');
    }
  }, []);

  const addDay = () => setDays(ds => [...ds, {
    id: Date.now(), name: '', date: '', occasion: 'Doğum Günü',
    recipient: '', address: '', time: '10:00', note: '', concept: 'Klasik', package: 'klasik',
  }]);
  const removeDay = (id: number) => setDays(ds => ds.filter(d => d.id !== id));
  const updateDay = (id: number, patch: Partial<Day>) => setDays(ds => ds.map(d => d.id === id ? { ...d, ...patch } : d));

  const total = days.reduce((s, d) => s + (PACKAGES.find(p => p.id === d.package)?.price || 0), 0);
  const steps = ['Özel Günler', 'Detaylar', 'Paketler', 'Özet'];

  return (
    <section style={{ paddingTop: 130, paddingBottom: 80, background: 'var(--paper)' }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div className="overline" style={{ color: 'var(--accent)', marginBottom: 16 }}>B2C · Özel Günler Aboneliği</div>
          <h1 className="serif" style={{ fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 400, lineHeight: 1.05 }}>
            Her özel günü <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>bir kez</em> planla,
          </h1>
          <h1 className="serif" style={{ fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 400, lineHeight: 1.05 }}>
            yıl boyunca unutulma.
          </h1>
          <p style={{ marginTop: 22, color: 'var(--ink-60)', fontSize: 17, maxWidth: 600, margin: '22px auto 0' }}>
            Özel günlerinizi girin, paketi seçin, toplu ödemenizi yapın — o günlerde çiçekler sizin adınıza gitsin.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 60, flexWrap: 'wrap' }}>
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  border: `1px solid ${step >= i ? 'var(--accent)' : 'var(--ink-20)'}`,
                  background: step >= i ? 'var(--accent)' : 'transparent',
                  color: step >= i ? '#fff' : 'var(--ink-40)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500,
                }}>{step > i ? <Icons.Check size={14} /> : i + 1}</div>
                <span style={{ fontSize: 12.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: step >= i ? 'var(--ink)' : 'var(--ink-40)' }}>{s}</span>
              </div>
              {i < steps.length - 1 && <div style={{ width: 40, height: 1, background: step > i ? 'var(--accent)' : 'var(--ink-20)' }} />}
            </React.Fragment>
          ))}
        </div>

        {confirmed ? <B2CConfirm total={total} days={days} onReset={() => { setConfirmed(false); setStep(0); }} />
          : step === 0 ? <B2CStep1 days={days} addDay={addDay} removeDay={removeDay} updateDay={updateDay} onNext={() => setStep(1)} />
          : step === 1 ? <B2CStep2 days={days} updateDay={updateDay} onBack={() => setStep(0)} onNext={() => setStep(2)} />
          : step === 2 ? <B2CStep3 days={days} updateDay={updateDay} onBack={() => setStep(1)} onNext={() => setStep(3)} />
          :              <B2CStep4 days={days} total={total} onBack={() => setStep(2)} onConfirm={() => setConfirmed(true)} />
        }
      </div>
    </section>
  );
}

export function B2CStep1({ days, addDay, removeDay, updateDay, onNext }: { days: Day[]; addDay: () => void; removeDay: (id: number) => void; updateDay: (id: number, patch: Partial<Day>) => void; onNext: () => void }) {
  return (
    <div>
      <h2 className="serif" style={{ fontSize: 30, marginBottom: 10, fontWeight: 400 }}>Özel günlerini ekle</h2>
      <p style={{ color: 'var(--ink-60)', marginBottom: 14 }}>Yıl boyunca hatırlamak istediğin günleri bir kerede gir.</p>
      <div style={{ marginBottom: 30, padding: '10px 14px', background: 'var(--accent-soft)', color: 'var(--accent-deep)', borderRadius: 6, fontSize: 13 }}>
        ℹ Teslimat yalnızca <strong>İstanbul içinde</strong> geçerlidir. Tarih, en erken bugünden 2 gün sonrası seçilebilir.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {days.map((d, i) => (
          <div key={d.id} style={{
            display: 'grid', gridTemplateColumns: '60px 1.5fr 1fr 1.2fr 40px', gap: 20, alignItems: 'center',
            padding: 22, background: 'var(--paper-warm)', border: '1px solid var(--line)',
          }} className="b2c-row">
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icons.Calendar size={20} />
            </div>
            <Field label="Günün Adı"><Input value={d.name} onChange={(e: any) => updateDay(d.id, { name: e.target.value })} placeholder="Örn: Annemin Doğum Günü" /></Field>
            <Field label="Tarih"><Input type="date" min={new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10)} max={new Date(Date.now() + 367 * 86400000).toISOString().slice(0, 10)} value={d.date} onChange={(e: any) => updateDay(d.id, { date: e.target.value })} /></Field>
            <Field label="Vesile"><Select value={d.occasion} onChange={(e: any) => updateDay(d.id, { occasion: e.target.value })} options={['Doğum Günü','Yıl Dönümü','Anneler Günü','Babalar Günü','Sevgililer Günü','Teşekkür','Diğer']} /></Field>
            {days.length > 1 && (
              <button onClick={() => removeDay(d.id)} style={{ color: 'var(--ink-40)', padding: 8 }}>
                <Icons.Trash size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      <button onClick={addDay} style={{
        marginTop: 16, padding: '16px 24px', width: '100%', border: '1px dashed var(--accent)', color: 'var(--accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', background: 'transparent',
        fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase',
      }}>
        <Icons.Plus size={16} /> Bir Gün Daha Ekle
      </button>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 40 }}>
        <Button variant="primary" size="lg" onClick={onNext} iconRight={<Icons.Arrow size={14} />}>Devam Et</Button>
      </div>

      <style>{`@media (max-width: 800px){ .b2c-row { grid-template-columns: 1fr !important; gap: 14px !important; } }`}</style>
    </div>
  );
}

export function B2CStep2({ days, updateDay, onBack, onNext }: { days: Day[]; updateDay: (id: number, patch: Partial<Day>) => void; onBack: () => void; onNext: () => void }) {
  const concepts = ['Romantik','Klasik','Modern','Minimalist','Vintage','Renkli','Pastel','Lüks'];
  return (
    <div>
      <h2 className="serif" style={{ fontSize: 30, marginBottom: 10, fontWeight: 400 }}>Her gün için detaylar</h2>
      <p style={{ color: 'var(--ink-60)', marginBottom: 30 }}>Kime, nereye, hangi konseptle gideceğini belirle.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {days.map((d, i) => (
          <div key={d.id} style={{ padding: 30, background: 'var(--paper-warm)', border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 500 }}>
                {i + 1}
              </div>
              <div>
                <div className="serif" style={{ fontSize: 22 }}>{d.name || '(Adsız Gün)'}</div>
                <div style={{ fontSize: 12, letterSpacing: '0.2em', color: 'var(--ink-40)' }}>{d.date} · {d.occasion.toUpperCase()}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="form-grid">
              <Field label="Kime gidecek?" required>
                <Input value={d.recipient} onChange={(e: any) => updateDay(d.id, { recipient: e.target.value })} placeholder="Örn: Ayşe Yılmaz" />
              </Field>
              <Field label="Teslimat Saati">
                <Input type="time" value={d.time} onChange={(e: any) => updateDay(d.id, { time: e.target.value })} />
              </Field>
              <Field label="Adres" required span={2}>
                <Input value={d.address} onChange={(e: any) => updateDay(d.id, { address: e.target.value })} placeholder="Sokak, No, Mahalle, İlçe, Şehir" />
              </Field>
              <Field label="Konsept / Stil" span={2}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {concepts.map(c => (
                    <button key={c} type="button" onClick={() => updateDay(d.id, { concept: c })} style={{
                      padding: '8px 16px', borderRadius: 999, fontSize: 12.5,
                      background: d.concept === c ? 'var(--accent)' : 'transparent',
                      color: d.concept === c ? '#fff' : 'var(--ink)',
                      border: `1px solid ${d.concept === c ? 'var(--accent)' : 'var(--line)'}`,
                      cursor: 'pointer', letterSpacing: '0.05em',
                    }}>{c}</button>
                  ))}
                </div>
              </Field>
              <Field label="Kart Notu" span={2}>
                <TextArea value={d.note} onChange={(e: any) => updateDay(d.id, { note: e.target.value })} placeholder="Çiçekle birlikte gidecek mesaj (maks 200 karakter)" rows={2} maxLength={200} />
              </Field>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
        <Button variant="ghost" onClick={onBack} icon={<Icons.ArrowLeft size={14} />}>Geri</Button>
        <Button variant="primary" size="lg" onClick={onNext} iconRight={<Icons.Arrow size={14} />}>Paketleri Gör</Button>
      </div>
    </div>
  );
}

export function B2CStep3({ days, updateDay, onBack, onNext }: { days: Day[]; updateDay: (id: number, patch: Partial<Day>) => void; onBack: () => void; onNext: () => void }) {
  return (
    <div>
      <h2 className="serif" style={{ fontSize: 30, marginBottom: 10, fontWeight: 400 }}>Her gün için paket seç</h2>
      <p style={{ color: 'var(--ink-60)', marginBottom: 30 }}>Her özel gününe farklı bir paket atayabilirsin.</p>

      {days.map((d, idx) => (
        <div key={d.id} style={{ marginBottom: 40, paddingBottom: 30, borderBottom: idx < days.length - 1 ? '1px solid var(--line)' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
              {idx + 1}
            </div>
            <div className="serif" style={{ fontSize: 22 }}>{d.name || '(Adsız)'} · <span style={{ fontSize: 14, color: 'var(--ink-40)', letterSpacing: '0.1em' }}>{d.date}</span></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {PACKAGES.map(p => {
              const selected = d.package === p.id;
              return (
                <div key={p.id} onClick={() => updateDay(d.id, { package: p.id })} style={{
                  padding: 22,
                  background: selected ? 'var(--accent)' : 'var(--paper-warm)',
                  color: selected ? '#fff' : 'var(--ink)',
                  border: `1px solid ${selected ? 'var(--accent)' : 'var(--line)'}`,
                  cursor: 'pointer', transition: 'all 0.2s',
                  position: 'relative',
                }}>
                  {selected && <div style={{ position: 'absolute', top: 16, right: 16 }}><Icons.Check size={18} /></div>}
                  <div className="serif" style={{ fontSize: 26 }}>{p.name}</div>
                  <div className="serif" style={{ fontSize: 32, marginTop: 8 }}>{p.price.toLocaleString('tr-TR')} ₺</div>
                  <p style={{ fontSize: 13, marginTop: 10, opacity: 0.88, lineHeight: 1.5 }}>{p.desc}</p>
                  <ul style={{ listStyle: 'none', marginTop: 14, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {p.items.map(it => (
                      <li key={it} style={{ display: 'flex', gap: 8, fontSize: 12.5, opacity: 0.9 }}>
                        <Icons.Check size={13} /> {it}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <Button variant="ghost" onClick={onBack} icon={<Icons.ArrowLeft size={14} />}>Geri</Button>
        <Button variant="primary" size="lg" onClick={onNext} iconRight={<Icons.Arrow size={14} />}>Özete Geç</Button>
      </div>
    </div>
  );
}

export function B2CStep4({ days, total, onBack, onConfirm }: { days: Day[]; total: number; onBack: () => void; onConfirm: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [buyer, setBuyer] = useState({ name: '', email: '', phone: '' });
  const [agreed, setAgreed] = useState(false);
  const upB = (k: string, v: string) => setBuyer(b => ({ ...b, [k]: v }));

  const submit = async () => {
    if (!buyer.name.trim() || !buyer.email.trim() || !buyer.phone.trim()) {
      setError('Lütfen ad, e-posta ve telefon bilgilerinizi girin.');
      return;
    }
    if (!agreed) {
      setError('Devam etmek için Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu\'nu kabul etmeniz gerekir.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/odeme/baslat', {
        method: 'POST',
        body: JSON.stringify({ days, buyer }),
        headers: { 'content-type': 'application/json' },
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Ödeme başlatılamadı.');
        return;
      }
      if (json.paymentPageUrl) {
        window.location.href = json.paymentPageUrl;
        return;
      }
      // devMode — ödeme sağlayıcısı yapılandırılmamış, doğrudan onayla
      onConfirm();
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="serif" style={{ fontSize: 30, marginBottom: 10, fontWeight: 400 }}>Ödeme özeti</h2>
      <p style={{ color: 'var(--ink-60)', marginBottom: 30 }}>Bir kerede öde, yıl boyunca sen hatırlamayı unutsan bile GAIA unutmasın.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 30 }} className="summary-grid">
        <div style={{ background: 'var(--paper-warm)', padding: 30 }}>
          <div className="overline" style={{ color: 'var(--accent)', marginBottom: 16 }}>Takvim</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {days.map((d, i) => {
              const pkg = PACKAGES.find(p => p.id === d.package);
              return (
                <div key={d.id} style={{ display: 'grid', gridTemplateColumns: '50px 1fr auto', gap: 16, alignItems: 'center', paddingBottom: 16, borderBottom: i < days.length - 1 ? '1px dashed var(--line)' : 'none' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div className="serif" style={{ fontSize: 24, color: 'var(--accent)' }}>{d.date ? new Date(d.date).getDate() : '—'}</div>
                    <div style={{ fontSize: 10, letterSpacing: '0.15em', color: 'var(--ink-40)', textTransform: 'uppercase' }}>
                      {d.date ? new Date(d.date).toLocaleDateString('tr-TR', { month: 'short' }) : ''}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{d.name || '(Adsız)'}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 2 }}>
                      {d.recipient || '—'} · {d.time} · {d.concept}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--accent)' }}>{pkg?.name.toUpperCase()}</div>
                    <div className="serif" style={{ fontSize: 20 }}>{pkg?.price.toLocaleString('tr-TR')} ₺</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div style={{ background: 'var(--paper-warm)', padding: 24, marginBottom: 16 }}>
            <div className="overline" style={{ color: 'var(--accent)', marginBottom: 14 }}>İletişim Bilgileriniz</div>
            <p style={{ fontSize: 12.5, color: 'var(--ink-60)', marginBottom: 14, lineHeight: 1.5 }}>
              Siparişiniz hakkında sizi bilgilendirebilmemiz için gereklidir.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Ad Soyad" required><Input value={buyer.name} onChange={(e: any) => upB('name', e.target.value)} placeholder="Adınız Soyadınız" /></Field>
              <Field label="E-posta" required><Input type="email" value={buyer.email} onChange={(e: any) => upB('email', e.target.value)} placeholder="ornek@email.com" /></Field>
              <Field label="Telefon" required><Input value={buyer.phone} onChange={(e: any) => upB('phone', e.target.value)} placeholder="+90 5xx xxx xx xx" /></Field>
            </div>
          </div>
          <div style={{ background: 'var(--accent)', color: '#fff', padding: 30 }}>
            <div className="overline" style={{ opacity: 0.8, marginBottom: 16 }}>Toplam</div>
            <div className="serif" style={{ fontSize: 48, lineHeight: 1 }}>{total.toLocaleString('tr-TR')} ₺</div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>{days.length} özel gün · KDV dahil</div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.3)', marginTop: 20, paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Ara Toplam</span><span>{total.toLocaleString('tr-TR')} ₺</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Sadakat İndirimi</span><span>— Ücretsiz</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Kargo</span><span>Dahil</span></div>
            </div>
            <label style={{ marginTop: 20, display: 'flex', gap: 10, fontSize: 12.5, lineHeight: 1.55, opacity: 0.95, cursor: 'pointer', alignItems: 'flex-start' }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop: 2, accentColor: '#fff', flexShrink: 0, cursor: 'pointer' }}
              />
              <span>
                <a href="/mesafeli-satis-sozlesmesi" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>Mesafeli Satış Sözleşmesi</a>
                {' ve '}
                <a href="/teslimat-iade" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>Teslimat &amp; İade Koşulları</a>
                {'\''}nı okudum, kabul ediyorum.
              </span>
            </label>
            <Button variant="white" size="lg" onClick={submit} disabled={submitting || !agreed} style={{ marginTop: 16, width: '100%', justifyContent: 'center', opacity: agreed ? 1 : 0.6 }} iconRight={<Icons.Arrow size={14} />}>
              {submitting ? 'İşleniyor…' : 'Ödemeyi Tamamla'}
            </Button>
            {error && (
              <div style={{ marginTop: 12, fontSize: 12.5, background: 'rgba(255,255,255,0.15)', padding: '8px 12px', borderRadius: 4 }}>
                {error}
              </div>
            )}
            <div style={{ marginTop: 14, fontSize: 11, opacity: 0.8, textAlign: 'center', lineHeight: 1.5 }}>
              Ödeme, GAIA hesabındaki güvenli ödeme sağlayıcısı ile alınır. Takvimini istediğin zaman düzenleyebilirsin.
            </div>
          </div>

          <div style={{ marginTop: 20, padding: 20, border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Icons.Sparkle size={16} />
              <span style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Bonus</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-60)', lineHeight: 1.55 }}>
              Yıllık abonelikte her 5. çiçek ikramiye — sürpriz bir gönderi ekibimizin seçeceği bir günde ulaşır.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
        <Button variant="ghost" onClick={onBack} icon={<Icons.ArrowLeft size={14} />}>Geri</Button>
      </div>

      <style>{`@media (max-width: 760px){ .summary-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

export function B2CConfirm({ total, days, onReset }: { total: number; days: Day[]; onReset: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <div style={{ width: 80, height: 80, margin: '0 auto', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icons.Check size={36} />
      </div>
      <h2 className="serif" style={{ fontSize: 44, marginTop: 30, fontWeight: 400 }}>Takvimin hazır</h2>
      <p style={{ color: 'var(--ink-60)', marginTop: 14, maxWidth: 520, margin: '14px auto 0', fontSize: 17, lineHeight: 1.6 }}>
        Toplam <strong>{total.toLocaleString('tr-TR')} ₺</strong> ödemen alındı. Artık {days.length} özel günü unutmana gerek yok — o günlerde çiçekler senin adına yerine ulaşacak.
      </p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 40 }}>
        <Button variant="primary" onClick={onReset}>Yeni Takvim</Button>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Button variant="outlined">Ana Sayfa</Button>
        </Link>
      </div>
    </div>
  );
}

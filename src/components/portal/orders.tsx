'use client';
// Portal — Orders: list, new wizard, detail/timeline

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icons } from '@/components/shared/icons';
import {
  PortalCard, PortalButton, PortalInput, PortalTextarea, PortalSelect, StatusBadge,
  fmtTL, fmtDate,
} from '@/components/portal/ui';
import { type PortalState } from '@/lib/portal-data';
import { PHOTOS } from '@/components/site/images';

export function PortalOrders({ state }: { state: PortalState }) {
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const orders = state.orders || [];
  const filtered = orders.filter(o =>
    (filter === 'all' || o.status === filter) &&
    (q === '' || o.id.toLowerCase().includes(q.toLowerCase()) || o.type.toLowerCase().includes(q.toLowerCase()) || o.recipient.toLowerCase().includes(q.toLowerCase()))
  );

  const tabs = [
    { id: 'all',        label: 'Tümü',       n: orders.length },
    { id: 'pending',    label: 'İncelemede', n: orders.filter(o => o.status === 'pending').length },
    { id: 'approved',   label: 'Onaylandı',  n: orders.filter(o => o.status === 'approved').length },
    { id: 'production', label: 'Atölyede',   n: orders.filter(o => o.status === 'production').length },
    { id: 'shipping',   label: 'Yolda',      n: orders.filter(o => o.status === 'shipping').length },
    { id: 'delivered',  label: 'Teslim',     n: orders.filter(o => o.status === 'delivered').length },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)} style={{
              padding: '8px 14px', fontSize: 13, fontWeight: 500,
              background: filter === t.id ? 'var(--accent)' : 'transparent',
              color: filter === t.id ? '#fff' : 'var(--ink-60)',
              border: '1px solid ' + (filter === t.id ? 'var(--accent)' : 'var(--line)'),
              borderRadius: 999, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {t.label}
              <span style={{
                fontSize: 11, padding: '1px 7px', borderRadius: 999,
                background: filter === t.id ? 'rgba(255,255,255,0.2)' : 'var(--line)',
                color: filter === t.id ? '#fff' : 'var(--ink-60)',
              }}>{t.n}</span>
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ position: 'relative' }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Sipariş ara…"
            style={{ padding: '9px 14px 9px 36px', fontSize: 13, border: '1px solid var(--line)', borderRadius: 6, width: 220, background: 'var(--paper)', outline: 'none' }} />
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-40)' }}>
            <Icons.Search size={13} />
          </span>
        </div>
      </div>

      <PortalCard padding={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 100px 130px 40px', padding: '14px 24px', borderBottom: '1px solid var(--line)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-60)', fontWeight: 500, gap: 16 }}>
          <div>Sipariş</div>
          <div>Tip & Alıcı</div>
          <div>Tarih · Şablon</div>
          <div style={{ textAlign: 'right' }}>Tutar</div>
          <div>Durum</div>
          <div />
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: 80, textAlign: 'center', color: 'var(--ink-60)' }}>Sonuç bulunamadı.</div>
        ) : filtered.map((o, i) => (
          <div key={o.id} onClick={() => router.push('/portal/siparisler/' + o.id)}
            style={{
              display: 'grid', gridTemplateColumns: '120px 1fr 1fr 100px 130px 40px',
              padding: '16px 24px', borderBottom: i < filtered.length - 1 ? '1px solid var(--line)' : 'none',
              cursor: 'pointer', gap: 16, alignItems: 'center', transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--paper-warm)'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
          >
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--ink-60)' }}>{o.id}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{o.type}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 2 }}>{o.recipient}</div>
            </div>
            <div>
              <div style={{ fontSize: 13.5 }}>{fmtDate(o.date)}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 2 }}>{o.template}</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 500 }}>{fmtTL(o.amount)}</div>
            <div><StatusBadge status={o.status} size="sm" /></div>
            <Icons.Arrow size={14} />
          </div>
        ))}
      </PortalCard>
    </div>
  );
}

// ============ New Order Wizard ============
export function PortalOrderNew({ state }: { state: PortalState }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<any>({
    template: null,
    type: '',
    recipient: '', addrId: '', addr: '', city: 'İstanbul',
    date: '', time: '10:00',
    palette: 'cream', concept: '',
    note: '', brandedCard: true,
    multiAddr: false, addrList: [],
    amount: 0,
  });
  const [done, setDone] = useState(false);
  const [newId, setNewId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const update = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

  const submitOrder = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/portal/siparis', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          template: data.template || 'custom',
          recipient: data.recipient,
          addrId: data.addrId,
          addr: data.addr,
          city: data.city,
          date: data.date,
          time: data.time,
          palette: data.palette,
          concept: data.concept,
          note: data.note,
          amount: Number(data.amount) || 0,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Sipariş oluşturulamadı.');
        return;
      }
      setNewId(json.id || '');
      setDone(true);
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  const templates = [
    { id: 'lobi',     title: 'Standart Lobi Yenileme', desc: 'Haftalık taze + vazo', price: 8500, photo: 'cLobby', icon: 'Bouquet' },
    { id: 'meeting',  title: 'Toplantı Masası',        desc: 'Alçak, profesyonel',  price: 2800, photo: 'cMeeting', icon: 'Hall' },
    { id: 'birthday', title: 'Çalışan Doğumgünü',      desc: 'Pastel buket + kart', price: 1450, photo: 'pBouquet', icon: 'Cake' },
    { id: 'welcome',  title: 'VIP Karşılama',           desc: 'Premium orkide',      price: 4800, photo: 'cWelcome', icon: 'Sparkle' },
    { id: 'opening',  title: 'Açılış Çelengi',          desc: 'Marka kartlı',        price: 3200, photo: 'pWreath', icon: 'Gift' },
    { id: 'custom',   title: 'Özel Talep',              desc: 'Sıfırdan tasarım',    price: 0,    photo: 'cWelcome', icon: 'Plus' },
  ];
  const palettes = [
    { id: 'cream',  label: 'Krem & Beyaz',    colors: ['#f5e8d8', '#fff', '#e0d6c0'] },
    { id: 'pastel', label: 'Pastel Pembe',    colors: ['#f8d3da', '#fce0e8', '#e8a4b0'] },
    { id: 'sage',   label: 'Yeşil & Beyaz',   colors: ['#a8b89e', '#fff', '#5c6e54'] },
    { id: 'autumn', label: 'Toprak & Bordo',  colors: ['#b87333', '#7a2828', '#d9a878'] },
    { id: 'brand',  label: 'Marka Renklerim', colors: ['#1a4d8c', '#fff', '#e30d27'] },
  ];

  if (done) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icons.Check size={42} />
        </div>
        <h2 className="serif" style={{ fontSize: 36, fontWeight: 500 }}>Talebiniz oluşturuldu.</h2>
        <p style={{ color: 'var(--ink-60)', fontSize: 16, maxWidth: 520, lineHeight: 1.6 }}>
          Talebiniz GAIA ekibimize iletildi. Onaylandığında size e-posta ve panelinizden bildirim göndereceğiz.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          {newId && <PortalButton variant="primary" onClick={() => router.push('/portal/siparisler/' + newId)}>Siparişi Görüntüle</PortalButton>}
          <PortalButton variant="ghost" onClick={() => router.push('/portal/dashboard')}>Panele Dön</PortalButton>
        </div>
      </div>
    );
  }

  const steps = ['Şablon', 'Alıcı', 'Tasarım', 'Onay'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 980, margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', fontSize: 13, fontWeight: 500,
                background: step >= i ? 'var(--accent)' : 'var(--line)',
                color: step >= i ? '#fff' : 'var(--ink-60)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{step > i ? <Icons.Check size={14} /> : i + 1}</div>
              <span style={{ fontSize: 13, fontWeight: step === i ? 500 : 400, color: step >= i ? 'var(--ink)' : 'var(--ink-40)' }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: step > i ? 'var(--accent)' : 'var(--line)' }} />}
          </React.Fragment>
        ))}
      </div>

      <PortalCard padding={32}>
        {step === 0 && (
          <>
            <h2 className="serif" style={{ fontSize: 24, fontWeight: 500, marginBottom: 8 }}>Bir şablon seçin</h2>
            <p style={{ color: 'var(--ink-60)', fontSize: 14, marginBottom: 28 }}>Sık kullandığınız taleplerden birini seçerek hızlıca başlayın veya özel talep oluşturun.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
              {templates.map(t => {
                const I = (Icons as any)[t.icon] || (Icons as any).Flower;
                const sel = data.template === t.id;
                return (
                  <button key={t.id} onClick={() => { update('template', t.id); update('type', t.title); update('amount', t.price); }}
                    style={{
                      padding: 18, textAlign: 'left', background: sel ? 'var(--accent-soft)' : 'var(--paper-warm)',
                      border: '1px solid ' + (sel ? 'var(--accent)' : 'var(--line)'),
                      borderRadius: 8, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10,
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <I size={18} />
                      </div>
                      {sel && <Icons.Check size={18} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{t.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 3 }}>{t.desc}</div>
                    </div>
                    {t.price > 0 && <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>{fmtTL(t.price)} itibaren</div>}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="serif" style={{ fontSize: 24, fontWeight: 500, marginBottom: 24 }}>Kime ve nereye?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="form2">
              <PortalInput label="Alıcı" required placeholder="Kişi veya kurum adı" value={data.recipient} onChange={e => update('recipient', e.target.value)} />
              <PortalSelect label="Adres Defterinden Seç" value={data.addrId} onChange={e => update('addrId', e.target.value)}
                options={[{ value: '', label: 'Yeni adres gir...' }, ...state.addresses.map(a => ({ value: a.id, label: `${a.label} — ${a.city}` }))]} />
              <div style={{ gridColumn: 'span 2' }}><PortalInput label="Adres" required placeholder="Mahalle, sokak, no" value={data.addr} onChange={e => update('addr', e.target.value)} /></div>
              <PortalSelect label="Şehir" value={data.city} onChange={e => update('city', e.target.value)} options={['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa']} />
              <PortalInput label="Teslim Tarihi" type="date" required value={data.date} onChange={e => update('date', e.target.value)} />
              <PortalInput label="Teslim Saati" type="time" value={data.time} onChange={e => update('time', e.target.value)} />
              <PortalInput label="İletişim Telefonu" placeholder="+90 5xx xxx xx xx" />
            </div>

            <label style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'var(--paper-warm)', borderRadius: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={data.multiAddr} onChange={e => update('multiAddr', e.target.checked)} />
              <span style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>Çoklu adres / Toplu sipariş</div>
                <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 2 }}>Bayram, yıldönümü gibi günler için 10+ adrese aynı anda gönderin (CSV upload).</div>
              </span>
              {data.multiAddr && <PortalButton size="sm" variant="ghost" icon={<Icons.Upload size={12} />}>CSV Yükle</PortalButton>}
            </label>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="serif" style={{ fontSize: 24, fontWeight: 500, marginBottom: 24 }}>Tasarım & Detay</h2>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 10 }}>Renk Paleti</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                {palettes.map(p => {
                  const sel = data.palette === p.id;
                  return (
                    <button key={p.id} onClick={() => update('palette', p.id)} style={{
                      padding: 14, textAlign: 'left',
                      background: sel ? 'var(--accent-soft)' : 'var(--paper-warm)',
                      border: '1px solid ' + (sel ? 'var(--accent)' : 'var(--line)'),
                      borderRadius: 8, cursor: 'pointer',
                    }}>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                        {p.colors.map((c, i) => <span key={i} style={{ width: 22, height: 22, borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.06)' }} />)}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{p.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="form2">
              <div style={{ gridColumn: 'span 2' }}><PortalTextarea label="Konsept / Özel İstek" placeholder="Hangi çiçekler tercih edersiniz, kaçınılması gerekenler, özel notlar..." value={data.concept} onChange={e => update('concept', e.target.value)} /></div>
              <div style={{ gridColumn: 'span 2' }}><PortalTextarea label="Kart Notu" placeholder='"İyi ki varsın", "Hayırlı olsun"...' rows={2} value={data.note} onChange={e => update('note', e.target.value)} /></div>
            </div>

            <label style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'var(--paper-warm)', borderRadius: 8 }}>
              <input type="checkbox" checked={data.brandedCard} onChange={e => update('brandedCard', e.target.checked)} />
              <span style={{ fontSize: 13.5 }}>Markalı kart kullan (logo + kurumsal etiket)</span>
            </label>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="serif" style={{ fontSize: 24, fontWeight: 500, marginBottom: 8 }}>Talebinizi gözden geçirin</h2>
            <p style={{ color: 'var(--ink-60)', fontSize: 14, marginBottom: 28 }}>Onaylandığında GAIA ekibine iletilecek.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 30 }} className="review-grid">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <ReviewRow label="Şablon" value={templates.find(t => t.id === data.template)?.title || data.type || '—'} />
                <ReviewRow label="Alıcı" value={data.recipient || '—'} />
                <ReviewRow label="Adres" value={`${data.addr || '—'}, ${data.city}`} />
                <ReviewRow label="Tarih" value={`${fmtDate(data.date)} · ${data.time}`} />
                <ReviewRow label="Palet" value={palettes.find(p => p.id === data.palette)?.label || '—'} />
                {data.concept && <ReviewRow label="Konsept" value={data.concept} />}
                {data.note && <ReviewRow label="Kart Notu" value={`"${data.note}"`} />}
                <ReviewRow label="Markalı Kart" value={data.brandedCard ? 'Evet' : 'Hayır'} />
              </div>

              <PortalCard padding={20} style={{ background: 'var(--accent)', color: '#fff', height: 'fit-content' }}>
                <div className="overline" style={{ color: 'rgba(255,255,255,0.8)' }}>Toplam</div>
                <div className="serif" style={{ fontSize: 42, marginTop: 8, lineHeight: 1 }}>{fmtTL(data.amount || 8500)}</div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>KDV dahil — Kalan bütçe: {fmtTL(41500)}</div>
                {data.amount > 5000 && (
                  <div style={{ marginTop: 16, padding: 10, background: 'rgba(255,255,255,0.12)', borderRadius: 6, fontSize: 12, lineHeight: 1.5 }}>
                    ⚠ Bu talep bütçe üstü. Yöneticinizin onayına gönderilecek.
                  </div>
                )}
              </PortalCard>
            </div>
          </>
        )}

        <div style={{ marginTop: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: 24 }}>
          {step > 0 ? <PortalButton variant="ghost" onClick={() => setStep(step - 1)} icon={<Icons.ArrowLeft size={14} />}>Geri</PortalButton> : <PortalButton variant="ghost" onClick={() => router.push('/portal/dashboard')}>İptal</PortalButton>}
          {step < 3
            ? <PortalButton variant="primary" onClick={() => setStep(step + 1)} iconRight={<Icons.Arrow size={14} />} disabled={step === 0 && !data.template}>Devam</PortalButton>
            : <PortalButton variant="primary" size="lg" onClick={submitOrder} iconRight={<Icons.Check size={14} />} disabled={submitting}>{submitting ? 'Gönderiliyor…' : 'Talebi Gönder'}</PortalButton>}
        </div>
        {error && (
          <div style={{ marginTop: 16, padding: '10px 14px', background: '#fdeaea', color: '#9b2c2c', borderRadius: 6, fontSize: 13 }}>{error}</div>
        )}

        <style>{`@media (max-width: 720px){ .form2 { grid-template-columns: 1fr !important; } .form2 > div[style*="span 2"] { grid-column: span 1 !important; } .review-grid { grid-template-columns: 1fr !important; } }`}</style>
      </PortalCard>
    </div>
  );
}

export function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 14, padding: '10px 0', borderBottom: '1px dashed var(--line)' }}>
      <div style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-40)' }}>{label}</div>
      <div style={{ fontSize: 14 }}>{value}</div>
    </div>
  );
}

// ============ Order Detail / Timeline ============
type OrderEvent = {
  id: string;
  event_type: string | null;
  old_status: string | null;
  new_status: string | null;
  note: string | null;
  photo_url: string | null;
  created_at: string;
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Talep alındı',
  reviewing: 'İncelemede',
  approved: 'Onaylandı',
  workshop: 'Atölyede',
  production: 'Atölyede',
  shipping: 'Yolda',
  delivered: 'Teslim edildi',
  rejected: 'Reddedildi',
};

function fmtDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString('tr-TR', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function PortalOrderDetail({ orderId, state }: { orderId: string; state: PortalState }) {
  const router = useRouter();
  const o = (state.orders || []).find(x => x.id === orderId);
  const [events, setEvents] = useState<OrderEvent[] | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/portal/siparis/' + encodeURIComponent(orderId))
      .then(r => (r.ok ? r.json() : { events: [] }))
      .then(d => { if (active) setEvents(d.events || []); })
      .catch(() => { if (active) setEvents([]); });
    return () => { active = false; };
  }, [orderId]);

  if (!o) return <div style={{ padding: 60, textAlign: 'center' }}>Sipariş bulunamadı. <PortalButton variant="ghost" onClick={() => router.push('/portal/siparisler')}>← Geri</PortalButton></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/portal/siparisler" style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-60)', cursor: 'pointer', textDecoration: 'none' }}>← Siparişler</Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--ink-60)' }}>{o.id}</div>
          <h2 className="serif" style={{ fontSize: 32, fontWeight: 500, marginTop: 4 }}>{o.type}</h2>
          <div style={{ marginTop: 8 }}><StatusBadge status={o.status} /></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }} className="dash-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <PortalCard padding={28}>
            <h3 className="serif" style={{ fontSize: 20, fontWeight: 500, marginBottom: 22 }}>Sipariş Akışı</h3>
            {events === null ? (
              <div style={{ fontSize: 13, color: 'var(--ink-60)' }}>Yükleniyor…</div>
            ) : events.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--ink-60)' }}>Henüz hareket kaydı yok.</div>
            ) : (
              <div style={{ position: 'relative', paddingLeft: 28 }}>
                <div style={{ position: 'absolute', left: 11, top: 8, bottom: 8, width: 2, background: 'var(--line)' }} />
                {events.map((ev) => {
                  const label = ev.new_status
                    ? (STATUS_LABEL[ev.new_status] || ev.new_status)
                    : (ev.event_type === 'photo_added' ? 'Fotoğraf eklendi' : 'Güncelleme');
                  return (
                    <div key={ev.id} style={{ position: 'relative', marginBottom: 22 }}>
                      <div style={{
                        position: 'absolute', left: -24, top: 2,
                        width: 22, height: 22, borderRadius: '50%',
                        background: 'var(--accent)', border: '2px solid var(--accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                      }}>
                        <Icons.Check size={11} />
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-40)', marginTop: 3 }}>{fmtDateTime(ev.created_at)}</div>
                      {ev.note && (
                        <div style={{ fontSize: 12.5, color: 'var(--ink-60)', marginTop: 6, lineHeight: 1.5 }}>{ev.note}</div>
                      )}
                      {ev.photo_url && (
                        <img src={ev.photo_url} alt="" style={{ marginTop: 10, width: 120, height: 120, objectFit: 'cover', borderRadius: 6 }} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </PortalCard>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {o.photos && o.photos[0] && (PHOTOS as any)[o.photos[0]] && (
            <PortalCard padding={0}>
              <img src={(PHOTOS as any)[o.photos[0]]} alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
            </PortalCard>
          )}

          <PortalCard padding={24}>
            <h4 style={{ fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-60)', marginBottom: 16 }}>Detaylar</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <DetailLine label="Şablon" value={o.template} />
              <DetailLine label="Alıcı" value={o.recipient} />
              <DetailLine label="Adres" value={o.addr} />
              <DetailLine label="Teslim" value={fmtDate(o.date)} />
              <DetailLine label="Tutar" value={fmtTL(o.amount)} />
              {o.notes && <DetailLine label="Notlar" value={`"${o.notes}"`} />}
            </div>
          </PortalCard>
        </div>
      </div>
    </div>
  );
}

export function DetailLine({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: '0.16em', color: 'var(--ink-40)', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 13.5, marginTop: 3 }}>{value}</div>
    </div>
  );
}

export function ChatBubble({ side, name, text, time }: { side: 'left' | 'right'; name: string; text: string; time: string }) {
  const isMine = side === 'right';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
      <div style={{ fontSize: 11, color: 'var(--ink-40)', marginBottom: 4 }}>{name} · {time}</div>
      <div style={{
        maxWidth: '76%',
        padding: '10px 14px', borderRadius: 12,
        borderBottomRightRadius: isMine ? 2 : 12,
        borderBottomLeftRadius: isMine ? 12 : 2,
        background: isMine ? 'var(--accent)' : 'var(--paper-warm)',
        color: isMine ? '#fff' : 'var(--ink)',
        fontSize: 14, lineHeight: 1.5,
      }}>
        {text}
      </div>
    </div>
  );
}

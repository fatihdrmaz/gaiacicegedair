'use client';
// Portal — GAIA Admin Panel
// Admin dashboard, pending approvals, kanban, capacity

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/shared/icons';
import {
  PortalCard, StatCard, PortalButton, Avatar,
  PortalInput, PortalTextarea, PortalSelect,
  fmtTL, fmtDay, relTime,
} from '@/components/portal/ui';
import { type PortalState } from '@/lib/portal-data';
import { PHOTOS } from '@/components/site/images';

export function PortalAdminDashboard({ state }: { state: PortalState }) {
  const router = useRouter();
  const orders = state.orders || [];
  const pending = state.pending || [];
  const b2cOrders = state.b2cOrders || [];

  const todayIso = new Date().toISOString().slice(0, 10);
  const tmr = new Date();
  tmr.setDate(tmr.getDate() + 1);
  const tmrIso = tmr.toISOString().slice(0, 10);
  const monthKey = todayIso.slice(0, 7);

  const activeOrders = orders.filter(o => ['pending', 'approved', 'production', 'shipping'].includes(o.status));
  const activeB2C = b2cOrders.filter(o => o.status !== 'delivered');
  const todayDeliver = orders.filter(o => o.date === todayIso);

  // Aylık ciro — bu ayın kurumsal + B2C siparişleri
  const revenue =
    orders.filter(o => (o.date || '').startsWith(monthKey)).reduce((s, o) => s + o.amount, 0) +
    b2cOrders.filter(o => (o.createdAt || '').startsWith(monthKey)).reduce((s, o) => s + o.totalAmount, 0);

  // Yarınki üretim — yarın teslim/etkinlik
  const tmrCorporate = orders.filter(o => o.date === tmrIso).length;
  const tmrB2C = b2cOrders.flatMap(o => o.items).filter(it => it.eventDate === tmrIso).length;
  const tmrTotal = tmrCorporate + tmrB2C;

  // Son aktiviteler — gerçek veriden, tarihe göre
  type Act = { t: string; sub: string; date: string; type: 'check' | 'user' | 'package' };
  const acts: Act[] = [
    ...orders.map<Act>(o => ({
      t: `${o.company} · ${o.type}`,
      sub: 'Kurumsal sipariş',
      date: o.createdAt,
      type: 'package',
    })),
    ...b2cOrders.map<Act>(o => ({
      t: `${o.buyerName} · ${o.items.length} özel gün`,
      sub: 'B2C sipariş',
      date: o.createdAt,
      type: 'package',
    })),
    ...pending.map<Act>(p => ({
      t: `${p.company} kayıt başvurusu`,
      sub: 'Yeni firma',
      date: p.appliedAt,
      type: 'user',
    })),
  ]
    .filter(a => a.date)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 className="serif" style={{ fontSize: 32, fontWeight: 500, lineHeight: 1.1 }}>GAIA Yönetim Paneli</h2>
        <p style={{ marginTop: 6, color: 'var(--ink-60)', fontSize: 15 }}>
          {pending.length} firma onay bekliyor · {activeOrders.length} aktif kurumsal · {activeB2C.length} aktif B2C sipariş
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="stats-grid">
        <StatCard label="Bekleyen Firma" value={pending.length} hint="Onayınızı bekliyor" icon="Check" />
        <StatCard label="Aktif Sipariş" value={activeOrders.length + activeB2C.length} hint="Kurumsal + B2C" icon="Package" />
        <StatCard label="Bugün Teslim" value={todayDeliver.length} hint={todayIso} icon="Hall" />
        <StatCard label="Aylık Ciro" value={fmtTL(revenue)} hint="Bu ayki siparişler" icon="Gift" />
      </div>

      <PortalCard padding={0}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 className="serif" style={{ fontSize: 20, fontWeight: 500 }}>Bekleyen Kayıt Onayları</h3>
            <p style={{ fontSize: 13, color: 'var(--ink-60)', marginTop: 2 }}>İnceleyip onaylayın veya reddedin</p>
          </div>
          <PortalButton variant="ghost" size="sm" onClick={() => router.push('/admin/bekleyen-firmalar')}>Tümü →</PortalButton>
        </div>
        {pending.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-60)', fontSize: 14 }}>Bekleyen başvuru yok.</div>
        ) : pending.slice(0, 5).map((p, i) => (
          <div key={p.id} onClick={() => router.push('/admin/bekleyen-firmalar')} style={{
            display: 'grid', gridTemplateColumns: '60px 1.5fr 1.5fr 1fr 1fr',
            padding: '18px 24px', gap: 16, alignItems: 'center', cursor: 'pointer',
            borderBottom: i < Math.min(pending.length, 5) - 1 ? '1px solid var(--line)' : 'none',
          }} className="admin-row">
            <Avatar name={p.company} size={42} bg={['#5c5e3f','#7b5e19','#3e5c4a'][i % 3]} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{p.company}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 2 }}>Vergi: {p.taxNo} · {p.sector}</div>
            </div>
            <div>
              <div style={{ fontSize: 13 }}>{p.contact}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 2 }}>{p.email}</div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-60)' }}>{p.size} çalışan</div>
            <div style={{ fontSize: 12, color: 'var(--ink-40)' }}>{relTime(p.appliedAt)}</div>
          </div>
        ))}
      </PortalCard>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }} className="dash-grid">
        <PortalCard padding={28}>
          <h3 className="serif" style={{ fontSize: 20, fontWeight: 500, marginBottom: 22 }}>Son Aktiviteler</h3>
          {acts.length === 0 ? (
            <div style={{ fontSize: 14, color: 'var(--ink-60)' }}>Henüz aktivite yok.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {acts.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: i < acts.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: 'var(--accent-soft)', color: 'var(--accent-deep)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {a.type === 'check' && <Icons.Check size={14} />}
                    {a.type === 'user' && <Icons.User size={14} />}
                    {a.type === 'package' && <Icons.Package size={14} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5 }}>{a.t}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-40)', marginTop: 2 }}>{a.sub} · {fmtDay(a.date)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </PortalCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <PortalCard padding={24} style={{ background: 'var(--accent)', color: '#fff' }}>
            <div className="overline" style={{ color: 'rgba(255,255,255,0.85)' }}>Yarınki Üretim</div>
            <div className="serif" style={{ fontSize: 44, marginTop: 10, lineHeight: 1 }}>{tmrTotal}</div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>{tmrCorporate} kurumsal · {tmrB2C} özel gün</div>
            <PortalButton variant="primary" size="sm" style={{ marginTop: 16, background: '#fff', color: 'var(--accent-deep)', border: 'none' }} onClick={() => router.push('/admin/atolye')}>
              Atölyeyi Aç →
            </PortalButton>
          </PortalCard>
          <PortalCard padding={24}>
            <div className="overline" style={{ color: 'var(--ink-60)' }}>Takvim</div>
            <h4 className="serif" style={{ fontSize: 22, fontWeight: 500, marginTop: 8 }}>Tüm Talepler</h4>
            <p style={{ fontSize: 13, color: 'var(--ink-60)', marginTop: 6, lineHeight: 1.5 }}>
              Kurumsal ve B2C tüm teslimatları tek takvimde görün.
            </p>
            <PortalButton variant="secondary" size="md" style={{ marginTop: 18 }} onClick={() => router.push('/admin/takvim')} iconRight={<Icons.Arrow size={14} />}>
              Takvimi Aç
            </PortalButton>
          </PortalCard>
        </div>
      </div>
    </div>
  );
}

export function PortalAdminPending({ state }: { state: PortalState }) {
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');

  const act = async (companyId: string, action: 'approve' | 'reject') => {
    if (action === 'reject' && !window.confirm('Bu başvuruyu reddetmek istediğinize emin misiniz?')) return;
    setBusy(companyId);
    setErr('');
    try {
      const res = await fetch('/api/portal/onay', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ companyId, action }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErr(json.error || 'İşlem başarısız.');
        setBusy('');
        return;
      }
      window.location.reload();
    } catch {
      setErr('Bağlantı hatası.');
      setBusy('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <p style={{ color: 'var(--ink-60)', fontSize: 14 }}>
        Kurumsal kayıt başvurularını inceleyin, doğrulayın ve onaylayın. Onaylanan firmalara otomatik hoşgeldin e-postası gönderilir.
      </p>
      {err && <div style={{ padding: '10px 14px', background: '#fdeaea', color: '#9b2c2c', borderRadius: 6, fontSize: 13 }}>{err}</div>}
      {(state.pending || []).length === 0 && (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-60)' }}>Bekleyen başvuru yok.</div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 18 }}>
        {(state.pending || []).map((p, i) => (
          <PortalCard key={p.id} padding={24}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <Avatar name={p.company} size={52} bg={['#5c5e3f','#7b5e19','#3e5c4a'][i % 3]} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 500 }}>{p.company}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 2 }}>{p.id} · {relTime(p.appliedAt)}</div>
              </div>
              <span style={{ padding: '4px 10px', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', background: '#FFF4E5', color: '#995200', borderRadius: 999, fontWeight: 500 }}>
                İncelemede
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, fontSize: 13 }}>
              <Field2 label="Yetkili" value={p.contact} />
              <Field2 label="Telefon" value={p.phone} />
              <Field2 label="E-posta" value={p.email} />
              <Field2 label="Vergi No" value={p.taxNo} />
              <Field2 label="Sektör" value={p.sector} />
              <Field2 label="Büyüklük" value={p.size} />
            </div>

            <div style={{ marginTop: 20, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <PortalButton size="md" variant="danger" disabled={busy === p.id} onClick={() => act(p.id, 'reject')}>Reddet</PortalButton>
              <PortalButton size="md" variant="primary" iconRight={<Icons.Check size={14} />} disabled={busy === p.id} onClick={() => act(p.id, 'approve')}>
                {busy === p.id ? 'İşleniyor…' : 'Onayla'}
              </PortalButton>
            </div>
          </PortalCard>
        ))}
      </div>
    </div>
  );
}

export function Field2({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, letterSpacing: '0.16em', color: 'var(--ink-40)', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 13, marginTop: 2 }}>{value}</div>
    </div>
  );
}

// ============ Kanban ============
// Portal kolon statüsü → corporate_orders statüsü (bir sonraki adım)
const KANBAN_NEXT: Record<string, string> = {
  pending: 'approved',
  approved: 'workshop',
  production: 'shipping',
  shipping: 'delivered',
};

export function PortalAdminKanban({ state }: { state: PortalState }) {
  const router = useRouter();
  const [busy, setBusy] = useState('');
  const orders = state.orders || [];
  const cols = [
    { id: 'pending',    title: 'İncelemede',  desc: 'Onayı beklenenler' },
    { id: 'approved',   title: 'Onaylandı',   desc: 'Atölyeye girecek' },
    { id: 'production', title: 'Atölyede',    desc: 'Hazırlanıyor' },
    { id: 'shipping',   title: 'Yolda',       desc: 'Kuryeye verildi' },
    { id: 'delivered',  title: 'Teslim',      desc: 'Bu hafta tamamlanan' },
  ];

  const advance = async (orderId: string, colId: string) => {
    const next = KANBAN_NEXT[colId];
    if (!next) return;
    setBusy(orderId);
    try {
      const res = await fetch('/api/portal/siparis', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: next }),
      });
      if (res.ok) {
        window.location.reload();
        return;
      }
    } catch {
      // yoksay
    }
    setBusy('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <p style={{ color: 'var(--ink-60)', fontSize: 14 }}>
        Tüm siparişleri statüye göre yönetin. Bir kartın “İlerlet” düğmesi siparişi bir sonraki statüye taşır.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, alignItems: 'flex-start' }} className="kanban-grid">
        {cols.map(col => {
          const items = orders.filter(o => o.status === col.id);
          return (
            <div key={col.id} style={{ background: 'var(--paper-warm)', borderRadius: 8, padding: 10, minHeight: 400 }}>
              <div style={{ padding: '8px 10px 14px', borderBottom: '1px solid var(--line)', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{col.title}</div>
                  <div style={{ fontSize: 11, padding: '2px 8px', background: 'var(--paper)', borderRadius: 999, color: 'var(--ink-60)' }}>{items.length}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-40)', marginTop: 4 }}>{col.desc}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.map(o => (
                  <div key={o.id} onClick={() => router.push('/portal/siparisler/' + o.id)} style={{
                    padding: 12, background: 'var(--paper)',
                    borderRadius: 6, border: '1px solid var(--line)', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 10px rgba(0,0,0,0.06)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 28, height: 28, overflow: 'hidden', borderRadius: 4, flexShrink: 0 }}>
                        <img src={(PHOTOS as any)[o.photos[0]]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--ink-60)' }}>{o.id}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3 }}>{o.type}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-60)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {o.recipient}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 8, borderTop: '1px dashed var(--line)' }}>
                      <div style={{ fontSize: 11, color: 'var(--ink-60)' }}>{fmtDay(o.date)}</div>
                      {KANBAN_NEXT[col.id] ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); advance(o.id, col.id); }}
                          disabled={busy === o.id}
                          style={{ fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 999, border: '1px solid var(--accent)', background: 'transparent', color: 'var(--accent)', cursor: 'pointer' }}
                        >
                          {busy === o.id ? '…' : 'İlerlet →'}
                        </button>
                      ) : (
                        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink-40)' }}>✓</div>
                      )}
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <div style={{ padding: '20px 10px', textAlign: 'center', color: 'var(--ink-40)', fontSize: 12, fontStyle: 'italic' }}>—</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .kanban-grid { grid-template-columns: repeat(3, 1fr) !important; overflow-x: auto; }
        }
      `}</style>
    </div>
  );
}

// ============ Atölye Kapasite ============
export function PortalAdminCapacity({ state }: { state: PortalState }) {
  const orders = state.orders || [];
  const b2cItems = (state.b2cOrders || []).flatMap(o => o.items);

  // Bugünden başlayan 14 günlük pencere — yerel tarih (UTC kayması olmadan)
  const toIso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    const iso = toIso(d);
    const corporate = orders.filter(o => o.date === iso);
    const b2c = b2cItems.filter(it => it.eventDate === iso);
    return { iso, d, count: corporate.length + b2c.length };
  });

  const team = [
    { name: 'Mert Sönmez',  role: 'Atölye Sorumlusu',   cap: 8,  current: 6, photo: 'team3' },
    { name: 'Elif Yalçın',  role: 'Tasarım',            cap: 5,  current: 3, photo: 'team2' },
    { name: 'Naz Güner',    role: 'Müşteri İlişkileri', cap: 10, current: 7, photo: 'team4' },
    { name: 'Derya Kaptan', role: 'Konsept',            cap: 4,  current: 4, photo: 'team1' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <p style={{ color: 'var(--ink-60)', fontSize: 14 }}>
        Atölye kapasitesi, ekip yükü ve kurye rotaları — günlük operasyonel görünüm.
      </p>

      <PortalCard padding={28}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <h3 className="serif" style={{ fontSize: 20, fontWeight: 500 }}>14 Günlük Yük</h3>
          <div style={{ display: 'flex', gap: 14, fontSize: 11.5, color: 'var(--ink-60)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, background: 'var(--accent-soft)', borderRadius: 2 }} />Hafif
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, background: 'var(--accent)', borderRadius: 2 }} />Normal
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, background: '#a85050', borderRadius: 2 }} />Yoğun
            </span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: 4 }}>
          {days.map((day, i) => {
            const load = day.count;
            const color = load === 0 ? 'var(--paper-warm)' : load <= 2 ? 'var(--accent-soft)' : load <= 4 ? 'var(--accent)' : '#a85050';
            const txt = load === 0 ? 'var(--ink-40)' : load <= 2 ? 'var(--accent-deep)' : '#fff';
            return (
              <div key={i} style={{
                background: color, borderRadius: 6, padding: 10, textAlign: 'center',
                minHeight: 80, color: txt, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 500, opacity: 0.8 }}>
                    {day.d.toLocaleDateString('tr-TR', { weekday: 'short' })}
                  </div>
                  <div className="serif" style={{ fontSize: 20, fontWeight: 500 }}>{day.d.getDate()}</div>
                </div>
                <div style={{ fontSize: 10.5, opacity: 0.9 }}>{load} sipariş</div>
              </div>
            );
          })}
        </div>
      </PortalCard>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }} className="dash-grid">
        <PortalCard padding={28}>
          <h3 className="serif" style={{ fontSize: 20, fontWeight: 500, marginBottom: 22 }}>Ekip Yükü</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {team.map((m, i) => {
              const pct = (m.current / m.cap) * 100;
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '48px 1fr 100px 60px', gap: 16, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden' }}>
                    <img src={(PHOTOS as any)[m.photo]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{m.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--ink-60)' }}>{m.role}</div>
                      </div>
                    </div>
                    <div style={{ height: 6, background: 'var(--paper-warm)', borderRadius: 999, overflow: 'hidden', marginTop: 6 }}>
                      <div style={{ height: '100%', width: pct + '%', background: pct >= 100 ? '#a85050' : pct >= 80 ? '#c89e58' : 'var(--accent)' }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 13, textAlign: 'right' }}>{m.current} / {m.cap}</div>
                  <div style={{ fontSize: 11.5, color: pct >= 100 ? '#a85050' : 'var(--ink-60)', textAlign: 'right' }}>
                    {pct >= 100 ? 'Dolu' : pct >= 80 ? 'Yoğun' : 'Müsait'}
                  </div>
                </div>
              );
            })}
          </div>
        </PortalCard>

        <PortalCard padding={28}>
          <h3 className="serif" style={{ fontSize: 20, fontWeight: 500, marginBottom: 22 }}>Yarınki Kurye Rotaları</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { name: 'Rota 1 · Avrupa Yakası',  stops: 7, time: '07:30 — 12:00', driver: 'Kemal' },
              { name: 'Rota 2 · Anadolu Yakası', stops: 5, time: '08:00 — 11:30', driver: 'Hakan' },
              { name: 'Rota 3 · VIP & Otel',      stops: 3, time: '09:00 — 11:00', driver: 'Selim' },
            ].map((r, i) => (
              <div key={i} style={{ padding: 14, background: 'var(--paper-warm)', borderRadius: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-60)', marginTop: 4 }}>
                  {r.stops} durak · {r.time} · {r.driver}
                </div>
              </div>
            ))}
          </div>
        </PortalCard>
      </div>

      <PortalCard padding={0}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)' }}>
          <h3 className="serif" style={{ fontSize: 20, fontWeight: 500 }}>Üretim Listesi</h3>
          <p style={{ fontSize: 13, color: 'var(--ink-60)', marginTop: 2 }}>Hazırlanmayı bekleyen aktif siparişler</p>
        </div>
        <div style={{ padding: '12px 24px', display: 'grid', gridTemplateColumns: '120px 1fr 1fr 110px 100px', gap: 14, borderBottom: '1px solid var(--line)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-60)' }}>
          <div>Sipariş</div>
          <div>Tip</div>
          <div>Alıcı</div>
          <div>Sorumlu</div>
          <div>Hazırla</div>
        </div>
        {orders.filter(o => o.status === 'production' || o.status === 'approved' || o.status === 'pending').slice(0, 6).map((o, i, arr) => (
          <div key={o.id} style={{
            padding: '14px 24px', display: 'grid', gridTemplateColumns: '120px 1fr 1fr 110px 100px', gap: 14, alignItems: 'center',
            borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none',
          }}>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--ink-60)' }}>{o.id}</div>
            <div style={{ fontSize: 13.5 }}>{o.type}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-60)' }}>{o.recipient}</div>
            <div style={{ fontSize: 13 }}>{o.assignee !== '—' ? o.assignee : <span style={{ color: 'var(--ink-40)' }}>Atanmadı</span>}</div>
            <div>
              <input type="checkbox" defaultChecked={o.status === 'production'} />
            </div>
          </div>
        ))}
      </PortalCard>
    </div>
  );
}

// ============ Blog Yönetimi ============
type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  category: string | null;
  author: string | null;
  author_role: string | null;
  author_photo: string | null;
  cover_url: string | null;
  read_minutes: number | null;
  related: string[] | null;
  published: boolean;
  published_at: string | null;
};

const emptyBlog = {
  id: '', slug: '', title: '', excerpt: '', body: '', category: 'Rehber',
  author: 'GAIA Çiçeğe Dair', authorRole: '', authorPhoto: '', cover: '',
  readMin: 4, related: '', published: false,
};

export function PortalAdminBlog() {
  const [posts, setPosts] = useState<BlogRow[] | null>(null);
  const [form, setForm] = useState<typeof emptyBlog | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const upd = (k: string, v: string | number | boolean) => setForm(f => f ? { ...f, [k]: v } : f);

  const load = () => {
    fetch('/api/admin/blog')
      .then(r => (r.ok ? r.json() : { posts: [] }))
      .then(d => setPosts(d.posts || []))
      .catch(() => setPosts([]));
  };
  useEffect(load, []);

  const startNew = () => { setForm({ ...emptyBlog }); setError(''); };
  const startEdit = (p: BlogRow) => {
    setForm({
      id: p.id, slug: p.slug, title: p.title, excerpt: p.excerpt || '',
      body: p.body || '', category: p.category || 'Rehber',
      author: p.author || '', authorRole: p.author_role || '',
      authorPhoto: p.author_photo || '', cover: p.cover_url || '',
      readMin: p.read_minutes || 4, related: (p.related || []).join(', '),
      published: p.published,
    });
    setError('');
  };

  const save = async () => {
    if (!form) return;
    setBusy(true); setError('');
    try {
      const payload = {
        ...(form.id ? { id: form.id } : {}),
        slug: form.slug, title: form.title, excerpt: form.excerpt,
        body: form.body, category: form.category, author: form.author,
        authorRole: form.authorRole, authorPhoto: form.authorPhoto,
        cover: form.cover, readMin: Number(form.readMin) || 4,
        related: form.related.split(',').map(s => s.trim()).filter(Boolean),
        published: form.published,
      };
      const res = await fetch('/api/admin/blog', {
        method: form.id ? 'PATCH' : 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Kaydedilemedi.'); return; }
      setForm(null);
      load();
    } catch { setError('Bağlantı hatası.'); } finally { setBusy(false); }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch('/api/admin/blog?id=' + encodeURIComponent(id), { method: 'DELETE' });
      if (res.ok) load();
    } catch { /* yoksay */ }
  };

  const togglePublish = async (p: BlogRow) => {
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'PATCH', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: p.id, published: !p.published }),
      });
      if (res.ok) load();
    } catch { /* yoksay */ }
  };

  // Düzenleme / oluşturma formu
  if (form) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 880 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="serif" style={{ fontSize: 24, fontWeight: 500 }}>{form.id ? 'Yazıyı Düzenle' : 'Yeni Yazı'}</h2>
          <PortalButton variant="ghost" onClick={() => setForm(null)}>← Listeye dön</PortalButton>
        </div>
        <PortalCard padding={28}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <PortalInput label="Başlık" required value={form.title} onChange={e => upd('title', e.target.value)} />
            <PortalInput label="Slug (URL)" required value={form.slug} onChange={e => upd('slug', e.target.value)} placeholder="dugun-palet" />
            <div style={{ gridColumn: 'span 2' }}>
              <PortalTextarea label="Özet" value={form.excerpt} onChange={e => upd('excerpt', e.target.value)} rows={2} />
            </div>
            <PortalSelect label="Kategori" value={form.category} onChange={e => upd('category', e.target.value)}
              options={['Düğün', 'Kurumsal', 'Rehber', 'Konsept', 'Haber']} />
            <PortalInput label="Okuma süresi (dk)" type="number" value={String(form.readMin)} onChange={e => upd('readMin', e.target.value)} />
            <PortalInput label="Yazar" value={form.author} onChange={e => upd('author', e.target.value)} />
            <PortalInput label="Yazar ünvanı" value={form.authorRole} onChange={e => upd('authorRole', e.target.value)} />
            <PortalInput label="Kapak görseli (URL)" value={form.cover} onChange={e => upd('cover', e.target.value)} placeholder="https://…" />
            <PortalInput label="Yazar foto (URL)" value={form.authorPhoto} onChange={e => upd('authorPhoto', e.target.value)} placeholder="https://…" />
            <div style={{ gridColumn: 'span 2' }}>
              <PortalInput label="İlgili yazı slug'ları (virgülle)" value={form.related} onChange={e => upd('related', e.target.value)} placeholder="bukent-rehberi, kurumsal-lobi" />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <PortalTextarea label="İçerik (markdown — ## başlık, > alıntı, - liste)" value={form.body} onChange={e => upd('body', e.target.value)} rows={16} />
            </div>
          </div>
          <label style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.published} onChange={e => upd('published', e.target.checked)} />
            Yayında
          </label>
          {error && <div style={{ marginTop: 14, padding: '10px 14px', background: '#fdeaea', color: '#9b2c2c', borderRadius: 6, fontSize: 13 }}>{error}</div>}
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <PortalButton variant="ghost" onClick={() => setForm(null)}>İptal</PortalButton>
            <PortalButton variant="primary" onClick={save} disabled={busy}>{busy ? 'Kaydediliyor…' : 'Kaydet'}</PortalButton>
          </div>
        </PortalCard>
      </div>
    );
  }

  // Liste
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <p style={{ color: 'var(--ink-60)', fontSize: 14, maxWidth: 600 }}>
          Blog yazılarını oluşturun, düzenleyin ve yayınlayın. Yayınlanan yazılar siteye saatlik olarak yansır.
        </p>
        <PortalButton variant="primary" icon={<Icons.Plus size={14} />} onClick={startNew}>Yeni Yazı</PortalButton>
      </div>

      {posts === null ? (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-60)' }}>Yükleniyor…</div>
      ) : posts.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-60)' }}>Henüz yazı yok.</div>
      ) : (
        <PortalCard padding={0}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 110px 130px', padding: '14px 24px', borderBottom: '1px solid var(--line)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-60)', fontWeight: 500, gap: 16 }}>
            <div>Başlık</div>
            <div>Kategori</div>
            <div>Durum</div>
            <div />
          </div>
          {posts.map((p, i) => (
            <div key={p.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 110px 130px',
              padding: '14px 24px', gap: 16, alignItems: 'center',
              borderBottom: i < posts.length - 1 ? '1px solid var(--line)' : 'none',
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 2, fontFamily: 'monospace' }}>/{p.slug}</div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-60)' }}>{p.category}</div>
              <div>
                <button onClick={() => togglePublish(p)} style={{
                  padding: '4px 10px', fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, borderRadius: 999, cursor: 'pointer', border: 'none',
                  background: p.published ? 'var(--accent-soft)' : '#FFF4E5',
                  color: p.published ? 'var(--accent-deep)' : '#995200',
                }}>{p.published ? 'Yayında' : 'Taslak'}</button>
              </div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <PortalButton variant="ghost" size="sm" onClick={() => startEdit(p)}>Düzenle</PortalButton>
                <button onClick={() => remove(p.id)} title="Sil" style={{ padding: 6, color: 'var(--ink-60)', background: 'transparent', border: 'none', cursor: 'pointer' }}><Icons.Trash size={15} /></button>
              </div>
            </div>
          ))}
        </PortalCard>
      )}
    </div>
  );
}

// ============ B2C Özel Gün Siparişleri ============
const B2C_STATUS: Record<string, { label: string; bg: string; fg: string }> = {
  pending:    { label: 'Ödeme bekliyor', bg: '#FFF4E5', fg: '#995200' },
  paid:       { label: 'Ödendi',         bg: '#E5F0E9', fg: '#3a6a4a' },
  processing: { label: 'Hazırlanıyor',   bg: '#E5F0FF', fg: '#1F5DAB' },
  delivered:  { label: 'Teslim edildi',  bg: 'var(--accent-soft)', fg: 'var(--accent-deep)' },
};
const B2C_NEXT: Record<string, string> = {
  pending: 'processing',
  paid: 'processing',
  processing: 'delivered',
};

export function PortalAdminB2C({ state }: { state: PortalState }) {
  const orders = state.b2cOrders || [];
  const [busy, setBusy] = useState('');

  const advance = async (id: string, current: string) => {
    const next = B2C_NEXT[current];
    if (!next) return;
    setBusy(id);
    try {
      const res = await fetch('/api/portal/b2c', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id, status: next }),
      });
      if (res.ok) { window.location.reload(); return; }
    } catch { /* yoksay */ }
    setBusy('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <p style={{ color: 'var(--ink-60)', fontSize: 14 }}>
        Bireysel müşterilerin “Özel Günlerim” aboneliğinden gelen siparişleri. Her sipariş bir veya birden çok özel gün içerir.
      </p>

      {orders.length === 0 && (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-60)' }}>Henüz B2C siparişi yok.</div>
      )}

      {orders.map(o => {
        const st = B2C_STATUS[o.status] || B2C_STATUS.pending;
        const next = B2C_NEXT[o.status];
        return (
          <PortalCard key={o.id} padding={24}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Avatar name={o.buyerName} size={46} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{o.buyerName}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 2 }}>{o.buyerEmail}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ padding: '4px 10px', fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, borderRadius: 999, background: st.bg, color: st.fg }}>
                  {st.label}
                </span>
                <div className="serif" style={{ fontSize: 22 }}>{fmtTL(o.totalAmount)}</div>
                {next && (
                  <PortalButton size="sm" variant="primary" disabled={busy === o.id} onClick={() => advance(o.id, o.status)}>
                    {busy === o.id ? '…' : (next === 'processing' ? 'Hazırlığa Al' : 'Teslim Edildi')}
                  </PortalButton>
                )}
              </div>
            </div>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {o.items.map(it => (
                <div key={it.id} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 110px', gap: 12, alignItems: 'center', fontSize: 13 }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{it.dayName}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-60)' }}>{it.occasion} · {it.concept}</div>
                  </div>
                  <div style={{ color: 'var(--ink-60)' }}>{it.recipient}</div>
                  <div style={{ color: 'var(--ink-60)' }}>{it.eventDate || '—'} · {it.deliveryTime}</div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ textTransform: 'capitalize' }}>{it.package}</span> · {fmtTL(it.packagePrice)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 11.5, color: 'var(--ink-40)' }}>
              Sipariş: {o.createdAt}{o.paidAt ? ` · Ödeme: ${o.paidAt}` : ''}
            </div>
          </PortalCard>
        );
      })}
    </div>
  );
}

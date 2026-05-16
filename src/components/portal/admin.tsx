'use client';
// Portal — GAIA Admin Panel
// Admin dashboard, pending approvals, kanban, capacity

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/shared/icons';
import {
  PortalCard, StatCard, PortalButton, Avatar,
  fmtTL, fmtDay, relTime,
} from '@/components/portal/ui';
import { type PortalState } from '@/lib/portal-data';
import { PHOTOS } from '@/components/site/images';

export function PortalAdminDashboard({ state }: { state: PortalState }) {
  const router = useRouter();
  const orders = state.orders || [];
  const pending = state.pending || [];

  const today = orders.filter(o => o.date === '2026-05-18' || o.date === '2026-05-22');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 className="serif" style={{ fontSize: 32, fontWeight: 500, lineHeight: 1.1 }}>GAIA Yönetim Paneli</h2>
        <p style={{ marginTop: 6, color: 'var(--ink-60)', fontSize: 15 }}>
          {pending.length} firma onay bekliyor · {orders.filter(o => o.status === 'pending' || o.status === 'production').length} aktif sipariş işleniyor
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="stats-grid">
        <StatCard label="Bekleyen Firma" value={pending.length} hint="Onayınızı bekliyor" icon="Check" />
        <StatCard label="Aktif Sipariş" value={orders.filter(o => ['pending', 'approved', 'production', 'shipping'].includes(o.status)).length} hint="Bu hafta" icon="Package" />
        <StatCard label="Bugün Teslim" value={today.length} hint="3 atölyede" icon="Hall" />
        <StatCard label="Aylık Ciro" value={fmtTL(238400)} hint="Geçen aya göre +18%" trend="up" icon="Gift" />
      </div>

      <PortalCard padding={0}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 className="serif" style={{ fontSize: 20, fontWeight: 500 }}>Bekleyen Kayıt Onayları</h3>
            <p style={{ fontSize: 13, color: 'var(--ink-60)', marginTop: 2 }}>İnceleyip onaylayın veya reddedin</p>
          </div>
          <PortalButton variant="ghost" size="sm" onClick={() => router.push('/admin/bekleyen-firmalar')}>Tümü →</PortalButton>
        </div>
        {pending.map((p, i) => (
          <div key={p.id} style={{
            display: 'grid', gridTemplateColumns: '60px 1.5fr 1.5fr 1fr 1fr 200px',
            padding: '18px 24px', gap: 16, alignItems: 'center',
            borderBottom: i < pending.length - 1 ? '1px solid var(--line)' : 'none',
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
            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
              <PortalButton size="sm" variant="ghost">Detay</PortalButton>
              <PortalButton size="sm" variant="primary">Onayla</PortalButton>
            </div>
          </div>
        ))}
      </PortalCard>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }} className="dash-grid">
        <PortalCard padding={28}>
          <h3 className="serif" style={{ fontSize: 20, fontWeight: 500, marginBottom: 22 }}>Son Aktiviteler</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { t: 'Akbank · O-2026-0044 onaylandı',       who: 'Murat (GAIA)',  when: '12 dk önce', type: 'check' },
              { t: 'Limak Holding kayıt başvurusu aldı',   who: 'Sistem',         when: '38 dk önce', type: 'user' },
              { t: 'Akbank · O-2026-0045 yeni sipariş',    who: 'Ayşe (Akbank)',  when: '1 saat önce', type: 'package' },
              { t: 'Akbank · O-2026-0041 teslim edildi',   who: 'Mert (Atölye)',  when: '2 saat önce', type: 'check' },
              { t: 'NuAgent Ajans kayıt başvurusu aldı',   who: 'Sistem',         when: '5 saat önce', type: 'user' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: i < 4 ? '1px solid var(--line)' : 'none' }}>
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
                  <div style={{ fontSize: 12, color: 'var(--ink-40)', marginTop: 2 }}>{a.who} · {a.when}</div>
                </div>
              </div>
            ))}
          </div>
        </PortalCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <PortalCard padding={24} style={{ background: 'var(--accent)', color: '#fff' }}>
            <div className="overline" style={{ color: 'rgba(255,255,255,0.85)' }}>Yarınki Üretim</div>
            <div className="serif" style={{ fontSize: 44, marginTop: 10, lineHeight: 1 }}>19</div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>12 lobi · 5 hediye · 2 etkinlik</div>
            <PortalButton variant="primary" size="sm" style={{ marginTop: 16, background: '#fff', color: 'var(--accent-deep)', border: 'none' }} onClick={() => router.push('/admin/atolye')}>
              Atölyeyi Aç →
            </PortalButton>
          </PortalCard>
          <PortalCard padding={24}>
            <div className="overline" style={{ color: 'var(--ink-60)' }}>Kanban</div>
            <h4 className="serif" style={{ fontSize: 22, fontWeight: 500, marginTop: 8 }}>Sipariş Akışı</h4>
            <p style={{ fontSize: 13, color: 'var(--ink-60)', marginTop: 6, lineHeight: 1.5 }}>
              Tüm aktif siparişleri kanban tablosunda yönetin.
            </p>
            <PortalButton variant="secondary" size="md" style={{ marginTop: 18 }} onClick={() => router.push('/admin/kanban')} iconRight={<Icons.Arrow size={14} />}>
              Kanban'ı Aç
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

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(2026, 4, 16 + i);
    const iso = d.toISOString().slice(0, 10);
    return {
      iso, d,
      orders: orders.filter(o => o.date === iso),
    };
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
            const load = day.orders.length;
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
          <h3 className="serif" style={{ fontSize: 20, fontWeight: 500 }}>Yarın Üretim Listesi</h3>
          <p style={{ fontSize: 13, color: 'var(--ink-60)', marginTop: 2 }}>19 Mayıs · 6 sipariş hazırlanacak</p>
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

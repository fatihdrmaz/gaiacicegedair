'use client';
// Portal — Dashboard, Calendar, Addresses, Employees, Billing, Reports

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/shared/icons';
import {
  PortalCard, StatCard, StatusBadge, PortalButton, Avatar,
  PortalInput, PortalSelect, PortalTextarea,
  fmtTL, fmtDate, fmtDay, relTime,
} from '@/components/portal/ui';
import { EVENT_COLORS, type PortalState } from '@/lib/portal-data';
import { PHOTOS } from '@/components/site/images';

export function PortalDashboard({ state }: { state: PortalState }) {
  const router = useRouter();
  const orders = state.orders || [];
  const events = state.events || [];

  const thisWeek = orders.filter(o => {
    const d = new Date(o.date);
    const now = new Date();
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= -1 && diff <= 7;
  }).slice(0, 5);

  const pending = orders.filter(o => o.status === 'pending');
  const now0 = new Date();
  const monthKey = `${now0.getFullYear()}-${String(now0.getMonth() + 1).padStart(2, '0')}`;
  const monthName = now0.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
  const monthlyTotal = orders.filter(o => (o.date || '').startsWith(monthKey)).reduce((s, o) => s + o.amount, 0);
  const monthlyCount = orders.filter(o => (o.date || '').startsWith(monthKey)).length;
  const activeCount = orders.filter(o => !['delivered', 'rejected'].includes(o.status)).length;
  const budget = 50000;

  const upcomingSpecial = events.filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    return d > now && (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) < 60;
  }).slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 className="serif" style={{ fontSize: 32, fontWeight: 500, lineHeight: 1.1 }}>
          Merhaba {state.auth?.name?.split(' ')[0] || 'tekrar hoş geldiniz'} —
        </h2>
        <p style={{ marginTop: 6, color: 'var(--ink-60)', fontSize: 15 }}>
          Bu hafta {thisWeek.length} teslimat planlandı, {pending.length} talep onayınızı bekliyor.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="stats-grid">
        <StatCard label="Bu Ay Teslimat" value={monthlyCount} hint={monthName} icon="Package" />
        <StatCard label="Bu Ay Harcama" value={fmtTL(monthlyTotal)} hint={`${Math.round((monthlyTotal / budget) * 100)}% / ${fmtTL(budget)} bütçe`} icon="Gift" />
        <StatCard label="Bekleyen Onaylar" value={pending.length} hint="Onayınızı bekliyor" icon="Check" />
        <StatCard label="Aktif Sipariş" value={activeCount} hint="Devam eden talepler" icon="Star" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }} className="dash-grid">
        <PortalCard padding={0}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 className="serif" style={{ fontSize: 20, fontWeight: 500 }}>Bu Hafta Teslimatlar</h3>
              <p style={{ fontSize: 13, color: 'var(--ink-60)', marginTop: 2 }}>{thisWeek.length} sipariş — Tarih sırasıyla</p>
            </div>
            <PortalButton variant="ghost" size="sm" onClick={() => router.push('/portal/siparisler')}>Tümü →</PortalButton>
          </div>
          <div>
            {thisWeek.map((o, i) => (
              <div key={o.id} onClick={() => router.push('/portal/siparisler/' + o.id)} style={{
                display: 'grid', gridTemplateColumns: '60px 60px 1fr auto auto', gap: 16, alignItems: 'center',
                padding: '16px 24px', cursor: 'pointer',
                borderBottom: i < thisWeek.length - 1 ? '1px solid var(--line)' : 'none',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--paper-warm)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
              >
                <div style={{ textAlign: 'center' }}>
                  <div className="serif" style={{ fontSize: 24, color: 'var(--accent)', lineHeight: 1 }}>{new Date(o.date).getDate()}</div>
                  <div style={{ fontSize: 10, letterSpacing: '0.15em', color: 'var(--ink-40)', textTransform: 'uppercase', marginTop: 4 }}>
                    {new Date(o.date).toLocaleDateString('tr-TR', { month: 'short' })}
                  </div>
                </div>
                <div style={{ width: 56, height: 56, overflow: 'hidden', borderRadius: 6, background: 'var(--paper-warm)' }}>
                  <img src={(PHOTOS as any)[o.photos[0]]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{o.type}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-60)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {o.recipient} · {o.addr}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{fmtTL(o.amount)}</div>
                  <div style={{ marginTop: 4 }}><StatusBadge status={o.status} size="sm" /></div>
                </div>
                <Icons.Arrow size={14} />
              </div>
            ))}
          </div>
        </PortalCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <PortalCard padding={0}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)' }}>
              <h3 className="serif" style={{ fontSize: 20, fontWeight: 500 }}>Onay Bekliyor</h3>
              <p style={{ fontSize: 13, color: 'var(--ink-60)', marginTop: 2 }}>Bütçe üstü talepler</p>
            </div>
            {pending.map((o, i) => (
              <div key={o.id} style={{
                padding: '14px 24px', borderBottom: i < pending.length - 1 ? '1px solid var(--line)' : 'none',
              }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{o.type}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 4 }}>{o.recipient} · {fmtTL(o.amount)}</div>
                <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                  <PortalButton size="sm" variant="primary" style={{ flex: 1, justifyContent: 'center' }}>Onayla</PortalButton>
                  <PortalButton size="sm" variant="ghost">Reddet</PortalButton>
                </div>
              </div>
            ))}
          </PortalCard>

          <PortalCard padding={0}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)' }}>
              <h3 className="serif" style={{ fontSize: 20, fontWeight: 500 }}>Yaklaşan Özel Günler</h3>
            </div>
            {upcomingSpecial.map((e, i) => {
              const c = EVENT_COLORS[e.type] || EVENT_COLORS.gift;
              return (
                <div key={e.id} style={{
                  padding: '14px 24px', borderBottom: i < upcomingSpecial.length - 1 ? '1px solid var(--line)' : 'none',
                  display: 'flex', gap: 12, alignItems: 'center',
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.fg, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-40)', marginTop: 2 }}>{relTime(e.date)} · {fmtDay(e.date)}</div>
                  </div>
                  {e.suggestion && (
                    <span style={{ fontSize: 9, padding: '3px 7px', background: 'var(--accent-soft)', color: 'var(--accent-deep)', borderRadius: 999, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      GAIA önerisi
                    </span>
                  )}
                </div>
              );
            })}
          </PortalCard>
        </div>
      </div>

      <PortalCard padding={24}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 className="serif" style={{ fontSize: 20, fontWeight: 500 }}>Hızlı Başlangıç</h3>
            <p style={{ fontSize: 13, color: 'var(--ink-60)', marginTop: 2 }}>Şablonlardan bir tane seçerek 30 saniyede sipariş verin</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {[
            { t: 'Standart Lobi', s: '8.500₺', i: 'cLobby', icon: 'Bouquet' },
            { t: 'Toplantı Masası', s: '2.800₺', i: 'cMeeting', icon: 'Hall' },
            { t: 'Çalışan Doğumgünü', s: '1.450₺', i: 'pBouquet', icon: 'Cake' },
            { t: 'VIP Karşılama', s: '4.800₺', i: 'cWelcome', icon: 'Sparkle' },
          ].map((tpl, i) => {
            const I = (Icons as any)[tpl.icon];
            return (
              <button key={i} onClick={() => router.push('/portal/siparisler/yeni')} style={{
                padding: 18, textAlign: 'left', background: 'var(--paper-warm)',
                border: '1px solid var(--line)', borderRadius: 8, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.15s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-soft)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--line)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--paper-warm)'; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 8, background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <I size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{tpl.t}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 2 }}>{tpl.s} itibaren</div>
                </div>
              </button>
            );
          })}
        </div>
      </PortalCard>

      <style>{`
        @media (max-width: 1100px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dash-grid  { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ============ Calendar ============
export function PortalCalendar({ state, readOnly }: { state: PortalState; readOnly?: boolean }) {
  const router = useRouter();
  const [view, setView] = useState<'month' | 'year' | 'week'>('month');
  const [cursor, setCursor] = useState<Date>(new Date());
  const orders = state.orders || [];
  const b2cOrders = state.b2cOrders || [];

  const allItems: any[] = [
    // Kurumsal siparişler
    ...orders.map(o => ({
      id: o.id, date: o.date, title: o.type,
      type: o.type.toLowerCase().includes('lobi') ? 'lobi'
          : o.type.toLowerCase().includes('hediye') ? 'gift'
          : o.type.toLowerCase().includes('toplantı') ? 'meeting'
          : o.type.toLowerCase().includes('açılış') ? 'opening'
          : o.type.toLowerCase().includes('karşılama') ? 'event' : 'gift',
      addr: o.recipient, _src: 'order',
    })),
    // B2C özel gün siparişleri (yalnızca admin state'inde dolu gelir)
    ...b2cOrders.flatMap(o =>
      o.items.map(it => ({
        id: o.id, date: it.eventDate,
        title: `${it.dayName} · ${o.buyerName}`,
        type: 'special', addr: it.recipient, _src: 'b2c',
      })),
    ),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PortalCard padding={16}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {([['month', 'Ay'], ['year', 'Yıl'], ['week', 'Hafta']] as const).map(([v, l]) => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '8px 16px', fontSize: 12.5, letterSpacing: '0.1em',
                background: view === v ? 'var(--accent)' : 'transparent',
                color: view === v ? '#fff' : 'var(--ink)',
                border: '1px solid ' + (view === v ? 'var(--accent)' : 'var(--line)'),
                borderRadius: 6, cursor: 'pointer',
              }}>{l}</button>
            ))}
          </div>

          {view !== 'year' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button onClick={() => {
                const d = new Date(cursor);
                if (view === 'month') d.setMonth(d.getMonth() - 1);
                else d.setDate(d.getDate() - 7);
                setCursor(d);
              }} style={{ padding: 8, border: '1px solid var(--line)', borderRadius: 6 }}>
                <Icons.ChevronLeft size={14} />
              </button>
              <div style={{ padding: '8px 16px', fontSize: 14, fontWeight: 500, minWidth: 180, textAlign: 'center' }}>
                {view === 'month'
                  ? cursor.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
                  : 'Hafta · ' + cursor.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
              </div>
              <button onClick={() => {
                const d = new Date(cursor);
                if (view === 'month') d.setMonth(d.getMonth() + 1);
                else d.setDate(d.getDate() + 7);
                setCursor(d);
              }} style={{ padding: 8, border: '1px solid var(--line)', borderRadius: 6 }}>
                <Icons.Chevron size={14} />
              </button>
            </div>
          )}

          <div style={{ flex: 1 }} />

          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            {Object.entries(EVENT_COLORS).map(([k, c]) => (
              <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: c.fg }} />
                {c.label}
              </span>
            ))}
          </div>

          {!readOnly && (
            <PortalButton variant="primary" size="md" icon={<Icons.Plus size={14} />} onClick={() => router.push('/portal/siparisler/yeni')}>
              Yeni Etkinlik
            </PortalButton>
          )}
        </div>
      </PortalCard>

      {view === 'month' && <MonthView cursor={cursor} items={allItems} />}
      {view === 'year' && <YearView year={cursor.getFullYear()} items={allItems} onPick={(d) => { setCursor(d); setView('month'); }} />}
      {view === 'week' && <WeekView cursor={cursor} items={allItems} />}
    </div>
  );
}

export function MonthView({ cursor, items }: { cursor: Date; items: any[] }) {
  const router = useRouter();
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const startDay = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ day: number; iso: string; items: any[] } | null> = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ day: d, iso, items: items.filter(it => it.date === iso) });
  }
  while (cells.length % 7) cells.push(null);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <PortalCard padding={0}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--line)' }}>
        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => (
          <div key={d} style={{ padding: '14px 16px', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-60)', fontWeight: 500 }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {cells.map((c, i) => (
          <div key={i} style={{
            minHeight: 110, padding: 8, borderRight: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
            background: c?.iso === today ? 'var(--accent-soft)' : 'transparent',
            position: 'relative',
          }}>
            {c && (
              <>
                <div style={{
                  fontSize: 13, fontWeight: c.iso === today ? 600 : 400,
                  color: c.iso === today ? 'var(--accent-deep)' : 'var(--ink)',
                }}>{c.day}</div>
                <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {c.items.slice(0, 3).map((it: any, j: number) => {
                    const col = EVENT_COLORS[it.type] || EVENT_COLORS.gift;
                    return (
                      <div key={j} onClick={() => it._src === 'order' && router.push('/portal/siparisler/' + it.id)} style={{
                        padding: '3px 6px', borderRadius: 3, fontSize: 11, lineHeight: 1.3,
                        background: col.bg, color: col.fg, cursor: it._src === 'order' ? 'pointer' : 'default',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {it.title}
                      </div>
                    );
                  })}
                  {c.items.length > 3 && (
                    <div style={{ fontSize: 10.5, color: 'var(--ink-40)' }}>+{c.items.length - 3} daha</div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </PortalCard>
  );
}

export function YearView({ year, items, onPick }: { year: number; items: any[]; onPick: (d: Date) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }} className="year-grid">
      {Array.from({ length: 12 }, (_, m) => {
        const monthItems = items.filter(it => it.date.startsWith(`${year}-${String(m + 1).padStart(2, '0')}`));
        const first = new Date(year, m, 1);
        const startDay = (first.getDay() + 6) % 7;
        const days = new Date(year, m + 1, 0).getDate();
        const cells: Array<number | null> = Array(startDay).fill(null);
        for (let d = 1; d <= days; d++) cells.push(d);

        return (
          <PortalCard key={m} padding={14}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h4 className="serif" style={{ fontSize: 16, fontWeight: 500, color: 'var(--accent-deep)' }}>
                {first.toLocaleDateString('tr-TR', { month: 'long' })}
              </h4>
              <button onClick={() => onPick(new Date(year, m, 1))} style={{ fontSize: 11, color: 'var(--ink-40)' }}>Aç →</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, fontSize: 10 }}>
              {['P', 'S', 'Ç', 'P', 'C', 'C', 'P'].map((d, i) => (
                <div key={i} style={{ textAlign: 'center', color: 'var(--ink-40)', padding: 2 }}>{d}</div>
              ))}
              {cells.map((d, i) => {
                if (!d) return <div key={i} />;
                const iso = `${year}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const has = monthItems.filter(it => it.date === iso);
                const main = has[0];
                const col = main ? (EVENT_COLORS[main.type] || EVENT_COLORS.gift) : null;
                return (
                  <div key={i} style={{
                    aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: col ? col.fg : 'var(--ink-60)',
                    background: col ? col.bg : 'transparent',
                    borderRadius: 3, fontWeight: col ? 600 : 400,
                  }}>{d}</div>
                );
              })}
            </div>
            {monthItems.length > 0 && (
              <div style={{ marginTop: 10, fontSize: 11, color: 'var(--accent)' }}>{monthItems.length} etkinlik</div>
            )}
          </PortalCard>
        );
      })}
      <style>{`@media (max-width: 860px){ .year-grid { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
    </div>
  );
}

export function WeekView({ cursor, items }: { cursor: Date; items: any[] }) {
  const router = useRouter();
  const start = new Date(cursor);
  const day = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - day);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <PortalCard padding={0}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {days.map((d, i) => {
          const iso = d.toISOString().slice(0, 10);
          const its = items.filter(it => it.date === iso);
          return (
            <div key={i} style={{ borderRight: i < 6 ? '1px solid var(--line)' : 'none', padding: 16, minHeight: 360 }}>
              <div style={{ paddingBottom: 12, borderBottom: '1px solid var(--line)', marginBottom: 12 }}>
                <div style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink-40)', textTransform: 'uppercase' }}>
                  {d.toLocaleDateString('tr-TR', { weekday: 'short' })}
                </div>
                <div className="serif" style={{ fontSize: 28, fontWeight: 500, color: 'var(--accent-deep)' }}>{d.getDate()}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {its.map((it: any, j: number) => {
                  const col = EVENT_COLORS[it.type] || EVENT_COLORS.gift;
                  return (
                    <div key={j} onClick={() => it._src === 'order' && router.push('/portal/siparisler/' + it.id)} style={{
                      padding: 8, borderRadius: 4, background: col.bg, color: col.fg,
                      fontSize: 12, cursor: it._src === 'order' ? 'pointer' : 'default',
                    }}>
                      <div style={{ fontWeight: 500 }}>{it.title}</div>
                      {it.addr && <div style={{ fontSize: 10.5, opacity: 0.8, marginTop: 2 }}>{it.addr}</div>}
                    </div>
                  );
                })}
                {its.length === 0 && <div style={{ fontSize: 11, color: 'var(--ink-40)' }}>—</div>}
              </div>
            </div>
          );
        })}
      </div>
    </PortalCard>
  );
}

// ============ Addresses ============
const emptyAddr = { label: '', type: 'office', address: '', city: 'İstanbul', contactName: '', contactPhone: '' };

export function PortalAddresses({ state }: { state: PortalState }) {
  const addresses = state.addresses || [];
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyAddr });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setBusy(true); setError('');
    try {
      const res = await fetch('/api/portal/adres', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Adres eklenemedi.'); return; }
      window.location.reload();
    } catch { setError('Bağlantı hatası.'); } finally { setBusy(false); }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Bu adresi silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch('/api/portal/adres?id=' + encodeURIComponent(id), { method: 'DELETE' });
      if (res.ok) window.location.reload();
    } catch { /* yoksay */ }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <p style={{ color: 'var(--ink-60)', fontSize: 14, maxWidth: 600 }}>
            Şirket adresleriniz, şubeleriniz ve düzenli teslimat yaptığınız müşterilerinizi tek yerden yönetin. Sipariş oluştururken bu listeden hızlıca seçim yapabilirsiniz.
          </p>
        </div>
        <PortalButton variant="primary" icon={<Icons.Plus size={14} />} onClick={() => { setForm({ ...emptyAddr }); setShowForm(v => !v); }}>
          {showForm ? 'Vazgeç' : 'Yeni Adres'}
        </PortalButton>
      </div>

      {showForm && (
        <PortalCard padding={24}>
          <h3 className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 18 }}>Yeni Adres</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form2">
            <PortalInput label="Etiket" required value={form.label} onChange={e => upd('label', e.target.value)} placeholder="Genel Merkez" />
            <PortalSelect label="Tür" value={form.type} onChange={e => upd('type', e.target.value)}
              options={[{ value: 'office', label: 'Ofis' }, { value: 'branch', label: 'Şube' }, { value: 'client', label: 'Müşteri' }]} />
            <div style={{ gridColumn: 'span 2' }}><PortalInput label="Adres" required value={form.address} onChange={e => upd('address', e.target.value)} placeholder="Mahalle, sokak, no" /></div>
            <PortalSelect label="Şehir" value={form.city} onChange={e => upd('city', e.target.value)} options={['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa']} />
            <PortalInput label="İletişim Kişisi" value={form.contactName} onChange={e => upd('contactName', e.target.value)} />
            <PortalInput label="İletişim Telefonu" value={form.contactPhone} onChange={e => upd('contactPhone', e.target.value)} placeholder="+90" />
          </div>
          {error && <div style={{ marginTop: 14, padding: '10px 14px', background: '#fdeaea', color: '#9b2c2c', borderRadius: 6, fontSize: 13 }}>{error}</div>}
          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <PortalButton variant="ghost" onClick={() => setShowForm(false)}>İptal</PortalButton>
            <PortalButton variant="primary" onClick={save} disabled={busy}>{busy ? 'Kaydediliyor…' : 'Kaydet'}</PortalButton>
          </div>
        </PortalCard>
      )}

      {addresses.length === 0 && !showForm && (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-60)' }}>Henüz adres eklenmemiş.</div>
      )}

      <PortalCard padding={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1fr 60px', padding: '14px 24px', borderBottom: '1px solid var(--line)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-60)', fontWeight: 500, gap: 16 }}>
          <div>Etiket & Şehir</div>
          <div>Adres</div>
          <div>İletişim</div>
          <div style={{ textAlign: 'right' }}>Sipariş</div>
          <div />
        </div>
        {addresses.map((a, i) => (
          <div key={a.id} style={{
            display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1fr 60px',
            padding: '16px 24px', gap: 16, alignItems: 'center',
            borderBottom: i < addresses.length - 1 ? '1px solid var(--line)' : 'none',
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                {a.label}
                {a.type === 'client' && <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 999, background: 'var(--accent-soft)', color: 'var(--accent-deep)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Müşteri</span>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 2 }}>{a.city}</div>
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--ink-60)' }}>{a.addr}</div>
            <div>
              <div style={{ fontSize: 13 }}>{a.contact}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 2 }}>{a.phone}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="serif" style={{ fontSize: 22, color: 'var(--accent)' }}>{a.usage}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-40)' }}>teslimat</div>
            </div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
              <button onClick={() => remove(a.id)} title="Sil" style={{ padding: 6, color: 'var(--ink-60)', background: 'transparent', border: 'none', cursor: 'pointer' }}><Icons.Trash size={15} /></button>
            </div>
          </div>
        ))}
      </PortalCard>

      <PortalCard padding={24}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 8, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icons.Upload size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Toplu adres yükle</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-60)', marginTop: 2 }}>CSV dosyasıyla 100+ adresi tek seferde yükleyin — şube, müşteri ve çalışan listeleri için.</div>
          </div>
          <PortalButton variant="ghost">CSV Yükle</PortalButton>
        </div>
      </PortalCard>
    </div>
  );
}

// ============ Employees ============
const emptyEmp = { fullName: '', department: '', email: '', birthDate: '', startDate: '', notes: '' };

export function PortalEmployees({ state }: { state: PortalState }) {
  const employees = state.employees || [];
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyEmp });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setBusy(true); setError('');
    try {
      const res = await fetch('/api/portal/calisan', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Çalışan eklenemedi.'); return; }
      window.location.reload();
    } catch { setError('Bağlantı hatası.'); } finally { setBusy(false); }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Bu çalışanı silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch('/api/portal/calisan?id=' + encodeURIComponent(id), { method: 'DELETE' });
      if (res.ok) window.location.reload();
    } catch { /* yoksay */ }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <p style={{ color: 'var(--ink-60)', fontSize: 14, maxWidth: 600 }}>
            Çalışan doğum günleri, işe başlama tarihleri ve özel günler — GAIA otomatik olarak yaklaşan tarihlerde hatırlatır ve hediye önerisi sunar.
          </p>
        </div>
        <PortalButton variant="primary" icon={<Icons.Plus size={14} />} onClick={() => { setForm({ ...emptyEmp }); setShowForm(v => !v); }}>
          {showForm ? 'Vazgeç' : 'Yeni Çalışan'}
        </PortalButton>
      </div>

      {showForm && (
        <PortalCard padding={24}>
          <h3 className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 18 }}>Yeni Çalışan</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form2">
            <PortalInput label="Ad Soyad" required value={form.fullName} onChange={e => upd('fullName', e.target.value)} />
            <PortalInput label="Departman / Görev" value={form.department} onChange={e => upd('department', e.target.value)} />
            <PortalInput label="E-posta" type="email" value={form.email} onChange={e => upd('email', e.target.value)} />
            <PortalInput label="Doğum Tarihi" type="date" value={form.birthDate} onChange={e => upd('birthDate', e.target.value)} />
            <PortalInput label="İşe Başlama" type="date" value={form.startDate} onChange={e => upd('startDate', e.target.value)} />
          </div>
          {error && <div style={{ marginTop: 14, padding: '10px 14px', background: '#fdeaea', color: '#9b2c2c', borderRadius: 6, fontSize: 13 }}>{error}</div>}
          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <PortalButton variant="ghost" onClick={() => setShowForm(false)}>İptal</PortalButton>
            <PortalButton variant="primary" onClick={save} disabled={busy}>{busy ? 'Kaydediliyor…' : 'Kaydet'}</PortalButton>
          </div>
        </PortalCard>
      )}

      {employees.length === 0 && !showForm && (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-60)' }}>Henüz çalışan eklenmemiş.</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {employees.map(e => {
          const today = new Date();
          const [bm, bd] = (e.birthday || '').split('-').map(Number);
          const hasBday = Number.isFinite(bm) && Number.isFinite(bd);
          const thisYearBday = new Date(today.getFullYear(), (bm || 1) - 1, bd || 1);
          if (thisYearBday < today) thisYearBday.setFullYear(today.getFullYear() + 1);
          const days = Math.ceil((thisYearBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          const upcoming = hasBday && days <= 30;

          return (
            <PortalCard key={e.id} padding={20}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <Avatar name={e.name} size={48} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 2 }}>{e.role}</div>
                </div>
                <button onClick={() => remove(e.id)} title="Sil" style={{ padding: 4, color: 'var(--ink-40)', background: 'transparent', border: 'none', cursor: 'pointer' }}><Icons.Trash size={14} /></button>
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5 }}>
                  <span style={{ color: 'var(--ink-60)' }}>🎂 Doğum günü</span>
                  <span style={{ fontWeight: 500 }}>{hasBday ? thisYearBday.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) : '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5 }}>
                  <span style={{ color: 'var(--ink-60)' }}>İş başlangıcı</span>
                  <span style={{ fontWeight: 500 }}>{fmtDate(e.startDate)}</span>
                </div>
              </div>
              {upcoming && (
                <div style={{ marginTop: 14, padding: 10, background: 'var(--accent-soft)', borderRadius: 6, fontSize: 12, color: 'var(--accent-deep)' }}>
                  🌸 <strong>{days} gün</strong> sonra doğum günü — şimdi sipariş ver
                </div>
              )}
            </PortalCard>
          );
        })}
      </div>
    </div>
  );
}

// ============ Billing ============
export function PortalBilling({ state }: { state: PortalState }) {
  const orders = state.orders || [];
  const budget = 50000;
  const now = new Date();
  const year = now.getFullYear();
  const curMonthKey = `${year}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const used = orders.filter(o => (o.date || '').startsWith(curMonthKey)).reduce((s, o) => s + o.amount, 0);
  const pct = budget > 0 ? Math.min(100, (used / budget) * 100) : 0;

  const monthNames = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  const monthly = monthNames.map((name, i) => {
    const key = `${year}-${String(i + 1).padStart(2, '0')}`;
    const val = orders.filter(o => (o.date || '').startsWith(key)).reduce((s, o) => s + o.amount, 0);
    return { name, val, current: i === now.getMonth() };
  });
  const max = Math.max(1, ...monthly.map(m => m.val));
  const yearTotal = monthly.reduce((s, m) => s + m.val, 0);

  // Bu yılın siparişleri — fatura listesi yerine gerçek sipariş kayıtları
  const yearOrders = orders
    .filter(o => (o.date || '').startsWith(String(year)))
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
        <PortalCard padding={28}>
          <div className="overline" style={{ color: 'var(--ink-60)' }}>Bu Ay Bütçe Kullanımı</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 14 }}>
            <div className="serif" style={{ fontSize: 44, fontWeight: 500, lineHeight: 1 }}>{fmtTL(used)}</div>
            <div style={{ fontSize: 16, color: 'var(--ink-60)' }}>/ {fmtTL(budget)}</div>
          </div>
          <div style={{ marginTop: 18, height: 10, background: 'var(--paper-warm)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: pct + '%', background: pct > 80 ? '#a85050' : 'var(--accent)', transition: 'width 0.4s' }} />
          </div>
          <div style={{ marginTop: 12, fontSize: 13, color: 'var(--ink-60)' }}>
            %{Math.round(pct)} kullanıldı · {fmtTL(Math.max(0, budget - used))} kaldı
          </div>
        </PortalCard>
      </div>

      <PortalCard padding={28}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h3 className="serif" style={{ fontSize: 20, fontWeight: 500 }}>Aylık Harcama — {year}</h3>
            <p style={{ fontSize: 13, color: 'var(--ink-60)', marginTop: 2 }}>Toplam {fmtTL(yearTotal)} · Ortalama {fmtTL(Math.round(yearTotal / 12))} / ay</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 8, alignItems: 'flex-end', height: 200 }}>
          {monthly.map((m, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
              <div style={{
                width: '100%', height: ((m.val / max) * 160) + 'px', minHeight: 2,
                background: m.current ? 'var(--accent)' : 'var(--accent-soft)',
                borderRadius: '4px 4px 0 0', transition: 'height 0.4s',
                position: 'relative',
              }}>
                {m.current && (
                  <span style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: 'var(--accent)', whiteSpace: 'nowrap', fontWeight: 500 }}>
                    Şu an
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-60)' }}>{m.name}</div>
            </div>
          ))}
        </div>
      </PortalCard>

      <PortalCard padding={0}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)' }}>
          <h3 className="serif" style={{ fontSize: 20, fontWeight: 500 }}>{year} Siparişleri</h3>
        </div>
        {yearOrders.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-60)' }}>Bu yıl için sipariş yok.</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 130px 130px', padding: '14px 24px', borderBottom: '1px solid var(--line)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-60)', fontWeight: 500, gap: 16 }}>
              <div>Tip & Alıcı</div>
              <div>Tarih</div>
              <div style={{ textAlign: 'right' }}>Tutar</div>
              <div>Durum</div>
            </div>
            {yearOrders.map((o, i) => (
              <div key={o.id} style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 130px 130px',
                padding: '14px 24px', gap: 16, alignItems: 'center',
                borderBottom: i < yearOrders.length - 1 ? '1px solid var(--line)' : 'none',
              }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{o.type}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 2 }}>{o.recipient}</div>
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink-60)' }}>{fmtDate(o.date)}</div>
                <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 500 }}>{fmtTL(o.amount)}</div>
                <div><StatusBadge status={o.status} size="sm" /></div>
              </div>
            ))}
          </>
        )}
      </PortalCard>
    </div>
  );
}

// ============ Reports ============
const CAT_COLORS = ['#3e5c4a', '#5c5e3f', '#7b5e19', '#a8b89e', '#c89e58', '#8a6d3b', '#6a8a7a'];

export function PortalReports({ state }: { state: PortalState }) {
  const orders = state.orders || [];

  // Kategori dağılımı — sipariş tipine göre toplam harcama
  const catMap = new Map<string, number>();
  orders.forEach(o => catMap.set(o.type, (catMap.get(o.type) || 0) + o.amount));
  const cats = Array.from(catMap.entries())
    .map(([name, val], i) => ({ name, val, color: CAT_COLORS[i % CAT_COLORS.length] }))
    .sort((a, b) => b.val - a.val);
  const total = cats.reduce((s, c) => s + c.val, 0) || 1;

  // En sık alıcılar
  const recMap = new Map<string, { count: number; sum: number }>();
  orders.forEach(o => {
    const r = recMap.get(o.recipient) || { count: 0, sum: 0 };
    recMap.set(o.recipient, { count: r.count + 1, sum: r.sum + o.amount });
  });
  const topRecipients = Array.from(recMap.entries())
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.sum - a.sum)
    .slice(0, 5);

  // En popüler şablonlar
  const tplMap = new Map<string, number>();
  orders.forEach(o => tplMap.set(o.template, (tplMap.get(o.template) || 0) + 1));
  const topTemplates = Array.from(tplMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const delivered = orders.filter(o => o.status === 'delivered').length;
  const totalSpend = orders.reduce((s, o) => s + o.amount, 0);
  const activeCount = orders.filter(o => !['delivered', 'rejected'].includes(o.status)).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="stats-grid">
        <StatCard label="Toplam Sipariş" value={String(orders.length)} hint="Tüm zamanlar" icon="Package" />
        <StatCard label="Toplam Harcama" value={fmtTL(totalSpend)} hint="Tüm siparişler" icon="Gift" />
        <StatCard label="Teslim Edilen" value={String(delivered)} hint={`${orders.length} sipariş içinden`} icon="Clock" />
        <StatCard label="Aktif Sipariş" value={String(activeCount)} hint="Devam eden" icon="Star" />
      </div>

      {orders.length === 0 && (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-60)' }}>Rapor için yeterli veri yok.</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="dash-grid">
        <PortalCard padding={28}>
          <h3 className="serif" style={{ fontSize: 20, fontWeight: 500, marginBottom: 6 }}>Kategori Dağılımı</h3>
          <p style={{ fontSize: 13, color: 'var(--ink-60)', marginBottom: 22 }}>Bu ayki harcamalar</p>
          <div style={{ display: 'flex', height: 16, borderRadius: 999, overflow: 'hidden', marginBottom: 22 }}>
            {cats.map((c, i) => (
              <div key={i} style={{ width: ((c.val / total) * 100) + '%', background: c.color, transition: 'width 0.4s' }} title={c.name} />
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {cats.map((c, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '12px 1fr auto auto', gap: 12, alignItems: 'center', fontSize: 13 }}>
                <span style={{ width: 12, height: 12, background: c.color, borderRadius: 3 }} />
                <span>{c.name}</span>
                <span style={{ color: 'var(--ink-60)' }}>{Math.round((c.val / total) * 100)}%</span>
                <span style={{ fontWeight: 500 }}>{fmtTL(c.val)}</span>
              </div>
            ))}
          </div>
        </PortalCard>

        <PortalCard padding={28}>
          <h3 className="serif" style={{ fontSize: 20, fontWeight: 500, marginBottom: 6 }}>En Sık Alıcılar</h3>
          <p style={{ fontSize: 13, color: 'var(--ink-60)', marginBottom: 22 }}>Bu yıl en çok çiçek gönderdikleriniz</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {topRecipients.map((r, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '30px 1fr 80px 100px', gap: 14, alignItems: 'center' }}>
                <div className="serif" style={{ fontSize: 22, color: 'var(--accent)', opacity: 0.4 }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ fontSize: 13.5 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-60)' }}>{r.count} kez</div>
                <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 500 }}>{fmtTL(r.sum)}</div>
              </div>
            ))}
          </div>
        </PortalCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }} className="dash-grid">
        <PortalCard padding={28}>
          <h3 className="serif" style={{ fontSize: 20, fontWeight: 500, marginBottom: 22 }}>En Popüler Şablonlar</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topTemplates.map((t, i) => {
              const m = Math.max(...topTemplates.map(x => x.count));
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span>{t.name}</span>
                    <span style={{ color: 'var(--ink-60)' }}>{t.count} sipariş</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--paper-warm)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: ((t.count / m) * 100) + '%', background: 'var(--accent)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </PortalCard>

        <PortalCard padding={28} style={{ background: 'var(--accent-deep)', color: '#fff' }}>
          <h3 className="serif" style={{ fontSize: 20, fontWeight: 500 }}>Yıllık Etki Raporu</h3>
          <p style={{ fontSize: 13, opacity: 0.85, marginTop: 8, lineHeight: 1.6 }}>
            Kurumunuzun bu yıl ki çiçek hediyeleme aktivitesinin PDF özetini indirin — yönetim raporlarınıza eklemek için ideal.
          </p>
          <PortalButton variant="primary" size="md" icon={<Icons.ArrowDown size={14} />} style={{ marginTop: 20, background: '#fff', color: 'var(--accent-deep)', border: 'none' }}>
            PDF İndir
          </PortalButton>
        </PortalCard>
      </div>
    </div>
  );
}

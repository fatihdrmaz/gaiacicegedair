'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PortalCard, PortalButton, PortalInput, PortalSelect, StatusBadge,
  fmtTL, fmtDate,
} from '@/components/portal/ui';
import { Icons } from '@/components/shared/icons';
import type { PortalState } from '@/lib/portal-data';

export function PortalAdminOrders({ state }: { state: PortalState }) {
  const router = useRouter();
  const orders = state.orders || [];
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [company, setCompany] = useState('all');

  const companies = Array.from(new Set(orders.map(o => o.company).filter(Boolean))).sort();

  const filtered = orders.filter(o => {
    if (company !== 'all' && o.company !== company) return false;
    if (from && (o.date || '') < from) return false;
    if (to && (o.date || '') > to) return false;
    return true;
  });

  const total = filtered.reduce((s, o) => s + o.amount, 0);

  const exportCsv = () => {
    const headers = [
      'Sipariş ID', 'Firma', 'Tip', 'Alıcı', 'Telefon', 'Adres', 'Şehir',
      'Teslim Tarihi', 'Tutar', 'Durum', 'Palet', 'Konsept', 'Kart Notu',
    ];
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = filtered.map(o =>
      [o.id, o.company, o.type, o.recipient, o.phone, o.addr, o.city,
       o.date, o.amount, o.status, o.palette, o.concept, o.note].map(esc).join(';'),
    );
    const csv = '﻿' + [headers.map(esc).join(';'), ...rows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `siparisler-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <p style={{ color: 'var(--ink-60)', fontSize: 14 }}>
        Tüm kurumsal siparişler. Tarih aralığı ve firmaya göre filtreleyin, Excel olarak indirin.
      </p>

      <PortalCard padding={20}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 150 }}>
            <PortalInput label="Başlangıç" type="date" value={from} onChange={e => setFrom(e.target.value)} />
          </div>
          <div style={{ minWidth: 150 }}>
            <PortalInput label="Bitiş" type="date" value={to} onChange={e => setTo(e.target.value)} />
          </div>
          <div style={{ minWidth: 200 }}>
            <PortalSelect label="Firma" value={company} onChange={e => setCompany(e.target.value)}
              options={[{ value: 'all', label: 'Tüm firmalar' }, ...companies.map(c => ({ value: c, label: c }))]} />
          </div>
          {(from || to || company !== 'all') && (
            <PortalButton variant="ghost" onClick={() => { setFrom(''); setTo(''); setCompany('all'); }}>Temizle</PortalButton>
          )}
          <div style={{ flex: 1 }} />
          <PortalButton variant="primary" icon={<Icons.ArrowDown size={14} />} onClick={exportCsv} disabled={filtered.length === 0}>
            Excel İndir
          </PortalButton>
        </div>
      </PortalCard>

      <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--ink-60)', padding: '0 4px' }}>
        <span><strong style={{ color: 'var(--ink)' }}>{filtered.length}</strong> sipariş</span>
        <span>Toplam tutar: <strong style={{ color: 'var(--ink)' }}>{fmtTL(total)}</strong></span>
      </div>

      <PortalCard padding={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 130px 110px 130px', padding: '14px 24px', borderBottom: '1px solid var(--line)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-60)', fontWeight: 500, gap: 14 }}>
          <div>Firma</div>
          <div>Tip & Alıcı</div>
          <div>Teslim</div>
          <div style={{ textAlign: 'right' }}>Tutar</div>
          <div>Durum</div>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-60)' }}>Sipariş bulunamadı.</div>
        ) : filtered.map((o, i) => (
          <div key={o.id} onClick={() => router.push('/portal/siparisler/' + o.id)} style={{
            display: 'grid', gridTemplateColumns: '1fr 1.4fr 130px 110px 130px',
            padding: '15px 24px', gap: 14, alignItems: 'center', cursor: 'pointer',
            borderBottom: i < filtered.length - 1 ? '1px solid var(--line)' : 'none',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--paper-warm)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ fontSize: 13.5, fontWeight: 500 }}>{o.company}</div>
            <div>
              <div style={{ fontSize: 13.5 }}>{o.type}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 2 }}>{o.recipient}</div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-60)' }}>{fmtDate(o.date)}</div>
            <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 500 }}>{fmtTL(o.amount)}</div>
            <div><StatusBadge status={o.status} size="sm" /></div>
          </div>
        ))}
      </PortalCard>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { PortalCard, PortalButton, StatusBadge } from '@/components/portal/ui';
import { Icons } from '@/components/shared/icons';

type Quote = {
  id: string;
  created_at: string;
  status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
  ad: string;
  firma: string | null;
  tel: string;
  email: string;
  tip: string;
  konsept: string | null;
  kisi: string | null;
  tarih: string | null;
  mekan: string | null;
  butce: string | null;
  notlar: string | null;
  files: string[] | null;
  admin_note: string | null;
};

const STATUS_LABEL: Record<Quote['status'], string> = {
  new: 'Yeni',
  contacted: 'İletişim Kuruldu',
  quoted: 'Teklif Verildi',
  won: 'Kazanıldı',
  lost: 'Kaybedildi',
};

const STATUS_COLOR: Record<Quote['status'], string> = {
  new: '#3b82f6',
  contacted: '#f59e0b',
  quoted: '#8b5cf6',
  won: '#22c55e',
  lost: '#9ca3af',
};

export function PortalAdminQuotes() {
  const [quotes, setQuotes] = useState<Quote[] | null>(null);
  const [filter, setFilter] = useState<'all' | Quote['status']>('all');
  const [selected, setSelected] = useState<Quote | null>(null);
  const [note, setNote] = useState('');

  const load = () => {
    fetch('/api/admin/teklifler')
      .then(r => r.json())
      .then(d => setQuotes(d.quotes || []))
      .catch(() => setQuotes([]));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: Quote['status'], adminNote?: string) => {
    await fetch('/api/admin/teklifler', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, status, admin_note: adminNote }),
    });
    load();
    if (selected?.id === id) setSelected(s => s ? { ...s, status, admin_note: adminNote ?? s.admin_note } : null);
  };

  if (quotes === null) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-40)' }}>Yükleniyor…</div>;

  const filtered = filter === 'all' ? quotes : quotes.filter(q => q.status === filter);
  const counts = {
    all: quotes.length,
    new: quotes.filter(q => q.status === 'new').length,
    contacted: quotes.filter(q => q.status === 'contacted').length,
    quoted: quotes.filter(q => q.status === 'quoted').length,
    won: quotes.filter(q => q.status === 'won').length,
    lost: quotes.filter(q => q.status === 'lost').length,
  };

  const tabs: { id: 'all' | Quote['status']; label: string; n: number }[] = [
    { id: 'all', label: 'Tümü', n: counts.all },
    { id: 'new', label: 'Yeni', n: counts.new },
    { id: 'contacted', label: 'İletişim', n: counts.contacted },
    { id: 'quoted', label: 'Teklif Verildi', n: counts.quoted },
    { id: 'won', label: 'Kazanıldı', n: counts.won },
    { id: 'lost', label: 'Kaybedildi', n: counts.lost },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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

      {filtered.length === 0 ? (
        <PortalCard padding={60}>
          <div style={{ textAlign: 'center', color: 'var(--ink-40)' }}>
            <Icons.Mail size={40} />
            <div style={{ marginTop: 16, fontSize: 15 }}>Henüz teklif talebi yok.</div>
          </div>
        </PortalCard>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(q => (
            <PortalCard key={q.id} padding={20}>
              <div
                onClick={() => { setSelected(q); setNote(q.admin_note || ''); }}
                style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 20, alignItems: 'center', cursor: 'pointer' }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>
                    {q.ad} {q.firma && <span style={{ color: 'var(--ink-40)' }}>· {q.firma}</span>}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-60)', marginTop: 4 }}>
                    {q.tip} · {q.butce || '—'} · {q.tarih || 'tarihsiz'}
                  </div>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-60)' }}>
                  {new Date(q.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
                <span style={{
                  padding: '4px 10px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                  background: STATUS_COLOR[q.status] + '22', color: STATUS_COLOR[q.status], borderRadius: 4, fontWeight: 600,
                }}>{STATUS_LABEL[q.status]}</span>
                <Icons.Arrow size={14} />
              </div>
            </PortalCard>
          ))}
        </div>
      )}

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'var(--paper)', maxWidth: 640, width: '100%', maxHeight: '90vh', overflow: 'auto', borderRadius: 8, padding: 32 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h2 className="serif" style={{ fontSize: 24, fontWeight: 500 }}>{selected.ad}</h2>
                {selected.firma && <div style={{ color: 'var(--ink-60)', marginTop: 4 }}>{selected.firma}</div>}
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--ink-40)' }}>
                <Icons.Close size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 14, marginBottom: 24 }}>
              <Row label="Telefon" value={<a href={`tel:${selected.tel}`} style={{ color: 'var(--accent)' }}>{selected.tel}</a>} />
              <Row label="E-posta" value={<a href={`mailto:${selected.email}`} style={{ color: 'var(--accent)' }}>{selected.email}</a>} />
              <Row label="Hizmet" value={selected.tip} />
              <Row label="Bütçe" value={selected.butce || '—'} />
              <Row label="Tarih" value={selected.tarih || '—'} />
              <Row label="Kişi Sayısı" value={selected.kisi || '—'} />
              <Row label="Mekân" value={selected.mekan || '—'} />
              <Row label="Konsept" value={selected.konsept || '—'} />
            </div>

            {selected.notlar && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-40)', marginBottom: 8 }}>Notlar</div>
                <div style={{ background: 'var(--paper-warm)', padding: 14, borderRadius: 4, fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{selected.notlar}</div>
              </div>
            )}

            {selected.files && selected.files.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-40)', marginBottom: 8 }}>Görsel Ekler</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selected.files.map((f, i) => (
                    <a key={i} href={f} target="_blank" rel="noopener noreferrer">
                      <img src={f} alt="" style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 4 }} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-40)', marginBottom: 8 }}>İç Not</div>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={3}
                placeholder="Bu teklife dair ekip notunuz…"
                style={{ width: '100%', padding: 12, fontSize: 14, border: '1px solid var(--line)', borderRadius: 4, background: 'var(--paper)', resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(['new', 'contacted', 'quoted', 'won', 'lost'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => updateStatus(selected.id, s, note)}
                  style={{
                    padding: '8px 14px', fontSize: 12.5, borderRadius: 4, cursor: 'pointer',
                    background: selected.status === s ? STATUS_COLOR[s] : 'transparent',
                    color: selected.status === s ? '#fff' : STATUS_COLOR[s],
                    border: `1px solid ${STATUS_COLOR[s]}`, fontWeight: 500,
                  }}
                >{STATUS_LABEL[s]}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-40)' }}>{label}</div>
      <div style={{ marginTop: 4 }}>{value}</div>
    </div>
  );
}

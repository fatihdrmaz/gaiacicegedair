'use client';

import { useCallback, useEffect, useState } from 'react';
import { PortalCard, PortalButton } from '@/components/portal/ui';
import { Icons } from '@/components/shared/icons';

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
};

const STATUS: Record<Message['status'], { label: string; bg: string; fg: string }> = {
  new:     { label: 'Yeni',       bg: '#E5F0FF', fg: '#1F5DAB' },
  read:    { label: 'Okundu',     bg: '#f0f0eb', fg: '#6b6b63' },
  replied: { label: 'Yanıtlandı', bg: 'var(--accent-soft)', fg: 'var(--accent-deep)' },
};

export function PortalAdminMessages() {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [filter, setFilter] = useState<'all' | Message['status']>('all');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(() => {
    fetch('/api/admin/mesajlar')
      .then(r => r.json())
      .then(d => setMessages(d.messages || []))
      .catch(() => { setError('Mesajlar yüklenemedi.'); setMessages([]); });
  }, []);
  useEffect(() => { load(); }, [load]);

  const setStatus = async (id: string, status: Message['status']) => {
    setBusy(id); setError('');
    try {
      const res = await fetch('/api/admin/mesajlar', {
        method: 'PATCH', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) { setError('Güncellenemedi.'); return; }
      setMessages(ms => (ms || []).map(m => m.id === id ? { ...m, status } : m));
    } catch { setError('Bağlantı hatası.'); } finally { setBusy(''); }
  };

  const remove = async (m: Message) => {
    if (!window.confirm(`${m.name} adlı kişinin mesajı silinsin mi?`)) return;
    setBusy(m.id); setError('');
    try {
      const res = await fetch('/api/admin/mesajlar?id=' + encodeURIComponent(m.id), { method: 'DELETE' });
      if (!res.ok) { setError('Silinemedi.'); return; }
      setMessages(ms => (ms || []).filter(x => x.id !== m.id));
    } catch { setError('Bağlantı hatası.'); } finally { setBusy(''); }
  };

  if (messages === null) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-60)' }}>Yükleniyor…</div>;

  const filtered = filter === 'all' ? messages : messages.filter(m => m.status === filter);
  const tabs: { id: 'all' | Message['status']; label: string }[] = [
    { id: 'all', label: 'Tümü' }, { id: 'new', label: 'Yeni' }, { id: 'read', label: 'Okundu' }, { id: 'replied', label: 'Yanıtlandı' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ color: 'var(--ink-60)', fontSize: 14 }}>
        Sitedeki İletişim sayfasındaki “Bize yazın” formundan gelen mesajlar.
      </p>
      {error && <div style={{ padding: '10px 14px', background: '#fdeaea', color: '#9b2c2c', borderRadius: 6, fontSize: 13 }}>{error}</div>}

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {tabs.map(t => {
          const n = t.id === 'all' ? messages.length : messages.filter(m => m.status === t.id).length;
          const on = filter === t.id;
          return (
            <button key={t.id} onClick={() => setFilter(t.id)} style={{
              padding: '8px 14px', fontSize: 13, fontWeight: 500, borderRadius: 999, cursor: 'pointer',
              background: on ? 'var(--accent)' : 'transparent', color: on ? '#fff' : 'var(--ink-60)',
              border: '1px solid ' + (on ? 'var(--accent)' : 'var(--line)'),
            }}>{t.label} · {n}</button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <PortalCard padding={50}><div style={{ textAlign: 'center', color: 'var(--ink-60)' }}>Mesaj yok.</div></PortalCard>
      )}

      {filtered.map(m => {
        const st = STATUS[m.status] || STATUS.new;
        return (
          <PortalCard key={m.id} padding={20} style={m.status === 'new' ? { borderLeft: '3px solid #1F5DAB' } : undefined}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{m.name}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-60)', marginTop: 4, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <a href={`mailto:${m.email}`} style={{ color: 'var(--accent)' }}>{m.email}</a>
                  {m.phone && <a href={`tel:${m.phone}`} style={{ color: 'var(--accent)' }}>{m.phone}</a>}
                  <span>{new Date(m.created_at).toLocaleString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              <span style={{ padding: '4px 10px', fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, borderRadius: 999, background: st.bg, color: st.fg }}>{st.label}</span>
            </div>
            <div style={{ marginTop: 14, padding: 14, background: 'var(--paper-warm)', borderRadius: 4, fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{m.message}</div>
            <div style={{ marginTop: 14, display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap', alignItems: 'center' }}>
              {m.status === 'new' && <PortalButton size="sm" variant="ghost" disabled={busy === m.id} onClick={() => setStatus(m.id, 'read')}>Okundu</PortalButton>}
              {m.status !== 'replied' && <PortalButton size="sm" variant="primary" disabled={busy === m.id} onClick={() => setStatus(m.id, 'replied')}>Yanıtlandı</PortalButton>}
              {m.status !== 'new' && <PortalButton size="sm" variant="ghost" disabled={busy === m.id} onClick={() => setStatus(m.id, 'new')}>Yeni olarak işaretle</PortalButton>}
              <button onClick={() => remove(m)} disabled={busy === m.id} title="Sil" style={{ padding: 6, color: 'var(--ink-60)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <Icons.Trash size={15} />
              </button>
            </div>
          </PortalCard>
        );
      })}
    </div>
  );
}

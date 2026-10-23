'use client';

import { useState, useEffect, useCallback } from 'react';
import { PortalCard, PortalButton, PortalInput, PortalTextarea, fmtTL } from '@/components/portal/ui';
import { Icons } from '@/components/shared/icons';
import type { B2CPackage } from '@/lib/b2c-packages';

type Form = { name: string; price: string; description: string; items: string; sortOrder: string };

const EMPTY: Form = { name: '', price: '', description: '', items: '', sortOrder: '' };

function toPayload(f: Form) {
  return {
    name: f.name.trim(),
    price: Number(f.price) || 0,
    description: f.description.trim(),
    items: f.items.split('\n').map(s => s.trim()).filter(Boolean),
    sortOrder: Number(f.sortOrder) || 0,
  };
}

function PackageFields({ form, setForm }: { form: Form; setForm: (fn: (f: Form) => Form) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }} className="pkg-form">
      <PortalInput label="Paket adı" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Örn: Orta" />
      <PortalInput label="Fiyat (₺, KDV dahil)" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0" />
      <PortalInput label="Sıra" type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: e.target.value }))} placeholder="0" />
      <div style={{ gridColumn: '1 / -1' }}>
        <PortalInput label="Kısa açıklama" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Örn: Şık ve etkileyici · özenle hazırlanmış aranjman" />
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <PortalTextarea label="İçerik maddeleri (her satıra bir madde)" value={form.items} onChange={e => setForm(f => ({ ...f, items: e.target.value }))} rows={4} />
      </div>
      <style>{`@media (max-width: 720px){ .pkg-form { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

export function PortalAdminB2CPackages() {
  const [packages, setPackages] = useState<B2CPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Form>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<Form>(EMPTY);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(() => {
    fetch('/api/admin/paket')
      .then(r => r.json())
      .then(d => setPackages(d.packages || []))
      .catch(() => setError('Paketler yüklenemedi.'))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const call = async (key: string, method: string, body?: object, query = '') => {
    setBusy(key); setError('');
    try {
      const res = await fetch('/api/admin/paket' + query, {
        method,
        headers: body ? { 'content-type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setError(json.error || 'İşlem başarısız.'); return false; }
      load();
      return true;
    } catch { setError('Bağlantı hatası.'); return false; } finally { setBusy(''); }
  };

  const add = async () => {
    if (!form.name.trim()) { setError('Paket adı gerekli.'); return; }
    if (await call('new', 'POST', toPayload(form))) setForm(EMPTY);
  };

  const startEdit = (p: B2CPackage) => {
    setEditingId(p.id);
    setEdit({ name: p.name, price: String(p.price), description: p.desc, items: p.items.join('\n'), sortOrder: String(p.sortOrder) });
  };

  const saveEdit = async () => {
    if (!editingId || !edit.name.trim()) return;
    if (await call(editingId, 'PATCH', { id: editingId, ...toPayload(edit) })) setEditingId(null);
  };

  const remove = async (p: B2CPackage) => {
    if (!window.confirm(`"${p.name}" paketi silinsin mi? Geçmiş siparişler etkilenmez.`)) return;
    await call(p.id, 'DELETE', undefined, '?id=' + encodeURIComponent(p.id));
  };

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-60)' }}>Yükleniyor…</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <p style={{ color: 'var(--ink-60)', fontSize: 14 }}>
        Özel Günlerim sayfasında müşterilerin seçtiği paketler. Fiyat değişikliği yeni siparişlere hemen yansır;
        geçmiş siparişler verildikleri fiyatla kalır. Pasif paketler sitede görünmez.
      </p>
      {error && <div style={{ padding: '10px 14px', background: '#fdeaea', color: '#9b2c2c', borderRadius: 6, fontSize: 13 }}>{error}</div>}

      <PortalCard padding={24}>
        <h3 className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Yeni Paket</h3>
        <PackageFields form={form} setForm={setForm} />
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <PortalButton variant="primary" onClick={add} disabled={busy === 'new'}>
            {busy === 'new' ? 'Ekleniyor…' : 'Paket Ekle'}
          </PortalButton>
        </div>
      </PortalCard>

      {packages.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-60)' }}>Henüz paket yok.</div>
      )}

      {packages.map(p => (
        <PortalCard key={p.id} padding={20}>
          {editingId === p.id ? (
            <div>
              <PackageFields form={edit} setForm={setEdit} />
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <PortalButton size="sm" variant="ghost" onClick={() => setEditingId(null)} disabled={busy === p.id}>İptal</PortalButton>
                <PortalButton size="sm" variant="primary" onClick={saveEdit} disabled={busy === p.id}>
                  {busy === p.id ? 'Kaydediliyor…' : 'Kaydet'}
                </PortalButton>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, opacity: p.active ? 1 : 0.6 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>
                  {p.name}
                  <span style={{ marginLeft: 10, fontSize: 15, color: 'var(--accent)' }}>{fmtTL(p.price)}</span>
                  {!p.active && <span style={{ marginLeft: 8, fontSize: 11, color: '#995200' }}>(pasif — sitede görünmez)</span>}
                </div>
                {p.desc && <div style={{ fontSize: 13, color: 'var(--ink-60)', marginTop: 4 }}>{p.desc}</div>}
                {p.items.length > 0 && (
                  <ul style={{ margin: '8px 0 0', paddingLeft: 18, fontSize: 12.5, color: 'var(--ink-60)', lineHeight: 1.6 }}>
                    {p.items.map(it => <li key={it}>{it}</li>)}
                  </ul>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <PortalButton size="sm" variant="ghost" onClick={() => startEdit(p)} disabled={busy === p.id}>Düzenle</PortalButton>
                <PortalButton size="sm" variant="ghost" onClick={() => call(p.id, 'PATCH', { id: p.id, active: !p.active })} disabled={busy === p.id}>
                  {p.active ? 'Pasifleştir' : 'Aktifleştir'}
                </PortalButton>
                <button onClick={() => remove(p)} disabled={busy === p.id} title="Sil"
                  style={{ padding: 6, color: 'var(--ink-60)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <Icons.Trash size={15} />
                </button>
              </div>
            </div>
          )}
        </PortalCard>
      ))}
    </div>
  );
}

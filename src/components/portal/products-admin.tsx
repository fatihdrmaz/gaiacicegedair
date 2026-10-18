'use client';

import { useState, useEffect, useCallback } from 'react';
import { PortalCard, PortalButton, PortalInput, PortalTextarea, fmtTL } from '@/components/portal/ui';
import { Icons } from '@/components/shared/icons';

type Product = {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  active: boolean;
};

export function PortalAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', basePrice: '' });
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState({ name: '', description: '', basePrice: '' });

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEdit({ name: p.name, description: p.description || '', basePrice: String(p.base_price) });
  };
  const cancelEdit = () => { setEditingId(null); setEdit({ name: '', description: '', basePrice: '' }); };
  const saveEdit = async () => {
    if (!editingId || !edit.name.trim()) return;
    setBusy(editingId);
    try {
      const res = await fetch('/api/admin/urun', {
        method: 'PATCH', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          name: edit.name.trim(),
          description: edit.description.trim(),
          basePrice: Number(edit.basePrice) || 0,
        }),
      });
      if (!res.ok) { setError('Güncellenemedi.'); return; }
      cancelEdit();
      load();
    } catch { setError('Bağlantı hatası.'); } finally { setBusy(''); }
  };

  const load = useCallback(() => {
    fetch('/api/admin/urun')
      .then(r => r.json())
      .then(d => setProducts(d.products || []))
      .catch(() => setError('Ürünler yüklenemedi.'))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const add = async () => {
    if (!form.name.trim()) return;
    setBusy('new'); setError('');
    try {
      const res = await fetch('/api/admin/urun', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          basePrice: Number(form.basePrice) || 0,
        }),
      });
      if (!res.ok) { setError('Ürün eklenemedi.'); return; }
      setForm({ name: '', description: '', basePrice: '' });
      load();
    } catch { setError('Bağlantı hatası.'); } finally { setBusy(''); }
  };

  const toggleActive = async (p: Product) => {
    setBusy(p.id);
    try {
      const res = await fetch('/api/admin/urun', {
        method: 'PATCH', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: p.id, active: !p.active }),
      });
      if (res.ok) load();
    } catch { /* yoksay */ } finally { setBusy(''); }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Ürün silinsin mi? Firmalardaki atamaları da kalkar.')) return;
    setBusy(id);
    try {
      const res = await fetch('/api/admin/urun?id=' + encodeURIComponent(id), { method: 'DELETE' });
      if (res.ok) load();
    } catch { /* yoksay */ } finally { setBusy(''); }
  };

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-60)' }}>Yükleniyor…</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <p style={{ color: 'var(--ink-60)', fontSize: 14 }}>
        Kurumsal ürün kataloğu. Burada tanımlanan ürünler, Firmalar ekranından firmalara
        atanır ve her firma için ayrı fiyat belirlenir.
      </p>
      {error && <div style={{ padding: '10px 14px', background: '#fdeaea', color: '#9b2c2c', borderRadius: 6, fontSize: 13 }}>{error}</div>}

      <PortalCard padding={24}>
        <h3 className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Yeni Ürün</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form2">
          <PortalInput label="Ürün adı" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Örn: Standart Lobi Aranjmanı" />
          <PortalInput label="Baz fiyat (₺)" type="number" value={form.basePrice} onChange={e => setForm(f => ({ ...f, basePrice: e.target.value }))} placeholder="0" />
          <div style={{ gridColumn: 'span 2' }}>
            <PortalTextarea label="Açıklama" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
          </div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <PortalButton variant="primary" onClick={add} disabled={busy === 'new'}>
            {busy === 'new' ? 'Ekleniyor…' : 'Ürün Ekle'}
          </PortalButton>
        </div>
      </PortalCard>

      {products.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-60)' }}>Henüz ürün yok.</div>
      )}

      {products.map(p => (
        <PortalCard key={p.id} padding={20}>
          {editingId === p.id ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form2">
                <PortalInput label="Ürün adı" value={edit.name} onChange={e => setEdit(f => ({ ...f, name: e.target.value }))} />
                <PortalInput label="Baz fiyat (₺)" type="number" value={edit.basePrice} onChange={e => setEdit(f => ({ ...f, basePrice: e.target.value }))} />
                <div style={{ gridColumn: 'span 2' }}>
                  <PortalTextarea label="Açıklama" value={edit.description} onChange={e => setEdit(f => ({ ...f, description: e.target.value }))} rows={2} />
                </div>
              </div>
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <PortalButton size="sm" variant="ghost" onClick={cancelEdit} disabled={busy === p.id}>İptal</PortalButton>
                <PortalButton size="sm" variant="primary" onClick={saveEdit} disabled={busy === p.id}>
                  {busy === p.id ? 'Kaydediliyor…' : 'Kaydet'}
                </PortalButton>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>
                  {p.name}
                  {!p.active && <span style={{ marginLeft: 8, fontSize: 11, color: '#995200' }}>(pasif)</span>}
                </div>
                {p.description && <div style={{ fontSize: 13, color: 'var(--ink-60)', marginTop: 4 }}>{p.description}</div>}
                <div style={{ fontSize: 13, color: 'var(--accent)', marginTop: 6 }}>Baz fiyat: {fmtTL(Number(p.base_price) || 0)}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <PortalButton size="sm" variant="ghost" onClick={() => startEdit(p)} disabled={busy === p.id}>Düzenle</PortalButton>
                <PortalButton size="sm" variant="ghost" disabled={busy === p.id} onClick={() => toggleActive(p)}>
                  {p.active ? 'Pasifleştir' : 'Aktifleştir'}
                </PortalButton>
                <button onClick={() => remove(p.id)} disabled={busy === p.id} title="Sil"
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

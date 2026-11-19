'use client';

import { useState, useEffect, useCallback } from 'react';
import { PortalCard, PortalButton, PortalInput, PortalTextarea, fmtTL } from '@/components/portal/ui';
import { Icons } from '@/components/shared/icons';
import type { B2CConcept, B2CDesign, B2CPackage } from '@/lib/b2c-packages';
import { createClient } from '@/lib/supabase/client';

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
      <PortalInput label="Ölçek adı" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Örn: Seçkin" />
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
      <h2 className="serif" style={{ fontSize: 22, fontWeight: 500, marginTop: 10 }}>Tasarım Ölçekleri</h2>
      <p style={{ color: 'var(--ink-60)', fontSize: 14 }}>
        Özel Günlerim'de fiyatı belirleyen tek seçim ölçektir (ör. Zarif, Seçkin, İhtişamlı). Fiyat değişikliği yeni
        siparişlere hemen yansır; geçmiş siparişler verildikleri fiyatla kalır. Pasif ölçekler sitede görünmez.
      </p>
      {error && <div style={{ padding: '10px 14px', background: '#fdeaea', color: '#9b2c2c', borderRadius: 6, fontSize: 13 }}>{error}</div>}

      <PortalCard padding={24}>
        <h3 className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Yeni Ölçek</h3>
        <PackageFields form={form} setForm={setForm} />
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <PortalButton variant="primary" onClick={add} disabled={busy === 'new'}>
            {busy === 'new' ? 'Ekleniyor…' : 'Ölçek Ekle'}
          </PortalButton>
        </div>
      </PortalCard>

      {packages.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-60)' }}>Henüz ölçek yok.</div>
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

// ============ Konseptler (fiyatı değiştirmez; fotoğraf + anlatım) ============
type ConceptForm = { name: string; tagline: string; description: string; sortOrder: string };
const EMPTY_CONCEPT: ConceptForm = { name: '', tagline: '', description: '', sortOrder: '' };

function ConceptFields({ form, setForm }: { form: ConceptForm; setForm: (fn: (f: ConceptForm) => ConceptForm) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 100px', gap: 16 }} className="pkg-form">
      <PortalInput label="Konsept adı" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Örn: Afrodit" />
      <PortalInput label="Anahtar kelimeler" value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} placeholder="Örn: Aşk · Romantizm · Tutku" />
      <PortalInput label="Sıra" type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: e.target.value }))} placeholder="0" />
      <div style={{ gridColumn: '1 / -1' }}>
        <PortalInput label="Kime / hangi durumlar için" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Örn: Sevgili ve eş" />
      </div>
    </div>
  );
}

export function PortalAdminB2CConcepts() {
  const [concepts, setConcepts] = useState<B2CConcept[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ConceptForm>(EMPTY_CONCEPT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<ConceptForm>(EMPTY_CONCEPT);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(() => {
    fetch('/api/admin/konsept')
      .then(r => r.json())
      .then(d => setConcepts(d.concepts || []))
      .catch(() => setError('Konseptler yüklenemedi.'))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const call = async (key: string, method: string, body?: object, query = '') => {
    setBusy(key); setError('');
    try {
      const res = await fetch('/api/admin/konsept' + query, {
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

  const payload = (f: ConceptForm) => ({
    name: f.name.trim(), tagline: f.tagline.trim(), description: f.description.trim(), sortOrder: Number(f.sortOrder) || 0,
  });

  const add = async () => {
    if (!form.name.trim()) { setError('Konsept adı gerekli.'); return; }
    if (await call('new', 'POST', payload(form))) setForm(EMPTY_CONCEPT);
  };

  const uploadImage = async (c: B2CConcept, file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Lütfen bir görsel dosyası seçin.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('Görsel 10MB sınırını aşıyor.'); return; }
    setBusy(c.id); setError('');
    try {
      const supabase = createClient();
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const path = `konseptler/${c.id}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('galeri').upload(path, file, { upsert: false });
      if (upErr) { setError('Yükleme hatası: ' + upErr.message); setBusy(''); return; }
      const { data: pub } = supabase.storage.from('galeri').getPublicUrl(path);
      await call(c.id, 'PATCH', { id: c.id, imageUrl: pub.publicUrl });
    } catch { setError('Yükleme sırasında bir hata oluştu.'); setBusy(''); }
  };

  if (loading) return <div style={{ padding: 30, textAlign: 'center', color: 'var(--ink-60)' }}>Yükleniyor…</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 className="serif" style={{ fontSize: 22, fontWeight: 500 }}>Konseptler</h2>
      <p style={{ color: 'var(--ink-60)', fontSize: 14 }}>
        Müşterinin ilk seçtiği tasarım dili. Konsept fiyatı değiştirmez; müşteri fotoğraf ve anlatımla seçer, fiyatı
        bir sonraki adımda ölçeğe göre görür. Her konsepte o konsepti en iyi anlatan bir fotoğraf yükleyin.
      </p>
      {error && <div style={{ padding: '10px 14px', background: '#fdeaea', color: '#9b2c2c', borderRadius: 6, fontSize: 13 }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {concepts.map(c => (
          <PortalCard key={c.id} padding={0} style={{ overflow: 'hidden', opacity: c.active ? 1 : 0.6 }}>
            {c.imageUrl
              ? <img src={c.imageUrl} alt={c.name} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
              : <div style={{ aspectRatio: '4/3', background: 'var(--paper-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-40)', fontSize: 13 }}>Fotoğraf yok</div>}
            <div style={{ padding: 16 }}>
              {editingId === c.id ? (
                <>
                  <ConceptFields form={edit} setForm={setEdit} />
                  <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <PortalButton size="sm" variant="ghost" onClick={() => setEditingId(null)} disabled={busy === c.id}>İptal</PortalButton>
                    <PortalButton size="sm" variant="primary" disabled={busy === c.id}
                      onClick={async () => { if (edit.name.trim() && await call(c.id, 'PATCH', { id: c.id, ...payload(edit) })) setEditingId(null); }}>
                      {busy === c.id ? 'Kaydediliyor…' : 'Kaydet'}
                    </PortalButton>
                  </div>
                </>
              ) : (
                <>
                  <div className="serif" style={{ fontSize: 20 }}>{c.name}{!c.active && <span style={{ marginLeft: 8, fontSize: 11, color: '#995200' }}>(pasif)</span>}</div>
                  {c.tagline && <div style={{ fontSize: 12.5, color: 'var(--accent)', marginTop: 4 }}>{c.tagline}</div>}
                  {c.desc && <div style={{ fontSize: 12.5, color: 'var(--ink-60)', marginTop: 4 }}>{c.desc}</div>}
                  <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    <label style={{ fontSize: 12.5, color: 'var(--accent)', cursor: 'pointer', padding: '6px 10px', border: '1px solid var(--line)', borderRadius: 6 }}>
                      {busy === c.id ? 'Yükleniyor…' : 'Fotoğraf değiştir'}
                      <input type="file" accept="image/*" style={{ display: 'none' }} disabled={busy === c.id}
                        onChange={e => { uploadImage(c, e.target.files?.[0] || null); e.target.value = ''; }} />
                    </label>
                    <PortalButton size="sm" variant="ghost" disabled={busy === c.id}
                      onClick={() => { setEditingId(c.id); setEdit({ name: c.name, tagline: c.tagline, description: c.desc, sortOrder: String(c.sortOrder) }); }}>Düzenle</PortalButton>
                    <PortalButton size="sm" variant="ghost" disabled={busy === c.id} onClick={() => call(c.id, 'PATCH', { id: c.id, active: !c.active })}>
                      {c.active ? 'Pasifleştir' : 'Aktifleştir'}
                    </PortalButton>
                    <button title="Sil" disabled={busy === c.id}
                      onClick={() => { if (window.confirm(`"${c.name}" konsepti silinsin mi? Geçmiş siparişler etkilenmez.`)) call(c.id, 'DELETE', undefined, '?id=' + encodeURIComponent(c.id)); }}
                      style={{ padding: 6, color: 'var(--ink-60)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <Icons.Trash size={15} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </PortalCard>
        ))}
      </div>

      <PortalCard padding={20}>
        <h3 className="serif" style={{ fontSize: 17, fontWeight: 500, marginBottom: 14 }}>Yeni Konsept</h3>
        <ConceptFields form={form} setForm={setForm} />
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12.5, color: 'var(--ink-60)' }}>Fotoğrafı, konsepti ekledikten sonra kartından yükleyebilirsiniz.</span>
          <PortalButton variant="primary" onClick={add} disabled={busy === 'new'}>{busy === 'new' ? 'Ekleniyor…' : 'Konsept Ekle'}</PortalButton>
        </div>
      </PortalCard>
    </div>
  );
}

// ============ Aranjman örnekleri (konsept × kesme/saksı) ============
const DESIGN_TYPE_LABEL: Record<B2CDesign['flowerType'], string> = { kesme: 'Kesme çiçek', saksi: 'Saksı bitkisi' };

export function PortalAdminB2CDesigns() {
  const [concepts, setConcepts] = useState<B2CConcept[]>([]);
  const [designs, setDesigns] = useState<B2CDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(() => {
    Promise.all([
      fetch('/api/admin/konsept').then(r => r.json()),
      fetch('/api/admin/tasarim').then(r => r.json()),
    ])
      .then(([c, d]) => { setConcepts(c.concepts || []); setDesigns(d.designs || []); })
      .catch(() => setError('Aranjman örnekleri yüklenemedi.'))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const call = async (key: string, method: string, body?: object, query = '') => {
    setBusy(key); setError('');
    try {
      const res = await fetch('/api/admin/tasarim' + query, {
        method,
        headers: body ? { 'content-type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setError(json.error || 'İşlem başarısız.'); return false; }
      return true;
    } catch { setError('Bağlantı hatası.'); return false; } finally { setBusy(''); }
  };

  const addImages = async (c: B2CConcept, type: B2CDesign['flowerType'], files: FileList | null) => {
    const list = Array.from(files || []);
    if (list.length === 0) return;
    const key = `${c.id}-${type}`;
    setBusy(key); setError('');
    const supabase = createClient();
    let n = designs.filter(d => d.conceptId === c.id && d.flowerType === type).length;
    for (const file of list) {
      if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) { setError(`${file.name}: görsel olmalı ve 10MB'ı geçmemeli.`); continue; }
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const path = `aranjmanlar/${c.id}-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
      const { error: upErr } = await supabase.storage.from('galeri').upload(path, file, { upsert: false });
      if (upErr) { setError('Yükleme hatası: ' + upErr.message); continue; }
      const { data: pub } = supabase.storage.from('galeri').getPublicUrl(path);
      n += 1;
      const ok = await call(key, 'POST', { conceptId: c.id, flowerType: type, name: `${c.name} ${n}`, imageUrl: pub.publicUrl, sortOrder: n });
      if (!ok) break;
    }
    setBusy('');
    load();
  };

  const rename = async (d: B2CDesign, name: string) => {
    const v = name.trim();
    if (!v || v === d.name) return;
    if (await call(d.id, 'PATCH', { id: d.id, name: v })) setDesigns(ds => ds.map(x => x.id === d.id ? { ...x, name: v } : x));
  };

  if (loading) return <div style={{ padding: 30, textAlign: 'center', color: 'var(--ink-60)' }}>Yükleniyor…</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 className="serif" style={{ fontSize: 22, fontWeight: 500 }}>Aranjman Örnekleri</h2>
      <p style={{ color: 'var(--ink-60)', fontSize: 14 }}>
        Müşteri konsepti ve çiçek türünü seçtikten sonra buradaki örneklerden birini seçer; fiyat değişmez.
        Her konsept için Kesme çiçek ve Saksı bitkisine 3'er örnek önerilir. Örnek eklenmemiş bir seçimde müşteriden
        örnek seçmesi istenmez. Adın üzerine tıklayıp değiştirebilirsiniz.
      </p>
      {error && <div style={{ padding: '10px 14px', background: '#fdeaea', color: '#9b2c2c', borderRadius: 6, fontSize: 13 }}>{error}</div>}

      {concepts.map(c => (
        <PortalCard key={c.id} padding={20} style={{ opacity: c.active ? 1 : 0.6 }}>
          <div className="serif" style={{ fontSize: 19, marginBottom: 14 }}>
            {c.name}{c.tagline && <span style={{ fontSize: 12.5, color: 'var(--accent)', marginLeft: 10, fontFamily: 'inherit' }}>{c.tagline}</span>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {(['kesme', 'saksi'] as const).map(type => {
              const list = designs.filter(d => d.conceptId === c.id && d.flowerType === type);
              const key = `${c.id}-${type}`;
              return (
                <div key={type}>
                  <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-60)', marginBottom: 10 }}>
                    {DESIGN_TYPE_LABEL[type]} · {list.length} örnek
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {list.map(d => (
                      <div key={d.id} style={{ width: 120, opacity: d.active ? 1 : 0.5 }}>
                        <img src={d.imageUrl} alt={d.name} style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 6, display: 'block' }} />
                        <input defaultValue={d.name} onBlur={e => rename(d, e.target.value)}
                          style={{ width: '100%', marginTop: 4, fontSize: 12, border: '1px solid transparent', borderRadius: 4, padding: '3px 4px', background: 'transparent' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                          <button disabled={busy === d.id} onClick={async () => { if (await call(d.id, 'PATCH', { id: d.id, active: !d.active })) load(); }}
                            style={{ background: 'none', border: 'none', color: 'var(--ink-60)', cursor: 'pointer', padding: 2 }}>{d.active ? 'Gizle' : 'Göster'}</button>
                          <button disabled={busy === d.id} title="Sil"
                            onClick={async () => { if (window.confirm(`"${d.name}" silinsin mi?`) && await call(d.id, 'DELETE', undefined, '?id=' + encodeURIComponent(d.id))) load(); }}
                            style={{ background: 'none', border: 'none', color: 'var(--ink-60)', cursor: 'pointer', padding: 2 }}><Icons.Trash size={13} /></button>
                        </div>
                      </div>
                    ))}
                    <label style={{ width: 120, height: 90, borderRadius: 6, border: '1px dashed var(--accent)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 12, cursor: busy === key ? 'wait' : 'pointer', padding: 6 }}>
                      {busy === key ? 'Yükleniyor…' : '+ Fotoğraf ekle'}
                      <input type="file" accept="image/*" multiple style={{ display: 'none' }} disabled={busy === key}
                        onChange={e => { addImages(c, type, e.target.files); e.target.value = ''; }} />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </PortalCard>
      ))}
    </div>
  );
}

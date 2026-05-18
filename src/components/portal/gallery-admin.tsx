'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PortalCard, PortalButton, PortalInput } from '@/components/portal/ui';
import { Icons } from '@/components/shared/icons';

type Cat = { id: string; name: string };
type Img = { id: string; category_id: string; image_url: string; title: string | null; featured: boolean };

export function PortalAdminGallery() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [imgs, setImgs] = useState<Img[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(() => {
    fetch('/api/admin/galeri')
      .then(r => r.json())
      .then(d => { setCats(d.categories || []); setImgs(d.images || []); })
      .catch(() => setError('Veriler yüklenemedi.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const addCategory = async () => {
    if (!newCat.trim()) return;
    setBusy('newcat'); setError('');
    try {
      const res = await fetch('/api/admin/galeri', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'category', name: newCat.trim() }),
      });
      if (!res.ok) { setError('Kategori eklenemedi.'); return; }
      setNewCat('');
      load();
    } catch { setError('Bağlantı hatası.'); } finally { setBusy(''); }
  };

  const removeCategory = async (id: string) => {
    if (!window.confirm('Kategori ve içindeki tüm görseller silinecek. Emin misiniz?')) return;
    setBusy(id);
    try {
      const res = await fetch('/api/admin/galeri?type=category&id=' + encodeURIComponent(id), { method: 'DELETE' });
      if (res.ok) load();
    } catch { /* yoksay */ } finally { setBusy(''); }
  };

  const removeImage = async (id: string) => {
    setBusy(id);
    try {
      const res = await fetch('/api/admin/galeri?type=image&id=' + encodeURIComponent(id), { method: 'DELETE' });
      if (res.ok) load();
    } catch { /* yoksay */ } finally { setBusy(''); }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    setBusy(id);
    try {
      const res = await fetch('/api/admin/galeri', {
        method: 'PATCH', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id, featured: !featured }),
      });
      if (res.ok) load();
    } catch { /* yoksay */ } finally { setBusy(''); }
  };

  const uploadImages = async (categoryId: string, files: FileList | null) => {
    const list = Array.from(files || []);
    if (list.length === 0) return;
    setBusy('up-' + categoryId); setError('');
    try {
      const supabase = createClient();
      for (const file of list) {
        if (file.size > 10 * 1024 * 1024) { setError(`${file.name} 10MB sınırını aşıyor.`); continue; }
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `${categoryId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage.from('galeri').upload(path, file, { upsert: false });
        if (upErr) { setError('Yükleme hatası: ' + upErr.message); continue; }
        const { data: pub } = supabase.storage.from('galeri').getPublicUrl(path);
        const res = await fetch('/api/admin/galeri', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ action: 'image', categoryId, imageUrl: pub.publicUrl, title: '' }),
        });
        if (!res.ok) setError('Görsel kaydedilemedi.');
      }
      load();
    } catch { setError('Yükleme sırasında bir hata oluştu.'); } finally { setBusy(''); }
  };

  if (loading) {
    return <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-60)' }}>Yükleniyor…</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <p style={{ color: 'var(--ink-60)', fontSize: 14 }}>
        Galeri kategorileri ve görselleri buradan yönetilir. Eklenen görseller sitedeki Galeri sayfasında ilgili sekmede görünür.
      </p>

      {error && (
        <div style={{ padding: '10px 14px', background: '#fdeaea', color: '#9b2c2c', borderRadius: 6, fontSize: 13 }}>{error}</div>
      )}

      <PortalCard padding={24}>
        <h3 className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 14 }}>Yeni Kategori</h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <PortalInput label="Kategori adı" value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="Örn: Düğün" />
          </div>
          <PortalButton variant="primary" onClick={addCategory} disabled={busy === 'newcat'}>
            {busy === 'newcat' ? 'Ekleniyor…' : 'Ekle'}
          </PortalButton>
        </div>
      </PortalCard>

      {cats.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-60)' }}>Henüz kategori yok.</div>
      )}

      {cats.map(cat => {
        const catImgs = imgs.filter(i => i.category_id === cat.id);
        return (
          <PortalCard key={cat.id} padding={24}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 className="serif" style={{ fontSize: 18, fontWeight: 500 }}>
                {cat.name} <span style={{ fontSize: 13, color: 'var(--ink-60)' }}>· {catImgs.length} görsel</span>
              </h3>
              <button onClick={() => removeCategory(cat.id)} disabled={busy === cat.id} title="Kategoriyi sil"
                style={{ padding: 6, color: 'var(--ink-60)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <Icons.Trash size={16} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              {catImgs.map(img => (
                <div key={img.id} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 6, overflow: 'hidden', border: img.featured ? '2px solid var(--accent)' : '1px solid var(--line)' }}>
                  <img src={img.image_url} alt={img.title || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => toggleFeatured(img.id, img.featured)} disabled={busy === img.id}
                    title={img.featured ? 'Öne çıkarmayı kaldır' : 'Ana sayfada öne çıkar'}
                    style={{ position: 'absolute', top: 6, left: 6, height: 26, padding: '0 8px', borderRadius: 999, background: img.featured ? 'var(--accent)' : 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                    <Icons.Star size={12} /> {img.featured ? 'Öne çıkan' : 'Öne çıkar'}
                  </button>
                  <button onClick={() => removeImage(img.id)} disabled={busy === img.id} title="Görseli sil"
                    style={{ position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icons.Trash size={13} />
                  </button>
                </div>
              ))}

              <label style={{
                aspectRatio: '1/1', border: '1px dashed var(--accent)', borderRadius: 6,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                color: 'var(--accent)', cursor: 'pointer', fontSize: 12, textAlign: 'center', padding: 8,
              }}>
                <Icons.Plus size={20} />
                <span>{busy === 'up-' + cat.id ? 'Yükleniyor…' : 'Görsel ekle'}</span>
                <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                  disabled={busy === 'up-' + cat.id}
                  onChange={e => uploadImages(cat.id, e.target.files)} />
              </label>
            </div>
          </PortalCard>
        );
      })}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PortalCard, PortalButton, PortalInput, PortalSelect, StatusBadge, Avatar, fmtTL, fmtDate } from '@/components/portal/ui';
import { Icons } from '@/components/shared/icons';
import type { PortalOrder } from '@/lib/portal-data';

type Company = {
  id: string; name: string; status: string; sector: string | null;
  city: string | null; contact_name: string | null; email: string | null; phone: string | null;
};

const STATUS_TR: Record<string, string> = {
  pending: 'Onay bekliyor', approved: 'Onaylı', rejected: 'Reddedildi',
};

export function PortalAdminCompanies() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    fetch('/api/admin/firma')
      .then(r => r.json())
      .then(d => setCompanies(d.companies || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = companies.filter(c =>
    q === '' || c.name.toLowerCase().includes(q.toLowerCase()) ||
    (c.contact_name || '').toLowerCase().includes(q.toLowerCase()),
  );

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-60)' }}>Yükleniyor…</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <p style={{ color: 'var(--ink-60)', fontSize: 14 }}>
        Tüm kurumsal firmalar. Bir firmaya tıklayarak detaylarını, siparişlerini görebilir
        ve o firmaya özel ürün/fiyat tanımlayabilirsiniz.
      </p>

      <div style={{ position: 'relative', maxWidth: 320 }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Firma ara…"
          style={{ padding: '10px 14px 10px 36px', fontSize: 13, border: '1px solid var(--line)', borderRadius: 6, width: '100%', background: 'var(--paper)', outline: 'none' }} />
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-40)' }}>
          <Icons.Search size={14} />
        </span>
      </div>

      <PortalCard padding={0}>
        {filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-60)' }}>Firma bulunamadı.</div>
        ) : filtered.map((c, i) => (
          <div key={c.id} onClick={() => router.push('/admin/firmalar/' + c.id)} style={{
            display: 'grid', gridTemplateColumns: '52px 1.6fr 1.4fr 1fr 130px', gap: 14, alignItems: 'center',
            padding: '16px 24px', cursor: 'pointer',
            borderBottom: i < filtered.length - 1 ? '1px solid var(--line)' : 'none',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--paper-warm)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Avatar name={c.name} size={42} bg={['#5c5e3f', '#7b5e19', '#3e5c4a'][i % 3]} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 2 }}>{c.sector || '—'} · {c.city || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: 13 }}>{c.contact_name || '—'}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 2 }}>{c.email || '—'}</div>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-60)' }}>{c.phone || '—'}</div>
            <div>
              <span style={{
                padding: '4px 10px', fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, borderRadius: 999,
                background: c.status === 'approved' ? 'var(--accent-soft)' : c.status === 'pending' ? '#FFF4E5' : '#fdeaea',
                color: c.status === 'approved' ? 'var(--accent-deep)' : c.status === 'pending' ? '#995200' : '#9b2c2c',
              }}>{STATUS_TR[c.status] || c.status}</span>
            </div>
          </div>
        ))}
      </PortalCard>
    </div>
  );
}

type Detail = {
  company: Company & { tax_no?: string; address?: string };
  products: { id: string; name: string; description: string | null; base_price: number }[];
  assignments: { id: string; price: number; product_id: string; products: { name: string; description: string | null } | null }[];
  orders: PortalOrder[];
};

export function PortalAdminCompanyDetail({ companyId }: { companyId: string }) {
  const router = useRouter();
  const [d, setD] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [pick, setPick] = useState('');
  const [price, setPrice] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    fetch('/api/admin/firma?id=' + encodeURIComponent(companyId))
      .then(r => r.json())
      .then(setD)
      .catch(() => setError('Firma yüklenemedi.'))
      .finally(() => setLoading(false));
  }, [companyId]);
  useEffect(() => { load(); }, [load]);

  const assign = async () => {
    if (!pick || !price) { setError('Ürün ve fiyat seçin.'); return; }
    setBusy(true); setError('');
    try {
      const res = await fetch('/api/admin/firma', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ companyId, productId: pick, price: Number(price) }),
      });
      if (!res.ok) { setError('Ürün atanamadı.'); return; }
      setPick(''); setPrice('');
      load();
    } catch { setError('Bağlantı hatası.'); } finally { setBusy(false); }
  };

  const unassign = async (assignmentId: string) => {
    if (!window.confirm('Bu ürün ataması kaldırılsın mı?')) return;
    try {
      const res = await fetch('/api/admin/firma?assignmentId=' + encodeURIComponent(assignmentId), { method: 'DELETE' });
      if (res.ok) load();
    } catch { /* yoksay */ }
  };

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-60)' }}>Yükleniyor…</div>;
  if (!d || !d.company) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-60)' }}>Firma bulunamadı.</div>;

  const c = d.company;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <button onClick={() => router.push('/admin/firmalar')} style={{ alignSelf: 'flex-start', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-60)', background: 'none', border: 'none', cursor: 'pointer' }}>
        ← Firmalar
      </button>

      <PortalCard padding={24}>
        <h2 className="serif" style={{ fontSize: 24, fontWeight: 500 }}>{c.name}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginTop: 16 }}>
          <Info label="Yetkili" value={c.contact_name || '—'} />
          <Info label="E-posta" value={c.email || '—'} />
          <Info label="Telefon" value={c.phone || '—'} />
          <Info label="Sektör" value={c.sector || '—'} />
          <Info label="Şehir" value={c.city || '—'} />
          <Info label="Durum" value={STATUS_TR[c.status] || c.status} />
        </div>
      </PortalCard>

      <PortalCard padding={24}>
        <h3 className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 6 }}>Tanımlı Ürünler</h3>
        <p style={{ fontSize: 13, color: 'var(--ink-60)', marginBottom: 16 }}>
          Bu firmaya özel ürünler ve fiyatlar. Aynı ürünü yeniden atayarak fiyatı güncelleyebilirsiniz.
        </p>

        {error && <div style={{ marginBottom: 12, padding: '10px 14px', background: '#fdeaea', color: '#9b2c2c', borderRadius: 6, fontSize: 13 }}>{error}</div>}

        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 18 }}>
          <div style={{ minWidth: 220, flex: 1 }}>
            <PortalSelect label="Ürün" value={pick} onChange={e => setPick(e.target.value)}
              options={[{ value: '', label: 'Ürün seçin…' }, ...d.products.map(p => ({ value: p.id, label: p.name }))]} />
          </div>
          <div style={{ width: 140 }}>
            <PortalInput label="Firma fiyatı (₺)" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0" />
          </div>
          <PortalButton variant="primary" onClick={assign} disabled={busy}>{busy ? '…' : 'Ata / Güncelle'}</PortalButton>
        </div>

        {d.assignments.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--ink-60)' }}>Bu firmaya henüz ürün tanımlanmadı.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {d.assignments.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--paper-warm)', borderRadius: 6 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>{a.products?.name || '—'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--accent)' }}>{fmtTL(Number(a.price) || 0)}</span>
                  <button onClick={() => unassign(a.id)} title="Kaldır" style={{ padding: 4, color: 'var(--ink-60)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Icons.Trash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </PortalCard>

      <PortalCard padding={0}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--line)' }}>
          <h3 className="serif" style={{ fontSize: 18, fontWeight: 500 }}>Siparişler ({d.orders.length})</h3>
        </div>
        {d.orders.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-60)', fontSize: 14 }}>Bu firmaya ait sipariş yok.</div>
        ) : d.orders.map((o, i) => (
          <div key={o.id} onClick={() => router.push('/portal/siparisler/' + o.id)} style={{
            display: 'grid', gridTemplateColumns: '1.4fr 130px 110px 130px', gap: 14, alignItems: 'center',
            padding: '14px 24px', cursor: 'pointer',
            borderBottom: i < d.orders.length - 1 ? '1px solid var(--line)' : 'none',
          }}>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-40)' }}>{label}</div>
      <div style={{ fontSize: 13.5, marginTop: 3 }}>{value}</div>
    </div>
  );
}

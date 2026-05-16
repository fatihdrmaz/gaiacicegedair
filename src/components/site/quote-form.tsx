'use client';

import { useEffect, useState } from 'react';
import { Button, Input, TextArea, Select, Field } from '@/components/ui';
import { Icons } from '@/components/shared/icons';

export function QuoteForm({ open, onClose, preset }: { open: boolean; onClose: () => void; preset?: string }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<any>({
    firma: '', ad: '', tel: '', email: '',
    tip: preset || 'Düğün Organizasyonu', konsept: '',
    kisi: '', tarih: '', mekan: '', butce: '5.000 – 15.000 ₺',
    notlar: '', files: [] as string[],
  });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (preset && open) setData((d: any) => ({ ...d, tip: preset })); }, [preset, open]);
  useEffect(() => {
    if (open) { document.body.style.overflow = 'hidden'; setStep(0); setSent(false); }
    else { document.body.style.overflow = ''; }
  }, [open]);

  if (!open) return null;

  const types = ['Düğün Organizasyonu', 'Kurumsal Organizasyon', 'Doğum Günü', 'Mekan Süsleme', 'Tekne Süsleme', 'Lobi Düzenleme', 'Karşılama Buketi', 'Kurumsal Hediye', 'Çelenk', 'Kurutulmuş Promosyon'];
  const butceler = ['2.500 – 5.000 ₺', '5.000 – 15.000 ₺', '15.000 – 40.000 ₺', '40.000 – 100.000 ₺', '100.000 ₺+', 'Size Özel'];

  const update = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

  const submit = async () => {
    setSubmitting(true);
    try {
      await fetch('/api/teklif', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' },
      });
      setSent(true);
    } catch (err) {
      console.error(err);
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(31,35,32,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      animation: 'fadeIn 0.3s',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--paper)', width: '100%', maxWidth: 820, maxHeight: '92vh', overflow: 'auto',
        position: 'relative',
      }}>
        <div style={{ padding: '36px 48px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="overline" style={{ color: 'var(--accent)' }}>Teklif Formu</div>
            <h2 className="serif" style={{ fontSize: 30, fontWeight: 400, marginTop: 6 }}>Size özel teklif hazırlayalım</h2>
          </div>
          <button onClick={onClose} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icons.Close size={18} />
          </button>
        </div>

        {!sent && (
          <div style={{ padding: '14px 48px 0', display: 'flex', gap: 8 }}>
            {[0,1,2].map(s => (
              <div key={s} style={{ flex: 1, height: 2, background: step >= s ? 'var(--accent)' : 'var(--ink-20)' }} />
            ))}
          </div>
        )}

        <div style={{ padding: '36px 48px' }}>
          {sent ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, margin: '0 auto', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.Check size={28} />
              </div>
              <div className="serif" style={{ fontSize: 32, marginTop: 24 }}>Teklifinizi aldık</div>
              <p style={{ color: 'var(--ink-60)', marginTop: 10, maxWidth: 420, margin: '10px auto 0', lineHeight: 1.6 }}>
                Ekibimiz 24 saat içinde size özel bir teklifle dönecek. Sabırsızlıkla çalışıyoruz — güzel bir şey doğacak.
              </p>
              <Button variant="primary" onClick={onClose} style={{ marginTop: 32 }}>Tamam</Button>
            </div>
          ) : step === 0 ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="form-grid">
                <Field label="Ad Soyad" required><Input value={data.ad} onChange={(e: any) => update('ad', e.target.value)} placeholder="Adınız" /></Field>
                <Field label="Firma Adı"><Input value={data.firma} onChange={(e: any) => update('firma', e.target.value)} placeholder="(varsa)" /></Field>
                <Field label="Telefon" required><Input value={data.tel} onChange={(e: any) => update('tel', e.target.value)} placeholder="+90 5xx xxx xx xx" /></Field>
                <Field label="E-posta" required><Input type="email" value={data.email} onChange={(e: any) => update('email', e.target.value)} placeholder="ornek@email.com" /></Field>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 36 }}>
                <Button variant="primary" onClick={() => setStep(1)} iconRight={<Icons.Arrow size={14} />} disabled={!data.ad || !data.tel || !data.email}>Devam</Button>
              </div>
            </>
          ) : step === 1 ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="form-grid">
                <Field label="Hizmet Tipi" required span={2}>
                  <Select value={data.tip} onChange={(e: any) => update('tip', e.target.value)} options={types} />
                </Field>
                <Field label="Konsept / Tema" span={2}>
                  <TextArea value={data.konsept} onChange={(e: any) => update('konsept', e.target.value)} placeholder="Örn: Romantik kır teması, beyaz ve pastel tonlar..." />
                </Field>
                <Field label="Kişi Sayısı"><Input value={data.kisi} onChange={(e: any) => update('kisi', e.target.value)} placeholder="Örn: 120" /></Field>
                <Field label="Tarih"><Input type="date" value={data.tarih} onChange={(e: any) => update('tarih', e.target.value)} /></Field>
                <Field label="Mekan / Adres" span={2}><Input value={data.mekan} onChange={(e: any) => update('mekan', e.target.value)} placeholder="Mekan adı veya adres" /></Field>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 36 }}>
                <Button variant="ghost" onClick={() => setStep(0)} icon={<Icons.ArrowLeft size={14} />}>Geri</Button>
                <Button variant="primary" onClick={() => setStep(2)} iconRight={<Icons.Arrow size={14} />}>Devam</Button>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="form-grid">
                <Field label="Bütçe Aralığı" span={2}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {butceler.map(b => (
                      <button key={b} type="button" onClick={() => update('butce', b)} style={{
                        padding: '10px 16px', borderRadius: 999, fontSize: 13,
                        background: data.butce === b ? 'var(--accent)' : 'transparent',
                        color: data.butce === b ? '#fff' : 'var(--ink)',
                        border: `1px solid ${data.butce === b ? 'var(--accent)' : 'var(--line)'}`,
                        cursor: 'pointer',
                      }}>{b}</button>
                    ))}
                  </div>
                </Field>
                <Field label="Referans Görsel" span={2} hint="İlham aldığınız görselleri yükleyebilirsiniz (PNG, JPG — maks 10MB)">
                  <label style={{
                    border: '1px dashed var(--line)', padding: 30, textAlign: 'center', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: 'var(--ink-60)',
                  }}>
                    <Icons.Upload size={22} />
                    <span>Dosya seç veya buraya sürükle</span>
                    <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                      onChange={e => update('files', Array.from(e.target.files || []).map(f => f.name))} />
                    {data.files.length > 0 && (
                      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--accent)' }}>{data.files.length} dosya seçildi</div>
                    )}
                  </label>
                </Field>
                <Field label="Ek Notlar" span={2}>
                  <TextArea value={data.notlar} onChange={(e: any) => update('notlar', e.target.value)} placeholder="Eklemek istediğiniz her şey..." rows={3} />
                </Field>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 36 }}>
                <Button variant="ghost" onClick={() => setStep(1)} icon={<Icons.ArrowLeft size={14} />}>Geri</Button>
                <Button variant="primary" onClick={submit} disabled={submitting} iconRight={<Icons.Arrow size={14} />}>
                  {submitting ? 'Gönderiliyor...' : 'Teklifi Gönder'}
                </Button>
              </div>
            </>
          )}
        </div>
        <style>{`@media (max-width: 640px){ .form-grid { grid-template-columns: 1fr !important; } label[style*="grid-column"] { grid-column: span 1 !important; } }`}</style>
      </div>
    </div>
  );
}

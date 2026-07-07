'use client';
// Auth screens — Login, Register, Pending approval

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/shared/icons';
import { PortalCard, PortalButton, PortalInput, PortalSelect } from '@/components/portal/ui';
import { PHOTOS } from '@/components/site/images';
import { createClient } from '@/lib/supabase/client';

export function PortalLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: signErr } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (signErr || !data.user) {
        setError('E-posta veya şifre hatalı.');
        return;
      }
      const uid = data.user.id;
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', uid)
        .single();
      if (profile?.role === 'admin') {
        router.push('/admin');
        return;
      }
      const { data: company } = await supabase
        .from('companies')
        .select('status')
        .eq('user_id', uid)
        .maybeSingle();
      if (company && company.status !== 'approved') {
        router.push('/portal/onay-bekliyor');
        return;
      }
      router.push('/portal/dashboard');
    } catch {
      setError('Giriş sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--paper)' }} className="auth-grid">
      <div style={{ padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 540, margin: '0 auto', width: '100%' }}>
        <div className="overline" style={{ color: 'var(--accent)', marginBottom: 16 }}>◦ Kurumsal Portal ◦</div>
        <h1 className="serif" style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em' }}>
          Hoş geldiniz.
        </h1>
        <p style={{ marginTop: 14, color: 'var(--ink-60)', fontSize: 16, lineHeight: 1.6 }}>
          Hesabınıza giriş yaparak takviminizi planlayın, taleplerinizi yönetin ve siparişlerinizi takip edin.
        </p>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 36 }}>
          <PortalInput label="E-posta" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ornek@firma.com" required />
          <PortalInput label="Şifre" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" required />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" /> <span>Beni hatırla</span>
            </label>
            <a style={{ color: 'var(--accent)', cursor: 'pointer' }}>Şifremi unuttum</a>
          </div>
          {error && (
            <div style={{ padding: '10px 14px', background: '#fdeaea', color: '#9b2c2c', borderRadius: 6, fontSize: 13 }}>{error}</div>
          )}
          <PortalButton type="submit" variant="primary" size="lg" disabled={loading} style={{ justifyContent: 'center', width: '100%' }}>
            {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
          </PortalButton>
        </form>

        <div style={{ marginTop: 30, padding: 18, background: 'var(--accent-soft)', borderRadius: 8, fontSize: 14, color: 'var(--accent-deep)' }}>
          Henüz hesabınız yok mu? <Link href="/portal/kayit" style={{ fontWeight: 500, cursor: 'pointer', borderBottom: '1px solid currentColor', color: 'inherit', textDecoration: 'none' }}>Kurumsal kayıt başvurusu</Link>
        </div>

      </div>

      <div style={{ position: 'relative', overflow: 'hidden' }} className="auth-hero">
        <img src={(PHOTOS as any).cWelcome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.2), rgba(42,67,53,0.6))' }} />
        <div style={{ position: 'absolute', bottom: 60, left: 60, right: 60, color: '#fff' }}>
          <h2 className="serif" style={{ fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.01em' }}>
            "Çiçek varsa, mekân yaşayan bir ruha dönüşür."
          </h2>
          <p style={{ marginTop: 16, fontSize: 14, opacity: 0.85, maxWidth: 380 }}>
            GAIA Kurumsal — kurumunuzun çiçek operasyonunu tek yerden yönetin.
          </p>
        </div>
      </div>

      <style>{`@media (max-width: 860px){ .auth-grid { grid-template-columns: 1fr !important; } .auth-hero { display: none; } }`}</style>
    </div>
  );
}

export function PortalRegister() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<any>({
    company: '', taxNo: '', taxOffice: '', sector: '', size: '',
    contact: '', role: '', email: '', phone: '', password: '',
    address: '', city: 'İstanbul',
    kvkk: false, terms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<'kvkk' | 'terms' | null>(null);
  const update = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

  const submitApplication = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/portal/kayit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          company: data.company, taxNo: data.taxNo, taxOffice: data.taxOffice,
          sector: data.sector, size: data.size, contact: data.contact,
          role: data.role, email: data.email, phone: data.phone,
          password: data.password, address: data.address, city: data.city,
          kvkk: data.kvkk,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Başvuru gönderilemedi.');
        return;
      }
      router.push('/portal/onay-bekliyor');
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, background: 'var(--paper)' }}>
      <div style={{ width: '100%', maxWidth: 720 }}>
        <div style={{ marginBottom: 30 }}>
          <Link href="/portal/giris" style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-60)', cursor: 'pointer', textDecoration: 'none' }}>← Girişe dön</Link>
          <div className="overline" style={{ color: 'var(--accent)', marginTop: 24 }}>◦ Kurumsal Başvuru ◦</div>
          <h1 className="serif" style={{ fontSize: 'clamp(32px, 4vw, 46px)', fontWeight: 400, lineHeight: 1.05, marginTop: 10 }}>
            Firmanızı tanıyalım.
          </h1>
          <p style={{ marginTop: 12, color: 'var(--ink-60)', fontSize: 16 }}>
            Başvurunuz GAIA ekibi tarafından 24 saat içinde değerlendirilir.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 30 }}>
          {[0, 1, 2].map(s => (
            <div key={s} style={{
              flex: 1, height: 3, borderRadius: 999,
              background: step >= s ? 'var(--accent)' : 'var(--line)',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>

        <PortalCard padding={36}>
          {step === 0 && (
            <>
              <h2 className="serif" style={{ fontSize: 24, fontWeight: 500, marginBottom: 24 }}>Firma Bilgileri</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="form2">
                <div style={{ gridColumn: 'span 2' }}><PortalInput label="Firma Ünvanı" required value={data.company} onChange={e => update('company', e.target.value)} placeholder="ABC Holding A.Ş." /></div>
                <PortalInput label="Vergi No" required value={data.taxNo} onChange={e => update('taxNo', e.target.value)} placeholder="10 haneli" />
                <PortalInput label="Vergi Dairesi" value={data.taxOffice} onChange={e => update('taxOffice', e.target.value)} placeholder="Maslak V.D." />
                <PortalSelect label="Sektör" value={data.sector} onChange={e => update('sector', e.target.value)} options={['Seçiniz...', 'Bankacılık & Finans', 'Konaklama', 'Sağlık', 'Pazarlama / Ajans', 'Hukuk', 'Teknoloji', 'Üretim', 'Perakende', 'Diğer']} />
                <PortalSelect label="Firma Büyüklüğü" value={data.size} onChange={e => update('size', e.target.value)} options={['Seçiniz...', '1–10', '11–50', '51–200', '201–500', '500+']} />
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <h2 className="serif" style={{ fontSize: 24, fontWeight: 500, marginBottom: 24 }}>Yetkili Kişi</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="form2">
                <PortalInput label="Ad Soyad" required value={data.contact} onChange={e => update('contact', e.target.value)} />
                <PortalInput label="Görevi" value={data.role} onChange={e => update('role', e.target.value)} placeholder="Örn. Satınalma Müdürü" />
                <PortalInput label="Kurumsal E-posta" type="email" required value={data.email} onChange={e => update('email', e.target.value)} />
                <PortalInput label="Telefon" required value={data.phone} onChange={e => update('phone', e.target.value)} placeholder="+90" />
                <div style={{ gridColumn: 'span 2' }}><PortalInput label="Şifre" type="password" required value={data.password} onChange={e => update('password', e.target.value)} placeholder="En az 8 karakter" /></div>
                <div style={{ gridColumn: 'span 2' }}><PortalInput label="Adres" required value={data.address} onChange={e => update('address', e.target.value)} placeholder="Mahalle, sokak, no" /></div>
                <PortalSelect label="Şehir" value={data.city} onChange={e => update('city', e.target.value)} options={['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Diğer']} />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="serif" style={{ fontSize: 24, fontWeight: 500, marginBottom: 24 }}>Onaylar</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, border: '1px solid var(--line)', borderRadius: 6, cursor: 'pointer' }}>
                  <input type="checkbox" checked={data.kvkk} onChange={e => update('kvkk', e.target.checked)} style={{ marginTop: 4 }} />
                  <span style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--ink-60)' }}>
                    <button type="button" onClick={e => { e.preventDefault(); setModal('kvkk'); }}
                      style={{ color: 'var(--accent)', fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}>
                      KVKK Aydınlatma Metni
                    </button>'ni okudum, kişisel verilerimin işlenmesini kabul ediyorum.
                  </span>
                </label>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, border: '1px solid var(--line)', borderRadius: 6, cursor: 'pointer' }}>
                  <input type="checkbox" checked={data.terms} onChange={e => update('terms', e.target.checked)} style={{ marginTop: 4 }} />
                  <span style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--ink-60)' }}>
                    <button type="button" onClick={e => { e.preventDefault(); setModal('terms'); }}
                      style={{ color: 'var(--accent)', fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}>
                      Kullanıcı Sözleşmesi
                    </button>'ni okudum ve kabul ediyorum.
                  </span>
                </label>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ marginTop: 4 }} />
                  <span style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--ink-60)' }}>
                    GAIA'dan ürün, hizmet ve kampanyalarla ilgili e-posta almak istiyorum.
                  </span>
                </label>
              </div>
            </>
          )}

          {error && (
            <div style={{ marginTop: 20, padding: '10px 14px', background: '#fdeaea', color: '#9b2c2c', borderRadius: 6, fontSize: 13 }}>{error}</div>
          )}
          <div style={{ marginTop: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            {step > 0 ? (
              <PortalButton variant="ghost" onClick={() => setStep(step - 1)} icon={<Icons.ArrowLeft size={14} />}>Geri</PortalButton>
            ) : <span />}
            {step < 2 ? (
              <PortalButton variant="primary" onClick={() => setStep(step + 1)} iconRight={<Icons.Arrow size={14} />}>Devam</PortalButton>
            ) : (
              <PortalButton variant="primary" size="lg" onClick={submitApplication} disabled={!data.kvkk || !data.terms || submitting}>
                {submitting ? 'Gönderiliyor…' : 'Başvuruyu Gönder'}
              </PortalButton>
            )}
          </div>
        </PortalCard>

        <style>{`@media (max-width: 640px){ .form2 { grid-template-columns: 1fr !important; } .form2 > div[style*="span 2"] { grid-column: span 1 !important; } }`}</style>
      </div>

      {modal && (
        <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(31,35,32,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', maxWidth: 640, width: '100%', maxHeight: '85vh', overflowY: 'auto', borderRadius: 8, padding: '30px 34px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <h3 className="serif" style={{ fontSize: 24, fontWeight: 500 }}>
                {modal === 'kvkk' ? 'KVKK Aydınlatma Metni' : 'Kullanıcı Sözleşmesi'}
              </h3>
              <button type="button" onClick={() => setModal(null)} aria-label="Kapat"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-60)', padding: 4 }}>
                <Icons.Close size={20} />
              </button>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-60)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(modal === 'kvkk' ? [
                'GAIA Çiçeğe Dair, veri sorumlusu sıfatıyla; kurumsal başvurunuz sırasında paylaştığınız firma bilgileri, yetkili kişi kimlik ve iletişim verilerini işler.',
                'Verileriniz; başvurunuzun değerlendirilmesi, kurumsal hesabınızın oluşturulması, sipariş ve teslimat süreçlerinin yürütülmesi ile yasal yükümlülüklerin yerine getirilmesi amaçlarıyla işlenir.',
                'Veriler; yalnızca hizmetin sağlanması için gerekli olduğu ölçüde altyapı ve hizmet sağlayıcılarımızla ve yasal olarak yetkili kurumlarla paylaşılır; pazarlama amacıyla üçüncü taraflara satılmaz.',
                '6698 sayılı KVKK md. 11 kapsamında verilerinize erişme, düzeltilmesini veya silinmesini isteme haklarına sahipsiniz. Talepleriniz için info@gaiacicegedair.com adresine yazabilirsiniz.',
                'Detaylı metne /kvkk sayfasından ulaşabilirsiniz.',
              ] : [
                'Bu sözleşme, GAIA Çiçeğe Dair kurumsal portalını kullanan firma ile GAIA Çiçeğe Dair arasındaki kullanım koşullarını düzenler.',
                'Kurumsal başvurunuz GAIA ekibi tarafından incelenir; onaylanması halinde portal erişiminiz açılır. Onay zorunlu olup başvuru tek başına üyelik hakkı doğurmaz.',
                'Portal üzerinden oluşturulan siparişler, GAIA ile yapılan fiyat ve içerik mutabakatına tabidir. Bütçe aşan talepler yönetici onayına gönderilebilir.',
                'Hesap güvenliğiniz ve giriş bilgilerinizin gizliliği sizin sorumluluğunuzdadır. GAIA, hizmeti iyileştirmek amacıyla sözleşme şartlarını güncelleyebilir.',
                'Sorularınız için info@gaiacicegedair.com adresinden bize ulaşabilirsiniz.',
              ]).map((p, i) => <p key={i} style={{ margin: 0 }}>{p}</p>)}
            </div>
            <PortalButton variant="primary" onClick={() => setModal(null)} style={{ marginTop: 24 }}>
              Anladım, kapat
            </PortalButton>
          </div>
        </div>
      )}
    </div>
  );
}

export function PortalPending() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, background: 'var(--paper)' }}>
      <div style={{ textAlign: 'center', maxWidth: 540 }}>
        <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: 'var(--accent)' }}>
          <Icons.Clock size={36} />
        </div>
        <h1 className="serif" style={{ fontSize: 'clamp(32px, 4vw, 46px)', fontWeight: 400, lineHeight: 1.05, marginTop: 30 }}>
          Başvurunuz incelemede.
        </h1>
        <p style={{ marginTop: 20, color: 'var(--ink-60)', fontSize: 17, lineHeight: 1.6 }}>
          Hesabınız GAIA ekibimiz tarafından <strong>24 saat içinde</strong> incelenecek ve sonucu kurumsal e-posta adresinize göndereceğiz. Onaylandığında sisteme giriş yapabilir, takvim ve sipariş özelliklerinin tamamına erişebilirsiniz.
        </p>

        <div style={{ marginTop: 50, padding: 30, background: 'var(--paper-warm)', borderRadius: 12, textAlign: 'left' }}>
          <div className="overline" style={{ color: 'var(--accent)', marginBottom: 14 }}>Bu sırada</div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              ['Hizmetlerimizi inceleyin', '/'],
              ['Blog yazılarını okuyun', '/blog'],
              ['Bir telefonla bizi arayın', '/iletisim'],
            ].map(([l, p]) => (
              <li key={l} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icons.Arrow size={14} />
                <Link href={p} style={{ color: 'var(--accent-deep)', fontSize: 15, borderBottom: '1px solid var(--accent)', textDecoration: 'none' }}>{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: 40, fontSize: 13, color: 'var(--ink-40)' }}>
          Demo modu — başvurunun onaylandığını görmek için aşağıdaki butonu kullanın.
        </div>
        <Link href="/portal/giris">
          <PortalButton variant="secondary" style={{ marginTop: 14 }}>
            Onay Geldi → Giriş Yap
          </PortalButton>
        </Link>
      </div>
    </div>
  );
}

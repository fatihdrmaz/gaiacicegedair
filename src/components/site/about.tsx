import { FloralImage, Reveal, SectionTitle } from '@/components/ui';
import { Icons } from '@/components/shared/icons';

export function About({ full = false }: { full?: boolean }) {
  return (
    <section style={{ padding: full ? '160px 0 120px' : '120px 0', background: 'var(--paper)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="about-grid">
          <div>
            <FloralImage palette="sage" seed={101} ratio="4/5" photo="atelier" />
          </div>
          <div>
            <div className="overline" style={{ color: 'var(--accent)', marginBottom: 18 }}>Hakkımızda</div>
            <h2 className="serif" style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em' }}>
              Doğanın renklerini,<br/><em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>özel anlarınıza.</em>
            </h2>
            <p style={{ marginTop: 26, fontSize: 17, color: 'var(--ink-60)', lineHeight: 1.7 }}>
              GAIA, doğaya olan sevgiyi ve çiçeklerin eşsiz güzelliklerine duyulan hayranlığı birleştiren özel bir çiçek satış platformudur. Sizlere doğanın renklerini, neşesini ve zarafetini yaşatmayı ve özel anlarınızı unutulmaz kılmayı amaçlıyoruz.
            </p>
            <p style={{ marginTop: 16, fontSize: 17, color: 'var(--ink-60)', lineHeight: 1.7 }}>
              GAIA olarak çiçeklerin büyüsünü keşfetmek, sevdiklerinizi mutlu etmek ve anlamlı hediyeler sunmak için buradayız.
            </p>
            {full && (
              <div style={{ marginTop: 50, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
                {[['Tasarım', 'Her proje özgün konsept'],['Zanaat', 'Elle dokunulan her çiçek'],['Zamanlama', 'Doğru anda, doğru yerde']].map(([t, d], i) => (
                  <div key={i}>
                    <div style={{ fontSize: 11, letterSpacing: '0.25em', color: 'var(--accent)', textTransform: 'uppercase' }}>0{i+1}</div>
                    <div className="serif" style={{ fontSize: 22, marginTop: 10 }}>{t}</div>
                    <p style={{ fontSize: 13, color: 'var(--ink-60)', marginTop: 6 }}>{d}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <style>{`@media (max-width: 860px){ .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
      </div>
    </section>
  );
}

export function WhoWeAre() {
  return (
    <section style={{ padding: '120px 0', background: 'var(--paper-warm)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="about-grid">
          <div style={{ order: 2 }}>
            <FloralImage palette="haki" seed={303} ratio="4/5" photo="cMeeting" />
          </div>
          <div style={{ order: 1 }}>
            <div className="overline" style={{ color: 'var(--accent)', marginBottom: 18 }}>Biz Kimiz</div>
            <h2 className="serif" style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em' }}>
              Çiçek tutkusuyla,<br/><em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>yanıp tutuşan bir ekip.</em>
            </h2>
            <p style={{ marginTop: 26, fontSize: 17, color: 'var(--ink-60)', lineHeight: 1.7 }}>
              GAIA ekibi, çiçek tutkusuyla yanıp tutuşan bir grup yetenekli ve yaratıcı bireyden oluşuyor. Her birimiz doğanın gücünü ve çiçeklerin insanları nasıl etkilediğini biliyoruz. Bir araya gelerek çiçek sektörüne yeni bir soluk getiriyor ve müşterilerimize unutulmaz deneyimler sunmayı hedefliyoruz.
            </p>
            <p style={{ marginTop: 16, fontSize: 17, color: 'var(--ink-60)', lineHeight: 1.7 }}>
              GAIA olarak misyonumuz, doğanın büyüleyici güzelliğini, özgünlüğünü ve canlılığını insanlarla buluşturmaktır. Her çiçeğin kendine özgü bir hikâyesi olduğuna inanıyoruz ve bu hikâyeyi sevdiklerinizle paylaşmanızı sağlamak istiyoruz. Müşterilerimize en kaliteli çiçekleri sunarak, özel anlarını daha anlamlı ve unutulmaz kılmak için çaba gösteriyoruz.
            </p>
          </div>
        </div>
        <style>{`@media (max-width: 860px){ section .about-grid > div { order: unset !important; } }`}</style>
      </div>
    </section>
  );
}

export function Values() {
  const values = [
    { icon: 'Leaf',     title: 'Mevsiminde',    desc: 'Taze, mevsimine uygun ve etik kaynaklardan çiçekler.' },
    { icon: 'Sparkle',  title: 'Özgün Konsept', desc: 'Hazır şablonlar değil, size özel moodboard ve tasarım.' },
    { icon: 'Heart',    title: 'Hikâye Odaklı', desc: 'Her etkinliğin bir duygusu var — onu çiçekle anlatıyoruz.' },
    { icon: 'Package',  title: 'Sürdürülebilir',desc: 'Kurutma, yeniden kullanım ve minimal atık ilkeleri.' },
  ];
  return (
    <section style={{ padding: '100px 0', background: 'var(--paper-warm)' }}>
      <div className="container">
        <SectionTitle eyebrow="Değerlerimiz" title={<>Çiçeğin ardındaki <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>prensipler.</em></>} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 30, marginTop: 60 }}>
          {values.map((v, i) => {
            const I = (Icons as any)[v.icon];
            return (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{ padding: '30px 0' }}>
                  <div style={{ width: 48, height: 48, border: '1px solid var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                    <I size={20} />
                  </div>
                  <h3 className="serif" style={{ fontSize: 22, marginTop: 20, fontWeight: 500 }}>{v.title}</h3>
                  <p style={{ marginTop: 8, fontSize: 14, color: 'var(--ink-60)', lineHeight: 1.6 }}>{v.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Team() {
  const team = [
    { name: 'Elif Yalçın',    role: 'Kurucu & Tasarım',   seed: 201, photo: 'team2' },
    { name: 'Derya Kaptan',   role: 'Konsept Direktörü',  seed: 202, photo: 'team1' },
    { name: 'Mert Sönmez',    role: 'Atölye Sorumlusu',   seed: 203, photo: 'team3' },
    { name: 'Naz Güner',      role: 'Kurumsal İlişkiler', seed: 204, photo: 'team4' },
  ];
  return (
    <section style={{ padding: '100px 0' }}>
      <div className="container">
        <SectionTitle eyebrow="Ekip" title="Çiçeğe dokunanlar." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 30, marginTop: 60 }}>
          {team.map(m => (
            <div key={m.name}>
              <FloralImage palette="haki" seed={m.seed} ratio="4/5" photo={m.photo} />
              <div style={{ marginTop: 16 }}>
                <div className="serif" style={{ fontSize: 22 }}>{m.name}</div>
                <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-40)', marginTop: 4 }}>{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

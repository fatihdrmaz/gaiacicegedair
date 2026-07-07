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
              Çiçeğin dokunduğu her ana,<br/><em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Yeryüzü Tanrıçası&apos;nın zarafetiyle.</em>
            </h2>
            <p style={{ marginTop: 26, fontSize: 17, color: 'var(--ink-60)', lineHeight: 1.7 }}>
              GAIA, doğaya olan sevgiyi ve çiçeklerin eşsiz güzelliklerine duyulan hayranlığı bir araya getiren; özel anlara, sevdiklerinize ve yaşam alanlarına değer katmayı amaçlayan bir çiçek dünyasıdır.
            </p>
            <p style={{ marginTop: 16, fontSize: 17, color: 'var(--ink-60)', lineHeight: 1.7 }}>
              Çiçeklerin yalnızca gönderilen bir hediye değil; hatırlatan, hissettiren ve bağ kuran özel bir dil olduğuna inanıyoruz. Bu yüzden GAIA&apos;da sizin için anlamlı olan günleri takip ediyor, sevdiklerinize değer verdiğiniz anlarda yanınızda oluyoruz.
            </p>
            <p style={{ marginTop: 16, fontSize: 17, color: 'var(--ink-60)', lineHeight: 1.7 }}>
              Kurumsal çözümlerimizle ise markalara özel çiçek deneyimleri tasarlıyor; her şirketin kendi ihtiyaçlarına uygun, kendine ait bir çiçek dünyası oluşturuyoruz.
            </p>
            <p style={{ marginTop: 16, fontSize: 17, color: 'var(--ink-60)', lineHeight: 1.7 }}>
              GAIA olarak çiçeklerin büyüsünü keşfetmek, özel anları unutulmaz kılmak ve doğanın zarafetini hayatın her alanına taşımak için buradayız.
            </p>
            {full && (
              <div style={{ marginTop: 50, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
                {[['Tasarım', 'Her proje için özgün konsept'],['Zanaat', 'Mevsimin ruhundan ilham alan seçimler'],['Zamanlama', 'İlk dokunuştan son ana kadar özen']].map(([t, d], i) => (
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
              Çiçeğe dair,<br/><em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>yeni bir deneyim.</em>
            </h2>
            <p style={{ marginTop: 26, fontSize: 17, color: 'var(--ink-60)', lineHeight: 1.7 }}>
              GAIA, çiçeği yalnızca bir ürün değil; planlanabilen, kişiselleştirilebilen ve her ana eşlik eden bir deneyim olarak gören yeni nesil bir çiçek platformudur.
            </p>
            <p style={{ marginTop: 16, fontSize: 17, color: 'var(--ink-60)', lineHeight: 1.7 }}>
              Bireysel müşterilerimiz için geliştirdiğimiz <strong>Özel Günlerim</strong> akışıyla önemli tarihleri hatırlayan; kurumsal çözümlerimizle markalara, otellere ve işletmelere özel çiçek süreçleri sunan bir yapı oluşturduk.
            </p>
            <p style={{ marginTop: 16, fontSize: 17, color: 'var(--ink-60)', lineHeight: 1.7 }}>
              Geleneksel çiçekçiliği tasarım, teknoloji ve özenle bir araya getirerek; çiçek göndermenin daha anlamlı ve zahmetsiz bir yolunu tasarlıyoruz.
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
    { icon: 'Sparkle',  title: 'Kişiselleştirme', desc: 'Her kişi, marka ve özel an için farklı tasarlanan çiçek deneyimleri.' },
    { icon: 'Calendar', title: 'Akıllı Planlama', desc: 'Özel Günlerim ile önemli tarihleri hatırlar, zamanı geldiğinde sizin adınıza hazırlarız.' },
    { icon: 'Building', title: 'Kurumsal Kolaylık', desc: 'Şirketlere ve markalara özel seçimler, düzenli çözümler ve hızlı süreçler sunarız.' },
    { icon: 'Heart',    title: 'Tasarım Dili', desc: 'Her çiçeği yalnızca bir ürün değil, anlatılacak bir hikâye olarak görürüz.' },
  ];
  return (
    <section style={{ padding: '100px 0', background: 'var(--paper-warm)' }}>
      <div className="container">
        <SectionTitle eyebrow="GAIA Deneyimi" title={<>Çiçeğin ardındaki <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>yeni yaklaşım.</em></>} />
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

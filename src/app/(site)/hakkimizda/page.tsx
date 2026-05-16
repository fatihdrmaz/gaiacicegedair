import { About, WhoWeAre, Values, Team } from '@/components/site/about';
import { Testimonials } from '@/components/site/showcase';

export default function HakkimizdaPage() {
  return (
    <>
      <section style={{ paddingTop: 180, paddingBottom: 60, textAlign: 'center' }}>
        <div className="container">
          <div className="overline" style={{ color: 'var(--accent)', marginBottom: 18 }}>◦ Hakkımızda ◦</div>
          <h1 className="serif" style={{ fontSize: 'clamp(46px, 6vw, 92px)', fontWeight: 300, lineHeight: 1.02 }}>Bir atölye, bir duygu dili.</h1>
          <p style={{ marginTop: 22, fontSize: 18, color: 'var(--ink-60)', maxWidth: 640, margin: '22px auto 0' }}>2013&apos;ten bu yana çiçeği bir tasarım nesnesi olarak düşünen butik atölye.</p>
        </div>
      </section>
      <About full />
      <WhoWeAre />
      <Values />
      <Team />
      <Testimonials />
    </>
  );
}

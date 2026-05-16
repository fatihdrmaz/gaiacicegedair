import { Contact } from '@/components/site/contact';
import { FAQ } from '@/components/site/gallery';

export default function IletisimPage() {
  return (
    <>
      <section style={{ paddingTop: 180, paddingBottom: 60, textAlign: 'center' }}>
        <div className="container">
          <div className="overline" style={{ color: 'var(--accent)', marginBottom: 18 }}>◦ İletişim ◦</div>
          <h1 className="serif" style={{ fontSize: 'clamp(46px, 6vw, 92px)', fontWeight: 300, lineHeight: 1.02 }}>Hikâyenizi dinleyelim.</h1>
          <p style={{ marginTop: 22, fontSize: 18, color: 'var(--ink-60)', maxWidth: 640, margin: '22px auto 0' }}>Atölyeye uğrayın, arayın ya da yazın — size en uygun yolu seçin.</p>
        </div>
      </section>
      <Contact full />
      <FAQ />
    </>
  );
}

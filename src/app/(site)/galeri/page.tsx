import { Gallery, InstagramFeed } from '@/components/site/gallery';

export default function GaleriPage() {
  return (
    <>
      <section style={{ paddingTop: 180, paddingBottom: 60, textAlign: 'center' }}>
        <div className="container">
          <div className="overline" style={{ color: 'var(--accent)', marginBottom: 18 }}>◦ Galeri ◦</div>
          <h1 className="serif" style={{ fontSize: 'clamp(46px, 6vw, 92px)', fontWeight: 300, lineHeight: 1.02 }}>Yapılan işler.</h1>
          <p style={{ marginTop: 22, fontSize: 18, color: 'var(--ink-60)', maxWidth: 640, margin: '22px auto 0' }}>Gerçek etkinlikler, gerçek mekânlar — atölyeden kareler.</p>
        </div>
      </section>
      <Gallery />
      <InstagramFeed />
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Reveal, SectionTitle } from '@/components/ui';
import { Icons } from '@/components/shared/icons';
import { PHOTOS, PhotoImage } from '@/components/site/images';
import { BLOG_POSTS } from '@/lib/content';

export function BlogListPage() {
  const [cat, setCat] = useState('Tümü');
  const [q, setQ] = useState('');
  const cats = ['Tümü', ...Array.from(new Set((BLOG_POSTS as any[]).map(p => p.cat)))];

  useEffect(() => {
    document.title = 'Blog · GAIA Çiçeğe Dair';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) (meta as HTMLMetaElement).content = 'Düğün, kurumsal çiçek, teklif sahnesi ve rehber yazıları — GAIA atölyesinden.';
  }, []);

  const posts = (BLOG_POSTS as any[]).filter(p =>
    (cat === 'Tümü' || p.cat === cat) &&
    (q === '' || p.title.toLowerCase().includes(q.toLowerCase()) || p.excerpt.toLowerCase().includes(q.toLowerCase()))
  );
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      <section style={{ paddingTop: 180, paddingBottom: 40, background: 'var(--paper)' }}>
        <div className="container">
          <Breadcrumbs items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Blog' }]} />
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <div className="overline" style={{ color: 'var(--accent)', marginBottom: 18 }}>◦ Blog & Rehber ◦</div>
            <h1 className="serif" style={{ fontSize: 'clamp(46px, 6vw, 92px)', fontWeight: 300, lineHeight: 1.02, letterSpacing: '-0.02em' }}>
              Atölyeden <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>notlar</em>.
            </h1>
            <p style={{ marginTop: 22, fontSize: 18, color: 'var(--ink-60)', maxWidth: 640, margin: '22px auto 0', lineHeight: 1.6 }}>
              Düğün paletinden kurumsal lobiye, rehber yazılardan konsept hikâyelerine — uzun soluklu okumalar.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 0 20px', background: 'var(--paper)', borderBottom: '1px solid var(--line)' }}>
        <div className="container" style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)}
                style={{
                  padding: '8px 18px', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase',
                  border: '1px solid ' + (cat === c ? 'var(--accent)' : 'var(--line)'),
                  background: cat === c ? 'var(--accent)' : 'transparent',
                  color: cat === c ? '#fff' : 'var(--ink)',
                  borderRadius: 999, cursor: 'pointer', transition: 'all 0.2s',
                }}>
                {c}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Yazılarda ara…"
              style={{ padding: '10px 16px 10px 38px', fontSize: 14, border: '1px solid var(--line)', background: 'transparent', borderRadius: 999, width: 240, outline: 'none' }} />
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-40)' }}>
              <Icons.Search size={14} />
            </span>
          </div>
        </div>
      </section>

      {featured && (
        <section style={{ padding: '60px 0', background: 'var(--paper)' }}>
          <div className="container">
            <Link href={`/blog/${featured.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 50, cursor: 'pointer', alignItems: 'center' }} className="blog-featured">
                <div style={{ overflow: 'hidden' }}>
                  <PhotoImage src={(PHOTOS as any)[featured.cover]} ratio="4/3" />
                </div>
                <div>
                  <div className="overline" style={{ color: 'var(--accent)' }}>◦ Öne Çıkan · {featured.cat} ◦</div>
                  <h2 className="serif" style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 400, marginTop: 20, lineHeight: 1.1 }}>{featured.title}</h2>
                  <p style={{ marginTop: 16, fontSize: 17, color: 'var(--ink-60)', lineHeight: 1.6 }}>{featured.excerpt}</p>
                  <div style={{ marginTop: 26, display: 'flex', gap: 16, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-40)' }}>
                    <span>{formatDate(featured.date)}</span>·
                    <span>{featured.readMin} dk okuma</span>·
                    <span style={{ color: 'var(--accent)' }}>Oku →</span>
                  </div>
                </div>
              </div>
            </Link>
            <style>{`@media (max-width: 860px){ .blog-featured { grid-template-columns: 1fr !important; gap: 30px !important; } }`}</style>
          </div>
        </section>
      )}

      <section style={{ padding: '60px 0 120px', background: 'var(--paper)' }}>
        <div className="container">
          {rest.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-60)' }}>
              Arama sonucu bulunamadı.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 40 }}>
              {rest.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.05}>
                  <Link href={`/blog/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <article style={{ cursor: 'pointer' }}
                      onMouseEnter={e => { const img = (e.currentTarget as HTMLElement).querySelector('img'); if (img) (img as HTMLImageElement).style.transform = 'scale(1.04)'; }}
                      onMouseLeave={e => { const img = (e.currentTarget as HTMLElement).querySelector('img'); if (img) (img as HTMLImageElement).style.transform = 'scale(1)'; }}
                    >
                      <div style={{ overflow: 'hidden' }}>
                        <PhotoImage src={(PHOTOS as any)[p.cover]} ratio="4/3" />
                      </div>
                      <div style={{ marginTop: 18 }}>
                        <div className="overline" style={{ color: 'var(--accent)' }}>{p.cat}</div>
                        <h3 className="serif" style={{ fontSize: 24, fontWeight: 500, marginTop: 10, lineHeight: 1.2 }}>{p.title}</h3>
                        <p style={{ fontSize: 14, color: 'var(--ink-60)', marginTop: 10, lineHeight: 1.55 }}>{p.excerpt}</p>
                        <div style={{ marginTop: 14, display: 'flex', gap: 10, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-40)' }}>
                          <span>{formatDate(p.date)}</span>·<span>{p.readMin} dk</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export function BlogDetailPage({ slug, onQuote }: { slug: string; onQuote?: () => void }) {
  const p = (BLOG_POSTS as any[]).find(x => x.slug === slug);

  useEffect(() => {
    if (!p) return;
    document.title = `${p.title} · GAIA Blog`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) (meta as HTMLMetaElement).content = p.excerpt;
  }, [slug]);

  if (!p) return <div style={{ padding: 200, textAlign: 'center' }}>Yazı bulunamadı.</div>;

  const relatedPosts = ((p.related as string[]) || []).map((s: string) => (BLOG_POSTS as any[]).find(x => x.slug === s)).filter(Boolean);

  return (
    <>
      <section style={{ paddingTop: 160, paddingBottom: 40, background: 'var(--paper)' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <Breadcrumbs items={[
            { label: 'Ana Sayfa', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: p.title }
          ]} />
          <div className="overline" style={{ color: 'var(--accent)', marginTop: 30 }}>◦ {p.cat} ◦</div>
          <h1 className="serif" style={{ fontSize: 'clamp(38px, 5.5vw, 76px)', fontWeight: 300, lineHeight: 1.05, marginTop: 18, letterSpacing: '-0.01em' }}>
            {p.title}
          </h1>
          <p style={{ marginTop: 22, fontSize: 20, color: 'var(--ink-60)', lineHeight: 1.55, fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
            {p.excerpt}
          </p>
          <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 30, borderBottom: '1px solid var(--line)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden' }}>
              <PhotoImage src={(PHOTOS as any)[p.author.photo]} ratio="1/1" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{p.author.name}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-60)' }}>{p.author.role}</div>
            </div>
            <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-40)', textAlign: 'right' }}>
              <div>{formatDate(p.date)}</div>
              <div style={{ marginTop: 4 }}>{p.readMin} dk okuma</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--paper)' }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <PhotoImage src={(PHOTOS as any)[p.cover]} ratio="16/9" />
        </div>
      </section>

      <article style={{ padding: '60px 0 100px', background: 'var(--paper)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          {p.blocks.map((b: any, i: number) => {
            if (b.type === 'p') return <p key={i} style={{ fontSize: 18, lineHeight: 1.8, color: 'var(--ink)', marginBottom: 24 }}>{b.text}</p>;
            if (b.type === 'h2') return <h2 key={i} className="serif" style={{ fontSize: 32, fontWeight: 500, marginTop: 50, marginBottom: 18, lineHeight: 1.2 }}>{b.text}</h2>;
            if (b.type === 'quote') return (
              <blockquote key={i} style={{ margin: '40px 0', padding: '24px 32px', borderLeft: '3px solid var(--accent)', background: 'var(--accent-soft)' }}>
                <p className="serif" style={{ fontSize: 24, fontStyle: 'italic', color: 'var(--accent-deep)', lineHeight: 1.4 }}>"{b.text}"</p>
              </blockquote>
            );
            if (b.type === 'list') return (
              <ul key={i} style={{ marginBottom: 28, paddingLeft: 0, listStyle: 'none' }}>
                {b.items.map((it: string, j: number) => (
                  <li key={j} style={{ display: 'flex', gap: 14, padding: '10px 0', fontSize: 17, lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--accent)', fontSize: 20 }}>✦</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            );
            return null;
          })}

          <div style={{ marginTop: 60, paddingTop: 30, borderTop: '1px solid var(--line)', display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-60)' }}>Paylaş</span>
            {['Twitter', 'Facebook', 'Linkedin', 'Whatsapp'].map(s => (
              <button key={s} style={{
                padding: '8px 16px', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
                border: '1px solid var(--line)', borderRadius: 999, background: 'transparent', cursor: 'pointer',
              }}>{s}</button>
            ))}
          </div>
        </div>
      </article>

      <section style={{ padding: '60px 0', background: 'var(--accent-soft)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              <PhotoImage src={(PHOTOS as any)[p.author.photo]} ratio="1/1" />
            </div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div className="overline" style={{ color: 'var(--accent)' }}>Yazan</div>
              <div className="serif" style={{ fontSize: 28, fontWeight: 500, marginTop: 6 }}>{p.author.name}</div>
              <div style={{ fontSize: 14, color: 'var(--ink-60)', marginTop: 4 }}>{p.author.role} — GAIA Atölyesi</div>
            </div>
            <Link href="/iletisim" style={{ textDecoration: 'none' }}>
              <Button variant="outlinedAccent" iconRight={<Icons.Arrow size={14} />}>İletişim</Button>
            </Link>
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section style={{ padding: '80px 0 120px', background: 'var(--paper)' }}>
          <div className="container">
            <SectionTitle eyebrow="Ayrıca" title="İlgili yazılar." />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 30, marginTop: 40 }}>
              {relatedPosts.map((r: any) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <article style={{ cursor: 'pointer' }}>
                    <div style={{ overflow: 'hidden' }}>
                      <PhotoImage src={(PHOTOS as any)[r.cover]} ratio="4/3" />
                    </div>
                    <div className="overline" style={{ color: 'var(--accent)', marginTop: 14 }}>{r.cat}</div>
                    <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, marginTop: 8, lineHeight: 1.25 }}>{r.title}</h3>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export function Breadcrumbs({ items, light }: { items: { label: string; href?: string }[]; light?: boolean }) {
  return (
    <nav style={{ display: 'flex', gap: 10, fontSize: 11.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: light ? 'rgba(255,255,255,0.85)' : 'var(--ink-60)', flexWrap: 'wrap' }}>
      {items.map((it, i) => (
        <span key={i} style={{ display: 'contents' }}>
          {it.href ? (
            <Link href={it.href} style={{ cursor: 'pointer', opacity: 0.85, color: 'inherit', textDecoration: 'none' }}>
              {it.label}
            </Link>
          ) : (
            <span style={{ fontWeight: 500 }}>{it.label}</span>
          )}
          {i < items.length - 1 && <span style={{ opacity: 0.5 }}>›</span>}
        </span>
      ))}
    </nav>
  );
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  const ay = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'][d.getMonth()];
  return `${d.getDate()} ${ay} ${d.getFullYear()}`;
}

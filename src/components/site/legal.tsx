import type { ReactNode } from 'react';

export function LegalLayout({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <>
      <section style={{ paddingTop: 160, paddingBottom: 40, textAlign: 'center' }}>
        <div className="container">
          <div className="overline" style={{ color: 'var(--accent)', marginBottom: 18 }}>◦ Yasal ◦</div>
          <h1 className="serif" style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, lineHeight: 1.05 }}>{title}</h1>
          {intro && (
            <p style={{ marginTop: 20, fontSize: 17, color: 'var(--ink-60)', maxWidth: 620, margin: '20px auto 0', lineHeight: 1.6 }}>{intro}</p>
          )}
          {updated && (
            <p style={{ marginTop: 14, fontSize: 12, letterSpacing: '0.1em', color: 'var(--ink-40)' }}>Son güncelleme: {updated}</p>
          )}
        </div>
      </section>
      <section style={{ paddingBottom: 100 }}>
        <div className="container" style={{ maxWidth: 760 }}>
          {children}
        </div>
      </section>
    </>
  );
}

export function LegalHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="serif" style={{ fontSize: 24, fontWeight: 500, marginTop: 40, marginBottom: 14, color: 'var(--ink)' }}>
      {children}
    </h2>
  );
}

export function LegalText({ children }: { children: ReactNode }) {
  return (
    <p style={{ fontSize: 15.5, lineHeight: 1.75, color: 'var(--ink-60)', marginBottom: 14 }}>{children}</p>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul style={{ margin: '0 0 14px', paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((it, i) => (
        <li key={i} style={{ fontSize: 15.5, lineHeight: 1.7, color: 'var(--ink-60)' }}>{it}</li>
      ))}
    </ul>
  );
}

'use client';
import { useState } from 'react';
import { Services, SpecialtiesBand } from '@/components/site/services';
import { Process, CTAStrip } from '@/components/site/showcase';
import { QuoteForm } from '@/components/site/quote-form';
import { useRouter } from 'next/navigation';

export default function HizmetlerPage() {
  const router = useRouter();
  const [quote, setQuote] = useState<{ open: boolean; preset?: string }>({ open: false });
  const openQuote = (preset?: string) => setQuote({ open: true, preset });
  return (
    <>
      <section style={{ paddingTop: 180, paddingBottom: 60, textAlign: 'center' }}>
        <div className="container">
          <div className="overline" style={{ color: 'var(--accent)', marginBottom: 18 }}>◦ Hizmetlerimiz ◦</div>
          <h1 className="serif" style={{ fontSize: 'clamp(46px, 6vw, 92px)', fontWeight: 300, lineHeight: 1.02 }}>Bir buketten <em style={{ fontStyle: 'italic' }}>fazlası…</em></h1>
          <p style={{ marginTop: 22, fontSize: 18, color: 'var(--ink-60)', maxWidth: 680, margin: '22px auto 0' }}>Mekânlara, kutlamalara ve anılara eşlik eden zamansız çiçek deneyimleri tasarlıyoruz.</p>
        </div>
      </section>
      <Services onQuote={openQuote} />
      <SpecialtiesBand />
      <Process />
      <CTAStrip onQuote={() => openQuote()} onB2C={() => router.push('/ozel-gunlerim')} />
      <QuoteForm open={quote.open} onClose={() => setQuote({ open: false })} preset={quote.preset} />
    </>
  );
}

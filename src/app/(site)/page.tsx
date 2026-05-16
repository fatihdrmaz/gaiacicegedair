'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Hero } from '@/components/site/hero';
import { Services, SpecialtiesBand } from '@/components/site/services';
import { About } from '@/components/site/about';
import { Showcase, Testimonials, PressLogos, Process, CTAStrip } from '@/components/site/showcase';
import { InstagramFeed } from '@/components/site/gallery';
import { QuoteForm } from '@/components/site/quote-form';

export default function HomePage() {
  const router = useRouter();
  const [quote, setQuote] = useState<{ open: boolean; preset?: string }>({ open: false });
  const openQuote = (preset?: string) => setQuote({ open: true, preset });

  const onCTA = (which: string) => {
    if (which === 'quote') openQuote();
    else if (which === 'b2c') router.push('/ozel-gunlerim');
    else if (which === 'services') router.push('/hizmetler');
  };

  return (
    <>
      <Hero onCTA={onCTA} />
      <SpecialtiesBand />
      <Services onQuote={openQuote} preview />
      <About />
      <Showcase />
      <Testimonials />
      <Process />
      <PressLogos />
      <InstagramFeed />
      <CTAStrip onQuote={() => openQuote()} onB2C={() => router.push('/ozel-gunlerim')} />
      <QuoteForm open={quote.open} onClose={() => setQuote({ open: false })} preset={quote.preset} />
    </>
  );
}

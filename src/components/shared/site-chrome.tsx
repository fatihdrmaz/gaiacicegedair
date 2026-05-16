'use client';

import { useState } from 'react';
import { Nav } from '@/components/shared/nav';
import { Footer } from '@/components/shared/footer';
import { QuoteForm } from '@/components/site/quote-form';
import { WhatsappFab } from '@/components/shared/whatsapp-fab';
import { TweaksPanel } from '@/components/shared/tweaks';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const [quote, setQuote] = useState<{ open: boolean; preset?: string }>({ open: false });
  const openQuote = (preset?: string) => setQuote({ open: true, preset });
  const closeQuote = () => setQuote({ open: false });

  return (
    <>
      <Nav onOpenQuote={() => openQuote()} />
      {children}
      <Footer onQuote={() => openQuote()} />
      <QuoteForm open={quote.open} onClose={closeQuote} preset={quote.preset} />
      <WhatsappFab />
      <TweaksPanel />
    </>
  );
}

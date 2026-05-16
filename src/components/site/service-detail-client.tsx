'use client';
import { useState } from 'react';
import { ServiceDetailPage } from './service-detail';
import { QuoteForm } from './quote-form';

export function ServiceDetailClient({ serviceKey }: { serviceKey: string }) {
  const [quote, setQuote] = useState<{ open: boolean; preset?: string }>({ open: false });
  return (
    <>
      <ServiceDetailPage serviceKey={serviceKey} onQuote={(preset?: string) => setQuote({ open: true, preset })} />
      <QuoteForm open={quote.open} onClose={() => setQuote({ open: false })} preset={quote.preset} />
    </>
  );
}

'use client';
import { useState } from 'react';
import { BlogDetailPage } from './blog';
import { QuoteForm } from './quote-form';

export function BlogDetailClient({ slug }: { slug: string }) {
  const [quote, setQuote] = useState<{ open: boolean; preset?: string }>({ open: false });
  return (
    <>
      <BlogDetailPage slug={slug} onQuote={() => setQuote({ open: true })} />
      <QuoteForm open={quote.open} onClose={() => setQuote({ open: false })} preset={quote.preset} />
    </>
  );
}

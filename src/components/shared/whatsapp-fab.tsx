'use client';

import { Icons } from '@/components/shared/icons';

const WHATSAPP_URL = 'https://wa.me/905312123267';

export function WhatsappFab() {
  const Icon = (Icons as any).Whatsapp;
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişime geç"
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        zIndex: 140,
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: '#25D366',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 28px rgba(37, 211, 102, 0.45)',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'transform 0.2s ease',
      }}
    >
      {Icon ? (
        <Icon size={28} />
      ) : (
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.5 3.5A10.5 10.5 0 003.4 16.2L2 22l5.9-1.4A10.5 10.5 0 1020.5 3.5zM8 8.5c.2-.5.6-.5 1-.5h.6c.2 0 .5 0 .7.5.2.6.8 2 .9 2.1.1.2.1.4 0 .6-.1.2-.4.6-.6.8-.2.2-.3.3-.1.6.6 1.1 1.3 1.8 2.6 2.5.3.1.5.1.6-.1l.8-.9c.2-.2.3-.2.6-.1l1.9.9c.2.1.4.2.4.4 0 1-.7 1.9-1.1 2-.3.2-2.5.9-5-1.3-2-1.7-2.7-4-2.7-4.4 0-.4-.4-1.3 0-2.1z" />
        </svg>
      )}
    </a>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui';
import { Icons } from '@/components/shared/icons';
import { Logo as GaiaLogo } from '@/components/shared/logo';

const items = [
  { href: '/', label: 'Ana Sayfa', match: (p: string) => p === '/' },
  { href: '/hizmetler', label: 'Hizmetlerimiz', match: (p: string) => p.startsWith('/hizmetler') },
  { href: '/hakkimizda', label: 'Hakkımızda', match: (p: string) => p.startsWith('/hakkimizda') },
  { href: '/galeri', label: 'Galeri', match: (p: string) => p.startsWith('/galeri') },
  { href: '/blog', label: 'Blog', match: (p: string) => p.startsWith('/blog') },
  { href: '/ozel-gunlerim', label: 'Özel Günlerim', match: (p: string) => p.startsWith('/ozel-gunlerim') },
  { href: '/iletisim', label: 'İletişim', match: (p: string) => p.startsWith('/iletisim') },
];

export function Nav(_props: { darkHero?: boolean; onOpenQuote?: () => void }) {
  const pathname = usePathname() || '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [portalAuthed, setPortalAuthed] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('gaia-portal') || '{}');
      setPortalAuthed(!!s.auth);
    } catch { setPortalAuthed(false); }
  }, []);

  // Header her sayfada katı arka plana sahip — hero görselleri üzerinde de okunur
  const inverted = false;
  const navColor = 'var(--ink)';
  const logoColor = undefined;

  return (
    <>
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(250, 249, 246, 0.94)',
      backdropFilter: 'saturate(140%) blur(14px)',
      borderBottom: '1px solid var(--line)',
      transition: 'all 0.35s ease',
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: scrolled ? '14px 40px' : '22px 40px',
        transition: 'padding 0.3s ease',
      }}>
        <Link href="/" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <GaiaLogo size={scrolled ? 26 : 32} stacked={false} tagline={!scrolled} color={logoColor} />
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 36 }} className="desktop-nav">
          {items.map(it => {
            const isActive = it.match(pathname);
            const activeColor = inverted ? '#fff' : 'var(--accent)';
            return (
              <Link key={it.href} href={it.href}
                style={{
                  fontSize: 12.5, letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: isActive ? activeColor : navColor,
                  fontWeight: isActive ? 500 : 400,
                  cursor: 'pointer',
                  paddingBottom: 4,
                  borderBottom: isActive ? `1px solid ${activeColor}` : '1px solid transparent',
                  transition: 'all 0.2s',
                  textShadow: inverted ? '0 1px 10px rgba(0,0,0,0.6)' : 'none',
                  textDecoration: 'none',
                }}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link href="/portal/giris" style={{ textDecoration: 'none' }} className="nav-cta">
            <Button size="sm" variant={inverted ? 'white' : 'primary'}>
              {portalAuthed ? 'Kurumsal Panel' : 'Kurumsal'}
            </Button>
          </Link>
          <button onClick={() => setMenuOpen(true)} className="mobile-only" style={{ display: 'none', padding: 8, color: navColor }}>
            <Icons.Menu size={22} />
          </button>
        </div>
      </div>
    </header>

    {menuOpen && (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 100, background: 'var(--paper)', padding: 24,
        animation: 'fadeIn 0.3s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <GaiaLogo size={28} stacked={false} tagline />
          <button onClick={() => setMenuOpen(false)}><Icons.Close size={24} /></button>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 60 }}>
          {items.map(it => (
            <Link key={it.href} href={it.href} onClick={() => setMenuOpen(false)}
              className="serif" style={{ fontSize: 32, color: 'var(--ink)', cursor: 'pointer', textDecoration: 'none' }}>
              {it.label}
            </Link>
          ))}
          <Link href="/portal/giris" onClick={() => setMenuOpen(false)}
            className="serif" style={{ fontSize: 32, color: 'var(--accent)', cursor: 'pointer', textDecoration: 'none' }}>
            {portalAuthed ? 'Kurumsal Panel' : 'Kurumsal'}
          </Link>
        </nav>
      </div>
    )}

    <style>{`
      @media (max-width: 960px) {
        .desktop-nav { display: none !important; }
        .mobile-only { display: block !important; }
        .nav-cta { display: none !important; }
      }
    `}</style>
    </>
  );
}

'use client';
// Portal shell — sidebar + top bar + main content

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icons } from '@/components/shared/icons';
import { Logo as GaiaLogo } from '@/components/shared/logo';
import { Avatar, PortalButton } from '@/components/portal/ui';
import { createClient } from '@/lib/supabase/client';

type NavItem = { id: string; label: string; icon: string; badge?: number; href: string };

const companyNav: NavItem[] = [
  { id: 'dashboard', label: 'Panel',      icon: 'Bouquet',  href: '/portal/dashboard' },
  { id: 'calendar',  label: 'Takvim',     icon: 'Calendar', href: '/portal/takvim' },
  { id: 'orders',    label: 'Siparişler', icon: 'Package',  badge: 4, href: '/portal/siparisler' },
  { id: 'addresses', label: 'Adresler',   icon: 'MapPin',   href: '/portal/adresler' },
  { id: 'employees', label: 'Çalışanlar', icon: 'User',     href: '/portal/calisanlar' },
  { id: 'billing',   label: 'Faturalama', icon: 'Gift',     href: '/portal/faturalama' },
  { id: 'reports',   label: 'Raporlar',   icon: 'Star',     href: '/portal/raporlar' },
];

const adminNav: NavItem[] = [
  { id: 'admin',          label: 'Admin Panel', icon: 'Settings', href: '/admin' },
  { id: 'admin-pending',  label: 'Onaylar',     icon: 'Check',    badge: 3, href: '/admin/bekleyen-firmalar' },
  { id: 'admin-kanban',   label: 'Kanban',      icon: 'Package',  href: '/admin/kanban' },
  { id: 'admin-capacity', label: 'Atölye',      icon: 'Hall',     href: '/admin/atolye' },
]

const titleMap: Record<string, string> = {
  '/portal/dashboard':  'Panel',
  '/portal/takvim':         'Yıllık Takvim',
  '/portal/siparisler':     'Siparişler',
  '/portal/siparisler/yeni':'Yeni Talep Oluştur',
  '/portal/adresler':       'Adres Defteri',
  '/portal/calisanlar':     'Çalışan Listesi',
  '/portal/faturalama':     'Faturalama & Bütçe',
  '/portal/raporlar':       'Raporlar',
  '/admin':                 'Admin Panel',
  '/admin/bekleyen-firmalar':'Bekleyen Firma Onayları',
  '/admin/kanban':          'Sipariş Kanban',
  '/admin/atolye':          'Atölye Kapasite',
};

export function PortalShell({ children, auth, isAdmin }: {
  children: React.ReactNode;
  auth?: { name?: string; company?: string; type?: string } | null;
  isAdmin?: boolean;
}) {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const isAuth = pathname.startsWith('/portal/giris') || pathname.startsWith('/portal/kayit') || pathname.startsWith('/portal/onay-bekliyor');

  const nav = isAdmin ? adminNav : companyNav;

  const onLogout = async () => {
    try {
      await createClient().auth.signOut();
    } catch {
      // yoksay — yine de giriş sayfasına yönlendir
    }
    router.push('/portal/giris');
    router.refresh();
  };

  if (isAuth) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--paper-warm)' }}>
        <PortalTopBar minimal />
        <div style={{ paddingTop: 60 }}>{children}</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ee', display: 'grid', gridTemplateColumns: '240px 1fr' }} className="portal-shell">
      <aside style={{
        background: 'var(--accent-deep)', color: '#fff', position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.08)',
      }}>
        {/* Logo */}
        <div style={{ padding: '22px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Link href="/" style={{ cursor: 'pointer', color: '#fff', display: 'inline-block' }}>
            <GaiaLogo size={22} stacked={false} tagline color="#fff" />
          </Link>
          <div style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginTop: 8 }}>
            {isAdmin ? 'Admin Portal' : 'Kurumsal Portal'}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {nav.map(it => {
            const I = (Icons as any)[it.icon] || (Icons as any).Flower;
            const active = pathname === it.href || (it.id === 'orders' && pathname.startsWith('/portal/siparisler'));
            return (
              <Link key={it.id} href={it.href} style={{
                cursor: 'pointer',
                padding: '11px 14px', borderRadius: 6,
                display: 'flex', alignItems: 'center', gap: 12,
                fontSize: 13.5,
                color: active ? '#fff' : 'rgba(255,255,255,0.7)',
                background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
                transition: 'all 0.15s', textDecoration: 'none',
              }}>
                <I size={16} />
                <span style={{ flex: 1 }}>{it.label}</span>
                {it.badge && (
                  <span style={{
                    background: 'var(--accent)', color: '#fff',
                    fontSize: 10, padding: '2px 7px', borderRadius: 999, fontWeight: 500,
                  }}>{it.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.06)' }}>
            <Avatar name={auth?.name || 'GAIA'} size={36} bg="var(--accent)" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {auth?.name || 'GAIA Admin'}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{auth?.company || (isAdmin ? 'Yönetici' : '')}</div>
            </div>
            <button onClick={onLogout} title="Çıkış" style={{
              color: 'rgba(255,255,255,0.85)', padding: '6px 10px',
              fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4,
              cursor: 'pointer', background: 'transparent',
            }}>Çıkış</button>
          </div>
          <Link href="/" style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: 11, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', letterSpacing: '0.16em', textTransform: 'uppercase', textDecoration: 'none' }}>
            ← Siteye Dön
          </Link>
        </div>
      </aside>

      <main style={{ minHeight: '100vh', overflow: 'hidden' }}>
        <PortalTopBar auth={auth} pathname={pathname} />
        <div style={{ padding: '24px 36px 60px' }}>
          {children}
        </div>
      </main>

      <style>{`
        @media (max-width: 860px) {
          .portal-shell { grid-template-columns: 1fr !important; }
          .portal-shell aside { position: fixed; left: -240px; transition: left 0.3s; z-index: 100; }
          .portal-shell aside.open { left: 0; }
        }
      `}</style>
    </div>
  );
}

export function PortalTopBar({ auth, pathname, minimal }: { auth?: any; pathname?: string; minimal?: boolean }) {
  const router = useRouter();
  if (minimal) {
    return (
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 60, zIndex: 50,
        background: 'var(--paper)', borderBottom: '1px solid var(--line)',
        display: 'flex', alignItems: 'center', padding: '0 32px',
      }}>
        <Link href="/" style={{ cursor: 'pointer' }}><GaiaLogo size={22} stacked={false} tagline /></Link>
        <div style={{ flex: 1 }} />
        <Link href="/" style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-60)', cursor: 'pointer', textDecoration: 'none' }}>← Siteye Dön</Link>
      </header>
    );
  }

  const path = pathname || '';
  const title = titleMap[path] || (path.startsWith('/portal/siparisler/') ? 'Sipariş Detayı' : '');

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'rgba(245, 243, 238, 0.92)', backdropFilter: 'saturate(140%) blur(10px)',
      borderBottom: '1px solid var(--line)',
      padding: '14px 36px', display: 'flex', alignItems: 'center', gap: 20,
    }}>
      <h1 className="serif" style={{ fontSize: 24, fontWeight: 500 }}>{title}</h1>
      <div style={{ flex: 1 }} />
      {!auth?.type?.includes('admin') && (
        <PortalButton variant="primary" size="md" icon={<Icons.Plus size={14} />} onClick={() => router.push('/portal/siparisler/yeni')}>
          Yeni Talep
        </PortalButton>
      )}
      <button style={{ position: 'relative', padding: 8 }}>
        <Icons.Calendar size={18} />
        <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
      </button>
    </header>
  );
}

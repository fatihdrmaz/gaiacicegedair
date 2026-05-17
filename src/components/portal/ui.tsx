'use client';
// Portal — UI primitives shared across portal pages

import React from 'react';
import { Icons } from '@/components/shared/icons';
import { getMockPortalState, type PortalState } from '@/lib/portal-data';

const PORTAL_KEY = 'gaia-portal';

export function getPortalState(): PortalState {
  if (typeof window === 'undefined') return getMockPortalState();
  try {
    const s = JSON.parse(localStorage.getItem(PORTAL_KEY) || '{}');
    const base = getMockPortalState();
    return {
      auth: s.auth || null,
      orders: s.orders || base.orders,
      events: s.events || base.events,
      addresses: s.addresses || base.addresses,
      employees: s.employees || base.employees,
      pending: s.pending || base.pending,
      b2cOrders: s.b2cOrders || base.b2cOrders,
    };
  } catch {
    return { auth: null, orders: [], events: [], addresses: [], employees: [], pending: [], b2cOrders: [] };
  }
}

export function savePortalState(s: PortalState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PORTAL_KEY, JSON.stringify(s));
}

// Format helpers
export function fmtTL(n: number) { return n.toLocaleString('tr-TR') + ' ₺'; }
export function fmtDate(iso: string) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
}
export function fmtDay(iso: string) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}
export function relTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Bugün';
  if (diff === 1) return 'Yarın';
  if (diff > 0 && diff <= 7) return diff + ' gün sonra';
  if (diff > 0) return diff + ' gün sonra';
  if (diff === -1) return 'Dün';
  return Math.abs(diff) + ' gün önce';
}

// ============ Portal primitives ============
export function PortalCard({ children, padding = 24, style }: { children: React.ReactNode; padding?: number; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--paper)', border: '1px solid var(--line)',
      padding, ...style,
    }}>{children}</div>
  );
}

export function StatCard({ label, value, hint, trend, icon }: { label: string; value: React.ReactNode; hint?: string; trend?: 'up' | 'down'; icon?: string }) {
  const I = icon ? (Icons as any)[icon] : null;
  return (
    <PortalCard padding={22}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div className="overline" style={{ color: 'var(--ink-60)' }}>{label}</div>
        {I && <span style={{ color: 'var(--accent)' }}><I size={18} /></span>}
      </div>
      <div className="serif" style={{ fontSize: 36, fontWeight: 500, marginTop: 14, lineHeight: 1 }}>{value}</div>
      {hint && <div style={{ fontSize: 12.5, color: trend === 'up' ? '#3a8a4a' : trend === 'down' ? '#a85050' : 'var(--ink-40)', marginTop: 10 }}>{hint}</div>}
    </PortalCard>
  );
}

export function StatusBadge({ status, size = 'md' }: { status: string; size?: 'sm' | 'md' }) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    'pending':    { bg: '#FFF4E5', fg: '#995200', label: 'İncelemede' },
    'approved':   { bg: '#E5F0FF', fg: '#1F5DAB', label: 'Onaylandı' },
    'production': { bg: '#F0E5FF', fg: '#5C2D9B', label: 'Atölyede' },
    'shipping':   { bg: '#E0F5E9', fg: '#1B6B3A', label: 'Yolda' },
    'delivered':  { bg: 'var(--accent-soft)', fg: 'var(--accent-deep)', label: 'Teslim ✓' },
    'rejected':   { bg: '#FBE5E5', fg: '#8B2424', label: 'Reddedildi' },
    'draft':      { bg: '#EEEEEE', fg: '#555555', label: 'Taslak' },
  };
  const c = map[status] || map.pending;
  const sz = size === 'sm' ? { padding: '3px 9px', fontSize: 10 } : { padding: '5px 12px', fontSize: 11 };
  return (
    <span style={{
      ...sz, background: c.bg, color: c.fg, borderRadius: 999, letterSpacing: '0.12em',
      textTransform: 'uppercase', fontWeight: 500, whiteSpace: 'nowrap',
    }}>
      {c.label}
    </span>
  );
}

export function PortalButton({ children, onClick, variant = 'primary', size = 'md', icon, iconRight, style, type, disabled }: {
  children?: React.ReactNode; onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode; iconRight?: React.ReactNode; style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset'; disabled?: boolean;
}) {
  const sizes = {
    sm: { padding: '8px 14px', fontSize: 12 },
    md: { padding: '10px 18px', fontSize: 13 },
    lg: { padding: '13px 24px', fontSize: 13.5 },
  };
  const variants = {
    primary:   { background: 'var(--accent)', color: '#fff', border: '1px solid var(--accent)' },
    secondary: { background: 'var(--accent-soft)', color: 'var(--accent-deep)', border: '1px solid transparent' },
    ghost:     { background: 'transparent', color: 'var(--ink)', border: '1px solid var(--line)' },
    danger:    { background: 'transparent', color: '#a85050', border: '1px solid #a85050' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      ...sizes[size], ...variants[variant], borderRadius: 6, fontWeight: 500,
      letterSpacing: '0.04em', cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1, display: 'inline-flex', alignItems: 'center', gap: 8,
      transition: 'all 0.15s', fontFamily: 'var(--font-body)', ...style,
    }}
      onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
    >
      {icon}{children}{iconRight}
    </button>
  );
}

export function PortalInput({ label, hint, error, required, ...props }: {
  label?: string; hint?: string; error?: string; required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink)' }}>
          {label}{required && <span style={{ color: 'var(--accent)', marginLeft: 4 }}>*</span>}
        </span>
      )}
      <input {...props} style={{
        padding: '11px 14px', fontSize: 14, fontFamily: 'var(--font-body)',
        border: '1px solid ' + (error ? '#a85050' : 'var(--line)'),
        borderRadius: 6, outline: 'none', background: 'var(--paper)',
        transition: 'border-color 0.2s', ...(props.style || {}),
      }}
        onFocus={e => { e.target.style.borderColor = 'var(--accent)'; props.onFocus && props.onFocus(e); }}
        onBlur={e => { e.target.style.borderColor = error ? '#a85050' : 'var(--line)'; props.onBlur && props.onBlur(e); }}
      />
      {hint && !error && <span style={{ fontSize: 12, color: 'var(--ink-40)' }}>{hint}</span>}
      {error && <span style={{ fontSize: 12, color: '#a85050' }}>{error}</span>}
    </label>
  );
}

export function PortalTextarea({ label, hint, required, ...props }: {
  label?: string; hint?: string; required?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <span style={{ fontSize: 12, fontWeight: 500 }}>
          {label}{required && <span style={{ color: 'var(--accent)', marginLeft: 4 }}>*</span>}
        </span>
      )}
      <textarea {...props} style={{
        padding: '11px 14px', fontSize: 14, fontFamily: 'var(--font-body)',
        border: '1px solid var(--line)', borderRadius: 6, outline: 'none', resize: 'vertical',
        minHeight: 80, ...(props.style || {}),
      }} />
      {hint && <span style={{ fontSize: 12, color: 'var(--ink-40)' }}>{hint}</span>}
    </label>
  );
}

export function PortalSelect({ label, options, required, ...props }: {
  label?: string; options: Array<string | { value: string; label: string }>; required?: boolean;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <span style={{ fontSize: 12, fontWeight: 500 }}>
          {label}{required && <span style={{ color: 'var(--accent)', marginLeft: 4 }}>*</span>}
        </span>
      )}
      <select {...props} style={{
        padding: '11px 14px', fontSize: 14, fontFamily: 'var(--font-body)',
        border: '1px solid var(--line)', borderRadius: 6, outline: 'none', background: 'var(--paper)',
        ...(props.style || {}),
      }}>
        {options.map((o, i) => typeof o === 'string'
          ? <option key={i} value={o}>{o}</option>
          : <option key={i} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

// Avatar circle (initials)
export function Avatar({ name = '', size = 40, bg }: { name?: string; size?: number; bg?: string }) {
  const init = name.split(' ').filter(Boolean).slice(0, 2).map(s => s[0]).join('').toUpperCase() || '?';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg || 'var(--accent)', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 500, flexShrink: 0,
    }}>{init}</div>
  );
}

export { EVENT_COLORS } from '@/lib/portal-data';

'use client';

import { PortalShell } from '@/components/portal/shell';
import { type PortalState } from '@/lib/portal-data';
import { useState, useEffect } from 'react';

const EMPTY: PortalState = {
  auth: null,
  orders: [],
  events: [],
  addresses: [],
  employees: [],
  pending: [],
  b2cOrders: [],
};

export function PortalPageShell({
  children,
  isAdmin,
}: {
  children: (state: PortalState) => React.ReactNode;
  isAdmin?: boolean;
}) {
  const [state, setState] = useState<PortalState | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/portal/state')
      .then((r) => (r.ok ? r.json() : EMPTY))
      .then((data: PortalState) => {
        if (active) setState(data);
      })
      .catch(() => {
        if (active) setState(EMPTY);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!state) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--paper)',
          color: 'var(--ink-60)',
          fontSize: 14,
          letterSpacing: '0.1em',
        }}
      >
        Yükleniyor…
      </div>
    );
  }

  const activeOrders = state.orders.filter(
    (o) => !['delivered', 'rejected'].includes(o.status),
  ).length;
  // Kanban ve Özel Günler rozetleri yalnızca bugünden itibaren 7 gün içindeki teslimatları sayar
  const today = new Date();
  const fromIso = today.toISOString().slice(0, 10);
  const toIso = new Date(today.getTime() + 7 * 86400000).toISOString().slice(0, 10);
  const inNextWeek = (d: string) => !!d && d >= fromIso && d <= toIso;

  const weekCorporate = state.orders.filter(
    (o) => !['delivered', 'rejected'].includes(o.status) && inNextWeek(o.date),
  ).length;
  const weekB2C = state.b2cOrders
    .filter((o) => !['refunded', 'failed', 'pending'].includes(o.status))
    .flatMap((o) => o.items)
    .filter((it) => !['delivered', 'refunded'].includes(it.status) && inNextWeek(it.eventDate)).length;

  const badges: Record<string, number> = {
    orders: activeOrders,
    'admin-pending': state.pending.length,
    'admin-quotes': state.counts?.newQuotes || 0,
    'admin-messages': state.counts?.newMessages || 0,
    'admin-kanban': weekCorporate,
    'admin-b2c': weekB2C,
  };

  return (
    <PortalShell
      auth={{
        name: state.auth?.name ?? 'Kullanıcı',
        company: state.auth?.company ?? 'GAIA',
      }}
      isAdmin={isAdmin ?? state.auth?.type === 'admin'}
      badges={badges}
    >
      {children(state)}
    </PortalShell>
  );
}

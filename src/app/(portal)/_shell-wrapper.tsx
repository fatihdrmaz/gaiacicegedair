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
  const activeB2C = state.b2cOrders.filter(
    (o) => o.status !== 'delivered',
  ).length;

  const badges: Record<string, number> = {
    orders: activeOrders,
    'admin-pending': state.pending.length,
    'admin-kanban': activeOrders,
    'admin-b2c': activeB2C,
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

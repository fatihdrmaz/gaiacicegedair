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

  if (!state) return null;

  return (
    <PortalShell
      auth={{
        name: state.auth?.name ?? 'Kullanıcı',
        company: state.auth?.company ?? 'GAIA',
      }}
      isAdmin={isAdmin ?? state.auth?.type === 'admin'}
    >
      {children(state)}
    </PortalShell>
  );
}

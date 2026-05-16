'use client';
import { use } from 'react';
import { PortalPageShell } from '@/app/(portal)/_shell-wrapper';
import { PortalOrderDetail } from '@/components/portal/orders';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PortalPageShell>{(state) => <PortalOrderDetail orderId={id} state={state} />}</PortalPageShell>;
}

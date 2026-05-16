'use client';
import { PortalPageShell } from '@/app/(portal)/_shell-wrapper';
import { PortalOrders } from '@/components/portal/orders';

export default function Page() {
  return <PortalPageShell>{(state) => <PortalOrders state={state} />}</PortalPageShell>;
}

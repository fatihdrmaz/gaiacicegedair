'use client';
import { PortalPageShell } from '@/app/(portal)/_shell-wrapper';
import { PortalOrderNew } from '@/components/portal/orders';

export default function Page() {
  return <PortalPageShell>{(state) => <PortalOrderNew state={state} />}</PortalPageShell>;
}

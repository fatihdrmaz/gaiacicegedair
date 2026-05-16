'use client';
import { PortalPageShell } from '../../_shell-wrapper';
import { PortalBilling } from '@/components/portal/dashboard';
export default function Page() { return <PortalPageShell>{(state) => <PortalBilling state={state} />}</PortalPageShell>; }

'use client';
import { PortalPageShell } from '../../_shell-wrapper';
import { PortalAddresses } from '@/components/portal/dashboard';
export default function Page() { return <PortalPageShell>{(state) => <PortalAddresses state={state} />}</PortalPageShell>; }

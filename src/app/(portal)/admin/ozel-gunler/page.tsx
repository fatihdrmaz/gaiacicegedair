'use client';
import { PortalPageShell } from '../../_shell-wrapper';
import { PortalAdminB2C } from '@/components/portal/admin';
export default function Page() { return <PortalPageShell isAdmin>{(state) => <PortalAdminB2C state={state} />}</PortalPageShell>; }

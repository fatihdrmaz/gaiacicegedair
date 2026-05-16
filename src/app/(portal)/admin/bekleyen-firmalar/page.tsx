'use client';
import { PortalPageShell } from '../../_shell-wrapper';
import { PortalAdminPending } from '@/components/portal/admin';
export default function Page() { return <PortalPageShell isAdmin>{(state) => <PortalAdminPending state={state} />}</PortalPageShell>; }

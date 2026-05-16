'use client';
import { PortalPageShell } from '../../_shell-wrapper';
import { PortalAdminCapacity } from '@/components/portal/admin';
export default function Page() { return <PortalPageShell isAdmin>{(state) => <PortalAdminCapacity state={state} />}</PortalPageShell>; }

'use client';
import { PortalPageShell } from '../_shell-wrapper';
import { PortalAdminDashboard } from '@/components/portal/admin';
export default function Page() { return <PortalPageShell isAdmin>{(state) => <PortalAdminDashboard state={state} />}</PortalPageShell>; }

'use client';
import { PortalPageShell } from '../../_shell-wrapper';
import { PortalDashboard } from '@/components/portal/dashboard';
export default function Page() { return <PortalPageShell>{(state) => <PortalDashboard state={state} />}</PortalPageShell>; }

'use client';
import { PortalPageShell } from '../../_shell-wrapper';
import { PortalReports } from '@/components/portal/dashboard';
export default function Page() { return <PortalPageShell>{(state) => <PortalReports state={state} />}</PortalPageShell>; }

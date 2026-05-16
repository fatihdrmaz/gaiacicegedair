'use client';
import { PortalPageShell } from '../../_shell-wrapper';
import { PortalCalendar } from '@/components/portal/dashboard';
export default function Page() { return <PortalPageShell>{(state) => <PortalCalendar state={state} />}</PortalPageShell>; }

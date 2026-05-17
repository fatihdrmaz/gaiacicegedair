'use client';
import { PortalPageShell } from '../../_shell-wrapper';
import { PortalCalendar } from '@/components/portal/dashboard';
export default function Page() { return <PortalPageShell isAdmin>{(state) => <PortalCalendar state={state} readOnly />}</PortalPageShell>; }

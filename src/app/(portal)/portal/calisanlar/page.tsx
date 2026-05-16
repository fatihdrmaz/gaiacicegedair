'use client';
import { PortalPageShell } from '../../_shell-wrapper';
import { PortalEmployees } from '@/components/portal/dashboard';
export default function Page() { return <PortalPageShell>{(state) => <PortalEmployees state={state} />}</PortalPageShell>; }

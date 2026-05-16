'use client';
import { PortalPageShell } from '../../_shell-wrapper';
import { PortalAdminKanban } from '@/components/portal/admin';
export default function Page() { return <PortalPageShell isAdmin>{(state) => <PortalAdminKanban state={state} />}</PortalPageShell>; }

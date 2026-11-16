'use client';
import { PortalPageShell } from '../../_shell-wrapper';
import { PortalAdminMessages } from '@/components/portal/messages-admin';
export default function Page() { return <PortalPageShell isAdmin>{() => <PortalAdminMessages />}</PortalPageShell>; }

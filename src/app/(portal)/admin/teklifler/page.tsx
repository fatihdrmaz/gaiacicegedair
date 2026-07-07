'use client';
import { PortalPageShell } from '../../_shell-wrapper';
import { PortalAdminQuotes } from '@/components/portal/quotes-admin';
export default function Page() { return <PortalPageShell isAdmin>{() => <PortalAdminQuotes />}</PortalPageShell>; }

'use client';
import { PortalPageShell } from '../../_shell-wrapper';
import { PortalAdminCompanies } from '@/components/portal/companies-admin';
export default function Page() { return <PortalPageShell isAdmin>{() => <PortalAdminCompanies />}</PortalPageShell>; }

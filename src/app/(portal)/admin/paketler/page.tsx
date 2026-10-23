'use client';
import { PortalPageShell } from '../../_shell-wrapper';
import { PortalAdminB2CPackages } from '@/components/portal/b2c-packages-admin';
export default function Page() { return <PortalPageShell isAdmin>{() => <PortalAdminB2CPackages />}</PortalPageShell>; }

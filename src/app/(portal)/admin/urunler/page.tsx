'use client';
import { PortalPageShell } from '../../_shell-wrapper';
import { PortalAdminProducts } from '@/components/portal/products-admin';
export default function Page() { return <PortalPageShell isAdmin>{() => <PortalAdminProducts />}</PortalPageShell>; }

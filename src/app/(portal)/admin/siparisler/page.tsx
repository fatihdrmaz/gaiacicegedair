'use client';
import { PortalPageShell } from '../../_shell-wrapper';
import { PortalAdminOrders } from '@/components/portal/orders-admin';
export default function Page() { return <PortalPageShell isAdmin>{(state) => <PortalAdminOrders state={state} />}</PortalPageShell>; }

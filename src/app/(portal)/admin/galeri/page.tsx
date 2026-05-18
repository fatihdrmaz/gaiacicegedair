'use client';
import { PortalPageShell } from '../../_shell-wrapper';
import { PortalAdminGallery } from '@/components/portal/gallery-admin';
export default function Page() { return <PortalPageShell isAdmin>{() => <PortalAdminGallery />}</PortalPageShell>; }

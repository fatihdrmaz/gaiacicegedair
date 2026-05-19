'use client';
import { use } from 'react';
import { PortalPageShell } from '@/app/(portal)/_shell-wrapper';
import { PortalAdminCompanyDetail } from '@/components/portal/companies-admin';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PortalPageShell isAdmin>{() => <PortalAdminCompanyDetail companyId={id} />}</PortalPageShell>;
}

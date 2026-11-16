'use client';
import { PortalPageShell } from '../../_shell-wrapper';
import { PortalAdminB2CConcepts, PortalAdminB2CPackages } from '@/components/portal/b2c-packages-admin';
export default function Page() {
  return (
    <PortalPageShell isAdmin>
      {() => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <PortalAdminB2CConcepts />
          <PortalAdminB2CPackages />
        </div>
      )}
    </PortalPageShell>
  );
}

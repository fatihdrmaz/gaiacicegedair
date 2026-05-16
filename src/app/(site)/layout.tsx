import { SiteChrome } from '@/components/shared/site-chrome';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}

import type { Metadata } from 'next';
import { LegalLayout, LegalHeading, LegalText, LegalList } from '@/components/site/legal';

export const metadata: Metadata = {
  title: 'Çerez Politikası — GAIA Çiçeğe Dair',
  description: 'GAIA Çiçeğe Dair web sitesinde kullanılan çerezler hakkında bilgilendirme.',
};

export default function CerezPage() {
  return (
    <LegalLayout
      title="Çerez Politikası"
      intro="Web sitemizde kullanılan çerezler ve bunların amaçları hakkında bilgilendirme."
      updated="Mayıs 2026"
    >
      <LegalHeading>Çerez Nedir?</LegalHeading>
      <LegalText>
        Çerezler, web sitelerini ziyaret ettiğinizde tarayıcınıza kaydedilen
        küçük metin dosyalarıdır. Sitenin düzgün çalışması ve oturumunuzun
        sürdürülmesi için kullanılırlar.
      </LegalText>

      <LegalHeading>Kullandığımız Çerezler</LegalHeading>
      <LegalText>
        Sitemiz yalnızca <strong>zorunlu (işlevsel) çerezler</strong> kullanır.
        Reklam veya üçüncü taraf takip çerezi kullanmıyoruz.
      </LegalText>
      <LegalList items={[
        'Oturum/kimlik çerezleri: Kurumsal portala giriş yaptığınızda oturumunuzun açık kalmasını sağlar.',
        'Tercih çerezleri: Site üzerindeki bazı görünüm tercihlerinizi hatırlar.',
      ]} />

      <LegalHeading>Çerezleri Yönetme</LegalHeading>
      <LegalText>
        Tarayıcınızın ayarlarından çerezleri silebilir veya engelleyebilirsiniz.
        Ancak zorunlu çerezleri engellerseniz kurumsal portala giriş gibi bazı
        işlevler düzgün çalışmayabilir.
      </LegalText>

      <LegalHeading>İletişim</LegalHeading>
      <LegalText>
        Çerez kullanımına ilişkin sorularınız için info@cicegedair.com
        adresinden bize ulaşabilirsiniz. Kişisel verilerinizle ilgili
        detaylar için <a href="/kvkk" style={{ color: 'var(--accent)' }}>KVKK Aydınlatma Metni</a> sayfamıza bakabilirsiniz.
      </LegalText>

      <LegalText>
        <em>Bu metin bilgilendirme amaçlıdır; nihai yayından önce hukuki danışman tarafından gözden geçirilmesi önerilir.</em>
      </LegalText>
    </LegalLayout>
  );
}

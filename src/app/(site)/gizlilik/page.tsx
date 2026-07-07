import type { Metadata } from 'next';
import { LegalLayout, LegalHeading, LegalText, LegalList } from '@/components/site/legal';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası — GAIA Çiçeğe Dair',
  description: 'GAIA Çiçeğe Dair gizlilik politikası — verilerinizi nasıl topladığımız ve koruduğumuz.',
};

export default function GizlilikPage() {
  return (
    <LegalLayout
      title="Gizlilik Politikası"
      intro="GAIA Çiçeğe Dair olarak verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklıyoruz."
      updated="Mayıs 2026"
    >
      <LegalHeading>Topladığımız Bilgiler</LegalHeading>
      <LegalText>
        Web sitemizi ve kurumsal portalımızı kullanırken; ad soyad, e-posta,
        telefon, adres, sipariş detayları ve kurumsal başvuru bilgileri gibi
        sizin tarafınızdan paylaşılan verileri topluyoruz. Ayrıca oturum
        güvenliği için teknik kayıtlar (giriş bilgileri) tutulur.
      </LegalText>

      <LegalHeading>Bilgileri Nasıl Kullanıyoruz</LegalHeading>
      <LegalList items={[
        'Sipariş, teklif ve teslimat süreçlerini yürütmek',
        'Sizinle iletişim kurmak ve taleplerinizi yanıtlamak',
        'Kurumsal portal hesabınızı yönetmek',
        'Yasal yükümlülükleri yerine getirmek',
        'Hizmet kalitemizi iyileştirmek',
      ]} />

      <LegalHeading>Hizmet Sağlayıcılar</LegalHeading>
      <LegalText>
        Hizmetin sunulması için güvenilir altyapı sağlayıcılarından
        yararlanıyoruz: barındırma ve veritabanı, e-posta gönderimi ve
        elektronik ödeme altyapısı. Bu sağlayıcılar verilere yalnızca hizmeti
        sağlamak için gereken ölçüde erişebilir.
      </LegalText>

      <LegalHeading>Veri Güvenliği</LegalHeading>
      <LegalText>
        Verileriniz şifreli bağlantılar (HTTPS) üzerinden iletilir; erişim
        yetkilendirme ve satır bazlı güvenlik politikalarıyla korunur. Buna
        rağmen internet üzerinden hiçbir aktarımın %100 güvenli olmadığını
        hatırlatırız.
      </LegalText>

      <LegalHeading>Saklama Süresi</LegalHeading>
      <LegalText>
        Kişisel verileriniz, işleme amacının gerektirdiği süre ve ilgili yasal
        saklama yükümlülükleri boyunca saklanır; sürenin sonunda silinir veya
        anonim hale getirilir.
      </LegalText>

      <LegalHeading>Haklarınız</LegalHeading>
      <LegalText>
        Verilerinize erişme, düzeltme veya silinmesini talep etme haklarınızı
        kullanmak için info@gaiacicegedair.com adresinden bize ulaşabilirsiniz.
        Detaylar için <a href="/kvkk" style={{ color: 'var(--accent)' }}>KVKK Aydınlatma Metni</a> sayfamıza bakabilirsiniz.
      </LegalText>

      <LegalHeading>İletişim</LegalHeading>
      <LegalList items={[
        'E-posta: info@gaiacicegedair.com',
        'Telefon: +90 531 651 32 67',
        'Adres: Gümüşsuyu Mah. Mebusan Yokuşu No: 26/B, Beyoğlu/İstanbul',
      ]} />

      <LegalText>
        <em>Bu metin bilgilendirme amaçlıdır; nihai yayından önce hukuki danışman tarafından gözden geçirilmesi önerilir.</em>
      </LegalText>
    </LegalLayout>
  );
}

import type { Metadata } from 'next';
import { LegalLayout, LegalHeading, LegalText, LegalList } from '@/components/site/legal';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni — GAIA Çiçeğe Dair',
  description: '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.',
};

export default function KvkkPage() {
  return (
    <LegalLayout
      title="KVKK Aydınlatma Metni"
      intro="6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında, kişisel verilerinizin işlenmesine ilişkin bilgilendirme."
      updated="Mayıs 2026"
    >
      <LegalHeading>1. Veri Sorumlusu</LegalHeading>
      <LegalText>
        Kişisel verileriniz, veri sorumlusu sıfatıyla GAIA Çiçeğe Dair tarafından
        aşağıda açıklanan kapsamda işlenmektedir.
      </LegalText>
      <LegalList items={[
        'Adres: Gümüşsuyu Mah. Mebusan Yokuşu No: 6/B, Beyoğlu/İstanbul',
        'E-posta: info@cicegedair.com',
        'Telefon: +90 531 212 32 67',
      ]} />

      <LegalHeading>2. İşlenen Kişisel Veriler</LegalHeading>
      <LegalText>Hizmetlerimizden yararlanmanız sırasında aşağıdaki veriler işlenebilir:</LegalText>
      <LegalList items={[
        'Kimlik ve iletişim verileri (ad soyad, e-posta, telefon, adres)',
        'Kurumsal başvuru verileri (firma ünvanı, vergi bilgileri, yetkili kişi)',
        'Sipariş ve teslimat verileri (alıcı, adres, tarih, içerik)',
        'İşlem güvenliği verileri (oturum/giriş kayıtları)',
        'Talep ve mesaj içerikleri (teklif formu, iletişim formu)',
      ]} />

      <LegalHeading>3. İşleme Amaçları</LegalHeading>
      <LegalList items={[
        'Çiçek ve organizasyon hizmetlerinin sunulması, sipariş ve teslimat süreçlerinin yürütülmesi',
        'Teklif taleplerinin değerlendirilmesi ve sizinle iletişime geçilmesi',
        'Kurumsal portal üyeliği ve yetkilendirme işlemleri',
        'Yasal yükümlülüklerin yerine getirilmesi ve faturalandırma',
        'Hizmet kalitesinin iyileştirilmesi ve müşteri memnuniyeti',
      ]} />

      <LegalHeading>4. Kişisel Verilerin Aktarılması</LegalHeading>
      <LegalText>
        Verileriniz; hizmetin sağlanması için gerekli olduğu ölçüde, altyapı ve
        hizmet sağlayıcılarımızla (barındırma, e-posta ve ödeme altyapısı) ve
        yasal olarak yetkili kamu kurum ve kuruluşlarıyla paylaşılabilir.
        Verileriniz pazarlama amacıyla üçüncü taraflara satılmaz.
      </LegalText>

      <LegalHeading>5. Toplama Yöntemi ve Hukuki Sebep</LegalHeading>
      <LegalText>
        Kişisel verileriniz; web sitesi formları, kurumsal portal ve elektronik
        iletişim kanalları aracılığıyla, KVKK md. 5 kapsamında sözleşmenin
        kurulması/ifası, hukuki yükümlülük ve meşru menfaat hukuki sebeplerine
        dayanılarak toplanır ve işlenir.
      </LegalText>

      <LegalHeading>6. İlgili Kişinin Hakları</LegalHeading>
      <LegalText>KVKK md. 11 uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını öğrenme, eksik veya yanlış işlenmişse düzeltilmesini, kanuna uygun ölçüde silinmesini/yok edilmesini isteme ve işlemenin münhasıran otomatik sistemlerle analizi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme haklarına sahipsiniz.</LegalText>

      <LegalHeading>7. Başvuru</LegalHeading>
      <LegalText>
        Haklarınıza ilişkin taleplerinizi info@cicegedair.com adresine ya da
        yukarıdaki posta adresine yazılı olarak iletebilirsiniz. Talepler en geç
        30 gün içinde sonuçlandırılır.
      </LegalText>

      <LegalText>
        <em>Bu metin bilgilendirme amaçlıdır; nihai yayından önce hukuki danışman tarafından gözden geçirilmesi önerilir.</em>
      </LegalText>
    </LegalLayout>
  );
}

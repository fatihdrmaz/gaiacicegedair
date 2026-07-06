import type { Metadata } from 'next';
import { LegalLayout, LegalHeading, LegalText, LegalList } from '@/components/site/legal';

export const metadata: Metadata = {
  title: 'Teslimat ve İade Koşulları — GAIA Çiçeğe Dair',
  description: 'Çiçek ve organizasyon hizmetlerimize ilişkin teslimat, iade ve cayma hakkı koşulları.',
};

export default function TeslimatIadePage() {
  return (
    <LegalLayout
      title="Teslimat ve İade Koşulları"
      intro="Çiçek aranjmanları ve organizasyon hizmetlerimizin teslimat süreçleri ile 6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamındaki iade ve cayma haklarına ilişkin bilgilendirme."
      updated="Mayıs 2026"
    >
      <LegalHeading>1. Satıcı Bilgileri</LegalHeading>
      <LegalList items={[
        'Ünvan: GAIA Çiçeğe Dair',
        'Adres: Gümüşsuyu Mah. Mebusan Yokuşu No: 6/B, Beyoğlu/İstanbul',
        'E-posta: info@cicegedair.com',
        'Telefon: +90 531 212 32 67',
      ]} />

      <LegalHeading>2. Teslimat Bölgesi</LegalHeading>
      <LegalText>
        Fiziksel çiçek ve aranjman teslimatlarımız yalnızca <strong>İstanbul il sınırları</strong>
        içinde yapılmaktadır. Organizasyon hizmetlerimiz (düğün, kurumsal etkinlik, peyzaj) için
        şehir dışı taleplerde ayrı bir anlaşma yapılır; ulaşım ve konaklama giderleri teklife dahildir.
      </LegalText>

      <LegalHeading>3. Teslimat Süresi</LegalHeading>
      <LegalList items={[
        'Aynı gün teslimat: Saat 14:00\'e kadar verilen ve stokta bulunan siparişler, sipariş verilen gün içinde İstanbul içinde teslim edilir.',
        'İleri tarihli teslimat: Özel günler için önceden belirlenen tarih ve zaman aralığında, alıcının bildirdiği adrese teslim edilir.',
        'Kurumsal periyodik siparişler: Portal üzerinden belirlenen sıklıkta, kurumsal müşteriyle mutabık kalınan tarihlerde teslim edilir.',
        'Organizasyon hizmetleri: Sözleşmede belirlenen etkinlik tarihinden en geç 2 saat önce mekânda hazır olur.',
      ]} />
      <LegalText>
        Teslimat, İstanbul trafiği ve olağanüstü hava koşulları gibi mücbir sebeplerden ötürü ±2 saat sarkabilir.
        Bu durumlarda müşteri, sipariş bildiriminde belirtilen iletişim kanalları üzerinden bilgilendirilir.
      </LegalText>

      <LegalHeading>4. Teslimat Ücreti</LegalHeading>
      <LegalText>
        İstanbul içi kargo/kurye ücreti sipariş tutarına dahildir; ayrı bir teslimat bedeli tahsil edilmez.
        Belirtilen adresin yanlış ya da eksik olması nedeniyle yapılan tekrar teslimatlar ücretlendirilir.
      </LegalText>

      <LegalHeading>5. Cayma Hakkı ve İstisnalar</LegalHeading>
      <LegalText>
        Tüketici, 6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca kural olarak
        14 gün içinde cayma hakkına sahiptir. Ancak <strong>aynı Yönetmeliğin 15. maddesi uyarınca</strong>
        aşağıdaki ürün ve hizmetler için cayma hakkı kullanılamaz:
      </LegalText>
      <LegalList items={[
        'Çabuk bozulabilen ve son kullanma tarihi geçebilecek ürünler (kesme çiçek, aranjman, buket, canlı bitki içeren tasarımlar).',
        'Tüketicinin istek ve talepleri doğrultusunda hazırlanan, kişiye özel üretim ürünler (özel konseptli aranjmanlar, kart notu ile birlikte hazırlanan tasarımlar).',
        'İfası hizmet sağlayıcı tarafından tamamlanmış organizasyon ve etkinlik hizmetleri.',
      ]} />

      <LegalHeading>6. Sipariş İptali</LegalHeading>
      <LegalList items={[
        'Teslimat saatinden en az 24 saat önce yapılan iptal taleplerinde ödemenin tamamı iade edilir.',
        '24 saatten kısa süre kala yapılan iptallerde, hazırlanmaya başlanan sipariş için oluşan malzeme ve emek maliyeti düşülerek iade yapılır.',
        'Teslimata çıkmış siparişlerde iptal ve iade yapılamaz.',
        'Organizasyon hizmetlerinde etkinlik tarihinden en az 14 gün önce yapılan iptallerde ön ödemenin %70\'i iade edilir; sonraki iptallerde iade yapılmaz.',
      ]} />

      <LegalHeading>7. Ayıplı Ürün — Değişim ve İade</LegalHeading>
      <LegalText>
        Teslim aldığınız ürün taze olmayan çiçekler içeriyorsa, tasarım siparişte belirtilenden
        önemli ölçüde farklıysa veya nakliye sırasında hasar görmüşse, <strong>teslim tarihinden
        itibaren 24 saat içinde</strong> info@cicegedair.com adresine ürün fotoğraflarıyla birlikte
        bildirimde bulunmanız gerekir. Bildirim üzerine ürün ücretsiz olarak yenilenir ya da ödemenin
        tamamı iade edilir.
      </LegalText>

      <LegalHeading>8. İade Ödemesinin Yapılma Şekli</LegalHeading>
      <LegalText>
        Onaylanan iadeler, siparişin ödendiği kredi kartına <strong>14 gün içinde</strong> iade edilir.
        Kartınıza yansıma süresi bankanıza göre 2-10 iş günü sürebilir. Havale/EFT ile alınan
        ödemelerde iade, müşterinin bildireceği IBAN\'a yapılır.
      </LegalText>

      <LegalHeading>9. İletişim ve Şikayet</LegalHeading>
      <LegalText>
        Teslimat veya iade süreçlerine ilişkin her türlü soru, öneri ve şikayetiniz için
        info@cicegedair.com adresi ya da +90 531 212 32 67 numaralı hattımız üzerinden bize
        ulaşabilirsiniz. Talepleriniz en geç 3 iş günü içinde yanıtlanır.
      </LegalText>

      <LegalText>
        <em>Bu metin bilgilendirme amaçlıdır; nihai yayından önce hukuki danışman tarafından gözden geçirilmesi önerilir.</em>
      </LegalText>
    </LegalLayout>
  );
}

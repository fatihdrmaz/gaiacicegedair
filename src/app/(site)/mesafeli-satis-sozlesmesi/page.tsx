import type { Metadata } from 'next';
import { LegalLayout, LegalHeading, LegalText, LegalList } from '@/components/site/legal';

export const metadata: Metadata = {
  title: 'Mesafeli Satış Sözleşmesi — GAIA Çiçeğe Dair',
  description: '6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında mesafeli satış sözleşmesi örneği.',
};

export default function MesafeliSatisPage() {
  return (
    <LegalLayout
      title="Mesafeli Satış Sözleşmesi"
      intro="6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri uyarınca, satıcı ile alıcı arasında elektronik ortamda kurulan mesafeli satış sözleşmesi metni."
      updated="Mayıs 2026"
    >
      <LegalHeading>1. Taraflar</LegalHeading>
      <LegalText><strong>Satıcı:</strong></LegalText>
      <LegalList items={[
        'Ünvan: GAIA Çiçeğe Dair',
        'Adres: Gümüşsuyu Mah. Mebusan Yokuşu No: 6/B, Beyoğlu/İstanbul',
        'E-posta: info@cicegedair.com',
        'Telefon: +90 531 212 32 67',
      ]} />
      <LegalText>
        <strong>Alıcı:</strong> Sipariş sırasında adı, adresi ve iletişim bilgileri kayıt altına alınan;
        işbu sözleşmenin elektronik ortamda onaylanması suretiyle tarafı olan gerçek/tüzel kişi.
      </LegalText>

      <LegalHeading>2. Sözleşmenin Konusu</LegalHeading>
      <LegalText>
        İşbu sözleşme, alıcının satıcıya ait <strong>cicegedair.com</strong> internet sitesi ve
        kurumsal portal üzerinden elektronik ortamda verdiği siparişe konu ürün/hizmetin satışı ve
        teslimi ile tarafların hak ve yükümlülüklerinin belirlenmesine ilişkindir. Taraflar, 6502
        sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümlerini bildiklerini ve anladıklarını
        kabul ederler.
      </LegalText>

      <LegalHeading>3. Ürün / Hizmet Bilgileri</LegalHeading>
      <LegalText>
        Ürünün türü, cinsi, adedi, konsepti, teslim tarihi, alıcı bilgileri ve toplam satış bedeli
        (KDV dahil) sipariş sırasında elektronik ortamda alıcıya gösterilir ve sipariş onayı
        e-postası ile alıcıya ayrıca iletilir.
      </LegalText>

      <LegalHeading>4. Sözleşme Bedeli ve Ödeme</LegalHeading>
      <LegalList items={[
        'Toplam bedel, sipariş sırasında KDV dahil olarak alıcıya gösterilir; ayrıca bir teslimat ücreti tahsil edilmez.',
        'Ödeme; kredi kartı, banka kartı ya da havale/EFT ile yapılabilir. Kredi kartı ile yapılan ödemelerde iyzico altyapısı kullanılır ve kart bilgileri satıcıda saklanmaz.',
        'Ödemenin gerçekleştiği an, sipariş satıcı tarafından kabul edilmiş sayılır.',
      ]} />

      <LegalHeading>5. Teslimat</LegalHeading>
      <LegalList items={[
        'Ürünler, alıcının sipariş sırasında bildirdiği adrese ve tarihte teslim edilir.',
        'Teslimat bölgesi İstanbul il sınırlarıdır; şehir dışı teslimatlar için ayrı anlaşma yapılır.',
        'Trafik veya olağanüstü hava koşulları gibi mücbir sebeplerden ötürü teslim saati ±2 saat sarkabilir.',
        'Alıcının yanlış ya da eksik adres bildirmesi nedeniyle gerçekleşmeyen teslimatlarda tekrar teslimat ücreti alıcıya aittir.',
      ]} />
      <LegalText>
        Detaylı teslimat koşulları için <a href="/teslimat-iade" style={{ color: 'var(--accent)' }}>Teslimat ve İade Koşulları</a> sayfası bu sözleşmenin ayrılmaz parçasıdır.
      </LegalText>

      <LegalHeading>6. Cayma Hakkı</LegalHeading>
      <LegalText>
        Mesafeli Sözleşmeler Yönetmeliği\'nin 15. maddesi uyarınca aşağıdaki ürün ve hizmetler
        için <strong>cayma hakkı kullanılamaz</strong>:
      </LegalText>
      <LegalList items={[
        'Çabuk bozulan veya son kullanma tarihi geçebilecek ürünler (kesme çiçek, aranjman, buket, canlı bitki içeren tasarımlar).',
        'Tüketicinin istek ve talepleri doğrultusunda hazırlanan, kişiye özel üretim ürünler.',
        'İfası satıcı tarafından tamamlanmış organizasyon ve etkinlik hizmetleri.',
      ]} />
      <LegalText>
        Bu kapsam dışındaki ürünler için alıcı, teslim tarihinden itibaren 14 gün içinde
        info@cicegedair.com adresine bildirimde bulunarak cayma hakkını kullanabilir. Cayma
        hakkı kullanıldığında ürün, orijinal ambalajı bozulmamış olarak satıcıya iade edilir;
        onaylanan iade tutarı 14 gün içinde alıcının hesabına geçer.
      </LegalText>

      <LegalHeading>7. Ayıplı Ürün</LegalHeading>
      <LegalText>
        Teslim edilen ürünün taze olmayan çiçekler içermesi, siparişte belirtilenden önemli ölçüde
        farklı olması ya da nakliyeden kaynaklı hasar bulunması halinde alıcı, teslim tarihinden
        itibaren 24 saat içinde fotoğraflı bildirimle satıcıya başvurur. Satıcı, ürünü ücretsiz
        yenileme ya da ödemenin tamamını iade seçeneklerinden birini alıcıya sunar.
      </LegalText>

      <LegalHeading>8. Alıcının Beyan ve Yükümlülükleri</LegalHeading>
      <LegalList items={[
        'Alıcı, sipariş formunda verdiği bilgilerin doğru ve eksiksiz olduğunu beyan eder.',
        'Alıcı, ürün ve hizmete ilişkin ön bilgilendirmeyi ve işbu sözleşmeyi elektronik ortamda okuduğunu ve kabul ettiğini beyan eder.',
        'Alıcı, ödeme sırasında sunduğu banka/kart bilgilerinin kendisine ait olduğunu; aksi halde doğacak zararlardan sorumlu olduğunu kabul eder.',
      ]} />

      <LegalHeading>9. Satıcının Beyan ve Yükümlülükleri</LegalHeading>
      <LegalList items={[
        'Satıcı, siparişe konu ürün/hizmeti eksiksiz ve teslim tarihine uygun şekilde sunmakla yükümlüdür.',
        'Ürünün stokta bulunmaması ya da mücbir sebeplerle temin edilememesi halinde satıcı, alıcıyı derhal bilgilendirir ve ödemeyi iade eder ya da alıcının onayı ile eşdeğer bir ürün gönderir.',
        'Satıcı, alıcıya ait kişisel verileri KVKK Aydınlatma Metni ve Gizlilik Politikası\'nda belirtilen amaç ve şartlarla işler.',
      ]} />

      <LegalHeading>10. Kişisel Verilerin Korunması</LegalHeading>
      <LegalText>
        Alıcının işbu sözleşme kapsamında verdiği kişisel veriler, 6698 sayılı Kanun\'a uygun şekilde
        işlenir. Detaylı bilgi için <a href="/kvkk" style={{ color: 'var(--accent)' }}>KVKK Aydınlatma Metni</a> ve
        {' '}<a href="/gizlilik" style={{ color: 'var(--accent)' }}>Gizlilik Politikası</a> sayfalarına bakınız.
      </LegalText>

      <LegalHeading>11. Uyuşmazlıkların Çözümü</LegalHeading>
      <LegalText>
        İşbu sözleşmeden doğan uyuşmazlıklarda Ticaret Bakanlığı\'nca ilan edilen değere kadar
        alıcının yerleşim yerindeki <strong>Tüketici Hakem Heyetleri</strong> ile <strong>Tüketici
        Mahkemeleri</strong> yetkilidir. Belirtilen değerin üzerindeki uyuşmazlıklarda <strong>İstanbul
        Mahkemeleri ve İcra Daireleri</strong> yetkilidir. 2026 yılı için Tüketici Hakem Heyetleri\'ne
        başvuru sınırları Gümrük ve Ticaret Bakanlığı tarafından her yıl güncellenmektedir.
      </LegalText>

      <LegalHeading>12. Yürürlük</LegalHeading>
      <LegalText>
        İşbu sözleşme, 12 maddeden oluşup; alıcının siparişi elektronik ortamda onaylayarak
        sözleşmeyi kabul etmesi anında yürürlüğe girer. Alıcı, ön bilgilendirme formunu ve
        mesafeli satış sözleşmesini elektronik ortamda okuduğunu, anladığını ve kabul ettiğini
        siparişi onaylamakla beyan etmiş sayılır.
      </LegalText>

      <LegalText>
        <em>Bu metin bilgilendirme amaçlıdır; nihai yayından önce hukuki danışman tarafından gözden geçirilmesi önerilir.</em>
      </LegalText>
    </LegalLayout>
  );
}

import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";

const main = { backgroundColor: "#f6f4ef", fontFamily: "Georgia, serif" };
const container = { backgroundColor: "#ffffff", margin: "0 auto", padding: "32px", maxWidth: "560px" };
const brand = { color: "#5a6b4d", fontSize: "22px", letterSpacing: "1px" };

export function B2CIadeEmail({
  buyerName,
  amount,
  items,
  cancelled,
}: {
  buyerName: string;
  amount: number;
  items: { day_name?: string | null; event_date?: string | null }[];
  cancelled: boolean;
}) {
  const tutar = `${amount.toLocaleString("tr-TR")} ₺`;
  return (
    <Html>
      <Head />
      <Preview>{`${tutar} iadeniz başlatıldı`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={brand}>GAIA · Çiçeğe Dair</Text>
          <Heading as="h2" style={{ color: "#1f2320" }}>
            {cancelled ? "Siparişiniz iptal edildi" : "İadeniz başlatıldı"}
          </Heading>
          <Text style={{ color: "#4a4a44", fontSize: "15px" }}>
            Sayın {buyerName}, aşağıdaki özel gün{items.length > 1 ? "ler" : ""} için {tutar} tutarındaki
            ödemeniz ödeme yaptığınız karta iade edildi. Tutarın kartınıza yansıması bankanıza göre
            {cancelled ? " genellikle aynı gün ya da ertesi gün" : " 2-10 iş günü"} sürebilir.
          </Text>
          <Hr />
          <Section>
            {items.map((it, i) => (
              <Text key={i} style={{ color: "#1f2320", fontSize: "14px", margin: "0 0 8px" }}>
                <strong>{it.day_name || "Özel gün"}</strong> · {it.event_date || "—"}
              </Text>
            ))}
          </Section>
          <Hr />
          <Text style={{ color: "#8a8a82", fontSize: "12px" }}>
            Sorularınız için info@gaiacicegedair.com · +90 531 651 32 67
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default B2CIadeEmail;

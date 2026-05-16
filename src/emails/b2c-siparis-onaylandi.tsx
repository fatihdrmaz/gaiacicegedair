import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type B2COrderItem = {
  day_name?: string | null;
  recipient?: string | null;
  event_date?: string | null;
  package?: string | null;
  package_price?: number | null;
};

const main = { backgroundColor: "#f6f4ef", fontFamily: "Georgia, serif" };
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  maxWidth: "560px",
};
const brand = { color: "#5a6b4d", fontSize: "22px", letterSpacing: "1px" };

export function B2CSiparisOnaylandiEmail({
  buyerName,
  total,
  items,
}: {
  buyerName: string;
  total: number;
  items: B2COrderItem[];
}) {
  return (
    <Html>
      <Head />
      <Preview>Ödemeniz alındı — özel gün takviminiz hazır</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={brand}>GAIA · Çiçeğe Dair</Text>
          <Heading as="h2" style={{ color: "#1f2320" }}>
            Takviminiz hazır
          </Heading>
          <Text style={{ color: "#4a4a44", fontSize: "15px" }}>
            Sayın {buyerName}, {total.toLocaleString("tr-TR")} ₺ tutarındaki
            ödemeniz alındı. Aşağıdaki özel günlerde çiçekleriniz sizin adınıza
            ulaşacak.
          </Text>
          <Hr />
          <Section>
            {items.map((it, i) => (
              <Text
                key={i}
                style={{ color: "#1f2320", fontSize: "14px", margin: "0 0 8px" }}
              >
                <strong>{it.day_name || "Özel gün"}</strong> ·{" "}
                {it.event_date || "—"} · {it.recipient || "—"} ·{" "}
                {it.package_price
                  ? `${Number(it.package_price).toLocaleString("tr-TR")} ₺`
                  : ""}
              </Text>
            ))}
          </Section>
          <Hr />
          <Text style={{ color: "#8a8a82", fontSize: "12px" }}>
            GAIA Çiçeğe Dair · İstanbul
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default B2CSiparisOnaylandiEmail;

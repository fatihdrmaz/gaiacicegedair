import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";

const main = { backgroundColor: "#f6f4ef", fontFamily: "Georgia, serif" };
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  maxWidth: "560px",
};

const STATUS_TEXT: Record<string, { title: string; body: string }> = {
  approved: {
    title: "Siparişiniz onaylandı",
    body: "Talebiniz GAIA ekibi tarafından onaylandı ve üretim planına alındı.",
  },
  delivered: {
    title: "Siparişiniz teslim edildi",
    body: "Çiçekleriniz teslim edildi. Bizi tercih ettiğiniz için teşekkür ederiz.",
  },
};

export function SiparisDurumuEmail({
  recipientName,
  orderType,
  status,
}: {
  recipientName: string;
  orderType: string;
  status: "approved" | "delivered";
}) {
  const t = STATUS_TEXT[status];
  return (
    <Html>
      <Head />
      <Preview>{t.title} — GAIA Çiçeğe Dair</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={{ color: "#5a6b4d", fontSize: "22px", letterSpacing: "1px" }}>
            GAIA · Çiçeğe Dair
          </Text>
          <Heading as="h2" style={{ color: "#1f2320" }}>
            {t.title}
          </Heading>
          <Text style={{ color: "#4a4a44", fontSize: "15px" }}>
            Sayın {recipientName}, <strong>{orderType}</strong> talebiniz hakkında:
            {" "}
            {t.body}
          </Text>
          <Hr />
          <Text style={{ color: "#8a8a82", fontSize: "12px" }}>
            GAIA Çiçeğe Dair · İstanbul
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default SiparisDurumuEmail;

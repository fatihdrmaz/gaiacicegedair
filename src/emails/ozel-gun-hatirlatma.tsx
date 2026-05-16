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

export function OzelGunHatirlatmaEmail({
  buyerName,
  dayName,
  recipient,
  eventDate,
}: {
  buyerName: string;
  dayName: string;
  recipient: string;
  eventDate: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Özel gün yaklaşıyor — {dayName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={{ color: "#5a6b4d", fontSize: "22px", letterSpacing: "1px" }}>
            GAIA · Çiçeğe Dair
          </Text>
          <Heading as="h2" style={{ color: "#1f2320" }}>
            Özel gün yaklaşıyor
          </Heading>
          <Text style={{ color: "#4a4a44", fontSize: "15px" }}>
            Sayın {buyerName}, <strong>{dayName}</strong> 3 gün sonra ({eventDate}).
            {recipient ? ` ${recipient} için` : ""} çiçekleriniz hazırlanıyor —
            sizin adınıza ulaştıracağız.
          </Text>
          <Hr />
          <Text style={{ color: "#8a8a82", fontSize: "12px" }}>
            Değişiklik için bizimle iletişime geçebilirsiniz · GAIA Çiçeğe Dair
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default OzelGunHatirlatmaEmail;

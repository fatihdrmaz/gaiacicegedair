import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
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

export function FirmaOnaylandiEmail({
  companyName,
  contactName,
  loginUrl,
}: {
  companyName: string;
  contactName: string;
  loginUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Kurumsal başvurunuz onaylandı — GAIA Çiçeğe Dair</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={{ color: "#5a6b4d", fontSize: "22px", letterSpacing: "1px" }}>
            GAIA · Çiçeğe Dair
          </Text>
          <Heading as="h2" style={{ color: "#1f2320" }}>
            Hoş geldiniz, {companyName}
          </Heading>
          <Text style={{ color: "#4a4a44", fontSize: "15px" }}>
            Sayın {contactName}, kurumsal başvurunuz onaylandı. Artık portal
            üzerinden sipariş oluşturabilir, takviminizi yönetebilir ve
            raporlarınıza ulaşabilirsiniz.
          </Text>
          <Hr />
          <Text style={{ fontSize: "15px" }}>
            <Link href={loginUrl} style={{ color: "#5a6b4d" }}>
              Portala giriş yap
            </Link>
          </Text>
          <Text style={{ color: "#8a8a82", fontSize: "12px" }}>
            GAIA Çiçeğe Dair · İstanbul
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default FirmaOnaylandiEmail;

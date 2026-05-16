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

export function FirmaReddedildiEmail({
  companyName,
  contactName,
  reason,
}: {
  companyName: string;
  contactName: string;
  reason?: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Kurumsal başvurunuz hakkında — GAIA Çiçeğe Dair</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={{ color: "#5a6b4d", fontSize: "22px", letterSpacing: "1px" }}>
            GAIA · Çiçeğe Dair
          </Text>
          <Heading as="h2" style={{ color: "#1f2320" }}>
            Başvurunuz hakkında
          </Heading>
          <Text style={{ color: "#4a4a44", fontSize: "15px" }}>
            Sayın {contactName}, {companyName} adına yaptığınız kurumsal
            başvuruyu şu an için onaylayamadık.
          </Text>
          {reason ? (
            <>
              <Hr />
              <Text style={{ color: "#8a8a82", fontSize: "12px", margin: 0 }}>
                Gerekçe
              </Text>
              <Text style={{ color: "#1f2320", fontSize: "15px" }}>{reason}</Text>
            </>
          ) : null}
          <Hr />
          <Text style={{ color: "#4a4a44", fontSize: "14px" }}>
            Sorularınız için bilgi@cicegedair.com adresinden bize
            ulaşabilirsiniz.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default FirmaReddedildiEmail;

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type TeklifData = {
  ad: string;
  firma?: string;
  tel: string;
  email: string;
  tip: string;
  konsept?: string;
  kisi?: string;
  tarih?: string;
  mekan?: string;
  butce?: string;
  notlar?: string;
};

const main = { backgroundColor: "#f6f4ef", fontFamily: "Georgia, serif" };
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  maxWidth: "560px",
};
const brand = { color: "#5a6b4d", fontSize: "22px", letterSpacing: "1px" };
const label = { color: "#8a8a82", fontSize: "12px", margin: "0" };
const value = { color: "#1f2320", fontSize: "15px", margin: "0 0 12px" };

export function TeklifAlindiEmail({ data }: { data: TeklifData }) {
  return (
    <Html>
      <Head />
      <Preview>Teklif talebinizi aldık — GAIA Çiçeğe Dair</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={brand}>GAIA · Çiçeğe Dair</Text>
          <Heading as="h2" style={{ color: "#1f2320" }}>
            Teklifinizi aldık
          </Heading>
          <Text style={{ color: "#4a4a44", fontSize: "15px" }}>
            Sayın {data.ad}, talebiniz bize ulaştı. Ekibimiz en geç 24 saat
            içinde sizinle iletişime geçecek.
          </Text>
          <Hr />
          <Section>
            <Text style={label}>Hizmet</Text>
            <Text style={value}>{data.tip}</Text>
            {data.konsept ? (
              <>
                <Text style={label}>Konsept</Text>
                <Text style={value}>{data.konsept}</Text>
              </>
            ) : null}
            {data.tarih ? (
              <>
                <Text style={label}>Tarih</Text>
                <Text style={value}>{data.tarih}</Text>
              </>
            ) : null}
            {data.butce ? (
              <>
                <Text style={label}>Bütçe</Text>
                <Text style={value}>{data.butce}</Text>
              </>
            ) : null}
          </Section>
          <Hr />
          <Text style={{ color: "#4a4a44", fontSize: "14px" }}>
            Acil durumlar için bize WhatsApp üzerinden ulaşabilirsiniz:{" "}
            <Link href="https://wa.me/905316513267" style={{ color: "#5a6b4d" }}>
              WhatsApp ile yaz
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

export default TeklifAlindiEmail;

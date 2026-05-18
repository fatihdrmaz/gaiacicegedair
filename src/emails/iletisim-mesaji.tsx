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

export type IletisimData = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

const main = { backgroundColor: "#f6f4ef", fontFamily: "Georgia, serif" };
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  maxWidth: "560px",
};
const label = { color: "#8a8a82", fontSize: "12px", margin: "0" };
const value = { color: "#1f2320", fontSize: "15px", margin: "0 0 12px" };

export function IletisimMesajiEmail({ data }: { data: IletisimData }) {
  return (
    <Html>
      <Head />
      <Preview>Yeni iletişim mesajı: {data.name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading as="h2" style={{ color: "#1f2320" }}>
            Yeni İletişim Mesajı
          </Heading>
          <Section>
            <Text style={label}>Ad Soyad</Text>
            <Text style={value}>{data.name}</Text>
            <Text style={label}>E-posta</Text>
            <Text style={value}>{data.email}</Text>
            {data.phone ? (
              <>
                <Text style={label}>Telefon</Text>
                <Text style={value}>{data.phone}</Text>
              </>
            ) : null}
          </Section>
          <Hr />
          <Text style={label}>Mesaj</Text>
          <Text style={{ color: "#1f2320", fontSize: "15px", lineHeight: "1.6" }}>
            {data.message}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default IletisimMesajiEmail;

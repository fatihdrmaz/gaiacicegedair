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
import type { TeklifData } from "./teklif-alindi";

const main = { backgroundColor: "#f6f4ef", fontFamily: "Georgia, serif" };
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  maxWidth: "560px",
};
const label = { color: "#8a8a82", fontSize: "12px", margin: "0" };
const value = { color: "#1f2320", fontSize: "15px", margin: "0 0 12px" };

export function TeklifGaiaEmail({ data }: { data: TeklifData }) {
  const rows: [string, string | undefined][] = [
    ["Ad Soyad", data.ad],
    ["Firma", data.firma],
    ["Telefon", data.tel],
    ["E-posta", data.email],
    ["Hizmet", data.tip],
    ["Konsept", data.konsept],
    ["Kişi Sayısı", data.kisi],
    ["Tarih", data.tarih],
    ["Mekan", data.mekan],
    ["Notlar", data.notlar],
  ];
  return (
    <Html>
      <Head />
      <Preview>Yeni teklif talebi: {data.tip}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading as="h2" style={{ color: "#1f2320" }}>
            Yeni Teklif Talebi
          </Heading>
          <Text
            style={{
              background: "#eef0e7",
              color: "#5a6b4d",
              padding: "8px 12px",
              fontSize: "15px",
              borderRadius: "4px",
            }}
          >
            Bütçe: {data.butce || "Belirtilmedi"}
          </Text>
          <Hr />
          <Section>
            {rows
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <Text style={label}>{k}</Text>
                  <Text style={value}>{v}</Text>
                </div>
              ))}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default TeklifGaiaEmail;

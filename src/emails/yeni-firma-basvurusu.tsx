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

export type FirmaBasvuruData = {
  company: string;
  taxNo?: string;
  contact: string;
  contactRole?: string;
  email: string;
  phone: string;
  sector?: string;
  size?: string;
  address?: string;
  city?: string;
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

export function YeniFirmaBasvurusuEmail({ data }: { data: FirmaBasvuruData }) {
  const rows: [string, string | undefined][] = [
    ["Firma Ünvanı", data.company],
    ["Vergi No", data.taxNo],
    ["Yetkili", data.contact],
    ["Görevi", data.contactRole],
    ["E-posta", data.email],
    ["Telefon", data.phone],
    ["Sektör", data.sector],
    ["Büyüklük", data.size],
    ["Adres", [data.address, data.city].filter(Boolean).join(", ")],
  ];
  return (
    <Html>
      <Head />
      <Preview>Yeni kurumsal başvuru: {data.company}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading as="h2" style={{ color: "#1f2320" }}>
            Yeni Kurumsal Başvuru
          </Heading>
          <Text style={{ color: "#4a4a44", fontSize: "14px" }}>
            Aşağıdaki firma portal erişimi için başvurdu. Admin panelinden
            inceleyip onaylayabilirsiniz.
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

export default YeniFirmaBasvurusuEmail;

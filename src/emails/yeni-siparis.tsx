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

export type YeniSiparisData = {
  company: string;
  type: string;
  recipient: string;
  address: string;
  deliveryDate: string;
  budget: number;
  requiresApproval: boolean;
  note?: string;
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

export function YeniSiparisEmail({ data }: { data: YeniSiparisData }) {
  const rows: [string, string][] = [
    ["Firma", data.company],
    ["Tip", data.type],
    ["Alıcı", data.recipient],
    ["Adres", data.address],
    ["Teslim Tarihi", data.deliveryDate],
    ["Bütçe", `${data.budget.toLocaleString("tr-TR")} ₺`],
    ["Not", data.note || "—"],
  ];
  return (
    <Html>
      <Head />
      <Preview>Yeni kurumsal sipariş: {data.company}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading as="h2" style={{ color: "#1f2320" }}>
            Yeni Kurumsal Sipariş
          </Heading>
          {data.requiresApproval ? (
            <Text
              style={{
                background: "#fff0e5",
                color: "#995a30",
                padding: "8px 12px",
                fontSize: "14px",
                borderRadius: "4px",
              }}
            >
              Bu sipariş yönetici onayı gerektiriyor.
            </Text>
          ) : null}
          <Hr />
          <Section>
            {rows.map(([k, v]) => (
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

export default YeniSiparisEmail;

import { Resend } from "resend";
import type { ReactElement } from "react";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

export const MAIL_FROM =
  process.env.MAIL_FROM || "GAIA Çiçeğe Dair <bilgi@gaiacicegedair.com>";
export const GAIA_NOTIFY_EMAIL =
  process.env.GAIA_NOTIFY_EMAIL || "bilgi@gaiacicegedair.com";

type SendArgs = {
  to: string | string[];
  subject: string;
  react: ReactElement;
};

// API anahtarı yoksa sessizce atlar — geliştirme/build ortamı çökmesini önler.
export async function sendMail({ to, subject, react }: SendArgs) {
  if (!resend) {
    console.warn(`[resend] RESEND_API_KEY yok, e-posta atlandı: ${subject}`);
    return { skipped: true };
  }
  const { data, error } = await resend.emails.send({
    from: MAIL_FROM,
    to,
    subject,
    react,
  });
  if (error) {
    console.error("[resend] gönderim hatası:", error);
    throw new Error(error.message);
  }
  return { id: data?.id };
}

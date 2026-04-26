import { Resend } from "resend";

let cached: Resend | null | undefined;

function getResend(): Resend | null {
  if (cached !== undefined) return cached;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    cached = null;
    return null;
  }
  cached = new Resend(apiKey);
  return cached;
}

const FROM = process.env.EMAIL_FROM ?? "Ülkü Yaman <noreply@ulkuyamancollection.com>";
const REPLY_TO = process.env.EMAIL_REPLY_TO ?? "info@ulkuyamancollection.com";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Beklemede",
  PAYMENT_FAILED: "Ödeme Başarısız",
  PAID: "Ödendi",
  PREPARING: "Hazırlanıyor",
  SHIPPED: "Kargoya Verildi",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
  REFUNDED: "İade Edildi",
};

function shell(title: string, body: string) {
  return `<!doctype html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#fafaf8;margin:0;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #eee;">
    <div style="padding:20px 28px;border-bottom:1px solid #eee;">
      <p style="margin:0;font-size:13px;letter-spacing:.2em;text-transform:uppercase;font-weight:700;">Ülkü Yaman</p>
    </div>
    <div style="padding:32px 28px;">
      <h1 style="font-size:20px;font-weight:400;margin:0 0 16px 0;">${title}</h1>
      ${body}
    </div>
    <div style="padding:18px 28px;border-top:1px solid #eee;font-size:11px;color:#888;">
      Bu e-posta, ulkuyamancollection.com üzerinden bilgilendirme amacıyla gönderildi.
    </div>
  </div>
</body></html>`;
}

export async function sendOrderConfirmationEmail(
  to: string,
  data: {
    orderId: string;
    customerName: string;
    total: number;
    items: { name: string; quantity: number; price: number }[];
  }
) {
  const resend = getResend();
  if (!resend) return;

  const itemsHtml = data.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0;">${i.name} × ${i.quantity}</td><td style="padding:6px 0;text-align:right;">₺${(
          i.price * i.quantity
        ).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</td></tr>`
    )
    .join("");

  const html = shell(
    `Siparişin alındı, ${data.customerName}!`,
    `<p style="margin:0 0 18px 0;font-size:14px;line-height:1.6;color:#444;">
      Siparişin başarıyla alındı. Aşağıda detayları bulabilirsin. Hazırlandıkça e-posta ile haberdar edeceğiz.
    </p>
    <p style="margin:0 0 14px 0;font-size:13px;color:#666;">Sipariş #${data.orderId.slice(-8).toUpperCase()}</p>
    <table style="width:100%;font-size:14px;border-collapse:collapse;border-top:1px solid #eee;border-bottom:1px solid #eee;">
      ${itemsHtml}
    </table>
    <p style="text-align:right;margin:14px 0 0 0;font-size:15px;font-weight:600;">
      Toplam: ₺${data.total.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
    </p>`
  );

  await resend.emails.send({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject: `Siparişin alındı — #${data.orderId.slice(-8).toUpperCase()}`,
    html,
  });
}

export async function sendOrderStatusEmail(
  to: string,
  data: {
    orderId: string;
    customerName: string;
    newStatus: string;
    trackingCarrier?: string | null;
    trackingNumber?: string | null;
  }
) {
  const resend = getResend();
  if (!resend) return;

  const statusLabel = STATUS_LABEL[data.newStatus] ?? data.newStatus;
  const tracking =
    data.newStatus === "SHIPPED" && data.trackingNumber
      ? `<p style="margin:14px 0 0 0;font-size:14px;line-height:1.6;color:#444;">
           <strong>Kargo:</strong> ${data.trackingCarrier ?? "Kargo şirketi"}<br />
           <strong>Takip No:</strong> ${data.trackingNumber}
         </p>`
      : "";

  const html = shell(
    `Siparişin "${statusLabel}" durumuna geçti`,
    `<p style="margin:0 0 14px 0;font-size:14px;line-height:1.6;color:#444;">
      Merhaba ${data.customerName},
    </p>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#444;">
      <strong>#${data.orderId.slice(-8).toUpperCase()}</strong> numaralı siparişin durumu güncellendi: <strong>${statusLabel}</strong>
    </p>
    ${tracking}`
  );

  await resend.emails.send({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject: `Sipariş durumu: ${statusLabel} — #${data.orderId.slice(-8).toUpperCase()}`,
    html,
  });
}

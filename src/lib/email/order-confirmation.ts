import { Resend } from "resend";
import { storeConfig } from "@data/store-config";
import { validateEnv } from "@/lib/env";
import { isDemoMode } from "@data/store-config";
import type { Order } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

function shouldSendOrderEmail(): boolean {
  const env = validateEnv();
  if (!env.RESEND_API_KEY) return false;

  if (isDemoMode() && !env.EMAIL_DEMO_OVERRIDE) {
    return false;
  }

  return true;
}

function buildOrderItemsHtml(order: Order): string {
  const rows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #e8e4dc;">
          <strong>${item.title}</strong><br/>
          <span style="color:#6b6b6b;font-size:13px;">SKU: ${item.sku} · Qty: ${item.quantity}</span>
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #e8e4dc;text-align:right;white-space:nowrap;">
          ${formatPrice(item.lineTotalCents, { cents: true })}
        </td>
      </tr>`
    )
    .join("");

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#1a1a1a;">
      ${rows}
      <tr>
        <td style="padding:12px 0 4px;color:#6b6b6b;">Subtotal</td>
        <td style="padding:12px 0 4px;text-align:right;">${formatPrice(order.subtotalCents, { cents: true })}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;color:#6b6b6b;">Shipping</td>
        <td style="padding:4px 0;text-align:right;">${formatPrice(order.shippingCents, { cents: true })}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;color:#6b6b6b;">Tax</td>
        <td style="padding:4px 0;text-align:right;">${formatPrice(order.taxCents, { cents: true })}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;font-weight:600;">Total</td>
        <td style="padding:8px 0;text-align:right;font-weight:600;">${formatPrice(order.totalCents, { cents: true })}</td>
      </tr>
    </table>`;
}

function buildOrderEmailHtml(order: Order): string {
  const siteUrl = storeConfig.siteUrl;

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f7f5f0;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e8e4dc;">
          <tr>
            <td style="background:#1a2e1a;padding:24px 32px;text-align:center;">
              <img src="${siteUrl}/brand/logo-horizontal-light.svg" alt="${storeConfig.brandName}" width="200" style="max-width:200px;height:auto;"/>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 8px;font-size:22px;color:#1a1a1a;">Thank you for your order</h1>
              <p style="margin:0 0 24px;color:#6b6b6b;font-size:15px;line-height:1.5;">
                Hi ${order.customer.firstName}, we received your order from ${storeConfig.brandName}.
              </p>
              <p style="margin:0 0 8px;font-size:13px;color:#6b6b6b;text-transform:uppercase;letter-spacing:0.05em;">Order reference</p>
              <p style="margin:0 0 24px;font-size:20px;font-weight:600;color:#386641;font-family:monospace;">${order.reference}</p>
              ${buildOrderItemsHtml(order)}
              <p style="margin:24px 0 8px;font-size:13px;color:#6b6b6b;text-transform:uppercase;letter-spacing:0.05em;">Shipping to</p>
              <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#1a1a1a;">
                ${order.customer.firstName} ${order.customer.lastName}<br/>
                ${order.shippingAddress.line1}<br/>
                ${order.shippingAddress.line2 ? `${order.shippingAddress.line2}<br/>` : ""}
                ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}
              </p>
              <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#6b6b6b;">
                Track your order anytime at <a href="${siteUrl}/track-order" style="color:#386641;">${siteUrl}/track-order</a>
                using your order reference and email.
              </p>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#1a1a1a;">
                Questions? Call us at <a href="tel:${storeConfig.phoneE164}" style="color:#386641;">${storeConfig.phoneDisplay}</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background:#f7f5f0;text-align:center;font-size:12px;color:#6b6b6b;">
              ${storeConfig.legalName} · ${storeConfig.publicLocationLabel}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export interface SendOrderConfirmationResult {
  sent: boolean;
  skippedReason?: string;
}

export async function sendOrderConfirmationEmail(
  order: Order
): Promise<SendOrderConfirmationResult> {
  if (!shouldSendOrderEmail()) {
    return {
      sent: false,
      skippedReason: isDemoMode()
        ? "Demo mode - email not sent unless EMAIL_DEMO_OVERRIDE is set."
        : "RESEND_API_KEY not configured.",
    };
  }

  const env = validateEnv();
  const resend = new Resend(env.RESEND_API_KEY);
  const from =
    env.EMAIL_FROM ?? `${storeConfig.brandName} <orders@${new URL(storeConfig.siteUrl).hostname}>`;

  await resend.emails.send({
    from,
    to: order.customer.email,
    subject: `Order confirmed - ${order.reference} | ${storeConfig.brandName}`,
    html: buildOrderEmailHtml(order),
  });

  return { sent: true };
}

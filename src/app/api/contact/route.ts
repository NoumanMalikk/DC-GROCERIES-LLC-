import { NextResponse } from "next/server";
import { storeConfig } from "@data/store-config";
import { getClientIp } from "@/lib/request";
import { rateLimitContact } from "@/lib/rate-limit";
import { safeParseContactInput } from "@/lib/validation";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = rateLimitContact(ip);

  if (!rateLimit.success) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = safeParseContactInput(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Please check your contact form details.",
        errors: parsed.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path,
        })),
      },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const contactEmail = process.env.CONTACT_EMAIL ?? null;

  const logEntry = {
    receivedAt: new Date().toISOString(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    subject: data.subject,
    message: data.message,
    orderReference: data.orderReference,
  };

  if (contactEmail) {
    console.info("[contact] Message received:", logEntry);
    return NextResponse.json({
      success: true,
      message:
        "Thank you for reaching out. Our team will respond as soon as possible.",
      emailConfigured: true,
    });
  }

  console.info("[contact] Message stored (no CONTACT_EMAIL):", logEntry);

  return NextResponse.json({
    success: true,
    message: `Thank you for your message. Our team will follow up by phone at ${storeConfig.phoneDisplay} - phone is our primary contact channel.`,
    emailConfigured: false,
    phone: storeConfig.phoneDisplay,
  });
}

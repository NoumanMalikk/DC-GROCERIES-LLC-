import { NextResponse } from "next/server";
import { rateLimitNewsletter } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";
import { safeParseNewsletterInput } from "@/lib/validation";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = rateLimitNewsletter(ip);

  if (!rateLimit.success) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = safeParseNewsletterInput(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Please check your email and consent checkbox.",
        errors: parsed.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path,
        })),
      },
      { status: 422 },
    );
  }

  // Demo: acknowledge subscription without persisting or sending email.
  return NextResponse.json({
    success: true,
    message: "Subscription received. Thank you for signing up.",
  });
}

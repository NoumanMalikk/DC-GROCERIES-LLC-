import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_STORE_MODE: z.enum(["demo", "live"]).default("demo"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_MODE: z.enum(["test", "live"]).optional(),
  CONTACT_EMAIL: z.string().email().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_DEMO_OVERRIDE: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
  EMAIL_FROM: z.string().email().optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

export type StripeMode = "test" | "live" | "unset";

let cachedEnv: AppEnv | null = null;

export function validateEnv(): AppEnv {
  if (cachedEnv) return cachedEnv;

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const messages = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Environment validation failed: ${messages}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

export function getStripeMode(): StripeMode {
  const env = validateEnv();

  if (env.STRIPE_MODE) {
    return env.STRIPE_MODE;
  }

  const secret = env.STRIPE_SECRET_KEY ?? "";
  if (secret.startsWith("sk_live_")) return "live";
  if (secret.startsWith("sk_test_")) return "test";

  return "unset";
}

export function isStripeConfigured(): boolean {
  const env = validateEnv();
  return Boolean(
    env.STRIPE_SECRET_KEY && env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
}

export function getPublicEnv() {
  const env = validateEnv();
  return {
    siteUrl: env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    storeMode: env.NEXT_PUBLIC_STORE_MODE,
    stripePublishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? null,
    stripeMode: getStripeMode(),
  } as const;
}

export function resetEnvCache(): void {
  cachedEnv = null;
}

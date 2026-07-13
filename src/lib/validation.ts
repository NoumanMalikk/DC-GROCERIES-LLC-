import { z } from "zod";

const US_STATE_REGEX = /^[A-Z]{2}$/;
const POSTAL_CODE_REGEX = /^\d{5}(-\d{4})?$/;
const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/;

export const addressSchema = z.object({
  line1: z.string().trim().min(1, "Street address is required").max(120),
  line2: z.string().trim().max(120).optional().nullable(),
  city: z.string().trim().min(1, "City is required").max(80),
  state: z
    .string()
    .trim()
    .toUpperCase()
    .regex(US_STATE_REGEX, "Enter a valid two-letter state code"),
  postalCode: z
    .string()
    .trim()
    .regex(POSTAL_CODE_REGEX, "Enter a valid US ZIP code"),
  country: z.string().trim().default("United States"),
});

export type AddressInput = z.infer<typeof addressSchema>;

export const checkoutCustomerSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, "Enter a valid phone number")
    .optional()
    .nullable(),
  company: z.string().trim().max(100).optional().nullable(),
});

export const checkoutSchema = z
  .object({
    customer: checkoutCustomerSchema,
    shippingAddress: addressSchema,
    billingSameAsShipping: z.boolean().default(true),
    billingAddress: addressSchema.optional().nullable(),
    acceptTerms: z.literal(true, {
      error: "You must accept the terms to continue",
    }),
    orderNotes: z.string().trim().max(500).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (!data.billingSameAsShipping && !data.billingAddress) {
      ctx.addIssue({
        code: "custom",
        message: "Billing address is required when different from shipping",
        path: ["billingAddress"],
      });
    }
  });

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const checkoutCartItemSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.number().int().positive().max(99),
});

export const checkoutRequestSchema = z
  .object({
    customer: checkoutCustomerSchema,
    shippingAddress: addressSchema,
    billingSameAsShipping: z.boolean().default(true),
    billingAddress: addressSchema.optional().nullable(),
    deliveryInstructions: z.string().trim().max(500).optional().nullable(),
    cart: z.array(checkoutCartItemSchema).min(1, "Cart cannot be empty"),
    acceptTerms: z.literal(true, {
      error: "You must accept the terms of service",
    }),
    acceptPrivacy: z.literal(true, {
      error: "You must accept the privacy policy",
    }),
    acceptPackageReview: z.literal(true, {
      error: "You must confirm package size review",
    }),
    marketingConsent: z.boolean().optional().default(false),
    orderNotes: z.string().trim().max(500).optional().nullable(),
    idempotencyKey: z.string().trim().max(128).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (!data.billingSameAsShipping && !data.billingAddress) {
      ctx.addIssue({
        code: "custom",
        message: "Billing address is required when different from shipping",
        path: ["billingAddress"],
      });
    }
  });

export type CheckoutRequestInput = z.infer<typeof checkoutRequestSchema>;

export const trackOrderSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  orderReference: z
    .string()
    .trim()
    .regex(/^DCG-[0-9A-Z]{12}$/, "Enter a valid order reference"),
});

export type TrackOrderInput = z.infer<typeof trackOrderSchema>;

export const cartValidateRequestSchema = z.object({
  cart: z.array(checkoutCartItemSchema).min(1),
});

export type CartValidateRequestInput = z.infer<
  typeof cartValidateRequestSchema
>;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, "Enter a valid phone number")
    .optional()
    .nullable(),
  subject: z
    .enum([
      "general",
      "order",
      "product",
      "allergen",
      "shipping",
      "returns",
      "other",
    ])
    .default("general"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000),
  orderReference: z
    .string()
    .trim()
    .regex(/^DCG-[0-9A-Z]{12}$/, "Enter a valid order reference")
    .optional()
    .nullable(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  consent: z.literal(true, {
    error: "Consent is required to subscribe",
  }),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

export function parseCheckoutInput(data: unknown): CheckoutInput {
  return checkoutSchema.parse(data);
}

export function parseContactInput(data: unknown): ContactInput {
  return contactSchema.parse(data);
}

export function parseNewsletterInput(data: unknown): NewsletterInput {
  return newsletterSchema.parse(data);
}

export function parseAddressInput(data: unknown): AddressInput {
  return addressSchema.parse(data);
}

export function safeParseCheckoutInput(data: unknown) {
  return checkoutSchema.safeParse(data);
}

export function safeParseContactInput(data: unknown) {
  return contactSchema.safeParse(data);
}

export function safeParseNewsletterInput(data: unknown) {
  return newsletterSchema.safeParse(data);
}

export function safeParseCheckoutRequestInput(data: unknown) {
  return checkoutRequestSchema.safeParse(data);
}

export function safeParseTrackOrderInput(data: unknown) {
  return trackOrderSchema.safeParse(data);
}

export function safeParseCartValidateRequestInput(data: unknown) {
  return cartValidateRequestSchema.safeParse(data);
}

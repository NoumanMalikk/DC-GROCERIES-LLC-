import { z } from "zod";
import { addressSchema, checkoutCustomerSchema } from "@/lib/validation";

const checkoutAddressSchema = addressSchema.extend({
  country: z.string().trim().min(1),
});

export const checkoutFormSchema = z
  .object({
    customer: checkoutCustomerSchema,
    shippingAddress: checkoutAddressSchema,
    billingSameAsShipping: z.boolean(),
    billingAddress: checkoutAddressSchema.optional().nullable(),
    deliveryInstructions: z.string().trim().max(500).optional().nullable(),
    acceptTerms: z.boolean(),
    acceptPrivacy: z.boolean(),
    acceptPackageReview: z.boolean(),
    marketingConsent: z.boolean(),
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

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export const CHECKOUT_STEPS = [
  { id: "customer", label: "Customer" },
  { id: "shipping", label: "Shipping" },
  { id: "availability", label: "Availability" },
  { id: "shipping-method", label: "Shipping method" },
  { id: "billing", label: "Billing" },
  { id: "tax", label: "Tax" },
  { id: "review", label: "Review" },
  { id: "agreements", label: "Agreements" },
  { id: "pay", label: "Pay" },
] as const;

export type CheckoutStepId = (typeof CHECKOUT_STEPS)[number]["id"];

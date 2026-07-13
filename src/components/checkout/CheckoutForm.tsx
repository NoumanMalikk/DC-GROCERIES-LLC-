"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Loader2,
  Snowflake,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { storeConfig, isDemoMode } from "@data/store-config";
import {
  calculateDemoShipping,
  canShipRefrigeratedItems,
  isFragileProduceHandlingConfigured,
} from "@data/shipping-rules";
import { hasUnresolvedLegalPlaceholders } from "@data/legal-config";
import { isLiveMode } from "@data/store-config";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { VerificationNotice } from "@/components/shared/VerificationNotice";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import type { ValidatedCart } from "@/lib/cart-server";
import { calculateTaxEstimate } from "@/lib/tax";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { AddressFields } from "./AddressFields";
import { CheckoutStepIndicator } from "./CheckoutStepIndicator";
import { CheckoutStepTransition } from "./CheckoutStepTransition";
import { CheckoutSummary } from "./CheckoutSummary";
import {
  CHECKOUT_STEPS,
  checkoutFormSchema,
  type CheckoutFormValues,
  type CheckoutStepId,
} from "./checkout-form-schema";

const defaultValues: CheckoutFormValues = {
  customer: {
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
  },
  shippingAddress: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: storeConfig.defaultCountry,
  },
  billingSameAsShipping: true,
  billingAddress: null,
  deliveryInstructions: "",
  acceptTerms: false,
  acceptPrivacy: false,
  acceptPackageReview: false,
  marketingConsent: false,
  orderNotes: "",
};

export function CheckoutForm() {
  const router = useRouter();
  const cartItems = useCartStore((s) => s.items);
  const [currentStep, setCurrentStep] = useState<CheckoutStepId>("customer");
  const [validatedCart, setValidatedCart] = useState<ValidatedCart | null>(
    null
  );
  const [validationLoading, setValidationLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [payLoading, setPayLoading] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues,
    mode: "onBlur",
  });

  const {
    control,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = form;

  const shippingAddress = watch("shippingAddress");
  const billingSameAsShipping = watch("billingSameAsShipping");

  useEffect(() => {
    if (!billingSameAsShipping && !getValues("billingAddress")) {
      form.setValue("billingAddress", {
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: storeConfig.defaultCountry,
      });
    }
  }, [billingSameAsShipping, form, getValues]);

  const currentStepIndex = CHECKOUT_STEPS.findIndex((s) => s.id === currentStep);

  const legalBlocked = isLiveMode() && hasUnresolvedLegalPlaceholders();

  const shippingQuote = useMemo(() => {
    if (!validatedCart || !shippingAddress.state || !shippingAddress.postalCode) {
      return null;
    }
    return calculateDemoShipping(
      validatedCart.totalWeightLb,
      {
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
      validatedCart.subtotalCents
    );
  }, [validatedCart, shippingAddress]);

  const taxEstimate = useMemo(() => {
    if (!validatedCart || !shippingAddress.state) return null;
    return calculateTaxEstimate(
      validatedCart.subtotalCents,
      shippingAddress.state
    );
  }, [validatedCart, shippingAddress.state]);

  const refrigeratedBlocked =
    validatedCart &&
    (validatedCart.hasRefrigerated || validatedCart.hasFrozen) &&
    !canShipRefrigeratedItems();

  const validateCartOnServer = useCallback(async () => {
    setValidationLoading(true);
    setValidationError(null);

    try {
      const response = await fetch("/api/orders/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        setValidationError(
          data.message ??
            "Some items in your cart cannot be purchased. Please review your cart."
        );
        setValidatedCart(data.items ? { ...data, valid: false } : null);
        return false;
      }

      setValidatedCart(data as ValidatedCart);
      return true;
    } catch {
      setValidationError(
        "Unable to validate your cart. Please check your connection and try again."
      );
      return false;
    } finally {
      setValidationLoading(false);
    }
  }, [cartItems]);

  useEffect(() => {
    if (cartItems.length === 0 && currentStep !== "customer") {
      router.replace("/cart");
    }
  }, [cartItems.length, currentStep, router]);

  const goNext = async () => {
    let fieldsToValidate: (keyof CheckoutFormValues)[] = [];

    switch (currentStep) {
      case "customer":
        fieldsToValidate = ["customer"];
        break;
      case "shipping":
        fieldsToValidate = ["shippingAddress", "deliveryInstructions"];
        break;
      case "availability": {
        const ok = await validateCartOnServer();
        if (!ok) return;
        break;
      }
      case "shipping-method":
        if (refrigeratedBlocked) return;
        break;
      case "billing":
        fieldsToValidate = ["billingSameAsShipping", "billingAddress"];
        break;
      case "tax":
        break;
      case "review":
        break;
      case "agreements":
        fieldsToValidate = [
          "acceptTerms",
          "acceptPrivacy",
          "acceptPackageReview",
        ];
        break;
      default:
        break;
    }

    if (fieldsToValidate.length > 0) {
      const valid = await trigger(fieldsToValidate);
      if (!valid) return;
    }

    if (currentStep === "agreements") {
      const values = getValues();
      if (
        !values.acceptTerms ||
        !values.acceptPrivacy ||
        !values.acceptPackageReview
      ) {
        return;
      }
    }

    const nextStep = CHECKOUT_STEPS[currentStepIndex + 1];
    if (nextStep) {
      setCurrentStep(nextStep.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    const prevStep = CHECKOUT_STEPS[currentStepIndex - 1];
    if (prevStep) {
      setCurrentStep(prevStep.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePay = async () => {
    setPayError(null);
    setPayLoading(true);

    const values = getValues();
    const idempotencyKey =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `checkout-${Date.now()}`;

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: values.customer,
          shippingAddress: values.shippingAddress,
          billingSameAsShipping: values.billingSameAsShipping,
          billingAddress: values.billingSameAsShipping
            ? null
            : values.billingAddress,
          deliveryInstructions: storeConfig.localDeliveryEnabled
            ? values.deliveryInstructions
            : null,
          cart: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          acceptTerms: true,
          acceptPrivacy: true,
          acceptPackageReview: true,
          marketingConsent: values.marketingConsent,
          orderNotes: values.orderNotes,
          idempotencyKey,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setPayError(
          data.message ??
            "Unable to start payment. Please try again or call us for assistance."
        );
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setPayError(
        "Unable to connect to payment service. Please try again."
      );
    } finally {
      setPayLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className="py-12">
        <SectionHeading
          as="h1"
          title="Checkout"
          description="Your cart is empty."
        />
        <Link href="/shop" className="mt-6 inline-block text-garden-green hover:underline">
          Continue shopping
        </Link>
      </Container>
    );
  }

  if (legalBlocked) {
    return (
      <Container className="py-12">
        <VerificationNotice
          message="Checkout is temporarily unavailable while legal policies are being finalized. Please call us to place your order."
          className="mb-6"
        />
        <p className="text-sm text-soft-graphite">
          Phone:{" "}
          <a href={`tel:${storeConfig.phoneE164}`} className="text-garden-green">
            {storeConfig.phoneDisplay}
          </a>
        </p>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
        className="mb-6"
      />

      <SectionHeading
        as="h1"
        title="Checkout"
        description="Guest checkout — complete each step to place your order securely."
        className="mb-6"
      />

      {isDemoMode() && (
        <VerificationNotice
          message="Demo mode: prices and shipping are for demonstration only. Payment uses Stripe test mode when configured."
          className="mb-6"
        />
      )}

      <CheckoutStepIndicator currentStep={currentStep} />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CheckoutStepTransition stepKey={currentStep}>
            {currentStep === "customer" && (
              <section aria-labelledby="customer-heading">
                <h2
                  id="customer-heading"
                  className="font-heading text-xl font-semibold text-market-ink"
                >
                  Customer information
                </h2>
                <p className="mt-1 text-sm text-soft-graphite">
                  We will send your order confirmation to this email.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName" required>
                      First name
                    </Label>
                    <Controller
                      name="customer.firstName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="firstName"
                          autoComplete="given-name"
                          error={Boolean(errors.customer?.firstName)}
                          {...field}
                        />
                      )}
                    />
                    {errors.customer?.firstName && (
                      <p className="mt-1 text-xs text-tomato-red">
                        {errors.customer.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName" required>
                      Last name
                    </Label>
                    <Controller
                      name="customer.lastName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="lastName"
                          autoComplete="family-name"
                          error={Boolean(errors.customer?.lastName)}
                          {...field}
                        />
                      )}
                    />
                    {errors.customer?.lastName && (
                      <p className="mt-1 text-xs text-tomato-red">
                        {errors.customer.lastName.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="email" required>
                      Email
                    </Label>
                    <Controller
                      name="customer.email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          error={Boolean(errors.customer?.email)}
                          {...field}
                        />
                      )}
                    />
                    {errors.customer?.email && (
                      <p className="mt-1 text-xs text-tomato-red">
                        {errors.customer.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Controller
                      name="customer.phone"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="phone"
                          type="tel"
                          autoComplete="tel"
                          error={Boolean(errors.customer?.phone)}
                          {...field}
                          value={field.value ?? ""}
                        />
                      )}
                    />
                    {errors.customer?.phone && (
                      <p className="mt-1 text-xs text-tomato-red">
                        {errors.customer.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="company">Company (optional)</Label>
                    <Controller
                      name="customer.company"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="company"
                          autoComplete="organization"
                          {...field}
                          value={field.value ?? ""}
                        />
                      )}
                    />
                  </div>
                </div>
              </section>
            )}

            {currentStep === "shipping" && (
              <section aria-labelledby="shipping-heading">
                <h2
                  id="shipping-heading"
                  className="font-heading text-xl font-semibold text-market-ink"
                >
                  Shipping address
                </h2>
                <p className="mt-1 text-sm text-soft-graphite">
                  Where should we deliver your order?
                </p>

                <div className="mt-6">
                  <AddressFields
                    control={control}
                    errors={errors}
                    prefix="shippingAddress"
                    idPrefix="shipping"
                  />
                </div>

                {storeConfig.localDeliveryEnabled && (
                  <div className="mt-4">
                    <Label htmlFor="deliveryInstructions">
                      Delivery instructions (optional)
                    </Label>
                    <Controller
                      name="deliveryInstructions"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          id="deliveryInstructions"
                          placeholder="Gate code, building access, etc."
                          {...field}
                          value={field.value ?? ""}
                        />
                      )}
                    />
                  </div>
                )}
              </section>
            )}

            {currentStep === "availability" && (
              <section aria-labelledby="availability-heading">
                <h2
                  id="availability-heading"
                  className="font-heading text-xl font-semibold text-market-ink"
                >
                  Availability validation
                </h2>
                <p className="mt-1 text-sm text-soft-graphite">
                  We verify product availability, pricing and fulfilment readiness
                  on our servers — never trusting browser prices.
                </p>

                <div className="mt-6">
                  {validationLoading ? (
                    <div className="flex items-center gap-3 text-sm text-soft-graphite">
                      <Loader2 className="size-5 animate-spin" />
                      Validating your cart…
                    </div>
                  ) : validationError ? (
                    <VerificationNotice
                      message={validationError}
                      className="mb-4"
                    />
                  ) : validatedCart ? (
                    <div className="space-y-4">
                      <p className="text-sm text-garden-green font-medium">
                        All {validatedCart.items.length} items validated successfully.
                      </p>
                      <ul className="space-y-2" role="list">
                        {validatedCart.items.map((item) => (
                          <li
                            key={item.productId}
                            className="flex justify-between rounded-md border border-border-sand px-3 py-2 text-sm"
                          >
                            <span>
                              {item.title}
                              <span className="block text-xs text-soft-graphite">
                                SKU {item.sku} · {item.packageSize}
                              </span>
                            </span>
                            <span className="tabular-nums">
                              {formatPrice(item.lineTotalCents, { cents: true })}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-soft-graphite">
                      Click Continue to validate your cart.
                    </p>
                  )}
                </div>
              </section>
            )}

            {currentStep === "shipping-method" && (
              <section aria-labelledby="shipping-method-heading">
                <h2
                  id="shipping-method-heading"
                  className="font-heading text-xl font-semibold text-market-ink"
                >
                  Shipping method
                </h2>
                <p className="mt-1 text-sm text-soft-graphite">
                  Demonstration shipping estimate for your delivery area.
                </p>

                {refrigeratedBlocked && (
                  <VerificationNotice
                    message="Your cart includes refrigerated items that cannot be shipped with current fulfilment settings. Please remove them or contact us by phone."
                    className="mt-4"
                  />
                )}

                {validatedCart?.hasFreshProduce &&
                  !isFragileProduceHandlingConfigured() && (
                    <VerificationNotice
                      message="Your cart includes fresh produce. Special fragile-produce handling is not yet configured — items may require extra packaging review before dispatch."
                      className="mt-4"
                    />
                  )}

                {shippingQuote && !refrigeratedBlocked && (
                  <div className="mt-6 rounded-xl border border-border-sand bg-fresh-white p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-market-ink">
                          Demonstration shipping
                        </p>
                        <p className="mt-1 text-sm text-soft-graphite">
                          Zone: {shippingQuote.zone} ·{" "}
                          {shippingQuote.estimatedBusinessDays.min}–
                          {shippingQuote.estimatedBusinessDays.max} business days
                        </p>
                        <p className="mt-2 text-xs text-soft-graphite">
                          {shippingQuote.note}
                        </p>
                      </div>
                      <p className="font-semibold tabular-nums text-market-ink">
                        {formatPrice(shippingQuote.shippingCents, { cents: true })}
                      </p>
                    </div>
                  </div>
                )}

                {validatedCart?.hasRefrigerated && (
                  <p className="mt-4 flex items-center gap-2 text-sm text-soft-graphite">
                    <Snowflake className="size-4" />
                    Cart includes refrigerated items
                  </p>
                )}
              </section>
            )}

            {currentStep === "billing" && (
              <section aria-labelledby="billing-heading">
                <h2
                  id="billing-heading"
                  className="font-heading text-xl font-semibold text-market-ink"
                >
                  Billing address
                </h2>

                <div className="mt-4">
                  <Controller
                    name="billingSameAsShipping"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        label="Billing address same as shipping"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                </div>

                {!billingSameAsShipping && (
                  <div className="mt-6">
                    <AddressFields
                      control={control}
                      errors={errors}
                      prefix="billingAddress"
                      idPrefix="billing"
                    />
                  </div>
                )}
              </section>
            )}

            {currentStep === "tax" && (
              <section aria-labelledby="tax-heading">
                <h2
                  id="tax-heading"
                  className="font-heading text-xl font-semibold text-market-ink"
                >
                  Tax estimate
                </h2>

                {taxEstimate && (
                  <div className="mt-6 rounded-xl border border-border-sand bg-fresh-white p-5">
                    <div className="flex justify-between">
                      <span className="text-soft-graphite">Estimated tax</span>
                      <span className="font-semibold tabular-nums text-market-ink">
                        {formatPrice(taxEstimate.taxCents, { cents: true })}
                      </span>
                    </div>
                    {taxEstimate.rateLabel && (
                      <p className="mt-1 text-xs text-soft-graphite">
                        Rate: {taxEstimate.rateLabel}
                      </p>
                    )}
                    <p className="mt-3 text-sm text-soft-graphite">
                      {taxEstimate.note}
                    </p>
                  </div>
                )}
              </section>
            )}

            {currentStep === "review" && (
              <section aria-labelledby="review-heading">
                <h2
                  id="review-heading"
                  className="font-heading text-xl font-semibold text-market-ink"
                >
                  Order review
                </h2>

                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-market-ink">
                      Customer
                    </h3>
                    <p className="mt-1 text-sm text-soft-graphite">
                      {getValues("customer.firstName")}{" "}
                      {getValues("customer.lastName")}
                      <br />
                      {getValues("customer.email")}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-market-ink">
                      Shipping to
                    </h3>
                    <p className="mt-1 text-sm text-soft-graphite">
                      {shippingAddress.line1}
                      {shippingAddress.line2 && (
                        <>
                          <br />
                          {shippingAddress.line2}
                        </>
                      )}
                      <br />
                      {shippingAddress.city}, {shippingAddress.state}{" "}
                      {shippingAddress.postalCode}
                    </p>
                  </div>

                  {validatedCart && (
                    <div>
                      <h3 className="text-sm font-semibold text-market-ink">
                        Items ({validatedCart.items.length})
                      </h3>
                      <ul className="mt-2 space-y-2" role="list">
                        {validatedCart.items.map((item) => (
                          <li
                            key={item.productId}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.title} × {item.quantity}
                            </span>
                            <span className="tabular-nums">
                              {formatPrice(item.lineTotalCents, { cents: true })}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {currentStep === "agreements" && (
              <section aria-labelledby="agreements-heading">
                <h2
                  id="agreements-heading"
                  className="font-heading text-xl font-semibold text-market-ink"
                >
                  Agreements
                </h2>
                <p className="mt-1 text-sm text-soft-graphite">
                  Please review and accept before payment.
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <Controller
                      name="acceptTerms"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          label={
                            <span>
                              I accept the{" "}
                              <Link
                                href="/terms-conditions"
                                className="text-garden-green underline"
                                target="_blank"
                              >
                                Terms of Service
                              </Link>{" "}
                              (required)
                            </span>
                          }
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      name="acceptPrivacy"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          label={
                            <span>
                              I accept the{" "}
                              <Link
                                href="/privacy-policy"
                                className="text-garden-green underline"
                                target="_blank"
                              >
                                Privacy Policy
                              </Link>{" "}
                              (required)
                            </span>
                          }
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      name="acceptPackageReview"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          label="I have reviewed package sizes and product details for my order (required)"
                        />
                      )}
                    />
                  </div>

                  <Separator />

                  <div>
                    <Controller
                      name="marketingConsent"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          label="Send me occasional updates and offers (optional)"
                        />
                      )}
                    />
                  </div>
                </div>
              </section>
            )}

            {currentStep === "pay" && (
              <section aria-labelledby="pay-heading">
                <h2
                  id="pay-heading"
                  className="font-heading text-xl font-semibold text-market-ink"
                >
                  Pay securely
                </h2>
                <p className="mt-1 text-sm text-soft-graphite">
                  You will be redirected to Stripe to complete payment. We never
                  collect card details on this site.
                </p>

                <div className="mt-6 rounded-xl border border-border-sand bg-oat-cream/50 p-5">
                  <div className="flex items-center gap-3">
                    <CreditCard className="size-6 text-garden-green" />
                    <div>
                      <p className="font-medium text-market-ink">
                        Secure payment via Stripe
                      </p>
                      <p className="text-sm text-soft-graphite">
                        Card details are entered only on Stripe&apos;s secure
                        checkout page.
                      </p>
                    </div>
                  </div>
                </div>

                {payError && (
                  <div className="mt-4 flex gap-2 rounded-md border border-tomato-red/30 bg-tomato-red/5 px-3 py-2.5 text-sm text-tomato-red">
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <p>{payError}</p>
                  </div>
                )}
              </section>
            )}
          </CheckoutStepTransition>

          <div className="mt-8 flex flex-wrap gap-3">
            {currentStepIndex > 0 && (
              <Button variant="outline" onClick={goBack} type="button">
                <ArrowLeft />
                Back
              </Button>
            )}

            {currentStep !== "pay" ? (
              <Button
                variant="primary"
                onClick={goNext}
                type="button"
                disabled={
                  currentStep === "shipping-method" && Boolean(refrigeratedBlocked)
                }
              >
                Continue
                <ArrowRight />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handlePay}
                type="button"
                disabled={payLoading}
              >
                {payLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Redirecting to Stripe…
                  </>
                ) : (
                  <>
                    <CreditCard />
                    Pay with Stripe
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {validatedCart && (
          <CheckoutSummary
            items={validatedCart.items}
            subtotalCents={validatedCart.subtotalCents}
            shipping={shippingQuote}
            tax={taxEstimate}
            className="lg:col-span-1"
          />
        )}
      </div>
    </Container>
  );
}

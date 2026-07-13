"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

type FormStatus = "idle" | "loading" | "success" | "error";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
        errors?: Array<{ message: string }>;
      };

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(
          data.message ??
            data.errors?.[0]?.message ??
            "Something went wrong. Please try again.",
        );
        return;
      }

      setStatus("success");
      setEmail("");
      setConsent(false);
    } catch {
      setStatus("error");
      setErrorMessage("Unable to connect. Please try again later.");
    }
  };

  return (
    <section className="bg-oat-cream py-14 sm:py-16">
      <Container size="narrow">
        <SectionHeading
          title="Stay in the loop"
          description="Occasional updates on new products, catalogue changes and store news. No discount promises—just clear information."
          align="center"
          className="mb-8"
        />

        {status === "success" ? (
          <div
            role="status"
            className="rounded-xl border border-garden-green/30 bg-garden-green/10 px-6 py-8 text-center"
          >
            <p className="font-heading text-lg font-semibold text-market-ink">
              Thank you for subscribing.
            </p>
            <p className="mt-2 text-sm text-soft-graphite">
              We&apos;ll send store updates to your inbox when there is news
              worth sharing.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setStatus("idle")}
            >
              Subscribe another email
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-md space-y-4"
            noValidate
          >
            <div>
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <Input
                id="newsletter-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === "loading"}
                error={status === "error"}
              />
            </div>

            <Checkbox
              id="newsletter-consent"
              name="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              disabled={status === "loading"}
              label="I agree to receive email updates from DC Groceries."
            />

            <p className="text-xs leading-relaxed text-soft-graphite">
              Read our{" "}
              <Link
                href="/privacy-policy"
                className="font-medium text-market-ink underline-offset-2 hover:underline"
              >
                privacy policy
              </Link>{" "}
              to learn how we handle your information. You can unsubscribe at
              any time.
            </p>

            {status === "error" && errorMessage && (
              <p role="alert" className="text-sm text-tomato-red">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={status === "loading" || !consent}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="animate-spin" />
                  Subscribing…
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
          </form>
        )}
      </Container>
    </section>
  );
}

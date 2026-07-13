"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type FormStatus = "idle" | "loading" | "success" | "error";

const CONTACT_TOPICS = [
  { value: "product", label: "Product question" },
  { value: "allergen", label: "Food or allergen information" },
  { value: "order", label: "Existing order" },
  { value: "shipping", label: "Shipping" },
  { value: "returns", label: "Returns" },
  { value: "general", label: "Website support" },
  { value: "other", label: "Other" },
] as const;

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState<string>("product");
  const [message, setMessage] = useState("");
  const [orderReference, setOrderReference] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const showOrderReference = subject === "order";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone.trim() || null,
          subject,
          message,
          orderReference: showOrderReference
            ? orderReference.trim() || null
            : null,
        }),
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
      setName("");
      setEmail("");
      setPhone("");
      setSubject("product");
      setMessage("");
      setOrderReference("");
    } catch {
      setStatus("error");
      setErrorMessage("Unable to connect. Please try again later.");
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-xl border border-garden-green/30 bg-garden-green/10 px-6 py-8"
      >
        <p className="font-heading text-lg font-semibold text-market-ink">
          Message received
        </p>
        <p className="mt-2 text-sm leading-relaxed text-soft-graphite">
          Thank you for contacting DC Groceries. We will review your message
          and respond as soon as we can.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={status === "loading"}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-phone">
            Phone <span className="text-soft-graphite">(optional)</span>
          </Label>
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={status === "loading"}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-subject">Topic</Label>
          <Select
            id="contact-subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={status === "loading"}
          >
            {CONTACT_TOPICS.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {showOrderReference && (
        <div className="space-y-2">
          <Label htmlFor="contact-order-ref">
            Order reference <span className="text-soft-graphite">(optional)</span>
          </Label>
          <Input
            id="contact-order-ref"
            name="orderReference"
            type="text"
            placeholder="DCG-XXXXXXXXXXXX"
            value={orderReference}
            onChange={(e) => setOrderReference(e.target.value)}
            disabled={status === "loading"}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={status === "loading"}
          placeholder="Include product name and SKU for product or allergen questions."
        />
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-sm text-tomato-red">
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          "Send message"
        )}
      </Button>

      <p className="text-xs leading-relaxed text-soft-graphite">
        For food safety and allergen questions, see our{" "}
        <Link
          href="/food-information"
          className="font-medium text-market-ink underline-offset-2 hover:underline"
        >
          Food Information
        </Link>{" "}
        and{" "}
        <Link
          href="/product-allergen-information"
          className="font-medium text-market-ink underline-offset-2 hover:underline"
        >
          Product and Allergen Information
        </Link>{" "}
        pages.
      </p>
    </form>
  );
}

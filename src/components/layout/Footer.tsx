import Link from "next/link";
import { storeConfig, getContactEmail } from "../../../data/store-config";
import { getTopLevelCategories } from "../../../data/categories";
import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/shared/Logo";
import { Separator } from "@/components/ui/separator";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const contactEmail = getContactEmail();
  const topCategories = getTopLevelCategories().sort(
    (a, b) => a.navOrder - b.navOrder,
  );

  const hasSocial =
    storeConfig.socialLinks.facebook ||
    storeConfig.socialLinks.instagram ||
    storeConfig.socialLinks.x;

  return (
    <footer className="mt-auto border-t border-border-sand bg-market-ink text-fresh-white">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-citrus-orange focus-visible:ring-offset-2 focus-visible:ring-offset-market-ink"
              aria-label={`${storeConfig.brandName} home`}
            >
              <Logo variant="dark" className="h-9 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed text-fresh-white/75">
              {storeConfig.tagline}
            </p>
            <p className="text-xs text-fresh-white/60">
              {storeConfig.brandConcept}
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-fresh-white/90">
              Categories
            </h3>
            <ul className="mt-4 space-y-2" role="list">
              {topCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={category.href}
                    className="text-sm text-fresh-white/75 transition-colors hover:text-citrus-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-citrus-orange rounded-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-fresh-white/90">
              Customer info
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-fresh-white/75" role="list">
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-citrus-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-citrus-orange rounded-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-policy"
                  className="transition-colors hover:text-citrus-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-citrus-orange rounded-sm"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  href="/return-refund-policy"
                  className="transition-colors hover:text-citrus-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-citrus-orange rounded-sm"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="transition-colors hover:text-citrus-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-citrus-orange rounded-sm"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <a
                  href={`tel:${storeConfig.phoneE164}`}
                  className="transition-colors hover:text-citrus-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-citrus-orange rounded-sm"
                >
                  {storeConfig.phoneDisplay}
                </a>
              </li>
              <li>{storeConfig.publicLocationLabel}</li>
              {storeConfig.showFullBusinessAddress && (
                <li className="leading-relaxed">
                  {storeConfig.registeredAddress.line1}
                  <br />
                  {storeConfig.registeredAddress.city},{" "}
                  {storeConfig.registeredAddress.state}{" "}
                  {storeConfig.registeredAddress.postalCode}
                </li>
              )}
              {contactEmail && (
                <li>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="transition-colors hover:text-citrus-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-citrus-orange rounded-sm"
                  >
                    {contactEmail}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-fresh-white/90">
              Legal
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-fresh-white/75" role="list">
              <li>
                <Link
                  href="/privacy-policy"
                  className="transition-colors hover:text-citrus-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-citrus-orange rounded-sm"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-conditions"
                  className="transition-colors hover:text-citrus-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-citrus-orange rounded-sm"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="transition-colors hover:text-citrus-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-citrus-orange rounded-sm"
                >
                  Accessibility
                </Link>
              </li>
            </ul>

            {hasSocial && (
              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-fresh-white/60">
                  Follow us
                </h4>
                <div className="mt-3 flex gap-3">
                  {storeConfig.socialLinks.facebook && (
                    <a
                      href={storeConfig.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-fresh-white/75 transition-colors hover:text-citrus-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-citrus-orange rounded-sm"
                      aria-label="Facebook"
                    >
                      <FacebookIcon className="size-5" />
                    </a>
                  )}
                  {storeConfig.socialLinks.instagram && (
                    <a
                      href={storeConfig.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-fresh-white/75 transition-colors hover:text-citrus-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-citrus-orange rounded-sm"
                      aria-label="Instagram"
                    >
                      <InstagramIcon className="size-5" />
                    </a>
                  )}
                  {storeConfig.socialLinks.x && (
                    <a
                      href={storeConfig.socialLinks.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-fresh-white/75 transition-colors hover:text-citrus-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-citrus-orange rounded-sm"
                      aria-label="X"
                    >
                      <XIcon className="size-5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-8 bg-fresh-white/15" />

        <div className="flex flex-col gap-2 text-xs text-fresh-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {storeConfig.legalName}. All rights reserved.
          </p>
          <p>
            {topCategories.length} shop categories · {storeConfig.publicLocationLabel}
          </p>
        </div>
      </Container>
    </footer>
  );
}

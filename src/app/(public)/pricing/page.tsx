import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Section, { SectionHeader } from "@/components/shared/Section";
import FadeInView from "@/components/shared/FadeInView";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Understand how artworks are priced and what is included with every purchase.",
};

const INCLUSIONS = [
  "Signed certificate of authenticity",
  "Professional archival packaging",
  "Shipping insurance",
  "Full artwork care guide",
  "Direct contact with the artist",
];

const TIERS = [
  {
    label: "Small Works",
    size: "Up to 30 × 30 cm",
    price: "From ₹15,000",
    description: "Intimate pieces ideal for desk, shelf, or small wall spaces.",
  },
  {
    label: "Medium Works",
    size: "30–60 cm",
    price: "From ₹35,000",
    description: "The most popular format — works well in living spaces and hallways.",
  },
  {
    label: "Large Works",
    size: "60 cm and above",
    price: "From ₹75,000",
    description: "Statement pieces for larger walls and collectors seeking significant impact.",
  },
  {
    label: "Commissions",
    size: "Any size",
    price: "Price on request",
    description: "Bespoke work created for you. Price varies by size, complexity, and timeline.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="bg-foreground text-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeInView>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-background/40 mb-4">
              Investment
            </p>
            <h1 className="font-heading text-5xl lg:text-6xl font-semibold text-background">
              Pricing
            </h1>
          </FadeInView>
        </div>
      </section>

      <Section>
        <div className="max-w-3xl">
          <FadeInView>
            <p className="text-muted-foreground leading-relaxed text-lg mb-16 max-w-xl">
              Prices reflect the time, materials, and care that go into each piece. Every
              original artwork is priced individually and listed in the gallery.
            </p>
          </FadeInView>

          <SectionHeader label="Guide Prices" title="What to Expect" />

          <div className="space-y-0">
            {TIERS.map(({ label, size, price, description }, i) => (
              <FadeInView key={label} delay={i * 0.08}>
                <div>
                  <div className="py-8 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start">
                    <div>
                      <h3 className="font-heading text-xl font-semibold text-foreground mb-1">
                        {label}
                      </h3>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
                        {size}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                    </div>
                    <p className="font-heading text-xl font-semibold text-foreground shrink-0 sm:text-right">
                      {price}
                    </p>
                  </div>
                  {i < TIERS.length - 1 && <Separator />}
                </div>
              </FadeInView>
            ))}
          </div>

          <Separator className="my-16" />

          {/* What's included */}
          <FadeInView>
            <SectionHeader label="Every Purchase" title="What's Included" />
            <ul className="space-y-4">
              {INCLUSIONS.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Check size={16} className="text-foreground shrink-0" />
                  <span className="text-muted-foreground text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </FadeInView>

          <FadeInView className="mt-16">
            <div className="p-8 bg-foreground text-background">
              <h3 className="font-heading text-2xl font-semibold mb-3">
                Ready to acquire a work?
              </h3>
              <p className="text-background/60 text-sm mb-6 max-w-md leading-relaxed">
                Browse the gallery and use the enquiry button on any artwork page. You can also
                contact me directly for availability and pricing.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-2 text-sm font-medium border-b border-background pb-0.5 hover:gap-3 transition-all duration-200"
                >
                  Browse Gallery
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm text-background/60 hover:text-background transition-colors border-b border-background/40 pb-0.5"
                >
                  Contact directly
                </Link>
              </div>
            </div>
          </FadeInView>
        </div>
      </Section>
    </>
  );
}

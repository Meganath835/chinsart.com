import type { Metadata } from "next";
import Section from "@/components/shared/Section";

export const metadata: Metadata = { title: "Terms of Use" };

const LAST_UPDATED = "July 2025";

export default function TermsPage() {
  return (
    <Section narrow>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
        Legal
      </p>
      <h1 className="font-heading text-4xl font-semibold mb-2">Terms of Use</h1>
      <p className="text-sm text-muted-foreground mb-12">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-8 text-muted-foreground">
        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
            1. Use of this Website
          </h2>
          <p className="leading-relaxed">
            By accessing ChinsArt, you agree to use the site for lawful purposes only. You may
            browse, share links, and enquire about artworks. Scraping, automated data collection,
            or reproduction of content without permission is prohibited.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
            2. Intellectual Property
          </h2>
          <p className="leading-relaxed">
            All artwork images, descriptions, and written content on this website are the
            intellectual property of ChinsArt. No reproduction, distribution, or commercial use
            is permitted without explicit written consent.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
            3. Artwork Enquiries
          </h2>
          <p className="leading-relaxed">
            Submitting an enquiry does not constitute a purchase or reservation of an artwork.
            Availability is confirmed only upon written agreement between the artist and the
            enquiring party.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
            4. Accuracy of Information
          </h2>
          <p className="leading-relaxed">
            We endeavour to keep artwork information accurate and up to date. Prices, dimensions,
            and availability are subject to change without notice. Colours may vary slightly from
            screen representations.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
            5. Limitation of Liability
          </h2>
          <p className="leading-relaxed">
            ChinsArt is not liable for any indirect, incidental, or consequential damages arising
            from use of this website or reliance on its content.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
            6. Governing Law
          </h2>
          <p className="leading-relaxed">
            These terms are governed by the laws of India. Any disputes shall be subject to the
            jurisdiction of courts in India.
          </p>
        </section>
      </div>
    </Section>
  );
}

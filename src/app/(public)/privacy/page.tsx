import type { Metadata } from "next";
import Section from "@/components/shared/Section";

export const metadata: Metadata = { title: "Privacy Policy" };

const LAST_UPDATED = "July 2025";

export default function PrivacyPage() {
  return (
    <Section narrow>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
        Legal
      </p>
      <h1 className="font-heading text-4xl font-semibold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-12">Last updated: {LAST_UPDATED}</p>

      <div className="prose prose-sm prose-neutral max-w-none space-y-8 text-muted-foreground">
        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
            1. Information We Collect
          </h2>
          <p className="leading-relaxed">
            We collect information you provide directly — such as your name and email address when you
            send a contact message or subscribe to our newsletter. We do not collect payment
            information as no purchases are made through this website at this time.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
            2. How We Use Your Information
          </h2>
          <p className="leading-relaxed">
            Information submitted via the contact form is used solely to respond to your enquiry.
            Newsletter subscribers receive occasional updates about new artworks and exhibitions.
            We do not sell, trade, or share your personal information with third parties.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
            3. Data Storage
          </h2>
          <p className="leading-relaxed">
            Your data is stored securely in encrypted databases. Artwork images are stored on
            Amazon Web Services S3 with appropriate access controls.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
            4. Cookies
          </h2>
          <p className="leading-relaxed">
            This website uses minimal cookies required for essential functionality only. No
            tracking or advertising cookies are used.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
            5. Your Rights
          </h2>
          <p className="leading-relaxed">
            You may request deletion of your data at any time by contacting us at
            hello@chinsart.com. Newsletter subscribers may unsubscribe at any time.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
            6. Contact
          </h2>
          <p className="leading-relaxed">
            For any privacy-related questions, contact us at hello@chinsart.com.
          </p>
        </section>
      </div>
    </Section>
  );
}

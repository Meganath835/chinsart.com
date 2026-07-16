import type { Metadata } from "next";
import Section, { SectionHeader } from "@/components/shared/Section";
import FadeInView from "@/components/shared/FadeInView";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to frequently asked questions about artworks, commissions, shipping, and more.",
};

const FAQS = [
  {
    category: "Purchasing",
    items: [
      {
        q: "How do I buy an artwork?",
        a: "Click the 'Enquire About This Piece' button on any artwork page and send a message. I'll respond with availability confirmation and next steps within 2–3 business days.",
      },
      {
        q: "Do you accept international enquiries?",
        a: "Yes. I work with collectors worldwide. Shipping costs and arrangements will be discussed during the enquiry process.",
      },
      {
        q: "What does 'Price on Request' mean?",
        a: "Some works are priced individually based on size, medium, and demand. Contact me and I'll provide the price directly.",
      },
      {
        q: "Can I pay in instalments?",
        a: "For original artworks over a certain value, payment plans may be arranged. Mention this in your enquiry and we can discuss options.",
      },
    ],
  },
  {
    category: "Commissions",
    items: [
      {
        q: "Do you accept commissions?",
        a: "Yes, I take on a limited number of commissions each year. The commission queue is noted on the gallery page. Use the Contact page to start the conversation.",
      },
      {
        q: "How does the commission process work?",
        a: "We begin with a detailed brief — subject, size, medium, and timeline. I'll provide a quote and, once agreed, a deposit secures your place. Progress updates are shared throughout.",
      },
      {
        q: "How long does a commission take?",
        a: "Typically 4–12 weeks depending on size and complexity. Rush commissions may be possible — ask when enquiring.",
      },
    ],
  },
  {
    category: "Shipping & Care",
    items: [
      {
        q: "How are artworks packaged for shipping?",
        a: "All works are professionally packaged with archival materials, foam padding, and double-boxed for transit. Insurance is included.",
      },
      {
        q: "How do I care for an original painting?",
        a: "Keep works away from direct sunlight and humidity extremes. Do not clean the surface without consulting a conservator. A full care card is included with every purchase.",
      },
      {
        q: "Do works come with a certificate of authenticity?",
        a: "Yes. Every original artwork is accompanied by a signed certificate of authenticity with title, year, medium, and dimensions.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <section className="bg-foreground text-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeInView>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-background/40 mb-4">
              Questions
            </p>
            <h1 className="font-heading text-5xl lg:text-6xl font-semibold text-background">
              FAQ
            </h1>
          </FadeInView>
        </div>
      </section>

      <Section>
        <div className="max-w-3xl">
          {FAQS.map(({ category, items }, ci) => (
            <FadeInView key={category} delay={ci * 0.05}>
              <div className="mb-16">
                <h2 className="font-heading text-xl font-semibold mb-8 text-foreground">
                  {category}
                </h2>
                <div className="space-y-0">
                  {items.map(({ q, a }, i) => (
                    <div key={q}>
                      <div className="py-6">
                        <h3 className="font-medium text-foreground mb-3">{q}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{a}</p>
                      </div>
                      {i < items.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </div>
            </FadeInView>
          ))}

          <FadeInView>
            <div className="p-8 border border-border bg-secondary mt-8">
              <h3 className="font-heading text-lg font-semibold mb-2">Still have questions?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                If you can&apos;t find the answer you&apos;re looking for, feel free to reach out directly.
              </p>
              <Link
                href="/contact"
                className="text-sm font-medium border-b border-foreground pb-0.5 hover:opacity-70 transition-opacity"
              >
                Get in touch
              </Link>
            </div>
          </FadeInView>
        </div>
      </Section>
    </>
  );
}

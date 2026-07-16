import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import Section from "@/components/shared/Section";
import FadeInView from "@/components/shared/FadeInView";
import ContactForm from "@/components/shared/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch to enquire about an artwork, discuss a commission, or ask a question.",
};

const CONTACT_INFO = [
  { Icon: Mail, label: "Email", value: "hello@chinsart.com" },
  { Icon: MapPin, label: "Studio", value: "Available by appointment" },
  { Icon: Clock, label: "Response time", value: "Within 2–3 business days" },
];

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ContactPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const defaultSubject = params.subject;

  return (
    <>
      {/* Header */}
      <section className="bg-foreground text-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeInView>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-background/40 mb-4">
              Get in Touch
            </p>
            <h1 className="font-heading text-5xl lg:text-6xl font-semibold text-background leading-tight">
              Let&apos;s talk.
            </h1>
          </FadeInView>
        </div>
      </section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16">
          {/* Form */}
          <FadeInView direction="left">
            <h2 className="font-heading text-2xl font-semibold mb-8">Send a message</h2>
            <ContactForm defaultSubject={defaultSubject} />
          </FadeInView>

          {/* Info */}
          <FadeInView direction="right" delay={0.15}>
            <div className="space-y-8 lg:pt-14">
              <div>
                <h3 className="font-heading text-xl font-semibold mb-6">Contact details</h3>
                <div className="space-y-5">
                  {CONTACT_INFO.map(({ Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="p-2 border border-border shrink-0">
                        <Icon size={16} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-0.5">
                          {label}
                        </p>
                        <p className="text-sm text-foreground">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border border-border bg-secondary">
                <h4 className="font-heading text-base font-semibold mb-2">Commissions</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  I take on a limited number of commissions each year. Include any references,
                  dimensions, and your timeline in your message.
                </p>
              </div>

              {/* Map placeholder */}
              <div className="aspect-video bg-muted border border-border flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Studio location map</p>
              </div>
            </div>
          </FadeInView>
        </div>
      </Section>
    </>
  );
}

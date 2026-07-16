import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Section, { SectionHeader } from "@/components/shared/Section";
import FadeInView from "@/components/shared/FadeInView";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the artist behind ChinsArt — the journey, mission, and studio practice.",
};

const JOURNEY = [
  {
    year: "Early Years",
    text: "A childhood spent surrounded by colour and texture — walls covered in sketches, tables lined with paints. Art was never a choice; it was simply the language that made sense.",
  },
  {
    year: "The Studio",
    text: "Years of formal study gave structure to instinct. Oil painting became the primary medium — slow, deliberate, unforgiving in the best possible way.",
  },
  {
    year: "Today",
    text: "Each work begins with a lived experience: a place, a mood, a moment worth preserving. The studio is small, the practice is daily, and the work is deeply personal.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-foreground text-background pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeInView>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-background/40 mb-4">
              The Artist
            </p>
            <h1 className="font-heading text-5xl lg:text-7xl font-semibold text-background leading-tight max-w-3xl">
              Art made with
              <br />
              intention.
            </h1>
          </FadeInView>
        </div>
      </section>

      {/* Portrait + intro */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <FadeInView direction="left">
            <div className="relative aspect-[4/5] bg-muted overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Artist Portrait</p>
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-border -z-10" />
            </div>
          </FadeInView>

          <FadeInView direction="right" delay={0.15}>
            <p className="font-heading text-3xl lg:text-4xl font-semibold text-foreground leading-snug text-balance">
              &ldquo;I paint to understand the world, not to explain it.&rdquo;
            </p>
            <Separator className="my-8" />
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Every brushstroke carries a decision — not just about colour or form, but about
                what is worth saying and how quietly it can be said. The paintings that matter
                most are the ones that require time from the viewer.
              </p>
              <p>
                Working primarily in oils and mixed media, the focus is on creating work that
                feels both timeless and deeply rooted in the present moment.
              </p>
            </div>
          </FadeInView>
        </div>
      </Section>

      {/* Journey timeline */}
      <Section className="bg-secondary">
        <FadeInView>
          <SectionHeader label="The Path" title="Journey" />
        </FadeInView>
        <div className="space-y-12 max-w-2xl">
          {JOURNEY.map(({ year, text }, i) => (
            <FadeInView key={year} delay={i * 0.1}>
              <div className="flex gap-8">
                <div className="shrink-0 pt-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground w-24">
                    {year}
                  </p>
                </div>
                <div>
                  <Separator orientation="vertical" className="hidden" />
                  <p className="text-foreground leading-relaxed">{text}</p>
                </div>
              </div>
              {i < JOURNEY.length - 1 && <Separator className="mt-12" />}
            </FadeInView>
          ))}
        </div>
      </Section>

      {/* Mission */}
      <Section narrow>
        <FadeInView className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Mission
          </p>
          <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mb-6 text-balance">
            Art that belongs in homes, not storage.
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Every piece is created to be lived with — to change in different light, to reveal
            something new after months on a wall. The goal is not spectacle but presence.
          </p>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-medium border-b border-foreground pb-0.5 hover:gap-3 transition-all duration-200"
          >
            Explore the collection
            <ArrowRight size={15} />
          </Link>
        </FadeInView>
      </Section>
    </>
  );
}

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Section from "@/components/shared/Section";
import FadeInView from "@/components/shared/FadeInView";

export default function AboutSnippet() {
  return (
    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Image */}
        <FadeInView direction="left" className="order-last lg:order-first">
          <div className="relative aspect-[4/5] bg-muted overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Artist Portrait</p>
            </div>
            {/* Decorative border offset */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-border -z-10" />
          </div>
        </FadeInView>

        {/* Text */}
        <FadeInView direction="right" delay={0.15}>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            The Artist
          </p>
          <h2 className="font-heading text-3xl lg:text-4xl xl:text-5xl font-semibold text-foreground text-balance leading-tight">
            Crafting worlds,
            <br />
            one brushstroke
            <br />
            at a time.
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground text-base leading-relaxed max-w-md">
            <p>
              With a deep belief that art should feel personal, every work begins with a lived
              experience — a moment, a place, an emotion that refuses to be forgotten.
            </p>
            <p>
              Each piece is created in a small studio, using traditional techniques alongside
              contemporary sensibilities, resulting in artworks that are both timeless and alive.
            </p>
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 mt-8 text-sm font-medium tracking-wide border-b border-foreground pb-0.5 hover:gap-3 transition-all duration-200"
          >
            Read the full story
            <ArrowRight size={15} />
          </Link>
        </FadeInView>
      </div>
    </Section>
  );
}

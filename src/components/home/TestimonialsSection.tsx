"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Section, { SectionHeader } from "@/components/shared/Section";
import FadeInView from "@/components/shared/FadeInView";
import type { Testimonial } from "@/types";

interface Props {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: Props) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  if (testimonials.length === 0) return null;

  const current = testimonials[index];

  function go(dir: 1 | -1) {
    setDirection(dir);
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);
  }

  return (
    <Section className="bg-foreground text-background">
      <FadeInView>
        <SectionHeader
          label="What Collectors Say"
          title="Testimonials"
          center
        />
      </FadeInView>

      <div className="max-w-2xl mx-auto">
        <div className="relative min-h-[220px] flex items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 40 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-center"
            >
              <Quote
                size={36}
                className="mx-auto mb-6 text-background/20"
                aria-hidden
              />
              <p className="font-heading text-xl lg:text-2xl text-background/90 leading-relaxed italic">
                &ldquo;{current.content}&rdquo;
              </p>
              <div className="mt-6">
                <p className="font-medium text-background text-sm">{current.name}</p>
                {current.location && (
                  <p className="text-background/50 text-sm mt-0.5">{current.location}</p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="p-2 border border-background/20 hover:border-background/60 hover:bg-background/10 transition-colors rounded-none"
            >
              <ChevronLeft size={18} className="text-background/70" />
            </button>

            <div className="flex items-center gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-background" : "w-1.5 bg-background/30"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="p-2 border border-background/20 hover:border-background/60 hover:bg-background/10 transition-colors rounded-none"
            >
              <ChevronRight size={18} className="text-background/70" />
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}

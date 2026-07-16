"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Section from "@/components/shared/Section";
import FadeInView from "@/components/shared/FadeInView";
import { newsletterSchema, type NewsletterFormData } from "@/lib/validations/contact";

export default function NewsletterSection() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewsletterFormData>({ resolver: zodResolver(newsletterSchema) });

  async function onSubmit(data: NewsletterFormData) {
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong");
      setSubmitted(true);
      reset();
      toast.success("You're on the list! Thank you.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to subscribe. Try again.");
    }
  }

  return (
    <Section className="bg-cream border-t border-border">
      <FadeInView className="max-w-2xl mx-auto text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Stay Connected
        </p>
        <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground">
          New works, first
        </h2>
        <p className="mt-4 text-muted-foreground text-base max-w-md mx-auto">
          Be the first to know when new artworks are added, exhibitions are announced, or
          commissions open up.
        </p>

        {submitted ? (
          <div className="mt-10 py-6">
            <p className="font-heading text-xl text-foreground">
              Thank you for subscribing.
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              You&apos;ll hear from us when something new arrives.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <div className="flex-1">
              <Input
                {...register("email")}
                type="email"
                placeholder="your@email.com"
                className="rounded-none h-11 border-foreground/20 focus-visible:border-foreground bg-background"
                aria-label="Email address"
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1 text-left">{errors.email.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-none h-11 px-6 shrink-0"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Subscribe
                  <ArrowRight size={15} className="ml-2" />
                </>
              )}
            </Button>
          </form>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          No spam. Unsubscribe at any time.
        </p>
      </FadeInView>
    </Section>
  );
}

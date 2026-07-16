"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact";

interface ContactFormProps {
  defaultSubject?: string;
}

export default function ContactForm({ defaultSubject }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { subject: defaultSubject },
  });

  async function onSubmit(data: ContactFormData) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong");
      setSubmitted(true);
      reset();
      toast.success("Message sent! I'll be in touch soon.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="py-12 text-center">
        <p className="font-heading text-2xl font-semibold mb-3">Thank you.</p>
        <p className="text-muted-foreground">
          Your message has been received. I&apos;ll respond within 2–3 business days.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-sm border-b border-foreground pb-0.5 hover:opacity-70 transition-opacity"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Your name"
            className="rounded-none border-border/60 focus-visible:border-foreground"
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="your@email.com"
            className="rounded-none border-border/60 focus-visible:border-foreground"
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject (optional)</Label>
        <Input
          id="subject"
          {...register("subject")}
          placeholder="What is this about?"
          className="rounded-none border-border/60 focus-visible:border-foreground"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Tell me about your interest, commission idea, or any questions…"
          rows={6}
          className="rounded-none border-border/60 focus-visible:border-foreground resize-none"
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-foreground text-background text-sm font-medium tracking-wide hover:bg-foreground/90 disabled:opacity-60 disabled:pointer-events-none transition-colors flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            <Send size={15} />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}

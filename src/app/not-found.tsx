import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "404 — Page Not Found" };

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-4">
        404
      </p>
      <h1 className="font-heading text-4xl lg:text-6xl font-semibold text-foreground mb-4">
        Page Not Found
      </h1>
      <p className="text-muted-foreground max-w-sm mb-10 text-base leading-relaxed">
        The page you are looking for may have moved, been renamed, or doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium border-b border-foreground pb-0.5 hover:gap-3 transition-all duration-200"
      >
        Return Home
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

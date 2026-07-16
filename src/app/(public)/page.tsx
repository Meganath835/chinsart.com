import type { Metadata } from "next";
import { Suspense } from "react";
import HeroSection from "@/components/home/HeroSection";
import FeaturedArtworks from "@/components/home/FeaturedArtworks";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import AboutSnippet from "@/components/home/AboutSnippet";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import ArtworkCardSkeleton from "@/components/gallery/ArtworkCardSkeleton";
import { getFeaturedTestimonials } from "@/services/testimonial.service";
import Section from "@/components/shared/Section";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "ChinsArt — Original Artworks by the Artist",
  description:
    "Discover original paintings, drawings, and mixed-media artworks crafted with intention. Each piece is unique.",
};

// Revalidate home page data every hour
export const revalidate = 3600;

function ArtworkGridSkeleton() {
  return (
    <Section>
      <div className="mb-12">
        <Skeleton className="h-3 w-24 mb-3" />
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <ArtworkCardSkeleton key={i} />
        ))}
      </div>
    </Section>
  );
}

function CollectionsSkeleton() {
  return (
    <Section className="bg-secondary">
      <div className="mb-12">
        <Skeleton className="h-3 w-28 mb-3" />
        <Skeleton className="h-10 w-48 mb-4" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[180px]" />
        ))}
      </div>
    </Section>
  );
}

export default async function HomePage() {
  const testimonials = await getFeaturedTestimonials().catch(() => []);

  return (
    <>
      <HeroSection />

      <Suspense fallback={<ArtworkGridSkeleton />}>
        <FeaturedArtworks />
      </Suspense>

      <Suspense fallback={<CollectionsSkeleton />}>
        <FeaturedCollections />
      </Suspense>

      <AboutSnippet />

      {testimonials.length > 0 && (
        <TestimonialsSection
          testimonials={testimonials.map((t) => ({
            ...t,
            createdAt: t.createdAt.toISOString(),
            updatedAt: t.updatedAt.toISOString(),
          }))}
        />
      )}

      <NewsletterSection />
    </>
  );
}

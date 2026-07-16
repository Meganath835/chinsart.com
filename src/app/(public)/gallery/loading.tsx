import Section from "@/components/shared/Section";
import ArtworkCardSkeleton from "@/components/gallery/ArtworkCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function GalleryLoading() {
  return (
    <Section>
      {/* Header skeleton */}
      <div className="mb-12 lg:mb-16 space-y-3">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Filter skeleton */}
      <div className="space-y-4 mb-8">
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-20" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-44" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <ArtworkCardSkeleton key={i} />
        ))}
      </div>
    </Section>
  );
}

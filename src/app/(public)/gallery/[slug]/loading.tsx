import Section from "@/components/shared/Section";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArtworkDetailLoading() {
  return (
    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16">
        {/* Image skeleton */}
        <div className="space-y-3">
          <Skeleton className="aspect-artwork-wide w-full" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-16 h-16 shrink-0" />
            ))}
          </div>
        </div>

        {/* Meta skeleton */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-px w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-6">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
          <Skeleton className="h-12 w-full mt-4" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </Section>
  );
}

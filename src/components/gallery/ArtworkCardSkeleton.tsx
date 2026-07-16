import { Skeleton } from "@/components/ui/skeleton";

export default function ArtworkCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-artwork w-full" />
      <div className="pt-4 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

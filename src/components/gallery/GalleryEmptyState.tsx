import Link from "next/link";
import { Palette } from "lucide-react";

interface GalleryEmptyStateProps {
  hasFilters: boolean;
}

export default function GalleryEmptyState({ hasFilters }: GalleryEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <Palette size={40} className="text-muted-foreground/40 mb-6" />
      <h3 className="font-heading text-2xl font-semibold text-foreground mb-2">
        {hasFilters ? "No artworks match your filters" : "No artworks yet"}
      </h3>
      <p className="text-muted-foreground text-sm max-w-xs">
        {hasFilters
          ? "Try adjusting your search or clearing the filters."
          : "New works will appear here when they are added to the gallery."}
      </p>
      {hasFilters && (
        <Link
          href="/gallery"
          className="mt-6 text-sm font-medium border-b border-foreground pb-0.5 hover:opacity-70 transition-opacity"
        >
          Clear all filters
        </Link>
      )}
    </div>
  );
}

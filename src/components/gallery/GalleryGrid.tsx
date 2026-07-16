import { cn } from "@/lib/utils";
import ArtworkCard from "./ArtworkCard";
import type { Artwork } from "@/types";

interface GalleryGridProps {
  artworks: Artwork[];
  view: "grid" | "masonry";
}

export default function GalleryGrid({ artworks, view }: GalleryGridProps) {
  if (view === "masonry") {
    return (
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-0">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="break-inside-avoid mb-6">
            <ArtworkCard artwork={artwork} masonry />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-x-6 gap-y-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4")}>
      {artworks.map((artwork, i) => (
        <ArtworkCard key={artwork.id} artwork={artwork} priority={i < 4} />
      ))}
    </div>
  );
}

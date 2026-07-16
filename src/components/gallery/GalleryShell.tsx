"use client";

import { useState } from "react";
import { Suspense } from "react";
import GalleryFilters from "./GalleryFilters";
import GalleryGrid from "./GalleryGrid";
import GalleryPagination from "./GalleryPagination";
import GalleryEmptyState from "./GalleryEmptyState";
import ArtworkCardSkeleton from "./ArtworkCardSkeleton";
import type { Artwork, Category, PaginationMeta } from "@/types";

interface GalleryShellProps {
  artworks: Artwork[];
  categories: Category[];
  meta: PaginationMeta;
  hasFilters: boolean;
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
      {Array.from({ length: 8 }).map((_, i) => (
        <ArtworkCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function GalleryShell({
  artworks,
  categories,
  meta,
  hasFilters,
}: GalleryShellProps) {
  const [view, setView] = useState<"grid" | "masonry">("grid");

  return (
    <div className="space-y-8">
      <Suspense>
        <GalleryFilters
          categories={categories}
          view={view}
          onViewChange={setView}
        />
      </Suspense>

      {/* Result count */}
      <p className="text-sm text-muted-foreground">
        {meta.total === 0
          ? "No artworks found"
          : `${meta.total} artwork${meta.total === 1 ? "" : "s"}`}
        {hasFilters && " matching your filters"}
      </p>

      {artworks.length === 0 ? (
        <GalleryEmptyState hasFilters={hasFilters} />
      ) : (
        <>
          <GalleryGrid artworks={artworks} view={view} />
          <Suspense>
            <GalleryPagination meta={meta} />
          </Suspense>
        </>
      )}
    </div>
  );
}

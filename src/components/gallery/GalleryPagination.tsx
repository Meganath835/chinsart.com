"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/types";

interface GalleryPaginationProps {
  meta: PaginationMeta;
}

export default function GalleryPagination({ meta }: GalleryPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  if (meta.totalPages <= 1) return null;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    startTransition(() => router.push(`/gallery?${params.toString()}`));
  }

  // Build page numbers: always show first, last, and ±1 around current
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= meta.totalPages; i++) {
    if (
      i === 1 ||
      i === meta.totalPages ||
      Math.abs(i - meta.page) <= 1
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <nav
      aria-label="Gallery pagination"
      className="flex items-center justify-center gap-1 mt-16"
    >
      <button
        onClick={() => goToPage(meta.page - 1)}
        disabled={!meta.hasPrevPage}
        aria-label="Previous page"
        className="p-2 border border-border disabled:opacity-30 hover:bg-muted transition-colors disabled:pointer-events-none"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-3 text-muted-foreground select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goToPage(p as number)}
            aria-label={`Page ${p}`}
            aria-current={p === meta.page ? "page" : undefined}
            className={cn(
              "h-9 w-9 text-sm border border-border transition-colors",
              p === meta.page
                ? "bg-foreground text-background border-foreground"
                : "hover:bg-muted text-foreground"
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goToPage(meta.page + 1)}
        disabled={!meta.hasNextPage}
        aria-label="Next page"
        className="p-2 border border-border disabled:opacity-30 hover:bg-muted transition-colors disabled:pointer-events-none"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

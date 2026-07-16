"use client";

import { useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, LayoutGrid, Columns2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { debounce } from "@/utils";
import type { Category } from "@/types";

interface GalleryFiltersProps {
  categories: Category[];
  view: "grid" | "masonry";
  onViewChange: (v: "grid" | "masonry") => void;
}

export default function GalleryFilters({ categories, view, onViewChange }: GalleryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // reset pagination on filter change
    startTransition(() => router.push(`/gallery?${params.toString()}`));
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSearch = useCallback(
    debounce((value: string) => updateParam("search", value || null), 350),
    [searchParams]
  );

  const activeSearch = searchParams.get("search") ?? "";
  const activeCategory = searchParams.get("category") ?? "all";
  const activeStatus = searchParams.get("status") ?? "all";
  const activeSort = searchParams.get("sort") ?? "newest";
  const hasFilters = activeSearch || activeCategory !== "all" || activeStatus !== "all";

  function clearAll() {
    startTransition(() => router.push("/gallery"));
  }

  return (
    <div className="space-y-4">
      {/* Row 1: search + view toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            defaultValue={activeSearch}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search artworks…"
            className="pl-9 rounded-none h-10 border-border/60 focus-visible:border-foreground"
          />
        </div>

        {/* View toggle */}
        <div className="flex border border-border/60">
          <button
            onClick={() => onViewChange("grid")}
            aria-label="Grid view"
            className={cn(
              "p-2.5 transition-colors",
              view === "grid"
                ? "bg-foreground text-background"
                : "hover:bg-muted text-muted-foreground"
            )}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => onViewChange("masonry")}
            aria-label="Masonry view"
            className={cn(
              "p-2.5 border-l border-border/60 transition-colors",
              view === "masonry"
                ? "bg-foreground text-background"
                : "hover:bg-muted text-muted-foreground"
            )}
          >
            <Columns2 size={16} />
          </button>
        </div>
      </div>

      {/* Row 2: category + status + sort + clear */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={activeCategory} onValueChange={(v) => updateParam("category", v)}>
          <SelectTrigger className="w-40 rounded-none h-9 border-border/60 text-sm">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={activeStatus} onValueChange={(v) => updateParam("status", v)}>
          <SelectTrigger className="w-44 rounded-none h-9 border-border/60 text-sm">
            <SelectValue placeholder="Any status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any status</SelectItem>
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="COMMISSION_OPEN">Commission open</SelectItem>
            <SelectItem value="PRICE_ON_REQUEST">Price on request</SelectItem>
            <SelectItem value="SOLD">Sold</SelectItem>
          </SelectContent>
        </Select>

        <Select value={activeSort} onValueChange={(v) => updateParam("sort", v)}>
          <SelectTrigger className="w-36 rounded-none h-9 border-border/60 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="title">Title A–Z</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={13} />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

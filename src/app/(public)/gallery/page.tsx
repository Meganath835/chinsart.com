import type { Metadata } from "next";
import Section, { SectionHeader } from "@/components/shared/Section";
import GalleryShell from "@/components/gallery/GalleryShell";
import { getGalleryArtworks } from "@/services/artwork.service";
import { getAllCategories } from "@/services/category.service";
import { mapArtworks } from "@/lib/mappers/artwork.mapper";
import type { ArtworkStatus, GalleryFilters } from "@/types";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse original artworks — paintings, drawings, and mixed-media pieces available for acquisition.",
};

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function GalleryPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: GalleryFilters = {
    search: params.search,
    categorySlug: params.category,
    status: params.status as ArtworkStatus | undefined,
    sortBy: (params.sort as GalleryFilters["sortBy"]) ?? "newest",
    page: params.page ? parseInt(params.page, 10) : 1,
    limit: 12,
  };

  const hasFilters = !!(params.search || params.category || params.status);

  const [result, rawCategories] = await Promise.all([
    getGalleryArtworks(filters).catch(() => ({
      items: [],
      meta: { page: 1, limit: 12, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false },
    })),
    getAllCategories().catch(() => []),
  ]);

  const artworks = mapArtworks(result.items);
  const categories = rawCategories.map((c) => ({
    ...c,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  return (
    <Section>
      <SectionHeader
        label="The Collection"
        title="Gallery"
        description="Original works crafted with intention. Each piece is one of a kind."
      />
      <GalleryShell
        artworks={artworks}
        categories={categories}
        meta={result.meta}
        hasFilters={hasFilters}
      />
    </Section>
  );
}

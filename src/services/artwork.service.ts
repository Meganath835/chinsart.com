import { prisma } from "@/lib/db/prisma";
import type { GalleryFilters, PaginatedResponse } from "@/types";

// Prisma select shape — NOT as const so orderBy arrays stay mutable
function artworkSelect() {
  return {
    id: true,
    title: true,
    slug: true,
    description: true,
    price: true,
    status: true,
    medium: true,
    dimensions: true,
    year: true,
    featured: true,
    tags: true,
    categoryId: true,
    createdAt: true,
    updatedAt: true,
    category: { select: { id: true, name: true, slug: true } },
    images: {
      select: {
        id: true,
        url: true,
        key: true,
        alt: true,
        isPrimary: true,
        sortOrder: true,
        artworkId: true,
        createdAt: true,
      },
      orderBy: [
        { isPrimary: "desc" as const },
        { sortOrder: "asc" as const },
      ],
    },
  };
}

export async function getFeaturedArtworks(limit = 6) {
  return prisma.artwork.findMany({
    where: { featured: true },
    select: artworkSelect(),
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getGalleryArtworks(filters: GalleryFilters = {}) {
  const { search, categorySlug, status, sortBy = "newest", page = 1, limit = 12 } = filters;

  const where = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
        { tags: { has: search } },
      ],
    }),
    ...(categorySlug && { category: { slug: categorySlug } }),
    ...(status && { status }),
  };

  const orderBy =
    sortBy === "newest"
      ? { createdAt: "desc" as const }
      : sortBy === "oldest"
      ? { createdAt: "asc" as const }
      : { title: "asc" as const };

  const [items, total] = await Promise.all([
    prisma.artwork.findMany({
      where,
      select: artworkSelect(),
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.artwork.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  } satisfies PaginatedResponse<(typeof items)[0]>;
}

export async function getArtworkBySlug(slug: string) {
  return prisma.artwork.findUnique({
    where: { slug },
    select: artworkSelect(),
  });
}

export async function getRelatedArtworks(artworkId: string, categoryId: string | null, limit = 4) {
  return prisma.artwork.findMany({
    where: {
      id: { not: artworkId },
      ...(categoryId ? { categoryId } : {}),
    },
    select: artworkSelect(),
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

// Inferred Prisma result type — use this to avoid manual mapping
export type PrismaArtwork = Awaited<ReturnType<typeof getFeaturedArtworks>>[0];

import type { Artwork } from "@/types";
import type { PrismaArtwork } from "@/services/artwork.service";
import { getImageUrl } from "@/lib/s3/client";

export function mapArtwork(a: PrismaArtwork): Artwork {
  return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    description: a.description,
    price: a.price ? Number(a.price) : null,
    status: a.status,
    medium: a.medium,
    dimensions: a.dimensions,
    year: a.year,
    featured: a.featured,
    tags: a.tags,
    categoryId: a.categoryId,
    category: a.category
      ? {
          id: a.category.id,
          name: a.category.name,
          slug: a.category.slug,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      : null,
    images: a.images.map((img) => ({
      id: img.id,
      url: getImageUrl(img.key),
      key: img.key,
      alt: img.alt,
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder,
      artworkId: img.artworkId,
      createdAt: img.createdAt.toISOString(),
    })),
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

export function mapArtworks(artworks: PrismaArtwork[]): Artwork[] {
  return artworks.map(mapArtwork);
}

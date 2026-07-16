import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ArtworkForm from "@/components/admin/ArtworkForm";
import { getArtworkBySlug } from "@/services/artwork.service";
import { getAllCategories } from "@/services/category.service";
import { mapArtwork } from "@/lib/mappers/artwork.mapper";
import { prisma } from "@/lib/db/prisma";

interface PageProps { params: Promise<{ id: string }> }

export default async function EditArtworkPage({ params }: PageProps) {
  const { id } = await params;

  const [rawArtwork, rawCategories] = await Promise.all([
    prisma.artwork.findUnique({
      where: { id },
      select: {
        id: true, title: true, slug: true, description: true, price: true, status: true,
        medium: true, dimensions: true, year: true, featured: true, tags: true,
        categoryId: true, createdAt: true, updatedAt: true,
        category: { select: { id: true, name: true, slug: true } },
        images: { select: { id: true, url: true, key: true, alt: true, isPrimary: true, sortOrder: true, artworkId: true, createdAt: true }, orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
      },
    }).catch(() => null),
    getAllCategories().catch(() => []),
  ]);

  if (!rawArtwork) notFound();

  const artwork = mapArtwork(rawArtwork);
  const categories = rawCategories.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/artworks"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft size={14} /> Artworks
        </Link>
        <h1 className="font-heading text-2xl font-semibold">Edit Artwork</h1>
        <p className="text-sm text-muted-foreground mt-1">{artwork.title}</p>
      </div>
      <ArtworkForm artwork={artwork} categories={categories} />
    </div>
  );
}

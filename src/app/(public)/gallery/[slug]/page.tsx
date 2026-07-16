import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Section from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/Section";
import ImageLightbox from "@/components/gallery/ImageLightbox";
import ArtworkMeta from "@/components/gallery/ArtworkMeta";
import ArtworkCard from "@/components/gallery/ArtworkCard";
import { getArtworkBySlug, getRelatedArtworks } from "@/services/artwork.service";
import { mapArtwork, mapArtworks } from "@/lib/mappers/artwork.mapper";
import { getPrimaryImage, truncate } from "@/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const raw = await getArtworkBySlug(slug).catch(() => null);
  if (!raw) return { title: "Artwork not found" };

  const artwork = mapArtwork(raw);
  const imageUrl = getPrimaryImage(artwork.images);

  return {
    title: artwork.title,
    description: artwork.description
      ? truncate(artwork.description, 160)
      : `Original artwork by ChinsArt — ${artwork.title}`,
    openGraph: {
      title: artwork.title,
      description: artwork.description ? truncate(artwork.description, 160) : undefined,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 900, alt: artwork.title }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: artwork.title,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ArtworkDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const raw = await getArtworkBySlug(slug).catch(() => null);
  if (!raw) notFound();

  const artwork = mapArtwork(raw);

  const relatedRaw = await getRelatedArtworks(artwork.id, artwork.categoryId ?? null, 4).catch(
    () => []
  );
  const related = mapArtworks(relatedRaw);

  return (
    <>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Gallery
        </Link>
      </div>

      {/* Main detail layout */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-start">
          {/* Left: image(s) */}
          <div className="lg:sticky lg:top-24">
            <ImageLightbox images={artwork.images} title={artwork.title} />
          </div>

          {/* Right: metadata */}
          <ArtworkMeta artwork={artwork} />
        </div>
      </Section>

      {/* Related artworks */}
      {related.length > 0 && (
        <Section className="border-t border-border">
          <SectionHeader label="More Works" title="You May Also Like" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {related.map((a, i) => (
              <ArtworkCard key={a.id} artwork={a} priority={i < 2} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

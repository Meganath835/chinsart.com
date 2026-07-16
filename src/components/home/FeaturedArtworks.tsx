import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Section, { SectionHeader } from "@/components/shared/Section";
import FadeInView from "@/components/shared/FadeInView";
import ArtworkCard from "@/components/gallery/ArtworkCard";
import { getFeaturedArtworks } from "@/services/artwork.service";
import { mapArtworks } from "@/lib/mappers/artwork.mapper";

export default async function FeaturedArtworks() {
  const raw = await getFeaturedArtworks(6).catch(() => []);
  const artworks = mapArtworks(raw);

  if (artworks.length === 0) return null;

  return (
    <Section>
      <FadeInView>
        <SectionHeader
          label="Selected Works"
          title="Featured Collection"
          description="A curated selection of original artworks available for acquisition."
        />
      </FadeInView>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {artworks.map((artwork, i) => (
          <FadeInView key={artwork.id} delay={i * 0.08}>
            <ArtworkCard artwork={artwork} priority={i < 3} />
          </FadeInView>
        ))}
      </div>

      <FadeInView className="mt-14 text-center">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-sm font-medium tracking-wide border-b border-foreground pb-0.5 hover:gap-3 transition-all duration-200"
        >
          View All Works
          <ArrowRight size={15} />
        </Link>
      </FadeInView>
    </Section>
  );
}

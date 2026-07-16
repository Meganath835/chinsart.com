import Link from "next/link";
import { MessageSquare, Tag } from "lucide-react";
import ArtworkStatusBadge from "@/components/shared/ArtworkStatusBadge";
import ShareButton from "./ShareButton";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/utils";
import type { Artwork } from "@/types";

interface ArtworkMetaProps {
  artwork: Artwork;
}

const META_ROWS = [
  { label: "Medium", key: "medium" as const },
  { label: "Dimensions", key: "dimensions" as const },
  { label: "Year", key: "year" as const },
];

export default function ArtworkMeta({ artwork }: ArtworkMetaProps) {
  return (
    <div className="space-y-8">
      {/* Title block */}
      <div>
        {artwork.category && (
          <Link
            href={`/gallery?category=${artwork.category.slug}`}
            className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-2 block"
          >
            {artwork.category.name}
          </Link>
        )}
        <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground leading-tight">
          {artwork.title}
        </h1>
        {artwork.year && (
          <p className="text-sm text-muted-foreground mt-1">{artwork.year}</p>
        )}
      </div>

      {/* Status + price */}
      <div className="flex items-center gap-4 flex-wrap">
        <ArtworkStatusBadge status={artwork.status} />
        {artwork.price && artwork.status === "AVAILABLE" && (
          <p className="font-heading text-2xl font-semibold">
            {formatPrice(artwork.price)}
          </p>
        )}
        {artwork.status === "PRICE_ON_REQUEST" && (
          <p className="text-sm text-muted-foreground">Contact the artist for pricing.</p>
        )}
      </div>

      <Separator />

      {/* Description */}
      {artwork.description && (
        <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
          {artwork.description}
        </p>
      )}

      {/* Metadata table */}
      <div className="space-y-3">
        {META_ROWS.map(({ label, key }) =>
          artwork[key] ? (
            <div key={key} className="flex items-start gap-6">
              <span className="text-xs uppercase tracking-widest text-muted-foreground w-20 shrink-0 pt-0.5">
                {label}
              </span>
              <span className="text-sm text-foreground">{String(artwork[key])}</span>
            </div>
          ) : null
        )}
      </div>

      {/* Tags */}
      {artwork.tags.length > 0 && (
        <div className="flex items-start gap-3">
          <Tag size={14} className="text-muted-foreground mt-0.5 shrink-0" />
          <div className="flex flex-wrap gap-2">
            {artwork.tags.map((tag) => (
              <Link
                key={tag}
                href={`/gallery?search=${encodeURIComponent(tag)}`}
                className="text-xs border border-border px-2.5 py-1 hover:bg-muted transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* CTAs */}
      <div className="space-y-3">
        {(artwork.status === "AVAILABLE" ||
          artwork.status === "PRICE_ON_REQUEST" ||
          artwork.status === "COMMISSION_OPEN") && (
          <Link
            href={`/contact?subject=${encodeURIComponent(`Enquiry about "${artwork.title}"`)}`}
            className="w-full flex items-center justify-center gap-2 h-12 bg-foreground text-background text-sm font-medium tracking-wide hover:bg-foreground/90 transition-colors"
          >
            <MessageSquare size={16} />
            {artwork.status === "COMMISSION_OPEN"
              ? "Discuss a Commission"
              : "Enquire About This Piece"}
          </Link>
        )}
        <ShareButton title={artwork.title} />
      </div>
    </div>
  );
}

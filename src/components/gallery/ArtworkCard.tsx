"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getPrimaryImage, formatPrice } from "@/utils";
import ArtworkStatusBadge from "@/components/shared/ArtworkStatusBadge";
import type { Artwork } from "@/types";

interface ArtworkCardProps {
  artwork: Artwork;
  priority?: boolean;
  className?: string;
  /** Masonry mode: natural image height instead of forced aspect ratio */
  masonry?: boolean;
}

export default function ArtworkCard({
  artwork,
  priority = false,
  className,
  masonry = false,
}: ArtworkCardProps) {
  const imageUrl = getPrimaryImage(artwork.images);

  return (
    <Link href={`/gallery/${artwork.slug}`} className={cn("group block", className)}>
      <motion.article
        initial={false}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Image container */}
        <div
          className={cn(
            "relative overflow-hidden bg-muted",
            masonry ? "w-full" : "aspect-artwork"
          )}
        >
          {masonry ? (
            <Image
              src={imageUrl}
              alt={artwork.title}
              width={600}
              height={800}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <Image
              src={imageUrl}
              alt={artwork.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority={priority}
            />
          )}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
          <div className="absolute top-3 left-3">
            <ArtworkStatusBadge status={artwork.status} />
          </div>
        </div>

        {/* Meta */}
        <div className="pt-4 pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {artwork.category && (
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  {artwork.category.name}
                </p>
              )}
              <h3 className="font-heading text-lg font-semibold text-foreground truncate group-hover:text-foreground/80 transition-colors">
                {artwork.title}
              </h3>
              {(artwork.medium || artwork.year) && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {[artwork.medium, artwork.year].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
            {artwork.price && artwork.status === "AVAILABLE" && (
              <p className="text-sm font-medium text-foreground shrink-0 mt-1">
                {formatPrice(artwork.price)}
              </p>
            )}
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

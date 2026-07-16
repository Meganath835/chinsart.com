"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ArtworkImage } from "@/types";

interface ImageLightboxProps {
  images: ArtworkImage[];
  title: string;
}

export default function ImageLightbox({ images, title }: ImageLightboxProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Order so primary is first
  const sorted = [...images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return a.sortOrder - b.sortOrder;
  });

  const navigate = useCallback(
    (dir: 1 | -1) =>
      setActiveIdx((i) => (i + dir + sorted.length) % sorted.length),
    [sorted.length]
  );

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "Escape") setLightboxOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, navigate]);

  const active = sorted[activeIdx];

  return (
    <>
      {/* Main image */}
      <div className="space-y-3">
        <div
          className="relative aspect-artwork-wide bg-muted overflow-hidden cursor-zoom-in group"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={active.url}
            alt={active.alt ?? title}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            priority
          />
          <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn size={16} className="text-foreground" />
          </div>
        </div>

        {/* Thumbnail strip */}
        {sorted.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {sorted.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveIdx(i)}
                className={cn(
                  "relative shrink-0 w-16 h-16 overflow-hidden border-2 transition-colors",
                  i === activeIdx ? "border-foreground" : "border-transparent hover:border-border"
                )}
              >
                <Image
                  src={img.url}
                  alt={img.alt ?? `${title} ${i + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            {sorted.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                  className="absolute left-4 text-white/70 hover:text-white p-3"
                  aria-label="Previous"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(1); }}
                  className="absolute right-4 text-white/70 hover:text-white p-3"
                  aria-label="Next"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative w-full h-full max-w-5xl max-h-[90vh] mx-auto px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={active.url}
                alt={active.alt ?? title}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </motion.div>

            {/* Counter */}
            {sorted.length > 1 && (
              <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-xs">
                {activeIdx + 1} / {sorted.length}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import ArtworkStatusBadge from "@/components/shared/ArtworkStatusBadge";
import { getPrimaryImage, formatPrice } from "@/utils";
import type { ArtworkStatus } from "@/types";

export default async function AdminArtworksPage() {
  const artworks = await prisma.artwork
    .findMany({
      include: { category: true, images: { orderBy: [{ isPrimary: "desc" }], take: 1 } },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Artworks</h1>
          <p className="text-sm text-muted-foreground mt-1">{artworks.length} total</p>
        </div>
        <Link
          href="/admin/artworks/new"
          className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          <Plus size={15} />
          Add Artwork
        </Link>
      </div>

      <div className="bg-background border border-border overflow-hidden">
        {artworks.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground text-sm mb-4">No artworks yet.</p>
            <Link href="/admin/artworks/new" className="text-sm font-medium border-b border-foreground pb-0.5">
              Add your first artwork
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-widest w-16">Image</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-widest">Title</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-widest hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-widest hidden lg:table-cell">Price</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {artworks.map((artwork) => {
                const imgUrl = artwork.images[0]?.url ?? null;
                return (
                  <tr key={artwork.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="relative w-12 h-12 bg-muted overflow-hidden shrink-0">
                        {imgUrl && (
                          <Image src={imgUrl} alt={artwork.title} fill sizes="48px" className="object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium max-w-xs">
                      <p className="truncate">{artwork.title}</p>
                      {artwork.year && <p className="text-xs text-muted-foreground">{artwork.year}</p>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {artwork.category?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {artwork.price ? formatPrice(Number(artwork.price)) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <ArtworkStatusBadge status={artwork.status as ArtworkStatus} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/artworks/${artwork.id}/edit`}
                        className="inline-flex items-center justify-center p-1.5 hover:bg-muted rounded-none transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil size={14} className="text-muted-foreground" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ArtworkForm from "@/components/admin/ArtworkForm";
import { getAllCategories } from "@/services/category.service";

export default async function NewArtworkPage() {
  const rawCategories = await getAllCategories().catch(() => []);
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
        <h1 className="font-heading text-2xl font-semibold">Add Artwork</h1>
      </div>
      <ArtworkForm categories={categories} />
    </div>
  );
}

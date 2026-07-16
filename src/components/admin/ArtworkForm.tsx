"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUploader, { type UploadedImage } from "./ImageUploader";
import { artworkSchema, type ArtworkFormData } from "@/lib/validations/artwork";
import type { Artwork, Category } from "@/types";

interface ArtworkFormProps {
  artwork?: Artwork;
  categories: Category[];
}

export default function ArtworkForm({ artwork, categories }: ArtworkFormProps) {
  const router = useRouter();
  const isEdit = !!artwork;

  const [images, setImages] = useState<UploadedImage[]>(
    artwork?.images.map((img) => ({ key: img.key, url: img.url, isPrimary: img.isPrimary })) ?? []
  );
  const [deleting, setDeleting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ArtworkFormData>({
    resolver: zodResolver(artworkSchema),
    defaultValues: {
      title: artwork?.title ?? "",
      description: artwork?.description ?? "",
      price: artwork?.price ? Number(artwork.price) : undefined,
      status: artwork?.status ?? "AVAILABLE",
      medium: artwork?.medium ?? "",
      dimensions: artwork?.dimensions ?? "",
      year: artwork?.year ?? new Date().getFullYear(),
      featured: artwork?.featured ?? false,
      tags: artwork?.tags ?? [],
      categoryId: artwork?.categoryId ?? null,
    },
  });

  const tags = watch("tags");

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,$/, "");
      if (newTag && !tags.includes(newTag)) {
        setValue("tags", [...tags, newTag]);
      }
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setValue("tags", tags.filter((t) => t !== tag));
  }

  async function onSubmit(data: ArtworkFormData) {
    if (images.length === 0) { toast.error("Upload at least one image"); return; }

    const payload = { ...data, images };
    const url = isEdit ? `/api/admin/artworks/${artwork.id}` : "/api/admin/artworks";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to save");
      toast.success(isEdit ? "Artwork updated" : "Artwork created");
      router.push("/admin/artworks");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function handleDelete() {
    if (!artwork || !confirm("Delete this artwork? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/artworks/${artwork.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Artwork deleted");
      router.push("/admin/artworks");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      {/* Images */}
      <div className="space-y-2">
        <Label>Images <span className="text-destructive">*</span></Label>
        <ImageUploader value={images} onChange={setImages} />
      </div>

      {/* Title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
          <Input id="title" {...register("title")} className="rounded-none" />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="SOLD">Sold</SelectItem>
                  <SelectItem value="PRICE_ON_REQUEST">Price on Request</SelectItem>
                  <SelectItem value="COMMISSION_OPEN">Commission Open</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select value={field.value ?? "none"} onValueChange={(v) => field.onChange(v === "none" ? null : v)}>
                <SelectTrigger className="rounded-none">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input id="price" type="number" min={0} {...register("price", { valueAsNumber: true })} className="rounded-none" placeholder="Leave blank for 'Price on Request'" />
          {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input id="year" type="number" min={1800} max={new Date().getFullYear()} {...register("year")} className="rounded-none" />
          {errors.year && <p className="text-xs text-destructive">{errors.year.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="medium">Medium</Label>
          <Input id="medium" {...register("medium")} placeholder="Oil on canvas" className="rounded-none" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dimensions">Dimensions</Label>
          <Input id="dimensions" {...register("dimensions")} placeholder="60 × 80 cm" className="rounded-none" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} rows={5} className="rounded-none resize-none" />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 text-xs border border-border px-2 py-0.5">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">×</button>
            </span>
          ))}
        </div>
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={addTag}
          placeholder="Type a tag and press Enter"
          className="rounded-none"
        />
        <p className="text-xs text-muted-foreground">Press Enter or comma to add each tag</p>
      </div>

      {/* Featured */}
      <div className="flex items-center gap-3">
        <input type="checkbox" id="featured" {...register("featured")} className="w-4 h-4" />
        <Label htmlFor="featured" className="cursor-pointer">Feature this artwork on the home page</Label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 bg-foreground text-background px-6 h-10 text-sm font-medium hover:bg-foreground/90 disabled:opacity-60 disabled:pointer-events-none transition-colors"
        >
          {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {isEdit ? "Save Changes" : "Create Artwork"}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 border border-destructive text-destructive px-5 h-10 text-sm font-medium hover:bg-destructive/10 disabled:opacity-60 disabled:pointer-events-none transition-colors"
          >
            {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            Delete
          </button>
        )}
      </div>
    </form>
  );
}

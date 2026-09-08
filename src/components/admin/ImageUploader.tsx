"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface UploadedImage {
  key: string;
  url: string;
  isPrimary: boolean;
}

interface ImageUploaderProps {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File): Promise<UploadedImage | null> => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Failed to upload image");

        const { key, url } = json.data;

        return { key, url, isPrimary: value.length === 0 };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        console.error("[uploadFile]", msg);
        toast.error(msg);
        return null;
      }
    },
    [value.length]
  );

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const valid = Array.from(files).filter((f) => allowed.includes(f.type));
    if (valid.length === 0) { toast.error("Only JPEG, PNG and WebP images are allowed"); return; }

    setUploading(true);
    const results = await Promise.all(valid.map(uploadFile));
    const uploaded = results.filter((r): r is UploadedImage => r !== null);

    if (uploaded.length > 0) {
      // If no primary yet, make first upload the primary
      const current = [...value, ...uploaded];
      const hasPrimary = current.some((img) => img.isPrimary);
      if (!hasPrimary && current.length > 0) current[0].isPrimary = true;
      onChange(current);
      toast.success(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded`);
    }
    setUploading(false);
  }

  function setPrimary(key: string) {
    onChange(value.map((img) => ({ ...img, isPrimary: img.key === key })));
  }

  function remove(key: string) {
    const remaining = value.filter((img) => img.key !== key);
    if (remaining.length > 0 && !remaining.some((img) => img.isPrimary)) {
      remaining[0].isPrimary = true;
    }
    onChange(remaining);
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-none p-10 text-center cursor-pointer transition-colors",
          dragOver ? "border-foreground bg-muted" : "border-border hover:border-foreground/40"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Uploading…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={24} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drop images here or <span className="text-foreground font-medium">click to browse</span>
            </p>
            <p className="text-xs text-muted-foreground/60">JPEG, PNG, WebP — multiple allowed</p>
          </div>
        )}
      </div>

      {/* Uploaded images */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {value.map((img) => (
            <div key={img.key} className="relative group aspect-square bg-muted overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="absolute inset-0 w-full h-full object-cover" />

              {/* Primary star */}
              <button
                type="button"
                onClick={() => setPrimary(img.key)}
                title={img.isPrimary ? "Primary image" : "Set as primary"}
                className={cn(
                  "absolute top-1 left-1 p-0.5 transition-opacity",
                  img.isPrimary ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
              >
                <Star
                  size={14}
                  className={img.isPrimary ? "fill-amber-400 text-amber-400" : "text-white"}
                />
              </button>

              {/* Remove */}
              <button
                type="button"
                onClick={() => remove(img.key)}
                title="Remove image"
                className="absolute top-1 right-1 p-0.5 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>

              {img.isPrimary && (
                <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] text-center py-0.5">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

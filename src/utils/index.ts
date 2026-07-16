import type { ArtworkStatus } from "@/types";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatPrice(price: number | string | null | undefined): string {
  if (price == null) return "";
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function getStatusLabel(status: ArtworkStatus): string {
  const labels: Record<ArtworkStatus, string> = {
    AVAILABLE: "Available",
    SOLD: "Sold",
    PRICE_ON_REQUEST: "Price on Request",
    COMMISSION_OPEN: "Commission Open",
  };
  return labels[status];
}

export function getStatusColor(status: ArtworkStatus): string {
  const colors: Record<ArtworkStatus, string> = {
    AVAILABLE: "text-emerald-700 bg-emerald-50 border-emerald-200",
    SOLD: "text-rose-700 bg-rose-50 border-rose-200",
    PRICE_ON_REQUEST: "text-amber-700 bg-amber-50 border-amber-200",
    COMMISSION_OPEN: "text-sky-700 bg-sky-50 border-sky-200",
  };
  return colors[status];
}

export function getPrimaryImage(images: { url: string; isPrimary: boolean }[]): string {
  return images.find((img) => img.isPrimary)?.url ?? images[0]?.url ?? "/placeholder.jpg";
}

export function truncate(text: string, length = 150): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(fn: T, ms = 300) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

import { cn } from "@/lib/utils";

export default function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin",
        className
      )}
    />
  );
}

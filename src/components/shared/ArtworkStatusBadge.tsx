import { cn } from "@/lib/utils";
import { getStatusLabel, getStatusColor } from "@/utils";
import type { ArtworkStatus } from "@/types";

interface Props {
  status: ArtworkStatus;
  className?: string;
}

export default function ArtworkStatusBadge({ status, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getStatusColor(status),
        className
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
}

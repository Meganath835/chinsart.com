"use client";

import { Share2 } from "lucide-react";

export default function ShareButton({ title }: { title: string }) {
  function handleShare() {
    if (typeof navigator === "undefined") return;
    if (navigator.share) {
      navigator.share({ title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="w-full flex items-center justify-center gap-2 h-10 border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
    >
      <Share2 size={15} />
      Share
    </button>
  );
}

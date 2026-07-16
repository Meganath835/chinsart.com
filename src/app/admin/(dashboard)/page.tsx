import Link from "next/link";
import { Image, FolderOpen, MessageSquare, Users, ArrowRight, Plus } from "lucide-react";
import { getDashboardStats } from "@/services/dashboard.service";
import { getStatusLabel } from "@/utils";
import ArtworkStatusBadge from "@/components/shared/ArtworkStatusBadge";
import type { ArtworkStatus, MessageStatus } from "@/types";

const STAT_COLORS: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
};

const MESSAGE_STATUS_CLASSES: Record<MessageStatus, string> = {
  UNREAD: "bg-blue-100 text-blue-700",
  READ: "bg-muted text-muted-foreground",
  REPLIED: "bg-emerald-100 text-emerald-700",
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats().catch(() => null);

  const statCards = stats
    ? [
        { label: "Total Artworks", value: stats.totalArtworks, Icon: Image, color: "blue", href: "/admin/artworks" },
        { label: "Available", value: stats.availableArtworks, Icon: Image, color: "green", href: "/admin/artworks" },
        { label: "Unread Messages", value: stats.unreadMessages, Icon: MessageSquare, color: "amber", href: "/admin/messages" },
        { label: "Subscribers", value: stats.totalSubscribers, Icon: Users, color: "purple", href: "/admin/subscribers" },
      ]
    : [];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back. Here&apos;s what&apos;s happening.</p>
        </div>
        <Link
          href="/admin/artworks/new"
          className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          <Plus size={15} />
          Add Artwork
        </Link>
      </div>

      {/* Stats */}
      {stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, value, Icon, color, href }) => (
            <Link
              key={label}
              href={href}
              className="bg-background border border-border p-6 hover:border-foreground/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 border ${STAT_COLORS[color]}`}>
                  <Icon size={16} />
                </div>
              </div>
              <p className="text-2xl font-semibold font-heading">{value}</p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">{label}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-6 border border-border bg-background text-sm text-muted-foreground">
          Connect your database to see statistics.
        </div>
      )}

      {/* Recent activity */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent artworks */}
          <div className="bg-background border border-border">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-medium text-sm">Recent Artworks</h2>
              <Link href="/admin/artworks" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {stats.recentArtworks.length === 0 ? (
                <p className="px-6 py-4 text-sm text-muted-foreground">No artworks yet.</p>
              ) : (
                stats.recentArtworks.map((a) => (
                  <div key={a.id} className="px-6 py-3 flex items-center justify-between gap-4">
                    <Link
                      href={`/admin/artworks/${a.id}/edit`}
                      className="text-sm font-medium hover:underline truncate"
                    >
                      {a.title}
                    </Link>
                    <ArtworkStatusBadge status={a.status as ArtworkStatus} className="shrink-0" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent messages */}
          <div className="bg-background border border-border">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-medium text-sm">Recent Messages</h2>
              <Link href="/admin/messages" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {stats.recentMessages.length === 0 ? (
                <p className="px-6 py-4 text-sm text-muted-foreground">No messages yet.</p>
              ) : (
                stats.recentMessages.map((m) => (
                  <div key={m.id} className="px-6 py-3 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{m.subject ?? m.email}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${MESSAGE_STATUS_CLASSES[m.status as MessageStatus]}`}>
                      {m.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

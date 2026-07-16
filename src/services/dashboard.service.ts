import { prisma } from "@/lib/db/prisma";

export async function getDashboardStats() {
  const [
    totalArtworks,
    availableArtworks,
    soldArtworks,
    totalCategories,
    unreadMessages,
    totalSubscribers,
    recentArtworks,
    recentMessages,
  ] = await Promise.all([
    prisma.artwork.count(),
    prisma.artwork.count({ where: { status: "AVAILABLE" } }),
    prisma.artwork.count({ where: { status: "SOLD" } }),
    prisma.category.count(),
    prisma.contactMessage.count({ where: { status: "UNREAD" } }),
    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    prisma.artwork.findMany({
      select: { id: true, title: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.contactMessage.findMany({
      select: { id: true, name: true, email: true, subject: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    totalArtworks,
    availableArtworks,
    soldArtworks,
    totalCategories,
    unreadMessages,
    totalSubscribers,
    recentArtworks: recentArtworks.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() })),
    recentMessages: recentMessages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() })),
  };
}

import { prisma } from "@/lib/db/prisma";

export async function getFeaturedTestimonials(limit = 6) {
  return prisma.testimonial.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

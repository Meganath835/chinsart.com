import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Section, { SectionHeader } from "@/components/shared/Section";
import FadeInView from "@/components/shared/FadeInView";
import { getAllCategories } from "@/services/category.service";

export default async function FeaturedCollections() {
  const categories = await getAllCategories().catch(() => []);
  const active = categories.filter((c) => (c._count?.artworks ?? 0) > 0).slice(0, 4);

  if (active.length === 0) return null;

  return (
    <Section className="bg-secondary">
      <FadeInView>
        <SectionHeader
          label="Browse by Theme"
          title="Collections"
          description="Explore artworks organised by medium, theme, and style."
        />
      </FadeInView>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {active.map((cat, i) => (
          <FadeInView key={cat.id} delay={i * 0.1}>
            <Link
              href={`/gallery?category=${cat.slug}`}
              className="group block p-8 border border-border bg-background hover:bg-accent transition-colors duration-300"
            >
              <div className="flex flex-col justify-between h-full min-h-[180px]">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                    {cat._count?.artworks ?? 0} works
                  </p>
                  <h3 className="font-heading text-2xl font-semibold text-foreground group-hover:text-foreground/80 transition-colors">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </div>
                <ArrowRight
                  size={18}
                  className="mt-6 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200"
                />
              </div>
            </Link>
          </FadeInView>
        ))}
      </div>
    </Section>
  );
}

import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  narrow?: boolean;
}

export default function Section({ children, className, id, narrow }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "px-6 lg:px-8 py-20 lg:py-28",
        narrow ? "max-w-3xl mx-auto" : "max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  label,
  title,
  description,
  center = false,
}: {
  label?: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("mb-12 lg:mb-16", center && "text-center")}>
      {label && (
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          {label}
        </p>
      )}
      <h2 className="font-heading text-3xl lg:text-4xl xl:text-5xl font-semibold text-foreground text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-muted-foreground text-base lg:text-lg max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

import Link from "next/link";
import { Globe, Share2, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const FOOTER_LINKS = [
  {
    heading: "Explore",
    links: [
      { href: "/gallery", label: "Gallery" },
      { href: "/about", label: "About" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    heading: "Support",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
    ],
  },
];

const SOCIAL_LINKS = [
  { href: "https://instagram.com", label: "Instagram", Icon: Globe },
  { href: "https://twitter.com", label: "Twitter / X", Icon: Share2 },
  { href: "mailto:hello@chinsart.com", label: "Email", Icon: Mail },
];

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="font-heading text-2xl font-semibold">
              ChinsArt
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Original artworks crafted with intention. Each piece tells a story
              waiting to find its home.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map(({ heading, links }) => (
            <div key={heading}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-4">
                {heading}
              </h3>
              <ul className="flex flex-col gap-3">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-border" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ChinsArt. All rights reserved.</p>
          <p>Handcrafted with care.</p>
        </div>
      </div>
    </footer>
  );
}

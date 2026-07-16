import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "ChinsArt — Original Artworks by the Artist",
    template: "%s | ChinsArt",
  },
  description:
    "Discover original paintings, drawings, and mixed-media artworks. Each piece is a unique expression of vision and craft.",
  keywords: ["art gallery", "original artworks", "paintings", "buy art", "artist"],
  authors: [{ name: "ChinsArt" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "ChinsArt",
    title: "ChinsArt — Original Artworks",
    description: "Discover original paintings, drawings, and mixed-media artworks.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "ChinsArt Gallery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChinsArt — Original Artworks",
    description: "Discover original paintings, drawings, and mixed-media artworks.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}

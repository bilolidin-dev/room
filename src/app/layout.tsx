import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/300-italic.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import { SITE } from "@/config/site";

const siteUrl =
  SITE.url ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const description =
  "Частная резиденция — интерьер спальни в четырёх фотореалистичных ракурсах от HERMITAGE · дизайн интерьера.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Частная резиденция — интерьер спальни | HERMITAGE",
  description,
  openGraph: {
    title: "Частная резиденция — интерьер спальни",
    description,
    siteName: SITE.studioFull,
    type: "website",
    images: [{ url: "/images/bedroom/angle-01.jpg", width: 1080, height: 810, alt: "Интерьер спальни от HERMITAGE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Частная резиденция — интерьер спальни",
    description,
    images: ["/images/bedroom/angle-01.jpg"],
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#20201e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link
          rel="preload"
          as="image"
          type="image/avif"
          href="/images/bedroom/optimized/angle-01-1080.avif"
          imageSrcSet="/images/bedroom/optimized/angle-01-480.avif 480w, /images/bedroom/optimized/angle-01-768.avif 768w, /images/bedroom/optimized/angle-01-1080.avif 1080w"
          imageSizes="100vw"
          fetchPriority="high"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/300-italic.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import { SEO, SITE, SITE_URL } from "@/config/site";

const verification: Metadata["verification"] = {
  ...(SEO.googleVerification && { google: SEO.googleVerification }),
  ...(SEO.yandexVerification && { yandex: SEO.yandexVerification }),
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SEO.title,
  description: SEO.description,
  keywords: [...SEO.keywords],
  applicationName: SITE.studioFull,
  authors: [{ name: SITE.studio, url: SITE_URL }],
  creator: SITE.studio,
  publisher: SITE.studio,
  category: "design",
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: SITE.studioFull,
    title: SEO.shortTitle,
    description: SEO.description,
    images: [SEO.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.shortTitle,
    description: SEO.description,
    images: [SEO.ogImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(Object.keys(verification).length > 0 && { verification }),
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

import type { MetadataRoute } from "next";
import { SEO, SITE } from "@/config/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.project} — ${SITE.studioFull}`,
    short_name: SITE.studio,
    description: SEO.description,
    lang: "ru",
    start_url: "/",
    display: "standalone",
    background_color: "#20201e",
    theme_color: "#20201e",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

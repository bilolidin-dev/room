import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { IMAGES, ROOM_VIEWS } from "@/data/views";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      // Image sitemap entries help the renders show up in Google / Yandex image search.
      images: ROOM_VIEWS.map((v) => `${SITE_URL}${IMAGES[v.id].original}`),
    },
  ];
}

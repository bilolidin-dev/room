import Experience from "@/components/Experience";
import { SEO, SITE, SITE_URL } from "@/config/site";
import { IMAGES, ROOM_VIEWS } from "@/data/views";

const orgId = `${SITE_URL}/#organization`;
const pageId = `${SITE_URL}/#webpage`;

// Structured data (schema.org) for Google / Yandex: who made it, what the page is,
// and which images belong to the project.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": orgId,
      name: SITE.studio,
      alternateName: SITE.studioFull,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/apple-icon.png`,
      description: "Студия дизайна интерьера",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE.studioFull,
      inLanguage: "ru-RU",
      publisher: { "@id": orgId },
    },
    {
      "@type": ["WebPage", "ImageGallery"],
      "@id": pageId,
      url: `${SITE_URL}/`,
      name: SEO.title,
      description: SEO.description,
      inLanguage: "ru-RU",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      primaryImageOfPage: { "@id": `${SITE_URL}/#image-${ROOM_VIEWS[0].id}` },
      about: {
        "@type": "CreativeWork",
        name: `${SITE.project} — ${SITE.category.toLowerCase()}`,
        genre: "Дизайн интерьера",
        creator: { "@id": orgId },
        keywords: SEO.keywords.join(", "),
      },
      image: ROOM_VIEWS.map((v) => ({
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#image-${v.id}`,
        contentUrl: `${SITE_URL}${IMAGES[v.id].original}`,
        width: IMAGES[v.id].width,
        height: IMAGES[v.id].height,
        name: `Ракурс ${v.number} — ${v.title}`,
        caption: v.caption,
        description: v.alt,
        creator: { "@id": orgId },
        copyrightHolder: { "@id": orgId },
      })),
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Experience />
    </>
  );
}

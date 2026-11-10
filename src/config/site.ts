/**
 * Site configuration.
 *
 * WhatsApp contact number — set NEXT_PUBLIC_WHATSAPP_NUMBER in `.env.local`
 * (or in your hosting provider's environment variables) using international
 * format, digits only, e.g. 996555123456. No number is hard-coded here.
 *
 * If the variable is empty, the CTA opens WhatsApp's share picker with the
 * pre-filled message so the button still works during review.
 */
export const SITE = {
  studio: "HERMITAGE",
  studioFull: "HERMITAGE · дизайн интерьера",
  project: "Частная резиденция",
  category: "Интерьер спальни",
  presentation: "Визуализация интерьера спальни",
  url: process.env.NEXT_PUBLIC_SITE_URL || "",
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, ""),
  whatsappMessage:
    "Здравствуйте, HERMITAGE! Мне понравилась презентация спальни «Частная резиденция». Хочу обсудить свой проект.",
} as const;

/**
 * Absolute site URL used for canonical links, sitemap and social previews.
 * Order: NEXT_PUBLIC_SITE_URL → Vercel production domain → localhost (dev only).
 */
export const SITE_URL = (
  SITE.url ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/+$/, "");

export const SEO = {
  title: "Частная резиденция — дизайн интерьера спальни | HERMITAGE",
  shortTitle: "Частная резиденция — интерьер спальни",
  description:
    "Дизайн интерьера спальни в классическом стиле от студии HERMITAGE: молдинги, кровать с мягкой обивкой, встроенный гардероб и пол «ёлочкой». Четыре фотореалистичных ракурса, обзор деталей и галерея.",
  keywords: [
    "дизайн интерьера спальни",
    "интерьер спальни",
    "дизайн спальни",
    "спальня в классическом стиле",
    "молдинги в спальне",
    "визуализация интерьера",
    "дизайн интерьера частной резиденции",
    "HERMITAGE дизайн интерьера",
  ],
  ogImage: { url: "/og-image.jpg", width: 1200, height: 630, alt: "Интерьер спальни «Частная резиденция» — HERMITAGE" },
  googleVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  yandexVerification: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || "",
} as const;

export function whatsappHref(): string {
  const text = encodeURIComponent(SITE.whatsappMessage);
  return SITE.whatsappNumber
    ? `https://wa.me/${SITE.whatsappNumber}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

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

export function whatsappHref(): string {
  const text = encodeURIComponent(SITE.whatsappMessage);
  return SITE.whatsappNumber
    ? `https://wa.me/${SITE.whatsappNumber}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

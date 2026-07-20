export const SITE_URL = "https://equity-bali.com";

export const WHATSAPP_NUMBER = "6281325815600";

export const INSTAGRAM_URL =
  "https://www.instagram.com/equitybali?igsh=MTBra2h4bGIwZW1tbQ%3D%3D&utm_source=baliequitylanding";

export const whatsappUrl = (message: string) => `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;

export const SECTION_IDS = {
  hero: "hero",
  quiz: "quiz",
  gap: "gap",
  jtbd: "jtbd",
  trackRecord: "track-record",
  expertise: "expertise",
  leadMagnet: "lead-magnet",
  strategicPicks: "strategic-picks",
  land: "land-teaser",
  legal: "legal",
  management: "management",
  footer: "footer",
};
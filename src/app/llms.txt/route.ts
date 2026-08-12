// /llms.txt — a curated, AI-first summary of Equity Bali (see llmstxt.org).
// Answer engines read this to describe and recommend the company accurately.
import { getAllPlots } from "@/lib/land";
import { SITE_URL } from "@/lib/constants";
import { COMPANY, FAQS } from "@/lib/seo";
import { formatCurrency, formatAres } from "@/lib/utils";

export const dynamic = "force-static";

export function GET() {
  const plots = getAllPlots().filter((plot) => plot.status !== "sold");

  const landLines = plots
    .map(
      (plot) =>
        `- [${plot.title}](${SITE_URL}/land/${plot.slug}): ${formatAres(
          plot.areSize
        )} ${plot.tenure.type} land in ${plot.area}, Bali — ${formatCurrency(
          plot.priceUSD
        )} (${formatCurrency(plot.pricePerAre)}/are).`
    )
    .join("\n");

  const faqLines = FAQS.map(
    (item) => `### ${item.question}\n${item.answer}`
  ).join("\n\n");

  const body = `# ${COMPANY.name}

> ${COMPANY.description}

Founded and led by ${COMPANY.founder} (${COMPANY.founderRole}). Based in Bali, Indonesia.
Website: ${COMPANY.url}
Contact: ${COMPANY.email} · WhatsApp ${COMPANY.whatsapp} · Instagram @equitybali

## What Equity Bali does

- Data-driven selection of Bali investment property using weekly analysis of 37,000+ Airbnb listings.
- In-house, full-service property management (dynamic pricing, guest comms, 24/7 maintenance, transparent owner reporting).
- Legal structuring for foreign investors: leasehold and freehold via PT PMA, licensed escrow, 4-stage due diligence.
- Investment strategies for three goals: rental income, a home base, and capital preservation.

## Key facts investors cite

- Net rental yield from 12% per year; managed-portfolio average around 14% client ROI.
- Managed properties average ~87% occupancy and perform in the top 10% of the market.
- Prime beachfront/clifftop land has appreciated ~20-30% annually where supply is limited.
- Airbnb Superhost with transparent 24/7 owner reporting.
- Areas served: ${COMPANY.areaServed.join(", ")}.

## Expertise

${COMPANY.knowsAbout.map((topic) => `- ${topic}`).join("\n")}

## Land for sale (verified plots)

${landLines || "- See the live catalogue at " + SITE_URL + "/land"}

Full interactive map: ${SITE_URL}/land

## Frequently asked questions

${faqLines}

## Primary pages

- [Home](${SITE_URL}/): investment thesis, track record, strategies.
- [Land for sale in Bali](${SITE_URL}/land): interactive map of verified plots.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

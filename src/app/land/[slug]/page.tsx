import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPlots, getPlotBySlug, getSimilarPlots } from "@/lib/land";
import { SITE_URL } from "@/lib/constants";
import { organizationSchema } from "@/lib/seo";
import { formatAres, formatCurrency } from "@/lib/utils";
import { REGION_LABELS } from "@/lib/landConstants";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/land/Breadcrumbs";
import { LandGallery } from "@/components/land/LandGallery";
import { LandFactsGrid } from "@/components/land/LandFactsGrid";
import { LandDetailMap } from "@/components/land/LandDetailMap";
import { SimilarPlots } from "@/components/land/SimilarPlots";
import { StickyWhatsAppCTA } from "@/components/land/StickyWhatsAppCTA";
import { FooterSection } from "@/components/sections/FooterSection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPlots().map((plot) => ({ slug: plot.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const plot = getPlotBySlug(slug);
  if (!plot) return {};
  const title = `${plot.title} — Land for Sale in ${plot.area} | Equity Bali`;
  const description = `${formatAres(plot.areSize)} of ${plot.tenure.type} land in ${plot.area} for ${formatCurrency(plot.priceUSD)} (${formatCurrency(plot.pricePerAre)}/are). Verified zoning and title.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/land/${plot.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: plot.images[0] }],
    },
  };
}

export default async function LandDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const plot = getPlotBySlug(slug);
  if (!plot) notFound();

  const similar = getSimilarPlots(plot);
  const sold = plot.status === "sold";

  const listing = {
    "@type": "RealEstateListing",
    "@id": `${SITE_URL}/land/${plot.slug}#listing`,
    name: plot.title,
    url: `${SITE_URL}/land/${plot.slug}`,
    image: plot.images.map((image) =>
      image.startsWith("http") ? image : `${SITE_URL}${image}`
    ),
    description: plot.description,
    datePosted: plot.publishedAt,
    broker: { "@id": `${SITE_URL}/#organization` },
    floorSize: {
      "@type": "QuantitativeValue",
      value: plot.sqm,
      unitCode: "MTK",
      unitText: "m²",
    },
    offers: {
      "@type": "Offer",
      price: plot.priceUSD,
      priceCurrency: "USD",
      seller: { "@id": `${SITE_URL}/#organization` },
      availability: sold
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
    },
    spatialCoverage: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: plot.area,
        addressRegion: "Bali",
        addressCountry: "ID",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: plot.coordinates.lat,
        longitude: plot.coordinates.lng,
      },
    },
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Land", item: `${SITE_URL}/land` },
      {
        "@type": "ListItem",
        position: 3,
        name: plot.title,
        item: `${SITE_URL}/land/${plot.slug}`,
      },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [organizationSchema(), listing, breadcrumb],
  };

  return (
    <main className="pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <Breadcrumbs
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Land", href: "/land" },
            { label: plot.title },
          ]}
        />

        <div className="mt-4 lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">
          <div className="space-y-8 pb-24 lg:pb-12">
            <LandGallery plot={plot} />

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge label={REGION_LABELS[plot.region]} variant="blue" />
                {plot.featured && !sold && <Badge label="Featured" />}
              </div>
              <h1 className="mt-3 font-heading text-3xl font-bold text-primary-white md:text-4xl">
                {plot.title}
              </h1>
              <p className="mt-2 text-muted">{plot.area}, Bali</p>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-1">
                <span className="font-heading text-3xl font-bold text-primary-white">
                  {formatCurrency(plot.priceUSD)}
                </span>
                <span className="text-lg text-accent-gold">
                  {formatCurrency(plot.pricePerAre)}/are
                </span>
                <span className="text-muted">{formatAres(plot.areSize)}</span>
              </div>
            </div>

            <LandFactsGrid plot={plot} />

            <div>
              <h2 className="font-heading text-2xl font-bold text-primary-white">
                About this land
              </h2>
              <p className="mt-3 leading-relaxed whitespace-pre-line text-primary-white/80">
                {plot.description}
              </p>
            </div>

            <div>
              <h2 className="mb-4 font-heading text-2xl font-bold text-primary-white">
                Location
              </h2>
              <LandDetailMap plot={plot} />
            </div>

            {plot.investmentNote && (
              <div className="rounded-2xl border border-accent-gold/30 bg-accent-gold/5 p-6">
                <h2 className="font-heading text-xl font-bold text-accent-gold">
                  Investment angle
                </h2>
                <p className="mt-2 leading-relaxed text-primary-white/90">
                  {plot.investmentNote}
                </p>
              </div>
            )}

            <SimilarPlots plots={similar} />
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <StickyWhatsAppCTA plot={plot} />
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile fixed CTA renders itself; aside above covers desktop */}
      <div className="lg:hidden">
        <StickyWhatsAppCTA plot={plot} />
      </div>

      <FooterSection />
    </main>
  );
}

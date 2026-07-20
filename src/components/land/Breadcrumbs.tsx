import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SITE_URL } from "@/lib/constants";

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `${SITE_URL}${crumb.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {crumbs.map((crumb, index) => (
        <span key={crumb.label} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="h-3 w-3" />}
          {crumb.href ? (
            <Link
              href={crumb.href}
              className="transition-colors hover:text-accent-gold"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-primary-white/80">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

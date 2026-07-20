"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { whatsappUrl } from "@/lib/constants";
import { track } from "@/lib/analytics";
import type { LandPlotComputed } from "@/types/land";

export function StickyWhatsAppCTA({ plot }: { plot: LandPlotComputed }) {
  const sold = plot.status === "sold";
  const message = sold
    ? `Hi! I saw the sold plot "${plot.title}" (${plot.slug}) on your site. Do you have similar land available?`
    : `Hi! I'm interested in the land plot "${plot.title}" (${plot.slug}) — ${formatCurrency(plot.priceUSD)}. Is it still available?`;

  const onClick = () =>
    track({
      name: "lead_submitted",
      props: { source: "land_detail", channel: "whatsapp", plot: plot.slug },
    });

  return (
    <>
      {/* Desktop: inline block in the sidebar */}
      <div className="hidden rounded-2xl border border-white/10 bg-surface p-6 lg:block">
        <p className="text-xs uppercase tracking-wider text-muted">
          {sold ? "This plot is sold" : "Total price"}
        </p>
        {!sold && (
          <p className="mt-1 font-heading text-3xl font-bold text-primary-white">
            {formatCurrency(plot.priceUSD)}
          </p>
        )}
        <div className="mt-4">
          <Button
            variant="whatsapp"
            fullWidth
            href={whatsappUrl(message)}
            onClick={onClick}
            icon={<MessageCircle className="h-5 w-5" />}
          >
            {sold ? "Ask about similar plots" : "Enquire on WhatsApp"}
          </Button>
        </div>
        <p className="mt-3 text-center text-xs text-muted">
          Reply within a few hours, Bali time
        </p>
      </div>

      {/* Mobile: fixed bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-white/10 bg-deep-blue/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="min-w-0">
          {sold ? (
            <p className="text-sm font-semibold text-muted">Sold</p>
          ) : (
            <>
              <p className="text-xs text-muted">Total price</p>
              <p className="truncate text-lg font-bold text-primary-white">
                {formatCurrency(plot.priceUSD)}
              </p>
            </>
          )}
        </div>
        <Button
          variant="whatsapp"
          size="sm"
          href={whatsappUrl(message)}
          onClick={onClick}
          icon={<MessageCircle className="h-4 w-4" />}
        >
          {sold ? "Similar plots" : "Enquire"}
        </Button>
      </div>
    </>
  );
}

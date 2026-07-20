"use client";

import posthog from "posthog-js";

export type AnalyticsEvent =
  | { name: "quiz_started"; props?: Record<string, unknown> }
  | {
      name: "quiz_step_answered";
      props: {
        step: "goal" | "horizon" | "budget";
        step_index: 1 | 2 | 3;
        answer: string;
      };
    }
  | {
      name: "quiz_completed";
      props: {
        goal: string | null;
        horizon: string | null;
        budget: string | null;
      };
    }
  | { name: "quiz_reset" }
  | {
      name: "lead_submitted";
      props: {
        source: "quiz_result" | "hero" | "lead_magnet" | "land_detail" | "other";
        channel: "whatsapp";
        goal?: string | null;
        horizon?: string | null;
        budget?: string | null;
        plot?: string;
      };
    }
  | {
      name: "cta_clicked";
      props: { section: string; label: string };
    }
  | {
      name: "lead_magnet_requested";
      props: { report: string };
    }
  | {
      name: "land_filter_applied";
      props: {
        filter: "price" | "size" | "region" | "zoning" | "tenure" | "sort";
        value: string;
      };
    }
  | {
      name: "land_card_clicked";
      props: { slug: string; surface: "catalog" | "teaser" | "similar" };
    }
  | { name: "land_pin_clicked"; props: { slug: string } }
  | { name: "map_view_toggled"; props: { view: "map" | "list" } };

export function track(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  const { name } = event;
  const props = "props" in event ? event.props : undefined;
  if (posthog.__loaded) {
    posthog.capture(name, props);
  }
}

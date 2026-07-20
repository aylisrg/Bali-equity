import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactPrice(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return `$${millions % 1 === 0 ? millions : millions.toFixed(1)}M`;
  }
  return `$${Math.round(amount / 1_000)}k`;
}

export function formatAres(ares: number): string {
  const label = ares % 1 === 0 ? `${ares}` : ares.toFixed(1);
  return `${label} are · ${Math.round(ares * 100).toLocaleString("en-US")} m²`;
}

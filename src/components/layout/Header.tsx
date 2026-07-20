"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/constants";
import { track } from "@/lib/analytics";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-16 transition-colors duration-300",
        scrolled
          ? "border-b border-white/5 bg-deep-blue/80 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-wide text-primary-white"
        >
          EQUITY <span className="text-accent-gold">BALI</span>
        </Link>

        <nav className="flex items-center gap-3 md:gap-6">
          <Link
            href="/land"
            className="text-sm font-medium text-primary-white/90 transition-colors hover:text-accent-gold"
          >
            Land
          </Link>
          <a
            href={whatsappUrl("Hi! I'd like to talk about investing in Bali.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track({
                name: "cta_clicked",
                props: { section: "header", label: "WhatsApp" },
              })
            }
            className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#20BD5A] md:px-4 md:py-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
            <span className="sm:hidden">Chat</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

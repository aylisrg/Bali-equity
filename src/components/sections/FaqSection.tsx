"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQS } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <SectionWrapper id="faq" dark={false}>
      <SectionHeading
        title="Buying Property in Bali — Answered"
        subtitle="The questions investors ask most about where and how to buy real estate in Bali"
      />

      <div className="mx-auto max-w-3xl divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left cursor-pointer"
              >
                <h3 className="font-heading text-base md:text-lg font-semibold text-primary-white">
                  {item.question}
                </h3>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-accent-gold transition-transform duration-300",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 leading-relaxed text-muted">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

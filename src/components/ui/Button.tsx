"use client";

import { cn } from "@/lib/utils";
import type { ButtonVariant } from "@/types";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  href?: string;
  /** Open href in a new tab. Defaults to true for absolute http(s) URLs. */
  external?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-red text-primary-white hover:bg-primary-red/90 shadow-lg shadow-primary-red/20",
  secondary:
    "border-2 border-accent-gold text-accent-gold hover:bg-accent-gold/10 backdrop-blur-sm",
  whatsapp:
    "bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-lg shadow-[#25D366]/20",
  ghost:
    "text-accent-gold hover:text-primary-white underline-offset-4 hover:underline",
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  external,
  onClick,
  children,
  className,
  icon,
  fullWidth,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300 cursor-pointer",
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full",
    className
  );

  if (href) {
    const opensNewTab = external ?? href.startsWith("http");
    return (
      <a
        href={href}
        {...(opensNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={classes}
        onClick={onClick}
      >
        {icon}
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {icon}
      {children}
    </button>
  );
}

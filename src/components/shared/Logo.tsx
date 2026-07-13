import Image from "next/image";
import { cn } from "@/lib/utils";

export type LogoVariant =
  | "horizontal"
  | "stacked"
  | "monogram"
  | "dark"
  | "light"
  | "single-color";

const LOGO_PATHS: Record<LogoVariant, string> = {
  horizontal: "/brand/logo-horizontal.svg",
  stacked: "/brand/logo-stacked.svg",
  monogram: "/brand/logo-monogram.svg",
  dark: "/brand/logo-horizontal-dark.svg",
  light: "/brand/logo-horizontal-light.svg",
  "single-color": "/brand/logo-single-color.svg",
};

const LOGO_DIMENSIONS: Record<
  LogoVariant,
  { width: number; height: number; alt: string }
> = {
  horizontal: {
    width: 480,
    height: 88,
    alt: "DC Groceries",
  },
  stacked: {
    width: 320,
    height: 200,
    alt: "DC Groceries",
  },
  monogram: {
    width: 100,
    height: 100,
    alt: "DC Groceries monogram",
  },
  dark: {
    width: 480,
    height: 88,
    alt: "DC Groceries",
  },
  light: {
    width: 480,
    height: 88,
    alt: "DC Groceries",
  },
  "single-color": {
    width: 480,
    height: 88,
    alt: "DC Groceries",
  },
};

export interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function Logo({
  variant = "horizontal",
  className,
  width,
  height,
  priority = false,
}: LogoProps) {
  const { width: defaultWidth, height: defaultHeight, alt } =
    LOGO_DIMENSIONS[variant];
  const src = LOGO_PATHS[variant];

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? defaultWidth}
      height={height ?? defaultHeight}
      className={cn("h-auto w-auto", className)}
      priority={priority}
    />
  );
}

export function LogoImg({
  variant = "horizontal",
  className,
  width,
  height,
}: Omit<LogoProps, "priority">) {
  const { width: defaultWidth, height: defaultHeight, alt } =
    LOGO_DIMENSIONS[variant];
  const src = LOGO_PATHS[variant];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width ?? defaultWidth}
      height={height ?? defaultHeight}
      className={cn("h-auto w-auto", className)}
    />
  );
}

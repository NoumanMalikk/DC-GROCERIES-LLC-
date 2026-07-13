import { cn } from "@/lib/utils";

export type LogoVariant =
  | "horizontal"
  | "stacked"
  | "monogram"
  | "dark"
  | "light"
  | "single-color";

export interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

const ink = "#18332C";
const cream = "#F8F2E7";
const citrus = "#F28C28";
const white = "#FFFFFF";

export function Logo({
  variant = "horizontal",
  className,
}: LogoProps) {
  if (variant === "monogram") {
    return (
      <svg
        viewBox="0 0 64 64"
        className={cn("size-9 shrink-0", className)}
        role="img"
        aria-label="DC Groceries"
      >
        <rect width="64" height="64" rx="16" fill={ink} />
        <text
          x="32"
          y="42"
          textAnchor="middle"
          fill={cream}
          style={{
            fontFamily: "var(--font-manrope), Manrope, Arial Black, sans-serif",
            fontSize: "26px",
            fontWeight: 800,
            letterSpacing: "-1px",
          }}
        >
          DC
        </text>
        <circle cx="50" cy="16" r="5" fill={citrus} />
      </svg>
    );
  }

  if (variant === "stacked") {
    return (
      <svg
        viewBox="0 0 160 110"
        className={cn("h-14 w-auto", className)}
        role="img"
        aria-label="DC Groceries"
      >
        <rect x="60" y="4" width="40" height="40" rx="10" fill={ink} />
        <text
          x="80"
          y="32"
          textAnchor="middle"
          fill={cream}
          style={{
            fontFamily: "var(--font-manrope), Manrope, Arial Black, sans-serif",
            fontSize: "18px",
            fontWeight: 800,
            letterSpacing: "-0.5px",
          }}
        >
          DC
        </text>
        <circle cx="93" cy="12" r="3.5" fill={citrus} />
        <text
          x="80"
          y="72"
          textAnchor="middle"
          fill={ink}
          style={{
            fontFamily: "var(--font-manrope), Manrope, Arial, sans-serif",
            fontSize: "15px",
            fontWeight: 700,
            letterSpacing: "2px",
          }}
        >
          GROCERIES
        </text>
      </svg>
    );
  }

  const markFill = variant === "dark" ? cream : ink;
  const markText = variant === "dark" ? ink : cream;
  const wordFill = variant === "dark" ? cream : ink;

  return (
    <svg
      viewBox="0 0 260 48"
      className={cn("h-9 w-auto sm:h-10", className)}
      role="img"
      aria-label="DC Groceries"
    >
      <rect x="0" y="4" width="40" height="40" rx="10" fill={markFill} />
      <text
        x="20"
        y="31"
        textAnchor="middle"
        fill={markText}
        style={{
          fontFamily: "var(--font-manrope), Manrope, Arial Black, sans-serif",
          fontSize: "17px",
          fontWeight: 800,
          letterSpacing: "-0.5px",
        }}
      >
        DC
      </text>
      {variant !== "single-color" && (
        <circle cx="33" cy="12" r="3.5" fill={citrus} />
      )}
      <text
        x="52"
        y="31"
        fill={wordFill}
        style={{
          fontFamily: "var(--font-manrope), Manrope, Arial, sans-serif",
          fontSize: "18px",
          fontWeight: 700,
          letterSpacing: "1.5px",
        }}
      >
        GROCERIES
      </text>
    </svg>
  );
}

/** Plain img fallback for emails / non-React contexts */
export function LogoImg({
  variant = "horizontal",
  className,
  width,
  height,
}: Omit<LogoProps, "priority">) {
  const src =
    variant === "monogram"
      ? "/brand/logo-monogram.svg"
      : variant === "stacked"
        ? "/brand/logo-stacked.svg"
        : variant === "dark"
          ? "/brand/logo-horizontal-dark.svg"
          : variant === "light"
            ? "/brand/logo-horizontal-light.svg"
            : variant === "single-color"
              ? "/brand/logo-single-color.svg"
              : "/brand/logo-horizontal.svg";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="DC Groceries"
      width={width ?? 260}
      height={height ?? 48}
      className={cn("h-auto w-auto", className)}
    />
  );
}

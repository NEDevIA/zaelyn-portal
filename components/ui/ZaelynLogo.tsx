import Link from "next/link";

interface ZaelynLogoProps {
  href?: string;
  size?: number; // font-size in px
  className?: string;
}

/**
 * Canonical Zaelyn logo.
 * Z + lyn  → var(--foreground)
 * ae       → #818cf8 (indigo-400)
 * Weight 600, tracking -0.03em, DM Sans.
 */
export default function ZaelynLogo({ href = "/", size = 17, className = "" }: ZaelynLogoProps) {
  const style: React.CSSProperties = {
    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
    fontWeight: 600,
    fontSize: `${size}px`,
    letterSpacing: "-0.03em",
    color: "var(--foreground)",
    lineHeight: 1,
  };

  const inner = (
    <span style={style}>
      Z<span style={{ color: "#818cf8" }}>ae</span>lyn
    </span>
  );

  if (!href) return <span className={className}>{inner}</span>;

  return (
    <Link href={href} className={`flex-shrink-0 ${className}`} style={{ textDecoration: "none" }}>
      {inner}
    </Link>
  );
}

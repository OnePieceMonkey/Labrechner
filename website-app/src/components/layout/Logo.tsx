import Link from "next/link";

interface LogoProps {
  size?: "small" | "medium" | "large";
  href?: string;
  className?: string;
}

export function Logo({ size = "medium", href = "/", className = "" }: LogoProps) {
  const sizeClasses = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-4xl",
  };

  const content = (
    <span
      className={`font-bold tracking-tight ${sizeClasses[size]} ${className}`}
    >
      <span className="relative text-primary">
        {/* Custom L mit verlängertem Strich */}
        <span className="relative inline-block">
          <span
            className="absolute -top-0.5 left-0 h-[110%] w-[2px] rounded-full bg-gradient-to-b from-primary-light to-primary"
            aria-hidden="true"
          />
          L
        </span>
      </span>
      <span className="text-primary">abrechner</span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
        {content}
      </Link>
    );
  }

  return content;
}

// Monogram für Favicon / kleine Anwendungen
export function LogoMonogram({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white ${className}`}
    >
      <span className="relative font-bold">
        <span
          className="absolute -left-0.5 top-0 h-full w-[2px] rounded-full bg-white/30"
          aria-hidden="true"
        />
        L
      </span>
    </div>
  );
}

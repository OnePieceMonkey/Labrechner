import { Badge } from "lucide-react";
import { formatPositionCode } from "@/lib/formatPositionCode";

interface PriceCardProps {
  positionCode: string;
  name: string;
  groupName: string | null;
  price: number | null;
  laborType: "gewerbe" | "praxis";
  isUkps?: boolean;
  isImplant?: boolean;
  onClick?: () => void;
}

export function PriceCard({
  positionCode,
  name,
  groupName,
  price,
  laborType,
  isUkps = false,
  isImplant = false,
  onClick,
}: PriceCardProps) {
  const formatPrice = (p: number | null) => {
    if (p === null) return "–";
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(p);
  };

  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer transition-shadow hover:shadow-md ${
        onClick ? "hover:border-primary/50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Code & Name */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-primary">
              {formatPositionCode(positionCode)}
            </span>
            {isUkps && (
              <span className="badge-primary">UKPS</span>
            )}
            {isImplant && (
              <span className="badge bg-blue-100 text-blue-700">Implantat</span>
            )}
          </div>
          <h3 className="mt-1 truncate text-base font-medium text-gray-900">
            {name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{groupName || "Sonstige"}</p>
        </div>

        {/* Right: Price */}
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(price)}
          </div>
          <div className="text-xs text-gray-500">
            {laborType === "gewerbe" ? "Gewerbelabor" : "Praxislabor"}
          </div>
        </div>
      </div>
    </div>
  );
}

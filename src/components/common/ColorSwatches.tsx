import type { ProductColorVariant } from "../../types/product.types";

interface ColorSwatchesProps {
  variants?: ProductColorVariant[];
  selectedVariant?: ProductColorVariant | null;
  onSelect?: (variant: ProductColorVariant) => void;
  onHover?: (variant: ProductColorVariant) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
}

export default function ColorSwatches({
  variants = [],
  selectedVariant,
  onSelect,
  onHover,
  size = "md",
  className = "",
  showLabel = false,
}: ColorSwatchesProps) {
  if (!variants || variants.length === 0) return null;

  const activeVariant = selectedVariant || variants[0];

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6 sm:w-7 sm:h-7",
    lg: "w-8 h-8",
  }[size];

  return (
    <div className={`space-y-1.5 ${className}`}>
      {showLabel && (
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-gray-500 font-medium">Color:</span>
          <span className="font-bold text-[#191142]">{activeVariant?.name || "Standard"}</span>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap" role="radiogroup" aria-label="Product color options">
        {variants.map((v, idx) => {
          const isSelected = Boolean(
            (activeVariant?.color && activeVariant.color.toLowerCase() === v.color.toLowerCase()) ||
            (activeVariant?.name && activeVariant.name.toLowerCase() === v.name.toLowerCase())
          );

          // Detect very light colors (like white) to ensure proper border visibility
          const isLight =
            v.color.toLowerCase() === "#ffffff" ||
            v.color.toLowerCase() === "#fff" ||
            v.color.toLowerCase() === "white";

          return (
            <button
              key={`${v.name}-${v.color}-${idx}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              title={v.name}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect?.(v);
              }}
              onMouseEnter={() => onHover?.(v)}
              className={`group relative rounded-full transition-all duration-200 cursor-pointer p-0.5 focus:outline-hidden ${
                isSelected
                  ? "ring-2 ring-[#191142] ring-offset-2 scale-105"
                  : "hover:scale-110 hover:ring-1 hover:ring-gray-300 ring-offset-1"
              }`}
            >
              <span
                className={`block rounded-full shadow-2xs border ${sizeClasses} ${
                  isLight ? "border-gray-300" : "border-black/20"
                }`}
                style={{ backgroundColor: v.color }}
              />
              <span className="sr-only">{v.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

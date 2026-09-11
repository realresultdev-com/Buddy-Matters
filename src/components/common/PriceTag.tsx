import React from "react";

interface PriceTagProps {
  price: number;
  originalMRP?: number | null;
  discountPercent?: number | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showDiscount?: boolean;
  showInclusiveText?: boolean;
  className?: string;
}

export default function PriceTag({
  price,
  originalMRP: providedMRP,
  discountPercent: providedDiscount,
  size = "md",
  showDiscount = true,
  showInclusiveText = true,
  className = "",
}: PriceTagProps) {
  // If originalMRP is passed use it; fallback to reasonable ~35% markup if not specified
  const originalMRP =
    providedMRP !== undefined && providedMRP !== null && providedMRP > 0
      ? providedMRP
      : Math.round(price * 1.35);

  const discountPercent =
    providedDiscount !== undefined && providedDiscount !== null && providedDiscount > 0
      ? providedDiscount
      : originalMRP && originalMRP > price
      ? Math.round(((originalMRP - price) / originalMRP) * 100)
      : 0;

  const sizeStyles = {
    xs: { symbol: "text-[11px]", main: "text-base font-bold", mrp: "text-[10px]", discount: "text-[11px]" },
    sm: { symbol: "text-xs", main: "text-lg sm:text-xl font-bold", mrp: "text-xs", discount: "text-xs" },
    md: { symbol: "text-sm", main: "text-2xl font-black", mrp: "text-xs", discount: "text-xs sm:text-sm" },
    lg: { symbol: "text-base mt-0.5", main: "text-3xl font-extrabold", mrp: "text-sm", discount: "text-sm" },
    xl: { symbol: "text-lg mt-1", main: "text-4xl font-black", mrp: "text-base", discount: "text-base" },
  }[size];

  return (
    <div className={`space-y-0.5 ${className}`}>
      {/* Amazon-Style Price Layout: ₹[Price]  M.R.P.: ₹[MRP]  ([X]% off) */}
      <div className="flex items-baseline gap-2 flex-wrap">
        {/* Main Current Selling Price */}
        <div className="flex items-start text-[#191142]">
          <span className={`${sizeStyles.symbol} font-bold mr-0.5 leading-none`}>₹</span>
          <span className={`${sizeStyles.main} tracking-tight leading-none`}>
            {price.toLocaleString("en-IN")}
          </span>
        </div>

        {/* M.R.P. Old Price (Strikethrough) */}
        {originalMRP && originalMRP > price ? (
          <div className={`${sizeStyles.mrp} text-gray-500 font-normal whitespace-nowrap`}>
            M.R.P.:{" "}
            <span className="line-through text-gray-500">
              ₹{originalMRP.toLocaleString("en-IN")}
            </span>
          </div>
        ) : null}

        {/* Offer Discount Percentage */}
        {showDiscount && discountPercent > 0 && (
          <span className={`${sizeStyles.discount} font-semibold text-[#388e3c] whitespace-nowrap`}>
            ({discountPercent}% off)
          </span>
        )}
      </div>

      {showInclusiveText && (
        <p className="text-[11px] text-gray-500 font-medium">Inclusive of all taxes</p>
      )}
    </div>
  );
}

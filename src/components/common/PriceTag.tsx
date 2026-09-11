interface PriceTagProps {
  price: number;
  originalMRP?: number;
  size?: "sm" | "md" | "lg" | "xl";
  showDiscount?: boolean;
  showEMI?: boolean;
  className?: string;
}

export default function PriceTag({
  price,
  originalMRP: providedMRP,
  size = "md",
  showDiscount = true,
  showEMI = false,
  className = "",
}: PriceTagProps) {
  const originalMRP = providedMRP || Math.round(price * 1.28);
  const discountPercent = Math.round(((originalMRP - price) / originalMRP) * 100);
  const emiAmount = Math.round(price / 12);

  const sizeStyles = {
    sm: { symbol: "text-xs", main: "text-lg", mrp: "text-[11px]" },
    md: { symbol: "text-xs mt-0.5", main: "text-2xl font-black", mrp: "text-xs" },
    lg: { symbol: "text-sm mt-1", main: "text-3xl font-extrabold", mrp: "text-xs" },
    xl: { symbol: "text-base mt-1", main: "text-4xl font-black", mrp: "text-sm" },
  }[size];

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-baseline gap-2 flex-wrap">
        {showDiscount && discountPercent > 0 && (
          <span className="text-[#cc0c39] font-light text-2xl">
            -{discountPercent}%
          </span>
        )}
        <div className="flex items-start text-[#191142]">
          <span className={`${sizeStyles.symbol} font-bold mr-0.5`}>₹</span>
          <span className={`${sizeStyles.main} tracking-tight leading-none`}>
            {price.toLocaleString("en-IN")}
          </span>
        </div>
        {originalMRP > price && (
          <div className={`${sizeStyles.mrp} text-gray-500`}>
            M.R.P.: <span className="line-through">₹{originalMRP.toLocaleString("en-IN")}</span>
          </div>
        )}
      </div>

      <p className="text-[11px] text-gray-500 font-medium">Inclusive of all taxes</p>

      {showEMI && (
        <p className="text-xs text-gray-600 pt-0.5">
          <span className="font-bold text-[#191142]">EMI</span> starts at ₹{emiAmount.toLocaleString("en-IN")}/mo. No Cost EMI available.
        </p>
      )}
    </div>
  );
}

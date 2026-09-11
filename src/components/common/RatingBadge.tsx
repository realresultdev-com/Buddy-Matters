interface RatingBadgeProps {
  rating?: number | null;
  reviewCount?: number | null;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  showCount?: boolean;
}

export default function RatingBadge({
  rating,
  reviewCount,
  size = "md",
  className = "",
  onClick,
  showCount = true,
}: RatingBadgeProps) {
  const count = reviewCount ?? 0;
  if (!rating || count <= 0) {
    return null;
  }

  const displayRating = Number(rating).toFixed(1);

  const sizeClasses = {
    xs: {
      container: "px-1.5 py-0.5 text-[10px] gap-1 rounded-md",
      star: "w-2.5 h-2.5",
      starText: "text-[10px]",
    },
    sm: {
      container: "px-2 py-0.5 text-xs gap-1.5 rounded-md",
      star: "w-3 h-3",
      starText: "text-xs",
    },
    md: {
      container: "px-2.5 py-1 text-sm gap-1.5 rounded-lg",
      star: "w-3.5 h-3.5",
      starText: "text-sm",
    },
    lg: {
      container: "px-3.5 py-1.5 text-base gap-2 rounded-xl",
      star: "w-4 h-4",
      starText: "text-base",
    },
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center bg-white border border-gray-200/90 shadow-2xs select-none ${
        sizeClasses.container
      } ${onClick ? "cursor-pointer hover:border-gray-300 hover:shadow-xs transition-all" : ""} ${className}`}
    >
      {/* Bold Rating Score */}
      <span className="font-extrabold text-[#111827] tracking-tight leading-none">
        {displayRating}
      </span>

      {/* Solid Green Star Matching E-Commerce Reference */}
      <span className={`text-[#038e42] leading-none select-none font-black ${sizeClasses.starText}`}>
        ★
      </span>

      {/* Review Count in Parentheses */}
      {showCount && (
        <span className="text-gray-500 font-normal leading-none">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}

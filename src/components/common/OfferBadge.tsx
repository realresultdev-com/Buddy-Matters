import React from "react";

interface OfferBadgeProps {
  prefix?: string | null;
  value?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function OfferBadge({
  prefix = "Starting",
  value,
  className = "",
  size = "md",
}: OfferBadgeProps) {
  if (!value && !prefix) return null;

  // 16-petal smooth scallop starburst path in a 100x100 viewBox
  const scallopPath =
    "M 50 4 C 52.54 4, 54.68 11.17, 57.61 11.75 C 60.54 12.33, 65.26 6.53, 67.6 7.5 " +
    "C 69.94 8.47, 69.18 15.91, 71.67 17.57 C 74.16 19.23, 80.74 15.68, 82.53 17.47 " +
    "C 84.32 19.26, 80.77 25.84, 82.43 28.33 C 84.09 30.82, 91.53 30.06, 92.5 32.4 " +
    "C 93.47 34.74, 87.67 39.46, 88.25 42.39 C 88.83 45.32, 96 47.46, 96 50 " +
    "C 96 52.54, 88.83 54.68, 88.25 57.61 C 87.67 60.54, 93.47 65.26, 92.5 67.6 " +
    "C 91.53 69.94, 84.09 69.18, 82.43 71.67 C 80.77 74.16, 84.32 80.74, 82.53 82.53 " +
    "C 80.74 84.32, 74.16 80.77, 71.67 82.43 C 69.18 84.09, 69.94 91.53, 67.6 92.5 " +
    "C 65.26 93.47, 60.54 87.67, 57.61 88.25 C 54.68 88.83, 52.54 96, 50 96 " +
    "C 47.46 96, 45.32 88.83, 42.39 88.25 C 39.46 87.67, 34.74 93.47, 32.4 92.5 " +
    "C 30.06 91.53, 30.82 84.09, 28.33 82.43 C 25.84 80.77, 19.26 84.32, 17.47 82.53 " +
    "C 15.68 80.74, 19.23 74.16, 17.57 71.67 C 15.91 69.18, 8.47 69.94, 7.5 67.6 " +
    "C 6.53 65.26, 12.33 60.54, 11.75 57.61 C 11.17 54.68, 4 52.54, 4 50 " +
    "C 4 47.46, 11.17 45.32, 11.75 42.39 C 12.33 39.46, 6.53 34.74, 7.5 32.4 " +
    "C 8.47 30.06, 15.91 30.82, 17.57 28.33 C 19.23 25.84, 15.68 19.26, 17.47 17.47 " +
    "C 19.26 15.68, 25.84 19.23, 28.33 17.57 C 30.82 15.91, 30.06 8.47, 32.4 7.5 " +
    "C 34.74 6.53, 39.46 12.33, 42.39 11.75 C 45.32 11.17, 47.46 4, 50 4 Z";

  const sizeStyles = {
    sm: "w-14 h-14 sm:w-16 sm:h-16",
    md: "w-18 h-18 sm:w-22 sm:h-22",
    lg: "w-22 h-22 sm:w-26 sm:h-26",
    xl: "w-28 h-28 sm:w-32 sm:h-32",
  }[size];

  const prefixSize = {
    sm: "text-[9px] leading-tight",
    md: "text-[11px] sm:text-[12px] leading-tight font-black",
    lg: "text-xs sm:text-sm leading-tight font-black",
    xl: "text-sm sm:text-base leading-tight font-black",
  }[size];

  const valueSize = {
    sm: "text-xs sm:text-sm font-black",
    md: "text-base sm:text-xl font-black",
    lg: "text-lg sm:text-2xl font-black",
    xl: "text-2xl sm:text-3xl font-black",
  }[size];

  return (
    <div
      className={`relative select-none pointer-events-none filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.22)] transition-transform duration-200 ${sizeStyles} ${className}`}
      aria-label={`${prefix || ""} ${value || ""}`}
    >
      {/* 16-lobe Yellow Scalloped Starburst SVG matching Amazon & Flipkart sticker */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full filter"
      >
        <defs>
          <linearGradient id="scallopYellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff200" />
            <stop offset="100%" stopColor="#ffe600" />
          </linearGradient>
        </defs>
        <path
          d={scallopPath}
          fill="url(#scallopYellowGrad)"
          stroke="#facc15"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Centered Badge Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-1.5 z-10 -rotate-1">
        {prefix && (
          <span
            className={`text-black font-extrabold tracking-tight ${prefixSize}`}
          >
            {prefix}
          </span>
        )}
        {value && (
          <span
            className={`text-black tracking-tight leading-none ${valueSize}`}
          >
            {value}
          </span>
        )}
      </div>
    </div>
  );
}

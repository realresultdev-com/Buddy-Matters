import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types/product.types";
import { getProductUrl } from "../../utils/urlSecurity";
import RatingBadge from "../common/RatingBadge";
import { ChevronLeft, ChevronRight, Flame, Sparkles, ArrowRight } from "lucide-react";

interface TrendingSliderProps {
  products: Product[];
}

export default function TrendingSlider({ products }: TrendingSliderProps) {
  const trendingProducts = products.filter((p) => p.is_trending);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-play slider
  useEffect(() => {
    if (trendingProducts.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingProducts.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [trendingProducts.length, isPaused]);

  if (trendingProducts.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? trendingProducts.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % trendingProducts.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleNext();
    } else if (touchEndX.current - touchStartX.current > 50) {
      handlePrev();
    }
  };

  // Color palettes tailored for mattress luxury branding (like Flipkart/Amazon banner carousels)
  const cardThemes = [
    {
      bg: "bg-gradient-to-r from-[#191142] via-[#241a58] to-[#0ea9df]/90",
      accent: "text-[#0ea9df]",
      badgeBg: "bg-[#0ea9df]/20 text-cyan-200 border-[#0ea9df]/40",
      buttonBg: "bg-[#0ea9df] hover:bg-[#0c93c4] text-white",
    },
    {
      bg: "bg-gradient-to-r from-[#0c2340] via-[#1d3d63] to-[#0ea9df]/80",
      accent: "text-amber-300",
      badgeBg: "bg-amber-400/20 text-amber-200 border-amber-400/40",
      buttonBg: "bg-white hover:bg-gray-100 text-[#0c2340]",
    },
    {
      bg: "bg-gradient-to-r from-[#1c1836] via-[#2f2759] to-[#6366f1]/80",
      accent: "text-indigo-300",
      badgeBg: "bg-indigo-400/20 text-indigo-200 border-indigo-400/40",
      buttonBg: "bg-indigo-500 hover:bg-indigo-600 text-white",
    },
  ];

  return (
    <div
      className="w-full relative select-none mb-6 mt-1"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3.5 px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#191142] tracking-tight flex items-center gap-2">
              Trending Deals
              <span className="text-[11px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Hot
              </span>
            </h2>
            <p className="text-xs text-gray-500">
              India&apos;s most loved orthopedic mattresses &amp; sleep essentials
            </p>
          </div>
        </div>

        {/* Desktop Navigation Arrows */}
        {trendingProducts.length > 1 && (
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="w-8 h-8 rounded-full border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-colors shadow-2xs cursor-pointer"
              aria-label="Previous trending slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-8 h-8 rounded-full border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-colors shadow-2xs cursor-pointer"
              aria-label="Next trending slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Slider Window */}
      <div
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-md"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {trendingProducts.map((product, idx) => {
            const theme = cardThemes[idx % cardThemes.length];
            const img = product.images?.[0] || "/logo-transparent.png";

            return (
              <div
                key={product.id}
                className="w-full shrink-0 relative overflow-hidden"
              >
                <div
                  className={`${theme.bg} text-white p-5 sm:p-8 md:p-10 min-h-[240px] sm:min-h-[290px] md:min-h-[320px] flex flex-col sm:flex-row items-center justify-between gap-6 relative`}
                >
                  {/* Background Accents */}
                  <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-20 -left-12 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Left Column: Product Info & CTA */}
                  <div className="flex-1 space-y-3 sm:space-y-4 z-10 text-center sm:text-left">
                    {Boolean(product.rating && (product.review_count ?? 0) > 0) && (
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <RatingBadge
                          rating={product.rating}
                          reviewCount={product.review_count}
                          size="xs"
                          className="bg-white/95 text-gray-900 shadow-sm"
                        />
                      </div>
                    )}

                    <div>
                      <Link
                        to={getProductUrl(product.id)}
                        className="hover:underline block"
                      >
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-snug line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs sm:text-sm text-gray-200/90 mt-1.5 line-clamp-2 max-w-xl">
                        {product.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline justify-center sm:justify-start gap-3">
                      <div className="text-2xl sm:text-3xl font-black tracking-tight">
                        ₹{product.price.toLocaleString("en-IN")}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                      <Link
                        to={getProductUrl(product.id)}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer hover:scale-102 ${theme.buttonBg}`}
                      >
                        <span>Explore Product</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Hero Product Visual */}
                  <div className="w-48 sm:w-64 md:w-80 h-44 sm:h-60 md:h-68 shrink-0 flex items-center justify-center z-10">
                    <Link
                      to={getProductUrl(product.id)}
                      className="w-full h-full flex items-center justify-center group"
                    >
                      <img
                        src={img}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300 rounded-xl"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Navigation Chevron Buttons (Overlay) */}
        {trendingProducts.length > 1 && (
          <div className="sm:hidden absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
            <button
              type="button"
              onClick={handlePrev}
              className="w-7 h-7 rounded-full bg-black/40 text-white backdrop-blur-xs flex items-center justify-center pointer-events-auto cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-7 h-7 rounded-full bg-black/40 text-white backdrop-blur-xs flex items-center justify-center pointer-events-auto cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Pagination Dots (Flipkart/E-commerce Carousel Style) */}
      {trendingProducts.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {trendingProducts.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setCurrentIndex(dotIdx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === dotIdx
                  ? "w-6 bg-[#0ea9df]"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

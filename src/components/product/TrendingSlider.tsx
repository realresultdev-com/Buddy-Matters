import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types/product.types";
import { getProductUrl } from "../../utils/urlSecurity";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface TrendingSliderProps {
  products: Product[];
}

export default function TrendingSlider({ products }: TrendingSliderProps) {
  const trendingProducts = products.filter((p) => p.is_trending);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-play slider with smooth interval
  useEffect(() => {
    if (trendingProducts.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingProducts.length);
    }, 3800);

    return () => clearInterval(timer);
  }, [trendingProducts.length]);

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

  // Color palettes tailored for mattress luxury branding
  const cardThemes = [
    {
      bg: "bg-gradient-to-r from-[#191142] via-[#241a58] to-[#0ea9df]/90",
      buttonBg: "bg-[#0ea9df] hover:bg-[#0c93c4] text-white",
    },
    {
      bg: "bg-gradient-to-r from-[#0c2340] via-[#1d3d63] to-[#0ea9df]/80",
      buttonBg: "bg-white hover:bg-gray-100 text-[#0c2340]",
    },
    {
      bg: "bg-gradient-to-r from-[#1c1836] via-[#2f2759] to-[#6366f1]/80",
      buttonBg: "bg-indigo-500 hover:bg-indigo-600 text-white",
    },
  ];

  return (
    <div className="w-full relative select-none mb-6 mt-1">
      {/* Section Header with Clean iOS Typography */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#191142] tracking-tight">
            Trending Deals
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            India&apos;s most loved orthopedic mattresses &amp; sleep essentials
          </p>
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
                  className={`${theme.bg} text-white p-6 sm:p-8 md:p-10 lg:p-12 min-h-[380px] sm:min-h-[420px] md:min-h-[440px] flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 relative overflow-hidden`}
                >
                  {/* Background Accents */}
                  <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />

                  {/* Left Column: Product Info & CTA */}
                  <div className="w-full md:w-1/2 lg:w-7/12 space-y-3.5 sm:space-y-4 z-10 text-center md:text-left flex flex-col items-center md:items-start justify-center">
                    <div className="inline-flex items-center gap-2">
                      <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-md bg-white/20 backdrop-blur-md text-white border border-white/30">
                        Trending Deal
                      </span>
                      <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-md border border-emerald-400/30">
                        In Stock
                      </span>
                    </div>

                    <div>
                      <Link
                        to={getProductUrl(product.id)}
                        className="hover:underline block"
                      >
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs sm:text-sm text-gray-200/90 mt-2 line-clamp-2 sm:line-clamp-3 max-w-xl leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Amazon / Flipkart Style Price & Savings */}
                    <div className="flex flex-wrap items-baseline justify-center md:justify-start gap-3 pt-1">
                      <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                        ₹{product.price.toLocaleString("en-IN")}
                      </div>
                      <div className="text-base sm:text-lg text-gray-300/80 line-through font-medium">
                        ₹{Math.round(product.price * 1.3).toLocaleString("en-IN")}
                      </div>
                      <span className="text-xs font-extrabold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 rounded-md">
                        Save 23%
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                      <Link
                        to={getProductUrl(product.id)}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs sm:text-sm transition-all shadow-lg hover:scale-105 cursor-pointer ${theme.buttonBg}`}
                      >
                        <span>Shop This Deal</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: HUGE Product Visual (Like Amazon & Flipkart) */}
                  <div className="w-full md:w-1/2 lg:w-5/12 h-64 sm:h-80 md:h-96 lg:h-[380px] shrink-0 flex items-center justify-center z-10">
                    <Link
                      to={getProductUrl(product.id)}
                      className="w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center group relative"
                    >
                      <img
                        src={img}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

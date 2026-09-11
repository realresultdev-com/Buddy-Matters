import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Clock,
  ArrowRight,
  TrendingUp,
  Star,
  Tag,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchCatalog } from "../../store/productSlice";
import {
  loadRecentSearches,
  saveSearchQuery,
  removeSearchRecord,
  clearAllSearches,
} from "../../store/searchSlice";
import { getProductUrl } from "../../utils/urlSecurity";
import type { Product } from "../../types/product.types";

interface SearchBarProps {
  isMobile?: boolean;
  onSearchComplete?: () => void;
  className?: string;
}

const POPULAR_SUGGESTIONS = [
  "Orthopedic",
  "Memory Foam",
  "Dual Comfort",
  "Pillow",
  "Mattress Protector",
];

export default function SearchBar({
  isMobile = false,
  onSearchComplete,
  className = "",
}: SearchBarProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const products = useAppSelector((state) => state.catalog.products);
  const recentSearches = useAppSelector((state) => state.search.recentSearches);

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoggedIn = Boolean(user);

  // Load catalog into Redux once on initial mount
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchCatalog());
    }
  }, [dispatch, products.length]);

  // Load recent searches when user status changes or on initial mount
  useEffect(() => {
    dispatch(loadRecentSearches(isLoggedIn));
  }, [dispatch, isLoggedIn]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter products in-memory from Redux (ZERO API calls while typing!)
  const trimmedQuery = query.trim().toLowerCase();
  const matchingProducts = React.useMemo(() => {
    if (!trimmedQuery) return [];
    return products
      .filter((p) => {
        const name = (p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const cat = (p.category?.name || "").toLowerCase();
        return (
          name.includes(trimmedQuery) ||
          desc.includes(trimmedQuery) ||
          cat.includes(trimmedQuery)
        );
      })
      .sort((a, b) => {
        const aNameStarts = (a.name || "").toLowerCase().startsWith(trimmedQuery) ? 1 : 0;
        const bNameStarts = (b.name || "").toLowerCase().startsWith(trimmedQuery) ? 1 : 0;
        if (aNameStarts !== bNameStarts) return bNameStarts - aNameStarts;

        const aNameHas = (a.name || "").toLowerCase().includes(trimmedQuery) ? 1 : 0;
        const bNameHas = (b.name || "").toLowerCase().includes(trimmedQuery) ? 1 : 0;
        if (aNameHas !== bNameHas) return bNameHas - aNameHas;

        return 0;
      })
      .slice(0, 6);
  }, [products, trimmedQuery]);

  const executeSearch = (searchTerm: string) => {
    const finalQuery = searchTerm.trim();
    if (!finalQuery) return;

    // Save to Redux & Database (for registered user) or localStorage (guest)
    dispatch(saveSearchQuery({ query: finalQuery, isLoggedIn }));

    setIsOpen(false);
    if (onSearchComplete) onSearchComplete();

    navigate(`/shop?search=${encodeURIComponent(finalQuery)}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    executeSearch(query);
  };

  const handleProductSelect = (product: Product) => {
    // Save search context
    dispatch(saveSearchQuery({ query: product.name, isLoggedIn }));
    setIsOpen(false);
    if (onSearchComplete) onSearchComplete();
    navigate(getProductUrl(product.id));
  };

  const handleRemoveRecentSearch = (e: React.MouseEvent, id: string, term: string) => {
    e.stopPropagation();
    dispatch(removeSearchRecord({ id, query: term, isLoggedIn }));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(clearAllSearches(isLoggedIn));
  };

  const handleClearInput = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
    >
      {/* Search Input Container - NO SEARCH BUTTON */}
      <form
        onSubmit={handleFormSubmit}
        className={`flex items-center w-full rounded-full border transition-all duration-200 shadow-2xs ${
          isOpen
            ? "border-[#191142] ring-2 ring-[#191142]/10 bg-white"
            : "border-gray-200 hover:border-gray-300 bg-gray-50/90 hover:bg-white"
        } ${isMobile ? "h-10 px-3.5" : "h-10 px-4"}`}
      >
        <Search className="w-4 h-4 text-gray-400 shrink-0 mr-2.5 pointer-events-none" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsOpen(false);
              inputRef.current?.blur();
            }
          }}
          placeholder={t("searchPlaceholder") || "Search mattresses, pillows, accessories..."}
          className="flex-1 text-[15px] md:text-sm text-[#191142] placeholder-gray-400 focus:outline-none bg-transparent font-medium py-1.5"
          autoComplete="off"
          aria-label="Search"
        />

        {/* Clear input button when text is present */}
        {query && (
          <button
            type="button"
            onClick={handleClearInput}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer shrink-0 ml-1"
            aria-label="Clear search input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Interactive Live Search Dropdown */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animation-fade-in ${
            isMobile ? "max-h-[75vh]" : "max-h-[500px]"
          } flex flex-col`}
        >
          {/* STATE 1: User hasn't typed yet - Show Recent Searches (from DB / Redux) & Suggestions */}
          {!trimmedQuery ? (
            <div className="p-3.5 overflow-y-auto">
              {recentSearches.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#0ea9df]" />
                      Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors cursor-pointer"
                    >
                      Clear history
                    </button>
                  </div>

                  <div className="space-y-0.5">
                    {recentSearches.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setQuery(item.query);
                          executeSearch(item.query);
                        }}
                        className="group flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Clock className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#0ea9df] shrink-0 transition-colors" />
                          <span className="text-sm font-medium text-gray-800 group-hover:text-[#191142] truncate">
                            {item.query}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveRecentSearch(e, item.id, item.query)}
                          className="p-1 text-gray-300 hover:text-gray-600 hover:bg-gray-200/60 rounded-full transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                          title="Remove from history"
                          aria-label={`Remove ${item.query} from history`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Popular quick searches */}
              <div className={recentSearches.length > 0 ? "mt-4 pt-3 border-t border-gray-100" : ""}>
                <div className="px-2 pb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                    Popular Searches
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 px-2">
                  {POPULAR_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        setQuery(suggestion);
                        executeSearch(suggestion);
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-[#191142] hover:text-white rounded-full transition-all cursor-pointer shadow-2xs"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* STATE 2: User is typing - Live In-Memory Redux Products Dropdown */
            <div className="flex flex-col overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                <span>Products ({matchingProducts.length})</span>
                <span className="text-[11px] text-gray-400 font-normal normal-case">
                  Instant Live Results
                </span>
              </div>

              <div className="overflow-y-auto max-h-[340px] divide-y divide-gray-50">
                {matchingProducts.length > 0 ? (
                  matchingProducts.map((product) => {
                    const thumb =
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : "/placeholder-mattress.png";

                    return (
                      <div
                        key={product.id}
                        onClick={() => handleProductSelect(product)}
                        className="group flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50/40 cursor-pointer transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200/80 overflow-hidden shrink-0 flex items-center justify-center">
                          <img
                            src={thumb}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=100&auto=format&fit=crop&q=80";
                            }}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-sm font-semibold text-[#191142] truncate group-hover:text-[#0ea9df] transition-colors">
                              {product.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {product.category?.name && (
                              <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-medium">
                                {product.category.name}
                              </span>
                            )}
                            {product.rating ? (
                              <span className="flex items-center gap-0.5 text-amber-600 font-bold text-[11px]">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                {product.rating}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {/* Price & Badge */}
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-[#191142]">
                            ₹{product.price.toLocaleString("en-IN")}
                          </div>
                          {product.offer_badge_value && (
                            <span className="inline-block text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                              {product.offer_badge_value}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 px-4 text-center">
                    <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-700">
                      No matching products found
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Try searching with different keywords or check spelling.
                    </p>
                  </div>
                )}
              </div>

              {/* View all results footer link */}
              <div className="p-2.5 bg-gray-50 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => executeSearch(query)}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#191142] hover:text-white border border-gray-200 text-xs font-semibold text-[#191142] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs group"
                >
                  <span>
                    See all results for &quot;<strong className="underline">{query}</strong>&quot;
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0ea9df] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

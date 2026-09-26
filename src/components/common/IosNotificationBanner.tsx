import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ChevronRight, X, Sparkles } from "lucide-react";
import { notificationService, AppNotification, ParsedNotificationData } from "../../services/notification.service";

interface ActiveBanner {
  notification: AppNotification;
  data: ParsedNotificationData;
  id: string;
}

export default function IosNotificationBanner() {
  const [activeBanner, setActiveBanner] = useState<ActiveBanner | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const touchStartY = useRef<number | null>(null);
  const autoDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Subscribe to notification events
    const unsubscribe = notificationService.subscribe((notification, data) => {
      // Clear existing timer
      if (autoDismissTimer.current) {
        clearTimeout(autoDismissTimer.current);
      }

      setIsExiting(false);
      setDragOffset(0);
      setActiveBanner({ notification, data, id: notification.id });

      // Auto dismiss after 8 seconds
      autoDismissTimer.current = setTimeout(() => {
        dismissBanner();
      }, 8000);
    });

    return () => {
      unsubscribe();
      if (autoDismissTimer.current) {
        clearTimeout(autoDismissTimer.current);
      }
    };
  }, []);

  const dismissBanner = () => {
    setIsExiting(true);
    setTimeout(() => {
      setActiveBanner(null);
      setIsExiting(false);
      setDragOffset(0);
    }, 350);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    if (diff < 0) {
      // Swiping up
      setDragOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (dragOffset < -40) {
      dismissBanner();
    } else {
      setDragOffset(0);
    }
    touchStartY.current = null;
  };

  const handleViewOrder = () => {
    dismissBanner();
    navigate("/admin/orders");
  };

  if (!activeBanner) return null;

  const { notification, data } = activeBanner;
  const isPaid = notification.type === "ORDER_PAID";

  return (
    <div
      className="fixed inset-x-0 top-0 z-[99999] pointer-events-none flex justify-center px-3 sm:px-4"
      style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 0.6rem)",
      }}
    >
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateY(${dragOffset}px)`,
          transition: dragOffset === 0 ? "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease" : "none",
        }}
        className={`pointer-events-auto w-full max-w-md select-none transform transition-all duration-350 ease-out ${
          isExiting ? "opacity-0 -translate-y-8 scale-95" : "opacity-100 translate-y-0 scale-100"
        }`}
      >
        {/* iOS Frosted Glass Container */}
        <div className="relative overflow-hidden rounded-[26px] bg-slate-900/90 text-white shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)] backdrop-blur-2xl border border-white/20 p-4 transition-all">
          {/* Subtle Ambient Top Glow */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500/0 via-amber-400/50 to-amber-500/0" />

          {/* Dynamic Island Mini Pill at Top Center */}
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto -mt-1.5 mb-2.5" />

          {/* iOS App Identity Bar */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-inner text-slate-950 font-bold text-[10px]">
                <ShoppingBag className="w-3.5 h-3.5 text-slate-950" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold tracking-wider text-slate-200 uppercase">
                  Buddy Mattress
                </span>
                <span className="text-[10px] text-slate-400">•</span>
                <span className="text-[11px] font-medium text-amber-400 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> Now
                </span>
              </div>
            </div>

            <button
              onClick={dismissBanner}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Notification Main Content */}
          <div className="pl-1 pr-1">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 truncate">
                  {notification.title}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                  {notification.message}
                </p>
              </div>

              {data.totalAmount && (
                <div className="shrink-0 text-right">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                      isPaid
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    }`}
                  >
                    ₹{data.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Metadata Pill & Interactive Action Buttons */}
            <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                {data.itemsCount && (
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-medium">
                    {data.itemsCount} {data.itemsCount === 1 ? "item" : "items"}
                  </span>
                )}
                {data.customerName && (
                  <span className="truncate max-w-[120px] text-slate-300 font-medium">
                    {data.customerName}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={dismissBanner}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 bg-white/10 hover:bg-white/15 active:scale-95 transition-all"
                >
                  Dismiss
                </button>
                <button
                  onClick={handleViewOrder}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 active:scale-95 shadow-md flex items-center gap-1 transition-all"
                >
                  <span>View Order</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

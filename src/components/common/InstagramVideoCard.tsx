import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, ShoppingBag } from "lucide-react";
import { heroVideoService, type HeroVideo } from "../../services/heroVideo.service";

const isImageMedia = (url?: string): boolean => {
  if (!url) return false;
  return Boolean(url.match(/\.(jpg|jpeg|png|webp|gif|avif|svg)(\?.*)?$/i));
};

export default function InstagramVideoCard() {
  const [heroVideos, setHeroVideos] = useState<HeroVideo[]>([]);
  const [activeAdIndex, setActiveAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const fetchHeroVideos = async () => {
      try {
        const res = await heroVideoService.getActive();
        if (res.data && res.data.length > 0) {
          setHeroVideos(res.data);
        }
      } catch (err) {
        console.error("Failed to load sponsored ad media:", err);
      }
    };
    fetchHeroVideos();
  }, []);

  // 30-second Display & Hide repeat interval
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prevVisible) => {
        if (!prevVisible) {
          // Re-appearing -> Advance to next media item
          if (heroVideos.length > 0) {
            setActiveAdIndex((prev) => (prev + 1) % heroVideos.length);
          }
          return true;
        } else {
          // Hiding after 30 seconds
          return false;
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [heroVideos]);


  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const currentAd = heroVideos.length > 0 ? heroVideos[activeAdIndex] : null;
  const mediaUrl =
    currentAd?.video_url ||
    "https://assets.mixkit.co/videos/preview/mixkit-woman-relaxing-in-a-comfortable-bed-41556-large.mp4";
  const posterUrl =
    currentAd?.poster_url ||
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600";
  const adTitle = currentAd?.title || "100% Organic Latex & Orthopedic Mattress";
  const ctaLink = currentAd?.link_url || "/shop";
  const isImage = isImageMedia(mediaUrl);

  return (
    <aside
      aria-label="Sponsored video advertisement"
      className={`hidden lg:block fixed bottom-6 right-6 z-50 select-none transition-all duration-500 ease-in-out ${
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-12 opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="relative w-[210px] h-[350px] rounded-2xl overflow-hidden shadow-2xl bg-black group transition-transform duration-300 hover:scale-[1.02]"
        style={{
          borderRadius: "1rem",
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
        }}
      >
        {/* Media Element (Video or Image) */}
        {isImage ? (
          <img
            src={mediaUrl}
            alt={adTitle}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src={mediaUrl}
            poster={posterUrl}
            autoPlay
            loop
            muted
            playsInline
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer"
          />
        )}

        {/* Top Header Overlay: Instagram Sponsored Style */}
        <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[1.5px]">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                <img
                  src="/logo-transparent.png"
                  alt="Buddy Mattress"
                  className="w-5 h-5 object-contain"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold text-white leading-none">
                  buddymattress
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 flex items-center justify-center text-[7px] text-white font-bold">
                  ✓
                </span>
              </div>
              <span className="text-[9px] text-gray-300 font-medium block">
                Sponsored
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Close / Hide Button */}
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
              title="Hide Ad"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center Pause Indicator Overlay if Paused */}
        {!isImage && !isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer z-10"
          >
            <div className="w-12 h-12 rounded-full bg-black/70 text-white flex items-center justify-center text-xs font-bold pl-0.5">
              ▶
            </div>
          </div>
        )}

        {/* Bottom CTA Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-2 z-10">
          <p className="text-[11px] font-semibold text-white leading-tight line-clamp-2 drop-shadow-xs">
            {adTitle}
          </p>

          <Link
            to={ctaLink}
            className="w-full py-2 px-3 rounded-lg bg-white text-black hover:bg-gray-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Shop Now</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

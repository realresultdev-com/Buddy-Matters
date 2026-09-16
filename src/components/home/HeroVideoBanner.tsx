import { useState, useEffect, useRef } from "react";
import { Video } from "lucide-react";
import { heroVideoService, type HeroVideo } from "../../services/heroVideo.service";
import { getAdaptiveVideoUrl } from "../../utils/videoTranscoder";

const isImageMedia = (url?: string): boolean => {
  if (!url) return false;
  return Boolean(url.match(/\.(jpg|jpeg|png|webp|gif|avif|svg)(\?.*)?$/i));
};

const interleaveMedia = (items: HeroVideo[]): HeroVideo[] => {
  const videos = items.filter((v) => !isImageMedia(v.video_url));
  const images = items.filter((v) => isImageMedia(v.video_url));

  const result: HeroVideo[] = [];
  let vIdx = 0;
  let iIdx = 0;

  // Alternate Video -> Image -> Video -> Image
  while (vIdx < videos.length || iIdx < images.length) {
    if (vIdx < videos.length) {
      result.push(videos[vIdx]);
      vIdx++;
    }
    if (iIdx < images.length) {
      result.push(images[iIdx]);
      iIdx++;
    }
  }

  return result;
};

export default function HeroVideoBanner() {
  const [heroVideos, setHeroVideos] = useState<HeroVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isInteracting = useRef(false);

  useEffect(() => {
    const fetchHeroVideos = async () => {
      try {
        setLoading(true);
        const res = await heroVideoService.getActive();
        if (res.data && res.data.length > 0) {
          const orderedData = interleaveMedia(res.data);
          setHeroVideos(orderedData);
        }
      } catch (err) {
        console.error("Failed to load homepage hero videos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroVideos();
  }, []);

  // Ensure all videos play continuously and cannot be stopped
  useEffect(() => {
    Object.values(videoRefs.current).forEach((videoEl) => {
      if (videoEl) {
        videoEl.play().catch(() => {});
      }
    });
  }, [heroVideos]);

  // Auto-shift reel every 5 seconds
  useEffect(() => {
    if (!heroVideos || heroVideos.length <= 1) return;

    const interval = setInterval(() => {
      if (isInteracting.current) return;

      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % heroVideos.length;
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const cardElement = container.children[nextIndex] as HTMLElement;
          if (cardElement) {
            container.scrollTo({
              left: cardElement.offsetLeft - container.offsetLeft,
              behavior: "smooth",
            });
          }
        }
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [heroVideos]);

  if (loading) {
    return (
      <div className="w-full my-4 select-none">
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar pt-2 pb-6 px-1 flex-nowrap">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-[65vw] sm:w-[220px] md:w-[225px] lg:w-[235px] xl:w-[245px] shrink-0 h-[400px] sm:h-[400px] md:h-[420px] lg:h-[430px] rounded-[28px] bg-gray-100 animate-pulse border border-gray-200 flex items-center justify-center"
            >
              <Video className="w-6 h-6 text-gray-300" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!heroVideos || heroVideos.length === 0) {
    return null;
  }

  return (
    <section className="w-full select-none mb-2 overflow-hidden">
      {/* Pure Video & Image Reel Showcase Container */}
      <div
        ref={scrollContainerRef}
        onMouseEnter={() => {
          isInteracting.current = true;
        }}
        onMouseLeave={() => {
          isInteracting.current = false;
        }}
        onTouchStart={() => {
          isInteracting.current = true;
        }}
        onTouchEnd={() => {
          setTimeout(() => {
            isInteracting.current = false;
          }, 3000);
        }}
        className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pt-2 pb-6 px-1 w-full flex-nowrap"
      >
        {heroVideos.map((vid) => {
          const activeSrc = getAdaptiveVideoUrl(vid);
          const isImage = isImageMedia(vid.video_url);

          return (
            <div
              key={vid.id}
              className="w-[65vw] sm:w-[220px] md:w-[225px] lg:w-[235px] xl:w-[245px] shrink-0 h-[400px] sm:h-[400px] md:h-[420px] lg:h-[430px] rounded-[28px] relative group shadow-[0_10px_25px_-5px_rgba(0,0,0,0.12),0_8px_10px_-6px_rgba(0,0,0,0.06)] transition-all duration-300"
              style={{ borderRadius: "28px" }}
            >
              <div
                className="w-full h-full rounded-[28px] overflow-hidden bg-black relative flex flex-col justify-between"
                style={{
                  borderRadius: "28px",
                  WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                }}
              >
                {isImage ? (
                  /* Image Display */
                  <img
                    src={vid.video_url}
                    alt={vid.title || "Banner"}
                    className="w-full h-full object-cover absolute inset-0 group-hover:scale-[1.02] transition-transform duration-300"
                  />
                ) : (
                  /* Video Player - Non-pausable, continuous playback */
                  <video
                    ref={(el) => {
                      videoRefs.current[vid.id] = el;
                      if (el && el.paused) {
                        el.play().catch(() => {});
                      }
                    }}
                    src={activeSrc}
                    poster={vid.poster_url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    onPause={(e) => {
                      // Prevent stopping: immediately resume playing
                      e.currentTarget.play().catch(() => {});
                    }}
                    className="w-full h-full object-cover absolute inset-0 pointer-events-none group-hover:scale-[1.02] transition-transform duration-300"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

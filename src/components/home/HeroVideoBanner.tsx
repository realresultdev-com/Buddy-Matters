import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Volume2, VolumeX, Play, Pause, ChevronLeft, ChevronRight, ArrowRight, Video } from "lucide-react";
import { heroVideoService, type HeroVideo } from "../../services/heroVideo.service";
import { getNetworkSpeedMode, getAdaptiveVideoUrl } from "../../utils/videoTranscoder";

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
  const [mutedMap, setMutedMap] = useState<{ [key: string]: boolean }>({});
  const [pausedMap, setPausedMap] = useState<{ [key: string]: boolean }>({});
  const [networkSpeed] = useState(() => getNetworkSpeedMode());
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
          // Default all videos to muted
          const initialMuteState: { [key: string]: boolean } = {};
          orderedData.forEach((v) => {
            initialMuteState[v.id] = true;
          });
          setMutedMap(initialMuteState);
        }
      } catch (err) {
        console.error("Failed to load homepage hero videos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroVideos();
  }, []);

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
      <div className="w-full my-6 select-none">
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-1 flex-nowrap">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-[65vw] sm:w-[220px] md:w-[225px] lg:w-[235px] xl:w-[245px] shrink-0 h-[400px] sm:h-[400px] md:h-[420px] lg:h-[430px] rounded-2xl bg-gray-100 animate-pulse border border-gray-200 flex items-center justify-center"
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

  const toggleMute = (e: React.MouseEvent, vidId: string) => {
    e.stopPropagation();
    setMutedMap((prev) => {
      const nextMuted = !prev[vidId];
      if (videoRefs.current[vidId]) {
        videoRefs.current[vidId]!.muted = nextMuted;
      }
      return { ...prev, [vidId]: nextMuted };
    });
  };

  const togglePlay = (vidId: string) => {
    const el = videoRefs.current[vidId];
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
      setPausedMap((prev) => ({ ...prev, [vidId]: false }));
    } else {
      el.pause();
      setPausedMap((prev) => ({ ...prev, [vidId]: true }));
    }
  };

  return (
    <section className="w-full select-none mb-6 overflow-hidden">
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
        className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1 w-full flex-nowrap"
      >
        {heroVideos.map((vid, idx) => {
          const isMuted = mutedMap[vid.id] ?? true;
          const isPaused = pausedMap[vid.id] ?? false;
          const activeSrc = getAdaptiveVideoUrl(vid);
          const isImage = isImageMedia(vid.video_url);

          return (
            <div
              key={vid.id}
              className="w-[65vw] sm:w-[220px] md:w-[225px] lg:w-[235px] xl:w-[245px] shrink-0 h-[400px] sm:h-[400px] md:h-[420px] lg:h-[430px] rounded-2xl overflow-hidden border border-gray-800 bg-black relative group shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {isImage ? (
                /* Image Display */
                <img
                  src={vid.video_url}
                  alt={vid.title || "Banner"}
                  className="w-full h-full object-cover absolute inset-0 group-hover:scale-[1.02] transition-transform duration-300"
                />
              ) : (
                /* Video Player */
                <>
                  <video
                    ref={(el) => {
                      videoRefs.current[vid.id] = el;
                    }}
                    src={activeSrc}
                    poster={vid.poster_url}
                    autoPlay={networkSpeed !== "slow"}
                    loop
                    muted={isMuted}
                    playsInline
                    preload={networkSpeed === "slow" ? "metadata" : "auto"}
                    onClick={() => togglePlay(vid.id)}
                    className="w-full h-full object-cover absolute inset-0 cursor-pointer group-hover:scale-[1.02] transition-transform duration-300"
                  />

                  {/* Mute Control Button */}
                  <div className="relative z-10 p-3 flex items-center justify-end pointer-events-none">
                    <button
                      type="button"
                      onClick={(e) => toggleMute(e, vid.id)}
                      className="w-7.5 h-7.5 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer pointer-events-auto border border-white/20"
                      title={isMuted ? "Unmute sound" : "Mute sound"}
                    >
                      {isMuted ? (
                        <VolumeX className="w-3.5 h-3.5 text-gray-300" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </button>
                  </div>

                  {/* Play Indicator Icon overlay when paused */}
                  {isPaused && (
                    <div
                      onClick={() => togglePlay(vid.id)}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer z-10"
                    >
                      <div className="w-11 h-11 rounded-full bg-black/70 text-white flex items-center justify-center border border-white/30">
                        <Play className="w-5 h-5 fill-white pl-0.5" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

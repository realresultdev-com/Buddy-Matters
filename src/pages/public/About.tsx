import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Layers,
  Wind,
  BedDouble,
  Instagram,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ExternalLink,
  Eye,
  Heart,
} from "lucide-react";

interface ReelItem {
  id: string;
  title: string;
  subtitle: string;
  views: string;
  likes: string;
  videoUrl: string;
  posterUrl: string;
  instagramUrl: string;
  badge: string;
}

export default function About() {
  const [playingReelId, setPlayingReelId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const brandPillars = [
    {
      icon: Layers,
      title: "Orthopedic Spine Support",
      desc: "Engineered with 3-zone ergonomic density transitions that contour to your spine, relieving lumbar pressure points.",
    },
    {
      icon: Wind,
      title: "Cooling Airflow Technology",
      desc: "Open-cell breathable foam dissipates body heat efficiently for uninterrupted, sweat-free sleep.",
    },
    {
      icon: BedDouble,
      title: "Zero Motion Transfer",
      desc: "Encased pocket springs ensure movement on one side never disturbs your partner.",
    },
    {
      icon: Award,
      title: "Hypoallergenic Materials",
      desc: "Crafted with skin-safe bamboo knit fabrics free from harmful chemicals and heavy metals.",
    },
  ];

  const brandPromises = [
    {
      icon: RotateCcw,
      title: "100-Night Home Trial",
      subtitle: "Sleep on it risk-free. If you're not satisfied, we'll pick it up and issue a full refund.",
    },
    {
      icon: ShieldCheck,
      title: "10-Year Warranty",
      subtitle: "Tested against 100,000 pressure cycles, built to maintain structural support for a decade.",
    },
    {
      icon: Truck,
      title: "Free Express Shipping",
      subtitle: "Factory-sealed bed-in-a-box delivery directly to your doorstep across India.",
    },
    {
      icon: Award,
      title: "Direct Factory Value",
      subtitle: "We eliminate retail markups to bring you premium orthopedic craftsmanship at honest prices.",
    },
  ];

  const milestones = [
    { value: "50,000+", label: "Happy Sleepers" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "500+", label: "Cities Delivered" },
    { value: "10+ Years", label: "Craftsmanship" },
  ];

  const reelsData: ReelItem[] = [
    {
      id: "reel-motion",
      title: "Zero Motion Isolation Test",
      subtitle: "Pocket springs absorb localized impact without moving the rest of the mattress.",
      views: "48K",
      likes: "3.4K",
      videoUrl: "/videos/hero-mattress.mp4",
      posterUrl: "/hero-mattress.jpg",
      instagramUrl: "https://www.instagram.com/buddy_mattress/reels/",
      badge: "Zero Motion",
    },
    {
      id: "reel-ortho",
      title: "Spinal Support Demo",
      subtitle: "3-Zone orthopedic layer maintaining neutral spine alignment during sleep.",
      views: "64K",
      likes: "5.1K",
      videoUrl: "/videos/hero-mattress-2.mp4",
      posterUrl: "/hero-mattress.jpg",
      instagramUrl: "https://www.instagram.com/buddy_mattress/reels/",
      badge: "Spine Care",
    },
    {
      id: "reel-unboxing",
      title: "Bed-In-A-Box Unboxing",
      subtitle: "Watch the vacuum-sealed mattress expand to full loft in seconds.",
      views: "39K",
      likes: "2.8K",
      videoUrl: "/videos/hero-mattress.mp4",
      posterUrl: "/hero-mattress.jpg",
      instagramUrl: "https://www.instagram.com/buddy_mattress/reels/",
      badge: "Unboxing",
    },
    {
      id: "reel-factory",
      title: "Paramathi Velur Factory Tour",
      subtitle: "Inside our manufacturing facility in Tamil Nadu.",
      views: "78K",
      likes: "6.7K",
      videoUrl: "/videos/hero-mattress-2.mp4",
      posterUrl: "/hero-mattress.jpg",
      instagramUrl: "https://www.instagram.com/buddy_mattress/reels/",
      badge: "Factory",
    },
  ];

  const handleTogglePlay = (reelId: string) => {
    const video = videoRefs.current[reelId];
    if (!video) return;

    if (playingReelId === reelId) {
      video.pause();
      setPlayingReelId(null);
    } else {
      Object.entries(videoRefs.current).forEach(([id, vid]) => {
        if (vid && id !== reelId) {
          vid.pause();
        }
      });
      video.play().catch(() => {});
      setPlayingReelId(reelId);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 1. Hero Section - Elegant Human Design */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16 px-4 sm:px-8 max-w-4xl mx-auto text-center space-y-6">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          About Buddy Mattress
        </span>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
          Better sleep for every Indian home.
        </h1>

        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          We believe great days start with restorative nights. We design orthopedic, pressure-relieving sleep solutions built for Indian homes, climates, and body types.
        </p>

        <div className="pt-2 flex items-center justify-center gap-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-black text-white text-xs sm:text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#story"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-gray-200 text-gray-900 hover:bg-gray-50 text-xs sm:text-sm font-semibold transition-colors"
          >
            Our Story
          </a>
        </div>
      </section>



      {/* 4. Video Reels Showcase */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-t border-gray-100 bg-gray-50/30">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Factory & Demos
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-1">
                See our mattresses in action
              </h2>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-gray-400" /> : <Volume2 className="w-3.5 h-3.5 text-gray-900" />}
                <span>{isMuted ? "Muted" : "Sound On"}</span>
              </button>

              <a
                href="https://www.instagram.com/buddy_mattress/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gray-900 hover:underline flex items-center gap-1"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reelsData.map((reel) => {
              const isPlaying = playingReelId === reel.id;

              return (
                <div key={reel.id} className="rounded-lg border border-gray-200 overflow-hidden bg-white flex flex-col">
                  <div className="relative aspect-9/16 bg-black overflow-hidden cursor-pointer">
                    <video
                      ref={(el) => {
                        videoRefs.current[reel.id] = el;
                      }}
                      src={reel.videoUrl}
                      poster={reel.posterUrl}
                      muted={isMuted}
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                      onClick={() => handleTogglePlay(reel.id)}
                    />

                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-black/60 text-white">
                        {reel.badge}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-white bg-black/60 px-2 py-0.5 rounded">
                        <Eye className="w-3 h-3" />
                        <span>{reel.views}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTogglePlay(reel.id)}
                      className={`absolute inset-0 m-auto w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center transition-all cursor-pointer z-20 ${
                        isPlaying ? "opacity-0 hover:opacity-100" : "opacity-90 hover:opacity-100"
                      }`}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                    </button>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-900 line-clamp-1">{reel.title}</p>
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{reel.subtitle}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                      <div className="flex items-center gap-1 text-gray-400 text-[11px]">
                        <Heart className="w-3 h-3 text-gray-500" />
                        <span>{reel.likes}</span>
                      </div>

                      <a
                        href={reel.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-900 text-[11px] hover:underline flex items-center gap-1"
                      >
                        <span>Watch</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Engineering Pillars */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Engineering
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Built for support and durability
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Four key pillars behind our orthopedic mattress design.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {brandPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="p-6 rounded-lg border border-gray-200 space-y-2.5 bg-white">
                  <Icon className="w-5 h-5 text-gray-900" />
                  <h3 className="text-sm font-semibold text-gray-900">{pillar.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* 7. CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-5xl mx-auto text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Ready to experience better sleep?
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
          Explore our range of orthopedic mattresses, pillows, and bedding accessories with a 100-night trial.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-black text-white text-xs sm:text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            <span>Shop Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

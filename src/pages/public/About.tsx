import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Award,
  Sparkles,
  HeartHandshake,
  Clock,
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
  Share2,
  Film,
  Check,
} from "lucide-react";

interface ReelItem {
  id: string;
  title: string;
  subtitle: string;
  views: string;
  likes: string;
  duration: string;
  videoUrl: string;
  posterUrl: string;
  instagramUrl: string;
  badge: string;
}

export default function About() {
  const [playingReelId, setPlayingReelId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const brandPillars = [
    {
      icon: Layers,
      title: "Orthopedic Spinal Alignment",
      desc: "Engineered with 3-zone ergonomic density transitions that contour to your natural spine curve, relieving lumbar pressure points.",
    },
    {
      icon: Wind,
      title: "Advanced Cooling Airflow",
      desc: "Open-cell breathable foam infused with cooling gel beads dissipates body heat efficiently for uninterrupted, sweat-free deep sleep.",
    },
    {
      icon: BedDouble,
      title: "Zero Motion Transfer",
      desc: "Individually encased pocket springs and localized memory layers ensure movement on one side never disturbs the other.",
    },
    {
      icon: Award,
      title: "Eco-Friendly & Hypoallergenic",
      desc: "Crafted with certified skin-safe fabrics and non-toxic foams free from harmful volatile organic compounds and heavy metals.",
    },
  ];

  const brandPromises = [
    {
      icon: RotateCcw,
      title: "100-Night Home Trial",
      subtitle: "Sleep on it risk-free in your bedroom. If your sleep isn't transformed, we'll pick it up and refund you 100%.",
    },
    {
      icon: ShieldCheck,
      title: "10-Year Warranty",
      subtitle: "Every Buddy mattress is tested against 100,000 pressure cycles, built to maintain structural resilience for a decade.",
    },
    {
      icon: Truck,
      title: "Free Express Delivery",
      subtitle: "Factory-sealed bed-in-a-box delivery straight to your doorstep across India with zero shipping charges.",
    },
    {
      icon: HeartHandshake,
      title: "Direct-to-Consumer Honest Pricing",
      subtitle: "We skip showroom middlemen and bloated retail markups, passing pure quality and savings directly to you.",
    },
  ];

  const milestones = [
    { value: "50,000+", label: "Happy Sleepers" },
    { value: "98.4%", label: "Satisfaction Rate" },
    { value: "100 Nights", label: "Risk-Free Trial" },
    { value: "10 Years", label: "Full Warranty" },
  ];

  const reelsData: ReelItem[] = [
    {
      id: "reel-motion",
      title: "Zero Motion Water Glass Test",
      subtitle: "A glass of water stays still while jumping. Encased pocket springs isolate all movement!",
      views: "48.2K",
      likes: "3.4K",
      duration: "0:15",
      videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      posterUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80",
      instagramUrl: "https://www.instagram.com/buddy_mattress/reels/",
      badge: "Zero Motion",
    },
    {
      id: "reel-ortho",
      title: "3-Zone Orthopedic Alignment",
      subtitle: "See how contoured foam relieves spine tension and keeps your vertebrae in neutral alignment.",
      views: "64.9K",
      likes: "5.1K",
      duration: "0:20",
      videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
      posterUrl: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&auto=format&fit=crop&q=80",
      instagramUrl: "https://www.instagram.com/buddy_mattress/reels/",
      badge: "Spine Care",
    },
    {
      id: "reel-unboxing",
      title: "Instant Bed-In-A-Box Expansion",
      subtitle: "Unboxing our vacuum-sealed memory mattress! Watch it expand to full loft in seconds.",
      views: "39.5K",
      likes: "2.8K",
      duration: "0:18",
      videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      posterUrl: "https://images.unsplash.com/photo-1540518614846-7ede433c4550?w=800&auto=format&fit=crop&q=80",
      instagramUrl: "https://www.instagram.com/buddy_mattress/reels/",
      badge: "Unboxing",
    },
    {
      id: "reel-factory",
      title: "Factory Tour: Paramathi Velur, Tamil Nadu",
      subtitle: "Direct from our manufacturing facility to your home. Premium quilting with zero middleman markup.",
      views: "78.4K",
      likes: "6.7K",
      duration: "0:25",
      videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
      posterUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80",
      instagramUrl: "https://www.instagram.com/buddy_mattress/reels/",
      badge: "Factory Direct",
    },
  ];

  const handleTogglePlay = (reelId: string) => {
    const video = videoRefs.current[reelId];
    if (!video) return;

    if (playingReelId === reelId) {
      video.pause();
      setPlayingReelId(null);
    } else {
      // Pause any other playing video
      Object.entries(videoRefs.current).forEach(([id, vid]) => {
        if (vid && id !== reelId) {
          vid.pause();
        }
      });
      video.play().catch(() => {
        // Autoplay may be restricted without user interaction
      });
      setPlayingReelId(reelId);
    }
  };

  const handleCopyProfileLink = () => {
    navigator.clipboard.writeText("https://www.instagram.com/buddy_mattress/");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen text-[#191142]">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#191142] via-[#201654] to-[#191142] text-white py-16 sm:py-24 px-4 sm:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0ea9df_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-cyan-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Redefining Indian Sleep Wellness</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Better Sleep, <span className="text-[#0ea9df]">Better You</span>.
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            At Buddy Mattress, we believe that great days start with restorative nights. We engineer orthopedic, pressure-relieving sleep solutions designed specifically for Indian homes and lifestyles.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0ea9df] hover:bg-[#0c93c4] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#story"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold transition-all"
            >
              Our Story
            </a>
            <a
              href="#instagram-reels"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-95 transition-all"
            >
              <Instagram className="w-4 h-4" />
              <span>Watch Reels</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Stats Banner */}
      <section className="bg-gray-50 border-y border-gray-200/80 py-8 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {milestones.map((m, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#191142] tracking-tight">
                {m.value}
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Our Story Section */}
      <section id="story" className="py-14 sm:py-20 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0ea9df]">Our Origins</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191142] tracking-tight leading-snug">
              Born from a simple question: Why is finding the right mattress so difficult?
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              For years, buying a mattress meant awkward store visits, confusing terminology, inflated markups, and zero guarantees that you would actually wake up pain-free.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Buddy Mattress was created to challenge that status quo. By working alongside orthopedic spine specialists and sleep researchers, we crafted an optimized range of mattresses that balance pressure-point relief, spinal alignment, and thermal comfort.
            </p>
            <div className="pt-2 space-y-2 text-xs font-medium text-gray-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Engineered for Indian climate with breathable bamboo knit fabric</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Custom high-resilience base layers that prevent sagging</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero middlemen — direct factory-to-doorstep savings</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md aspect-4/3 bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&auto=format&fit=crop&q=80"
                alt="Buddy Mattress Orthopedic Sleep Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-[#191142] text-white p-4 rounded-xl shadow-lg max-w-[200px] border border-white/10 hidden sm:block">
              <p className="text-2xl font-black text-[#0ea9df]">100%</p>
              <p className="text-[11px] font-semibold text-gray-300 mt-0.5">Ergonomic Comfort & Spinal Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Instagram Profile & Interactive Video Reels Showcase */}
      <section id="instagram-reels" className="py-14 sm:py-20 px-4 sm:px-8 bg-gradient-to-b from-gray-50 via-white to-gray-50 border-y border-gray-200/80">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200/80 text-pink-600 text-xs font-bold uppercase tracking-wider">
              <Instagram className="w-3.5 h-3.5 text-pink-500" />
              <span>Connect on Social</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#191142] tracking-tight">
              Follow Us on Instagram & Watch Our Reels
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              See genuine mattress resilience tests, customer unboxings, and craftsmanship straight from our Paramathi Velur factory.
            </p>
          </div>

          {/* Instagram Official Profile Card */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden max-w-3xl mx-auto transition-all hover:shadow-2xl">
            {/* Top Gradient Banner */}
            <div className="h-28 sm:h-32 bg-gradient-to-r from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] relative flex items-center justify-between px-6">
              <div className="flex items-center gap-2 text-white/90">
                <Instagram className="w-6 h-6" />
                <span className="text-xs sm:text-sm font-black tracking-wider uppercase">Instagram Official</span>
              </div>
              <div className="text-xs font-semibold text-white/80 bg-black/20 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20">
                Paramathi Velur, Tamil Nadu
              </div>
            </div>

            {/* Profile Info Section */}
            <div className="p-6 sm:p-8 pt-0 relative">
              {/* Avatar + Follow CTA Row */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-5">
                {/* Profile Picture with Instagram Rainbow Story Border */}
                <div className="relative inline-block">
                  <div className="p-1 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-lg">
                    <div className="p-1 rounded-full bg-white">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#191142] flex items-center justify-center text-white overflow-hidden shadow-inner">
                        <span className="font-black text-2xl tracking-tighter text-[#0ea9df]">B<span className="text-white">M</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white shadow-xs" title="Verified Creator">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <a
                    href="https://www.instagram.com/buddy_mattress/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Follow @buddy_mattress</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyProfileLink}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-all cursor-pointer"
                    title="Share Profile"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-gray-500" />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Account Meta & Bio */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-[#191142] tracking-tight">
                      Buddy Mattress
                    </h3>
                    <span className="text-xs font-bold text-gray-500">@buddy_mattress</span>
                  </div>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">
                    Mattress Manufacturer • Home & Sleep Wellness
                  </p>
                </div>

                {/* Metrics: Followers, Following, Posts */}
                <div className="flex items-center gap-6 sm:gap-8 py-2 border-y border-gray-100 text-xs sm:text-sm">
                  <div>
                    <span className="font-black text-[#191142] text-sm sm:text-base">12K</span>
                    <span className="text-gray-500 ml-1">Followers</span>
                  </div>
                  <div>
                    <span className="font-black text-[#191142] text-sm sm:text-base">705</span>
                    <span className="text-gray-500 ml-1">Posts</span>
                  </div>
                  <div>
                    <span className="font-black text-[#191142] text-sm sm:text-base">14</span>
                    <span className="text-gray-500 ml-1">Following</span>
                  </div>
                </div>

                {/* Bio text */}
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed max-w-xl">
                  🛏️ Re-engineering deep sleep for Indian homes. Orthopedic memory foam, natural latex & zero-motion pocket springs. Handcrafted in Paramathi Velur, Tamil Nadu & delivered across India with a 100-night trial! 🇮🇳✨
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Reels Video Showcase Grid */}
          <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#191142] flex items-center gap-2">
                  <Film className="w-5 h-5 text-[#0ea9df]" />
                  <span>Featured Video Reels</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Click any reel to play video demo with sound
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors shadow-2xs"
                  title={isMuted ? "Unmute all videos" : "Mute all videos"}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-gray-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{isMuted ? "Sound Off" : "Sound On"}</span>
                </button>

                <a
                  href="https://www.instagram.com/buddy_mattress/reels/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#0ea9df] hover:text-[#0c93c4] flex items-center gap-1 transition-colors"
                >
                  <span>More on Instagram</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Reels 4-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {reelsData.map((reel) => {
                const isPlaying = playingReelId === reel.id;

                return (
                  <div
                    key={reel.id}
                    className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    {/* Video Container (Vertical 9:16 Aspect Ratio) */}
                    <div className="relative aspect-9/16 bg-black rounded-t-2xl overflow-hidden cursor-pointer">
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

                      {/* Top Badges Overlay */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs border border-white/20">
                          {reel.badge}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/20">
                          <Eye className="w-3 h-3 text-cyan-400" />
                          <span>{reel.views}</span>
                        </div>
                      </div>

                      {/* Center Play/Pause Floating Overlay */}
                      <button
                        type="button"
                        onClick={() => handleTogglePlay(reel.id)}
                        className={`absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/50 text-white backdrop-blur-xs flex items-center justify-center transition-all cursor-pointer z-20 border border-white/30 shadow-lg ${
                          isPlaying
                            ? "opacity-0 group-hover:opacity-100 hover:scale-110"
                            : "opacity-90 hover:opacity-100 hover:scale-110"
                        }`}
                        aria-label={isPlaying ? "Pause video" : "Play video"}
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 fill-white" />
                        ) : (
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        )}
                      </button>

                      {/* Bottom Overlay Info (Reel style) */}
                      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white space-y-1 pointer-events-none z-10">
                        <div className="flex items-center gap-1 text-[10px] text-cyan-300 font-semibold tracking-wider uppercase">
                          <Instagram className="w-3 h-3" />
                          <span>@buddy_mattress</span>
                        </div>
                        <p className="text-xs font-bold line-clamp-1 leading-snug">
                          {reel.title}
                        </p>
                      </div>
                    </div>

                    {/* Reel Footer Details */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3 bg-white">
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {reel.subtitle}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                        <div className="flex items-center gap-1 text-gray-500 font-semibold">
                          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                          <span>{reel.likes}</span>
                        </div>

                        <a
                          href={reel.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-[#0ea9df] hover:text-[#0c93c4] transition-colors"
                        >
                          <span>Watch Reel</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Sleep Science & Engineering Pillars */}
      <section className="bg-gray-50 py-14 sm:py-20 px-4 sm:px-8 border-b border-gray-200/80">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0ea9df]">Engineered for Health</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191142] tracking-tight">
              The Science Inside Every Layer
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              We focus on the four foundational pillars that dictate whether you wake up stiff or rejuvenated.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {brandPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[#0ea9df]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#191142]">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Customer Guarantees */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 max-w-5xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0ea9df]">The Buddy Promise</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191142] tracking-tight">
            Confidence in Every Stitch
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Enjoy complete peace of mind from checkout to delivery and every night after.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {brandPromises.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-gray-200 bg-white space-y-2.5 shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="w-9 h-9 rounded-xl bg-[#191142] text-white flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#0ea9df]" />
                </div>
                <h3 className="text-sm font-bold text-[#191142]">{p.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{p.subtitle}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Ready to sleep better CTA */}
      <section className="pb-16 sm:pb-24 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#191142] to-[#2b1f6f] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready for your best sleep ever?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-md">
              Upgrade your bedroom with Buddy's orthopedic mattresses, pillows, and waterproof protectors.
            </p>
          </div>

          <Link
            to="/shop"
            className="px-8 py-3.5 rounded-full bg-[#0ea9df] hover:bg-[#0c93c4] text-white text-xs sm:text-sm font-bold transition-all shadow-md shrink-0 cursor-pointer"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}

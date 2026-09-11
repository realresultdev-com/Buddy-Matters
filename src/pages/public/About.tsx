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
} from "lucide-react";

export default function About() {
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

      {/* 4. Sleep Science & Engineering Pillars */}
      <section className="bg-gray-50 py-14 sm:py-20 px-4 sm:px-8 border-y border-gray-200/80">
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

      {/* 5. Customer Guarantees */}
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

      {/* 6. Ready to sleep better CTA */}
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

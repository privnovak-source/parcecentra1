import { Link } from "react-router";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen bg-[#0a0a0a] overflow-hidden flex items-center">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(230,57,70,0.15)_0%,transparent_70%)]" />

      {/* Marquee text */}
      <div className="absolute top-1/2 left-0 w-full overflow-hidden opacity-[0.07] pointer-events-none -translate-y-1/2">
        <div className="animate-marquee whitespace-nowrap flex">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="font-['Oswald'] text-[120px] md:text-[180px] font-bold text-white mx-4 select-none shrink-0"
            >
              PARČE CENTRA &bull; PIZZA &bull;
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-24">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <span className="inline-block text-[#fca311] text-xs font-medium uppercase tracking-[3px] mb-4">
              Dobrodošli u
            </span>
            <h1 className="font-['Oswald'] font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Picerija{" "}
              <span className="text-[#e63946]">Parče Centra</span>
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-md mb-8 leading-relaxed">
              Autentična italijanska pizza, pečena sa ljubavlju u srcu
              Požarevca. Poručite online ili posetite nas — svaki zalogaj je
              parče sreće.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("meni")}
                className="px-8 py-3.5 border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-all text-sm"
              >
                Pogledaj Meni
              </button>
              <Link
                to="/menu"
                className="px-8 py-3.5 bg-[#e63946] text-white rounded-lg font-medium hover:bg-[#ff4d5a] transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#e63946]/30 text-sm"
              >
                Poruči Online
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollTo("meni")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
      >
        <ChevronDown className="w-5 h-5 animate-bounce" />
        <span className="text-[10px] uppercase tracking-widest">Skroluj</span>
      </button>
    </section>
  );
}

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Pizza, Menu, X, ShoppingCart, ChevronDown, Phone } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-xl shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Pizza className="w-7 h-7 text-[#e63946] group-hover:rotate-12 transition-transform" />
            <span className="font-['Oswald'] font-semibold text-lg md:text-xl text-white tracking-wide">
              PARČE CENTRA
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo("meni")}
              className="text-white/80 hover:text-[#fca311] text-xs font-medium uppercase tracking-widest transition-colors"
            >
              Meni
            </button>
            <button
              onClick={() => scrollTo("onama")}
              className="text-white/80 hover:text-[#fca311] text-xs font-medium uppercase tracking-widest transition-colors"
            >
              O Nama
            </button>
            <button
              onClick={() => scrollTo("kontakt")}
              className="text-white/80 hover:text-[#fca311] text-xs font-medium uppercase tracking-widest transition-colors"
            >
              Kontakt
            </button>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button
              onClick={() => navigate("/menu")}
              className="relative p-2 text-white/80 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#e63946] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Order Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden sm:flex items-center gap-2 bg-[#e63946] hover:bg-[#ff4d5a] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#e63946]/30">
                  Poruči
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[#161616] border-[#333] text-white min-w-[200px]"
              >
                <DropdownMenuItem
                  onClick={() => navigate("/menu")}
                  className="cursor-pointer hover:bg-[#333] focus:bg-[#333] py-3"
                >
                  <ShoppingCart className="w-4 h-4 mr-3 text-[#e63946]" />
                  <div>
                    <div className="text-sm font-medium">Online poručivanje</div>
                    <div className="text-xs text-white/50">Poručite preko sajta</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => window.location.href = "tel:+381629288482"}
                  className="cursor-pointer hover:bg-[#333] focus:bg-[#333] py-3"
                >
                  <Phone className="w-4 h-4 mr-3 text-[#fca311]" />
                  <div>
                    <div className="text-sm font-medium">Pozovite nas</div>
                    <div className="text-xs text-white/50">+381 62 9288482</div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10">
          <div className="px-4 py-4 space-y-4">
            <button
              onClick={() => scrollTo("meni")}
              className="block w-full text-left text-white/80 hover:text-[#fca311] text-sm font-medium uppercase tracking-widest py-2"
            >
              Meni
            </button>
            <button
              onClick={() => scrollTo("onama")}
              className="block w-full text-left text-white/80 hover:text-[#fca311] text-sm font-medium uppercase tracking-widest py-2"
            >
              O Nama
            </button>
            <button
              onClick={() => scrollTo("kontakt")}
              className="block w-full text-left text-white/80 hover:text-[#fca311] text-sm font-medium uppercase tracking-widest py-2"
            >
              Kontakt
            </button>
            <div className="pt-2 border-t border-white/10 space-y-2">
              <button
                onClick={() => { navigate("/menu"); setMobileOpen(false); }}
                className="w-full flex items-center gap-2 bg-[#e63946] text-white px-4 py-3 rounded-lg text-sm font-medium"
              >
                <ShoppingCart className="w-4 h-4" />
                Online poručivanje
              </button>
              <a
                href="tel:+381629288482"
                className="w-full flex items-center gap-2 bg-[#161616] text-white px-4 py-3 rounded-lg text-sm font-medium"
              >
                <Phone className="w-4 h-4 text-[#fca311]" />
                +381 62 9288482
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

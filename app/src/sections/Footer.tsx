import { Link } from "react-router";
import { Pizza, Instagram, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Pizza className="w-6 h-6 text-[#e63946]" />
              <span className="font-['Oswald'] font-semibold text-lg text-white">
                PARČE CENTRA
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed">
              Vaša omiljena pizza u gradu. Autentični ukusi, sveži sastojci,
              ljubav u svakom zalogaju.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-['Oswald'] font-medium text-white mb-4">
              Brzi Linkovi
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("meni")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-white/50 hover:text-[#e63946] text-sm transition-colors"
                >
                  Meni
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("onama")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-white/50 hover:text-[#e63946] text-sm transition-colors"
                >
                  O nama
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("kontakt")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-white/50 hover:text-[#e63946] text-sm transition-colors"
                >
                  Kontakt
                </button>
              </li>
              <li>
                <Link
                  to="/menu"
                  className="text-white/50 hover:text-[#e63946] text-sm transition-colors"
                >
                  Poruči Online
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Admin */}
          <div>
            <h4 className="font-['Oswald'] font-medium text-white mb-4">
              Pratite Nas
            </h4>
            <div className="flex gap-3 mb-6">
              <a
                href="https://www.instagram.com/_parce_centra_/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#161616] rounded-full flex items-center justify-center text-white/60 hover:bg-[#e63946] hover:text-white transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-xs transition-colors"
            >
              <Lock className="w-3 h-3" />
              Admin Panel
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © 2025 Picerija Parče Centra. Sva prava zadržana.
          </p>
          <p className="text-white/30 text-xs">
            Napravljeno sa ljubavlju u Požarevcu
          </p>
        </div>
      </div>
    </footer>
  );
}

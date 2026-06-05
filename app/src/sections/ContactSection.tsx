import { MapPin, Phone, Clock, Truck } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="kontakt" className="bg-white py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Info */}
          <div>
            <span className="text-[#e63946] text-xs font-medium uppercase tracking-[3px]">
              Kontakt
            </span>
            <h2 className="font-['Oswald'] font-semibold text-3xl md:text-4xl text-[#0a0a0a] mt-3 mb-8">
              Posetite Nas
            </h2>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-[#e63946]/10 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#e63946]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#0a0a0a] mb-1">Adresa</h4>
                  <p className="text-[#595959] text-sm">
                    Lenjinova 1, Požarevac 12000, Srbija
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-[#e63946]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#e63946]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#0a0a0a] mb-1">Telefon</h4>
                  <a
                    href="tel:+381629288482"
                    className="text-[#595959] text-sm hover:text-[#e63946] transition-colors"
                  >
                    +381 62 9288482
                  </a>
                </div>
              </div>

              {/* Working hours */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-[#e63946]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#e63946]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#0a0a0a] mb-1">
                    Radno Vreme
                  </h4>
                  <p className="text-[#595959] text-sm">
                    Svaki dan: 10:00 — 00:00
                  </p>
                </div>
              </div>

              {/* Delivery */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-[#e63946]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-[#e63946]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#0a0a0a] mb-1">Dostava</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-3xl overflow-hidden shadow-xl h-[400px] lg:h-auto min-h-[350px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.1234!2d21.1848444!3d44.6213833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4750efe2adb10a21%3A0xed03d6bf5d619a9d!2sPicerija%20Parce%20centra!5e0!3m2!1ssr!2srs!4v1700000000000!5m2!1ssr!2srs"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "350px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Picerija Parče Centra - Mapa"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

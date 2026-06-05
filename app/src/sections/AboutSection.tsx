export default function AboutSection() {
  return (
    <section id="onama" className="bg-[#0a0a0a] py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <span className="text-[#fca311] text-xs font-medium uppercase tracking-[3px]">
              O Nama
            </span>
            <h2 className="font-['Oswald'] font-semibold text-3xl md:text-4xl text-white mt-3 mb-6">
              Parče Centra — Više od Pizzerije
            </h2>
            <div className="space-y-4 text-white/60 text-sm md:text-base leading-relaxed">
              <p>
                Picerija Parče Centra je nastala iz ljubavi prema autentičnoj
                italijanskoj kuhinji. Naša porodica već decenijama neguje
                tradiciju pravljenja pizze po originalnim receptima, sa svežim
                sastojcima i beskompromisnim kvalitetom.
              </p>
              <p>
                Svaka pizza koja izlazi iz naše peći nosi deo naše priče — od
                pažljivo biranog brašna, preko domaćeg pelata, do ručno
                pripremanog testa koje fermentiše 48 sati. Rezultat je krhka,
                zlatna kora i savršen balans ukusa.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden">
              <img
                src="/food/pizza-oven.jpg"
                alt="Picerija Parče Centra - Pizza peć"
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#e63946]/10 rounded-3xl -z-10" />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#fca311]/10 rounded-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

import { useRef, useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, Plus, Check } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useCart } from "@/contexts/CartContext";

const categoryLabels: Record<string, string> = {
  PIZZA_32CM: "PIZZA 32CM",
  PIZZA_50CM: "PIZZA 50CM",
  SLATKA_PIZZA_32CM: "SLATKA PIZZA 32CM",
  SLATKA_PIZZA_50CM: "SLATKA PIZZA 50CM",
  PALAČINKA: "PALAČINKA",
  SOMUN: "SOMUN",
  PIĆE: "PIĆE",
  POHOVANO: "POHOVANO",
  SALATA: "SALATA",
  POMFRIT: "POMFRIT",
  MINI_PIZZA: "MINI PIZZA",
  DORUČAK: "DORUČAK",
  PIZZA_PARCE: "PIZZA PARČE",
};

const getItemImage = (item: any): string => {
  // Use the Supabase image URL if available, otherwise fall back to local mapping
  if (item.image_url) {
    return item.image_url;
  }
  const imageMap: Record<string, string> = {
    "Margherita 32cm": "/food/margherita.jpg",
    "Pepperoni 32cm": "/food/pepperoni.jpg",
    "Quattro Formaggi 32cm": "/food/quattro-formaggi.jpg",
    "Parče Centra Special 32cm": "/food/parce-special.jpg",
    "Chocco Tropic 32cm": "/food/chocco-tropic.jpg",
    "Nutela Mix": "/food/nutela-mix.jpg",
    "Somun Poh Piletina": "/food/somun-piletina.jpg",
    "Calzone Šunka 32cm": "/food/calzone.jpg",
    "Pomfrit 300g": "/food/pomfrit.jpg",
    "Tuna Salata": "/food/tuna-salata.jpg",
    "Naša Piletina 300g i pomfrit 150g": "/food/nuggets.jpg",
    "Pizza Parče Pepperoni": "/food/pepperoni.jpg",
    "Burger Special 32cm": "/food/parce-special.jpg",
  };
  return imageMap[item.name] || "/food/margherita.jpg";
};

export default function MenuSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: items } = trpc.menu.getPopular.useQuery();
  const { addItem } = useCart();
  const [addedItemId, setAddedItemId] = useState<number | null>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const handleAddItem = (item: any) => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: Number(item.price),
      imageUrl: getItemImage(item),
      description: item.description || undefined,
    });
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1500);
  };

  return (
    <section id="meni" className="bg-white py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <span className="text-[#e63946] text-xs font-medium uppercase tracking-[3px]">
            Naš Meni
          </span>
          <h2 className="font-['Oswald'] font-semibold text-3xl md:text-4xl lg:text-5xl text-[#0a0a0a] mt-3 mb-4">
            Ukusi Koje Volite
          </h2>
          <p className="text-[#595959] text-base max-w-lg">
            Od klasične Margherite do naše specijalne Parče Centra pizze — svako
            parče je majstorstvo.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          >
            {items?.map((item) => (
              <div
                key={item.id}
                className="min-w-[300px] max-w-[300px] bg-[#f4f4f4] rounded-3xl overflow-hidden snap-start group hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={getItemImage(item)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#e63946]/10 text-[#e63946] text-[10px] font-semibold uppercase px-3 py-1 rounded-full">
                    {categoryLabels[item.category] || item.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-['Oswald'] font-medium text-lg text-[#0a0a0a] mb-1">
                    {item.name}
                  </h3>
                  <p className="text-[#595959] text-xs leading-relaxed mb-4 line-clamp-2">
                    {item.description || "Ukusno i sveže pripremljeno"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-['Oswald'] font-semibold text-lg text-[#0a0a0a]">
                      {Number(item.price).toLocaleString("sr-RS")} RSD
                    </span>
                    <button
                      onClick={() => handleAddItem(item)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                        addedItemId === item.id
                          ? "bg-green-500 text-white scale-110"
                          : "bg-[#e63946] text-white hover:bg-[#ff4d5a] hover:scale-105"
                      }`}
                    >
                      {addedItemId === item.id ? (
                        <Check className="w-4 h-4 animate-bounce" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/3 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#e63946] hover:text-white transition-all z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/3 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#e63946] hover:text-white transition-all z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Link to full menu */}
        <div className="text-center mt-10">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-[#e63946] font-medium text-sm hover:underline underline-offset-4"
          >
            Pogledaj celokupan meni
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

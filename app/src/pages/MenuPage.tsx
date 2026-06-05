import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Pizza,
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  ChevronLeft,
  Send,
  Phone,
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useCart } from "@/contexts/CartContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const categoryLabels: Record<string, string> = {
  PIZZA_32CM: "Pizze 32cm",
  PIZZA_50CM: "Pizze 50cm",
  SLATKA_PIZZA_32CM: "Slatke Pizze 32cm",
  SLATKA_PIZZA_50CM: "Slatke Pizze 50cm",
  PALAČINKA: "Palačinke",
  SOMUN: "Somuni",
  PIĆE: "Pića",
  POHOVANO: "Pohovano Razno",
  SALATA: "Obrok Salate",
  POMFRIT: "Pomfrit",
  MINI_PIZZA: "Mini Pizze",
  DORUČAK: "Doručak",
  PIZZA_PARCE: "Pizza Parče",
};

// Map Supabase category names to frontend category names
const categoryMapping: Record<string, string> = {
  "PIZZA 32CM": "PIZZA_32CM",
  "PIZZA 50CM": "PIZZA_50CM",
  "SLATKA PIZZA 32CM": "SLATKA_PIZZA_32CM",
  "SLATKA PIZZA 50CM": "SLATKA_PIZZA_50CM",
  "PALAČINKA": "PALAČINKA",
  "PALA?INKA": "PALAČINKA",
  "SOMUN": "SOMUN",
  "SOMUNI": "SOMUN",
  "PIĆE": "PIĆE",
  "PI?E": "PIĆE",
  "POHOVANO": "POHOVANO",
  "Pohovano razno": "POHOVANO",
  "SALATA": "SALATA",
  "OBROK SALATE": "SALATA",
  "POMFRIT": "POMFRIT",
  "MINI_PIZZA": "MINI_PIZZA",
  "MINI PIZZE PUNJENE KORICE": "MINI_PIZZA",
  "DORUČAK": "DORUČAK",
  "DORUCAK": "DORUČAK",
  "PIZZA PARCE": "PIZZA_PARCE",
};

const categoryOrder = [
  "PIZZA_32CM",
  "PIZZA_50CM",
  "SLATKA_PIZZA_32CM",
  "SLATKA_PIZZA_50CM",
  "PALAČINKA",
  "SOMUN",
  "PIĆE",
  "POHOVANO",
  "SALATA",
  "POMFRIT",
  "MINI_PIZZA",
  "DORUČAK",
  "PIZZA_PARCE",
];

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
  "Somun Pečenica": "/food/somun-piletina.jpg",
  "Chocco Kinder 32cm": "/food/chocco-tropic.jpg",
  "Somun Kulen": "/food/somun-piletina.jpg",
  "Mali Somuni Kulen 4 komada": "/food/somun-piletina.jpg",
  "Pileći Cheeseburger i Pomfrit": "/food/nuggets.jpg",
  "Mini Pizza Pečenica": "/food/margherita.jpg",
  "Mozzarela Štapići": "/food/nuggets.jpg",
  "Pepperoni 50cm": "/food/pepperoni.jpg",
  "Diavola 32cm": "/food/pepperoni.jpg",
  "Margherita 50cm": "/food/margherita.jpg",
};

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("PIZZA_32CM");
  const [cartOpen, setCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { data: menuItems } = trpc.menu.getAll.useQuery();
  const { data: categories } = trpc.menu.getCategories.useQuery();
  const createOrder = trpc.order.create.useMutation();

  const { items, addItem, removeItem, updateQuantity, total, clearCart } = useCart();
  const navigate = useNavigate();

  const getItemImage = (item: any): string => {
    // Use the Supabase image URL if available, otherwise fall back to local mapping
    if (item.image_url) {
      return item.image_url;
    }
    return imageMap[item.name] || "/food/margherita.jpg";
  };

  // Group items by category
  const groupedItems: Record<string, typeof menuItems> = {};
  menuItems?.forEach((item) => {
    if (!groupedItems[item.category]) {
      groupedItems[item.category] = [];
    }
    groupedItems[item.category]!.push(item);
  });

  const availableCategories =
    categories
      ?.filter((c: string) => categoryOrder.includes(c))
      .sort((a: string, b: string) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)) || [];

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Ime je obavezno";
    if (!formData.phone.trim()) errors.phone = "Telefon je obavezan";
    if (!formData.address.trim()) errors.address = "Adresa je obavezna";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOrder = async () => {
    console.log("📋 Order button clicked");
    if (!validateForm()) {
      console.log("❌ Form validation failed");
      return;
    }
    if (items.length === 0) {
      console.log("❌ Cart is empty");
      return;
    }

    console.log("📋 Creating order with data:", {
      customerName: formData.name,
      customerPhone: formData.phone,
      customerAddress: formData.address,
      notes: formData.notes,
      items: items,
    });

    try {
      const order = await createOrder.mutateAsync({
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        notes: formData.notes || undefined,
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      console.log("✓ Order created successfully:", order);
      setOrderId(order.id);
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      console.error("❌ Order error:", err);
    }
  };

  if (orderSuccess && orderId) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="bg-[#161616] rounded-3xl p-8 md:p-12 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#e63946]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-8 h-8 text-[#e63946]" />
          </div>
          <h2 className="font-['Oswald'] font-semibold text-2xl text-white mb-2">
            Porudžbina Primljena!
          </h2>
          <p className="text-white/50 text-sm mb-2">
            Vaš broj porudžbine:
          </p>
          <p className="font-['Oswald'] font-bold text-3xl text-[#e63946] mb-6">
            #{orderId}
          </p>
          <p className="text-white/40 text-xs mb-8">
            Hvala na poverenju! Pozvaćemo vas uskoro radi potvrde.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-[#e63946] hover:bg-[#ff4d5a] text-white h-12 rounded-xl"
            >
              Nazad na Početnu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Nazad</span>
            </Link>

            <div className="flex items-center gap-2">
              <Pizza className="w-5 h-5 text-[#e63946]" />
              <span className="font-['Oswald'] font-semibold text-white">
                PORUČIVANJE
              </span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="tel:+381629288482"
                className="hidden sm:flex items-center gap-2 text-[#fca311] hover:text-[#e63946] transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                +381 62 9288482
              </a>
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-white hover:text-[#e63946] transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#e63946] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="sticky top-16 z-30 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-3">
            {availableCategories.map((cat: string) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all ${
                  activeCategory === cat
                    ? "bg-[#e63946] text-white"
                    : "bg-[#161616] text-white/50 hover:text-white hover:bg-[#222]"
                }`}
              >
                {categoryLabels[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {groupedItems[activeCategory] && (
          <div>
            <h2 className="font-['Oswald'] font-semibold text-2xl text-white mb-6">
              {categoryLabels[activeCategory] || activeCategory}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedItems[activeCategory]!.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#161616] rounded-2xl overflow-hidden group hover:bg-[#1c1c1c] transition-all hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={getItemImage(item)}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-['Oswald'] font-medium text-base text-white mb-1">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-white/40 text-xs mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-['Oswald'] font-semibold text-lg text-[#fca311]">
                        {Number(item.price).toLocaleString("sr-RS")} RSD
                      </span>
                      <button
                        onClick={() =>
                          addItem({
                            menuItemId: item.id,
                            name: item.name,
                            price: Number(item.price),
                            imageUrl: getItemImage(item),
                            description: item.description || undefined,
                          })
                        }
                        className="w-9 h-9 bg-[#e63946] text-white rounded-lg flex items-center justify-center hover:bg-[#ff4d5a] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating cart button */}
      {items.length > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#e63946] text-white px-6 py-3 rounded-full shadow-lg shadow-[#e63946]/30 flex items-center gap-2 animate-pulse-glow"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="font-medium text-sm">
            {total.toLocaleString("sr-RS")} RSD
          </span>
        </button>
      )}

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              setCartOpen(false);
              setShowCheckout(false);
            }}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#161616] shadow-2xl flex flex-col">
            {/* Cart Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-['Oswald'] font-semibold text-lg text-white">
                {showCheckout ? "Podaci za Dostavu" : "Vaša Korpa"}
              </h3>
              <button
                onClick={() => {
                  setCartOpen(false);
                  setShowCheckout(false);
                }}
                className="p-2 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {!showCheckout ? (
                <>
                  {items.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-12 h-12 text-white/20 mx-auto mb-4" />
                      <p className="text-white/40 text-sm">
                        Vaša korpa je prazna
                      </p>
                      <p className="text-white/20 text-xs mt-1">
                        Dodajte stavke iz menija
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.menuItemId}
                          className="flex gap-3 bg-[#0a0a0a] rounded-xl p-3"
                        >
                          <img
                            src={item.imageUrl || "/food/margherita.jpg"}
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm font-medium truncate">
                              {item.name}
                            </h4>
                            <p className="text-[#fca311] text-xs font-medium mt-1">
                              {(item.price * item.quantity).toLocaleString("sr-RS")} RSD
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() =>
                                  updateQuantity(item.menuItemId, item.quantity - 1)
                                }
                                className="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-white text-sm w-5 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.menuItemId, item.quantity + 1)
                                }
                                className="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => removeItem(item.menuItemId)}
                                className="ml-auto p-1 text-white/30 hover:text-[#e63946] transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">
                      Ime i Prezime *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Unesite vaše ime"
                      className={`bg-[#0a0a0a] border-white/10 text-white h-11 rounded-xl focus:border-[#e63946] ${
                        formErrors.name ? "border-red-500" : ""
                      }`}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">
                      Telefon *
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+381 XX XXX XXXX"
                      className={`bg-[#0a0a0a] border-white/10 text-white h-11 rounded-xl focus:border-[#e63946] ${
                        formErrors.phone ? "border-red-500" : ""
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">
                      Adresa Dostave *
                    </label>
                    <Textarea
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Ulica, broj, sprat, interfon..."
                      className={`bg-[#0a0a0a] border-white/10 text-white rounded-xl focus:border-[#e63946] min-h-[80px] resize-none ${
                        formErrors.address ? "border-red-500" : ""
                      }`}
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">
                      Napomena (opciono)
                    </label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Posebne želje, alergije..."
                      className="bg-[#0a0a0a] border-white/10 text-white rounded-xl focus:border-[#e63946] min-h-[60px] resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Ukupno:</span>
                  <span className="font-['Oswald'] font-semibold text-xl text-white">
                    {total.toLocaleString("sr-RS")} RSD
                  </span>
                </div>
                {!showCheckout ? (
                  <Button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-[#e63946] hover:bg-[#ff4d5a] text-white h-12 rounded-xl font-medium"
                  >
                    Nastavi na Plaćanje
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button
                      onClick={handleOrder}
                      disabled={createOrder.isPending}
                      className="w-full bg-[#e63946] hover:bg-[#ff4d5a] text-white h-12 rounded-xl font-medium"
                    >
                      {createOrder.isPending ? "Slanje..." : "Poruči"}
                    </Button>
                    <Button
                      onClick={() => setShowCheckout(false)}
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10 h-10 rounded-xl text-sm"
                    >
                      Nazad na Korpu
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

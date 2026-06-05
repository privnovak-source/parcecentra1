import { Link, useParams } from "react-router";
import { Pizza, CheckCircle } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order } = trpc.order.getById.useQuery(
    { id: Number(id) },
    { enabled: !!id }
  );

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#e63946] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/40 text-sm mt-4">Učitavanje...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="bg-[#161616] rounded-3xl p-8 md:p-12 max-w-md w-full text-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 justify-center mb-8 group"
        >
          <Pizza className="w-6 h-6 text-[#e63946] group-hover:rotate-12 transition-transform" />
          <span className="font-['Oswald'] font-semibold text-lg text-white">
            PARČE CENTRA
          </span>
        </Link>

        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>

        <h2 className="font-['Oswald'] font-semibold text-2xl text-white mb-2">
          Porudžbina Primljena!
        </h2>
        <p className="text-white/50 text-sm mb-2">Vaš broj porudžbine:</p>
        <p className="font-['Oswald'] font-bold text-3xl text-[#e63946] mb-6">
          #{order.id}
        </p>

        <div className="bg-[#0a0a0a] rounded-xl p-4 mb-6 text-left">
          <p className="text-white/30 text-[10px] uppercase tracking-wider mb-2">
            Detalji
          </p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-white/50">Ime:</span>
              <span className="text-white">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Telefon:</span>
              <span className="text-white">{order.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Ukupno:</span>
              <span className="text-[#fca311] font-medium">
                {Number(order.totalAmount).toLocaleString("sr-RS")} RSD
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Status:</span>
              <span className="text-yellow-400">Na čekanju</span>
            </div>
          </div>
        </div>

        <p className="text-white/40 text-xs mb-8">
          Hvala na poverenju! Pozvaćemo vas uskoro radi potvrde porudžbine.
        </p>

        <div className="space-y-3">
          <Link to="/" className="block">
            <Button className="w-full bg-[#e63946] hover:bg-[#ff4d5a] text-white h-12 rounded-xl font-medium">
              Nazad na Početnu
            </Button>
          </Link>
          <Link to="/menu" className="block">
            <Button
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 h-10 rounded-xl text-sm"
            >
              Nova Porudžbina
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

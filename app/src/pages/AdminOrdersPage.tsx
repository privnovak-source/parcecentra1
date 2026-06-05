import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Pizza,
  LogOut,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChefHat,
  RefreshCw,
  History,
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useAdmin } from "@/contexts/AdminContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Na čekanju",
    color: "text-yellow-400 bg-yellow-400/10",
    icon: <Clock className="w-4 h-4" />,
  },
  preparing: {
    label: "Priprema se",
    color: "text-blue-400 bg-blue-400/10",
    icon: <ChefHat className="w-4 h-4" />,
  },
  delivering: {
    label: "U dostavi",
    color: "text-purple-400 bg-purple-400/10",
    icon: <Truck className="w-4 h-4" />,
  },
  delivered: {
    label: "Isporučeno",
    color: "text-green-400 bg-green-400/10",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  cancelled: {
    label: "Otkazano",
    color: "text-red-400 bg-red-400/10",
    icon: <XCircle className="w-4 h-4" />,
  },
};

const statusOptions = [
  { value: "pending", label: "Na čekanju" },
  { value: "preparing", label: "Priprema se" },
  { value: "delivering", label: "U dostavi" },
  { value: "delivered", label: "Isporučeno" },
  { value: "cancelled", label: "Otkazano" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Order = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OrderItem = any;

export default function AdminOrdersPage() {
  const { isAuthenticated, logout } = useAdmin();
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  const [hiddenOrderIds, setHiddenOrderIds] = useState<Set<number>>(new Set());
  const [timers, setTimers] = useState<Record<number, NodeJS.Timeout>>({});
  const [countdowns, setCountdowns] = useState<Record<number, number>>({});

  const {
    data: orders,
    isLoading,
    refetch,
  } = trpc.order.getAll.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 10000,
  });

  const updateStatus = trpc.order.updateStatus.useMutation({
    onSuccess: (_, variables) => {
      refetch();
      // Start 30-second timer when status changes to delivered or cancelled
      if (variables.status === "delivered" || variables.status === "cancelled") {
        setCountdowns((prev) => ({ ...prev, [variables.id]: 30 }));
        
        // Countdown interval
        const countdownInterval = setInterval(() => {
          setCountdowns((prev) => {
            const current = prev[variables.id];
            if (current <= 1) {
              clearInterval(countdownInterval);
              return { ...prev, [variables.id]: 0 };
            }
            return { ...prev, [variables.id]: current - 1 };
          });
        }, 1000);

        // Hide timer after 30 seconds
        const timer = setTimeout(() => {
          setHiddenOrderIds((prev) => new Set([...prev, variables.id]));
          clearInterval(countdownInterval);
        }, 30000);
        setTimers((prev) => ({ ...prev, [variables.id]: timer }));
      }
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer));
    };
  }, [timers]);

  if (!isAuthenticated) return null;

  // Filter orders based on history view and hidden orders
  const orderList = orders || [];
  const visibleOrders = showHistory
    ? orderList.filter((order: Order) => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return new Date(order.created_at) >= thirtyDaysAgo;
      })
    : orderList.filter((order: Order) => {
        // Show only today's orders that are not cancelled or delivered
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const orderDate = new Date(order.created_at);
        orderDate.setHours(0, 0, 0, 0);
        const isToday = orderDate.getTime() === today.getTime();
        const isNotCancelledOrDelivered = order.status !== "cancelled" && order.status !== "delivered";
        const isNotHidden = !hiddenOrderIds.has(order.id);
        return isToday && isNotCancelledOrDelivered && isNotHidden;
      });

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <Pizza className="w-6 h-6 text-[#e63946] group-hover:rotate-12 transition-transform" />
              <span className="font-['Oswald'] font-semibold text-lg text-white">
                ADMIN PANEL
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowHistory(!showHistory)}
                variant={showHistory ? "default" : "outline"}
                className={`text-xs h-8 px-3 ${showHistory ? "bg-[#e63946] hover:bg-[#ff4d5a] text-white border-[#e63946]" : "bg-[#161616] border-[#e63946] text-[#e63946] hover:bg-[#e63946] hover:text-white"}`}
              >
                <History className="w-4 h-4 mr-2" />
                {showHistory ? "Sve Porudžbine" : "Istorija (30 dana)"}
              </Button>
              <button
                onClick={() => refetch()}
                className="p-2 text-white/40 hover:text-white transition-colors"
                title="Osveži"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-white/40 hover:text-[#e63946] text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Odjavi se</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Ukupno Porudžbina",
              value: visibleOrders.length,
              color: "text-white",
            },
            {
              label: "Na Čekanju",
              value: visibleOrders.filter((o: Order) => o.status === "pending").length,
              color: "text-yellow-400",
            },
            {
              label: "U Pripremi",
              value: visibleOrders.filter((o: Order) => o.status === "preparing").length,
              color: "text-blue-400",
            },
            {
              label: "Isporučeno",
              value: visibleOrders.filter((o: Order) => o.status === "delivered").length,
              color: "text-green-400",
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#161616] rounded-2xl p-5">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">
                {stat.label}
              </p>
              <p className={`font-['Oswald'] font-bold text-2xl ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          <h2 className="font-['Oswald'] font-semibold text-xl text-white mb-4">
            {showHistory ? "Istorija Porudžbina (Poslednjih 30 dana)" : "Sve Porudžbine"}
          </h2>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-[#e63946] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-white/40 text-sm mt-4">Učitavanje...</p>
            </div>
          ) : visibleOrders.length > 0 ? (
            <div className="space-y-3">
              {visibleOrders.map((order: Order) => {
                const status = statusConfig[order.status || "pending"];
                return (
                  <div
                    key={order.id}
                    className="bg-[#161616] rounded-2xl overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="p-4 sm:p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#e63946]/10 rounded-xl flex items-center justify-center">
                            <span className="font-['Oswald'] font-bold text-sm text-[#e63946]">
                              #{order.id}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-white font-medium text-sm">
                              {order.customerName}
                            </h3>
                            <p className="text-white/40 text-xs">
                              {order.customerPhone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.color}`}
                          >
                            {status.icon}
                            {status.label}
                          </span>
                          {countdowns[order.id] > 0 && (
                            <span className="flex items-center gap-1 text-[#e63946] text-xs font-medium animate-pulse">
                              <Clock className="w-3 h-3" />
                              {countdowns[order.id]}s
                            </span>
                          )}
                          <span className="font-['Oswald'] font-semibold text-lg text-[#fca311]">
                            {Number(order.totalAmount).toLocaleString("sr-RS")}{" "}
                            RSD
                          </span>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">
                            Adresa
                          </p>
                          <p className="text-white/70 text-sm">
                            {order.customerAddress}
                          </p>
                        </div>
                        {order.notes && (
                          <div>
                            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">
                              Napomena
                            </p>
                            <p className="text-white/70 text-sm">
                              {order.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Order Items */}
                      <div className="bg-[#0a0a0a] rounded-xl p-3 mb-4">
                        <p className="text-white/30 text-[10px] uppercase tracking-wider mb-2">
                          Stavke
                        </p>
                        <div className="space-y-1.5">
                          {order.items.map((item: OrderItem) => (
                            <div
                              key={item.id}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-white/60">
                                {item.quantity}x {item.itemName}
                              </span>
                              <span className="text-white/40">
                                {(
                                  Number(item.itemPrice) * item.quantity
                                ).toLocaleString("sr-RS")}{" "}
                                RSD
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status Dropdown */}
                      <div className="flex items-center gap-3">
                        <span className="text-white/40 text-xs">
                          Promeni status:
                        </span>
                        <Select
                          value={order.status || "pending"}
                          onValueChange={(value) =>
                            updateStatus.mutate({
                              id: order.id,
                              status: value as "pending" | "preparing" | "delivering" | "delivered" | "cancelled",
                            })
                          }
                        >
                          <SelectTrigger className="w-[180px] bg-[#0a0a0a] border-white/10 text-white h-9 rounded-lg text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#161616] border-white/10">
                            {statusOptions.map((opt) => (
                              <SelectItem
                                key={opt.value}
                                value={opt.value}
                                className="text-white text-xs focus:bg-[#222] focus:text-white"
                              >
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#161616] rounded-2xl">
              <p className="text-white/30 text-sm">Nema porudžbina</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

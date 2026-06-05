import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Pizza, Lock, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/contexts/AdminContext";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = await login(password);
    if (success) {
      navigate("/admin/orders");
    } else {
      setError("Pogrešna šifra. Pokušajte ponovo.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 justify-center mb-10 group"
        >
          <Pizza className="w-8 h-8 text-[#e63946] group-hover:rotate-12 transition-transform" />
          <span className="font-['Oswald'] font-semibold text-2xl text-white">
            PARČE CENTRA
          </span>
        </Link>

        {/* Login Card */}
        <div className="bg-[#161616] rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#e63946]/10 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#e63946]" />
            </div>
            <div>
              <h1 className="font-['Oswald'] font-semibold text-lg text-white">
                Admin Panel
              </h1>
              <p className="text-white/40 text-xs">Unesite administratorsku šifru</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Šifra"
                className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl focus:border-[#e63946]"
              />
              {error && (
                <p className="text-red-500 text-xs mt-2">{error}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-[#e63946] hover:bg-[#ff4d5a] text-white h-12 rounded-xl font-medium"
            >
              Uloguj se
            </Button>
          </form>
        </div>

        {/* Back Link */}
        <Link
          to="/"
          className="flex items-center gap-2 text-white/30 hover:text-white/60 text-sm mt-6 justify-center transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Nazad na sajt
        </Link>
      </div>
    </div>
  );
}

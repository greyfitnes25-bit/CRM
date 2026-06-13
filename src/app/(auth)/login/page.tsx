"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor ingresa tu email y contraseña");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Usuario o contraseña incorrectos");
      } else {
        toast.success("¡Bienvenido de vuelta!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error("Error al iniciar sesión. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail("admin@greycrm.com");
    setPassword("demo123");
  };

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-500/30">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">GreyCRM</h1>
        <p className="text-slate-400 mt-1 text-sm">CRM Inteligente para tu Negocio</p>
      </div>

      {/* Card */}
      <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">Iniciar Sesión</h2>
          <p className="text-slate-400 text-sm mt-1">Ingresa tus credenciales para continuar</p>
        </div>

        {/* Demo credentials banner */}
        <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-300 font-medium">Credenciales Demo</p>
            <p className="text-xs text-blue-400">admin@greycrm.com / demo123</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={fillDemo}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 text-xs"
          >
            Usar
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300 text-sm">
              Correo Electrónico
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="tu@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/30"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300 text-sm">
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/30"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm text-slate-400 cursor-pointer"
              >
                Recordarme
              </Label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium h-11 transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Iniciando sesión...
              </span>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-slate-500 text-xs mt-6">
        © 2024 GreyCRM. Todos los derechos reservados.
      </p>
    </div>
  );
}

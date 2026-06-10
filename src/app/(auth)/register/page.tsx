"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Eye, EyeOff, Lock, Mail, User, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrarse");
      }

      toast.success("¡Cuenta creada exitosamente! Inicia sesión.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Error al crear la cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-500/30">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">GreyCRM</h1>
        <p className="text-slate-400 mt-1 text-sm">Crea tu cuenta gratis</p>
      </div>

      {/* Card */}
      <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">Crear Cuenta</h2>
          <p className="text-slate-400 text-sm mt-1">
            Completa los datos para empezar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-slate-300 text-sm">
              Nombre de la Empresa
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Mi Empresa S.A."
                value={formData.companyName}
                onChange={handleChange}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300 text-sm">
              Tu Nombre
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Juan García"
                value={formData.name}
                onChange={handleChange}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300 text-sm">
              Correo Electrónico
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@empresa.com"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                required
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
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-300 text-sm">
              Confirmar Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repite la contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium h-11 mt-2 shadow-lg shadow-blue-500/25"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creando cuenta...
              </span>
            ) : (
              "Crear Cuenta Gratis"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Bell,
  Building2,
  Camera,
  Check,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  Shield,
  Smartphone,
  User,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RoleAvatar } from "@/components/common/role-avatar";
import { ROLE_COLORS, ROLE_LABELS } from "@/lib/constants";

const PROFILE_KEY = "greycrm-profile-demo";

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  city: string;
  bio: string;
  avatar: string | null;
  notifyEmail: boolean;
  notifyPush: boolean;
  notifyWhatsapp: boolean;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;
  const role = (user?.role as string) ?? "SELLER";
  const [saved, setSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [form, setForm] = useState<ProfileForm>({
    name: user?.name || "Usuario",
    email: user?.email || "",
    phone: "+1 809 000 0000",
    position: ROLE_LABELS[role] || "Vendedor",
    department: role === "TECHNICIAN" ? "Operaciones" : "Comercial",
    city: "Santo Domingo",
    bio: "Miembro del equipo de GreyCRM.",
    avatar: (user?.avatar as string | null) || null,
    notifyEmail: true,
    notifyPush: true,
    notifyWhatsapp: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (stored) {
      setForm((current) => ({ ...current, ...JSON.parse(stored) }));
      return;
    }
    setForm((current) => ({
      ...current,
      name: user?.name || current.name,
      email: user?.email || current.email,
      avatar: (user?.avatar as string | null) || current.avatar,
    }));
  }, [user?.avatar, user?.email, user?.name]);

  const updateForm = <K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const handleAvatarUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateForm("avatar", String(reader.result));
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const savePassword = () => {
    if (!passwordForm.current || !passwordForm.next || passwordForm.next !== passwordForm.confirm) return;
    setPasswordForm({ current: "", next: "", confirm: "" });
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2500);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <Button asChild variant="ghost" size="sm" className="gap-2 px-0 hover:bg-transparent">
            <Link href="/settings">
              <ArrowLeft className="h-4 w-4" />
              Configuracion
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Mi Perfil</h1>
            <p className="text-sm text-muted-foreground">
              Edita tu informacion personal, foto, contacto y preferencias de cuenta.
            </p>
          </div>
        </div>
        <Badge variant="outline" className={ROLE_COLORS[role]}>
          <Shield className="mr-1 h-3.5 w-3.5" />
          {ROLE_LABELS[role] ?? role}
        </Badge>
      </div>

      {(saved || passwordSaved) && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300">
          {saved ? "Perfil guardado correctamente." : "Contrasena actualizada en esta demo."}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <RoleAvatar
                  name={form.name}
                  role={role}
                  src={form.avatar}
                  className="[&_.h-10]:h-28 [&_.w-10]:w-28 [&_.text-xs]:text-2xl [&_.h-5]:h-8 [&_.w-5]:w-8"
                  badgeClassName="h-8 w-8"
                />
                <label className="absolute bottom-0 left-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-md">
                  <Camera className="h-4 w-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => handleAvatarUpload(event.target.files?.[0])} />
                </label>
              </div>

              <h2 className="mt-5 text-lg font-semibold">{form.name || "Usuario"}</h2>
              <p className="text-sm text-muted-foreground">{form.email || "Sin correo"}</p>
              <p className="mt-1 text-xs text-muted-foreground">{form.position} · {form.department}</p>

              <Separator className="my-5" />

              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Empresa</p>
                    <p className="truncate text-sm font-medium">{user?.companyName || "GreyCRM Demo"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <UserRound className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">ID de usuario</p>
                    <p className="text-sm font-mono">{(user?.id as string | undefined)?.slice(0, 10) || "demo-user"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ubicacion</p>
                    <p className="text-sm font-medium">{form.city}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Informacion personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Nombre completo</label>
                  <Input value={form.name} onChange={(event) => updateForm("name", event.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Correo</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={form.email} onChange={(event) => updateForm("email", event.target.value)} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Telefono</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Ciudad</label>
                  <Input value={form.city} onChange={(event) => updateForm("city", event.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Cargo visible</label>
                  <Input value={form.position} onChange={(event) => updateForm("position", event.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Departamento</label>
                  <Input value={form.department} onChange={(event) => updateForm("department", event.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Nota de perfil</label>
                <Textarea rows={3} value={form.bio} onChange={(event) => updateForm("bio", event.target.value)} />
              </div>
              <Button onClick={saveProfile} className="gap-2">
                <Check className="h-4 w-4" />
                Guardar perfil
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bell className="h-4 w-4" />
                  Preferencias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "notifyEmail" as const, icon: Mail, title: "Alertas por correo", desc: "Recibir resumenes y avisos importantes." },
                  { key: "notifyPush" as const, icon: Smartphone, title: "Notificaciones del CRM", desc: "Avisos dentro de la aplicacion." },
                  { key: "notifyWhatsapp" as const, icon: Phone, title: "Avisos por WhatsApp", desc: "Preparado para integracion futura." },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                    <div className="flex gap-3">
                      <item.icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                      </div>
                    </div>
                    <Switch checked={form[item.key]} onCheckedChange={(checked) => updateForm(item.key, checked)} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <KeyRound className="h-4 w-4" />
                  Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Contrasena actual</label>
                  <Input type="password" value={passwordForm.current} onChange={(event) => setPasswordForm((current) => ({ ...current, current: event.target.value }))} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Nueva contrasena</label>
                  <Input type="password" value={passwordForm.next} onChange={(event) => setPasswordForm((current) => ({ ...current, next: event.target.value }))} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Confirmar contrasena</label>
                  <Input type="password" value={passwordForm.confirm} onChange={(event) => setPasswordForm((current) => ({ ...current, confirm: event.target.value }))} />
                  {passwordForm.confirm && passwordForm.next !== passwordForm.confirm && (
                    <p className="text-xs text-red-500">Las contrasenas no coinciden.</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={savePassword}
                  disabled={!passwordForm.current || !passwordForm.next || passwordForm.next !== passwordForm.confirm}
                >
                  <KeyRound className="h-4 w-4" />
                  Actualizar contrasena
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "GreyCRM - CRM Inteligente para tu Negocio",
    template: "%s | GreyCRM",
  },
  description:
    "GreyCRM es el CRM todo en uno para gestionar leads, ventas, instalaciones y garantías. Conecta con WhatsApp, Instagram y Meta Ads.",
  keywords: ["CRM", "ventas", "leads", "WhatsApp", "Meta Ads", "gestión de clientes"],
  authors: [{ name: "GreyCRM" }],
  creator: "GreyCRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <SessionProvider>
          <ThemeProvider defaultTheme="light" storageKey="greycrm-theme">
            {children}
            <Toaster
              position="top-right"
              richColors
              expand={true}
              closeButton
            />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

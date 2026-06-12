import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { FontPreferenceProvider } from "@/components/providers/font-preference-provider";
import { AppearancePreferenceProvider } from "@/components/providers/appearance-preference-provider";
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
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
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
  icons: {
    icon: "/branding/greycrm-icon.png",
    shortcut: "/branding/greycrm-icon.png",
    apple: "/branding/greycrm-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem("greycrm-theme") || "dark";
                  var resolved = theme === "system"
                    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
                    : theme;
                  document.documentElement.classList.remove("light", "dark");
                  document.documentElement.classList.add(resolved);
                  var defaultFont = "var(--font-poppins), Poppins, var(--font-geist-sans), system-ui, sans-serif";
                  var storedFont = localStorage.getItem("greycrm-font-family");
                  if (!storedFont || /\\b(serif|georgia|times|cambria|garamond|baskerville)\\b/i.test(storedFont)) {
                    localStorage.setItem("greycrm-font-family", defaultFont);
                    storedFont = defaultFont;
                  }
                  document.documentElement.style.setProperty("--app-font-family", storedFont);
                  if (document.body) {
                    document.body.style.setProperty("--app-font-family", storedFont);
                    document.body.style.setProperty("font-family", storedFont);
                  }
                } catch (error) {}
              })();
            `,
          }}
        />
        <SessionProvider>
          <ThemeProvider defaultTheme="dark" storageKey="greycrm-theme">
            <AppearancePreferenceProvider>
              <FontPreferenceProvider>
                {children}
                <Toaster
                  position="top-right"
                  richColors
                  expand={true}
                  closeButton
                />
              </FontPreferenceProvider>
            </AppearancePreferenceProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

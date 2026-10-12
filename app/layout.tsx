import type { Metadata, Viewport } from "next";
import { Anton, Bangers, Bricolage_Grotesque } from "next/font/google";
import "@/styles/globals.css";
import { SITE } from "@/lib/site";
import { BootScript } from "@/components/layout/BootScript";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ToastProvider } from "@/components/ui/Toaster";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { CurrencyProvider } from "@/components/shop/CurrencyProvider";
import { getRates } from "@/lib/server/rates";
import { getCartCatalog } from "@/lib/shop/catalog";
import { CatalogProvider } from "@/components/shop/CatalogProvider";
import { PublicOnly } from "@/components/layout/PublicOnly";

// Polices auto-hébergées par Next au build : aucune requête vers Google côté visiteur.
const anton = Anton({ weight: "400", subsets: ["latin", "latin-ext"], variable: "--font-anton", display: "swap" });
const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bricolage",
  display: "swap",
});
const bangers = Bangers({ weight: "400", subsets: ["latin", "latin-ext"], variable: "--font-bangers", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.slogan}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": [{ url: "/rss.xml", title: `${SITE.name} — flux RSS` }] },
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.slogan}`,
    description: SITE.description,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#111114",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [rates, catalog] = await Promise.all([getRates(), getCartCatalog()]);
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${anton.variable} ${bricolage.variable} ${bangers.variable}`}
    >
      <head>
        <BootScript />
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}"}</style>
        </noscript>
      </head>
      <body className="bg-paper text-ink">
        <a
          href="#contenu"
          className="fixed top-2 left-2 z-[110] -translate-y-24 border-[3px] border-ink bg-yellow px-4 py-2 font-bold shadow-pop transition-transform focus:translate-y-0"
        >
          Aller au contenu
        </a>
        <MotionProvider>
          <CurrencyProvider rates={rates}>
            <CatalogProvider products={catalog}>
              <ToastProvider>
                <PublicOnly>
                  <Header />
                </PublicOnly>
                <main id="contenu" tabIndex={-1} className="outline-none">
                  {children}
                </main>
                <PublicOnly>
                  <Footer />
                  <CartDrawer />
                </PublicOnly>
              </ToastProvider>
            </CatalogProvider>
          </CurrencyProvider>
        </MotionProvider>
      </body>
    </html>
  );
}

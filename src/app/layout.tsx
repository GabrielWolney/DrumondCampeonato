import type { Metadata, Viewport } from "next";
import { Open_Sans, Oswald } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import { createClient } from "@supabase/supabase-js";
import { ToastProvider } from "@/components/ui/Toast";
import { LightboxProvider } from "@/context/LightboxContext";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-opensans",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nacionaldesinuca.drumondsports.com.br"),
  title: "Primeiro Nacional de Sinuca | Drumond Sports",
  description: "Participe do maior evento de sinuca do Brasil. Ingressos limitados. Inscreva-se para o campeonato ou garanta seu lugar como espectador.",
  keywords: "sinuca, nacional de sinuca, Drumond Sports, campeonato de sinuca, Brasília, evento esportivo",
  authors: [{ name: "Drumond Sports" }],
  creator: "Drumond Sports",
  publisher: "Drumond Sports",
  robots: "index, follow",
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    title: "Primeiro Nacional de Sinuca | Drumond Sports",
    description: "Os melhores jogadores do país em uma disputa única pelo título nacional. Garanta seu ingresso!",
    siteName: "Nacional de Sinuca",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    images: [{ url: "/share-image.webp", width: 1200, height: 630, alt: "Primeiro Nacional de Sinuca - Drumond Sports" }],
    locale: "pt_BR",
    countryName: "Brazil",
  },
  twitter: {
    card: "summary_large_image",
    title: "Primeiro Nacional de Sinuca | Drumond Sports",
    description: "Os melhores jogadores do país em uma disputa única pelo título nacional.",
    images: ["/share-image.webp"],
    site: "@drumondsports",
    creator: "@drumondsports",
  },
  applicationName: "Nacional de Sinuca",
appleWebApp: {
  capable: true,
  title: "Nacional de Sinuca",
  statusBarStyle: "black-translucent",
},
icons: {
  icon: [
    { url: "/favicon.ico", sizes: "any" },
    { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    { url: "/favicon.svg", type: "image/svg+xml" },
  ],
  apple: [
    { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  ],
  other: [
    {
      rel: "manifest",
      url: "/site.webmanifest",
    },
  ],
},
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION },
  category: "sports",
};

async function getMarketingScripts() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return { metaPixel: "", ga: "", ads: "" };

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from("site_config")
      .select("key, value")
      .in("key", ["meta_pixel_id", "google_analytics_id", "google_ads_id"]);

    if (error) {
      console.error("Erro ao carregar scripts de marketing:", error.message);
      return { metaPixel: "", ga: "", ads: "" };
    }

    const config: Record<string, string> = {};
    data?.forEach((item) => { config[item.key] = item.value; });
    return {
      metaPixel: config.meta_pixel_id || "",
      ga: config.google_analytics_id || "",
      ads: config.google_ads_id || "",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    console.error("Erro ao carregar scripts de marketing:", message);
    return { metaPixel: "", ga: "", ads: "" };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const scripts = await getMarketingScripts();

  return (
    <html lang="pt-BR" className={`${oswald.variable} ${openSans.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="font-body antialiased overflow-hidden w-full h-[100dvh] relative">
        <LightboxProvider>
          <ToastProvider>
            {/* Meta Pixel Code */}
            {scripts.metaPixel && (
              <>
                <Script id="meta-pixel" strategy="afterInteractive">
                  {`
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${scripts.metaPixel}');
                    fbq('track', 'PageView');
                  `}
                </Script>
                <noscript>
                  <img height="1" width="1" style={{ display: "none" }} src={`https://www.facebook.com/tr?id=${scripts.metaPixel}&ev=PageView&noscript=1`} />
                </noscript>
              </>
            )}

            {/* Google Analytics */}
            {scripts.ga && (
              <>
                <Script src={`https://www.googletagmanager.com/gtag/js?id=${scripts.ga}`} strategy="afterInteractive" />
                <Script id="google-analytics" strategy="afterInteractive">
                  {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${scripts.ga}');
                  `}
                </Script>
              </>
            )}

            {/* Google Ads */}
            {scripts.ads && (
              <Script id="google-ads" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${scripts.ads}');
                `}
              </Script>
            )}

            <Navbar />
            <main id="main-scroll-container" className="w-full h-full overflow-y-auto overflow-x-hidden relative">
              {children}
            </main>
          </ToastProvider>
        </LightboxProvider>
      </body>
    </html>
  );
}
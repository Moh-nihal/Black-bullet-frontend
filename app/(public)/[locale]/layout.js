import "../../globals.css";
import SchemaMarkup from "@/components/SchemaMarkup";
import PublicShell from "@/components/PublicShell";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
export const metadata = {
  title: "Black Bullet Garage Performance | Dubai",
  description:
    "The pinnacle of performance tuning and aesthetic restoration in Dubai. ECU remapping, carbon fiber kits, exhaust systems, and bespoke automotive engineering.",
  keywords: [
    "car performance tuning Dubai",
    "ECU remapping",
    "carbon fiber kits",
    "exhaust systems",
    "Black Bullet Garage",
  ],
};

export default async function RootLayout({ children, params }) {
  const resolved = params instanceof Promise ? await params : params;
  const raw = resolved?.locale;
  const locale = raw === "ar" ? "ar" : "en";
  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <html lang={locale} dir={dir}>
      <head>
        <SchemaMarkup locale={locale} />
        <link rel="alternate" hrefLang="en" href={`http://localhost:3000/en`} />
        <link rel="alternate" hrefLang="ar" href={`http://localhost:3000/ar`} />
        
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
            `}
          </Script>
        )}

        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-space-grotesk: 'Space Grotesk', sans-serif;
            --font-manrope: 'Manrope', sans-serif;
          }
        `}</style>
      </head>
      <body
        className={`font-manrope font-body bg-background text-on-surface min-h-screen antialiased ${locale === 'ar' ? 'rtl' : ''}`}
      >
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <Toaster position="top-right" />
        <PublicShell locale={locale}>{children}</PublicShell>
      </body>
    </html>
  );
}

import "./globals.css";
import PublicShell from "@/components/PublicShell";
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
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
        className="font-manrope font-body bg-background text-on-surface min-h-screen antialiased"
      >
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}

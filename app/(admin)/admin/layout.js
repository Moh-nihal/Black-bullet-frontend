export const metadata = {
  title: "Admin Dashboard | BLACK BULLET GARAGE",
  description: "Internal operations dashboard for Black Bullet Garage Performance Dubai.",
};

import { Toaster } from "react-hot-toast";
import "../../globals.css";

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-manrope antialiased bg-background text-on-surface">
        <div className="flex h-screen w-full overflow-hidden bg-background">
          <Toaster position="top-right" />
          {children}
        </div>
      </body>
    </html>
  );
}

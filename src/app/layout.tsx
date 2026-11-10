import type { Metadata } from "next";
import "@fontsource-variable/dm-sans";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500.css";
import "./globals.css";
import { Navigation, Footer } from "@/components/navigation";
export const metadata: Metadata = {
  title: {
    default: "Aurora Travel — Un viaje a tu manera",
    template: "%s · Aurora Travel",
  },
  description:
    "Una colección de lugares para mirar el mundo de otra manera. Explora destinos, guarda favoritos y diseña un itinerario local. Demo sin reservas reales.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}

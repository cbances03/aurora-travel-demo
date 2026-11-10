import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
export default function NotFound() {
  return (
    <main id="contenido" className="container not-found">
      <Compass size={48} strokeWidth={1} />
      <span className="overline">404 / FUERA DEL MAPA</span>
      <h1>
        Este camino aún
        <br />
        no tiene <em>destino.</em>
      </h1>
      <p>Vuelve a nuestra colección y encuentra otra forma de viajar.</p>
      <Link href="/destinos" className="button">
        <ArrowLeft size={16} />
        Explorar destinos
      </Link>
    </main>
  );
}

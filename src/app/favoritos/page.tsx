import type { Metadata } from "next";
import { Explorer } from "@/components/explorer";
export const metadata: Metadata = { title: "Mis lugares" };
export default function Favorites() {
  return (
    <main id="contenido" className="container explore-page">
      <header className="page-title">
        <span className="overline">TU COLECCIÓN PERSONAL</span>
        <h1>
          Lugares que
          <br />
          te hacen <em>volver a soñar.</em>
        </h1>
        <p>
          Lo que guardas aquí se queda en este navegador.
          <br />
          Tu próximo viaje puede empezar con cualquiera de ellos.
        </p>
      </header>
      <Explorer favoritesOnly />
    </main>
  );
}

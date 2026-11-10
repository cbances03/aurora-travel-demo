import type { Metadata } from "next";
import { ExperienceCatalog } from "@/components/experience-catalog";
export const metadata: Metadata = { title: "Experiencias" };
export default function Experiences() {
  return (
    <main id="contenido" className="container experience-page">
      <header className="page-title">
        <span className="overline">NO SOLO IR. TAMBIÉN ESTAR.</span>
        <h1>
          Momentos para
          <br />
          llevarte <em>contigo.</em>
        </h1>
        <p>
          Ideas de paseos, encuentros y pausas para tu itinerario.
          <br />
          Todas las experiencias y sus precios son ficticios.
        </p>
      </header>
      <ExperienceCatalog />
      <aside className="editorial-disclaimer">
        La simulación de reserva no genera compromisos ni disponibilidad real.
        No se procesan pagos ni se contacta a proveedores.
      </aside>
    </main>
  );
}

import type { Metadata } from "next";
import { Explorer } from "@/components/explorer";
export const metadata: Metadata = { title: "Explorar destinos" };
export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  return (
    <main id="contenido" className="container explore-page">
      <header className="page-title">
        <span className="overline">EL MUNDO, CON OTRA MIRADA</span>
        <h1>
          ¿Dónde empieza
          <br />
          tu próxima <em>historia?</em>
        </h1>
        <p>
          Seis destinos. Distintas maneras de sentir el viaje.
          <br />
          Encuentra el que habla de ti.
        </p>
      </header>
      <Explorer initialCategory={categoria} />
      <div className="editorial-disclaimer">
        Destinos reales, selección editorial de demostración. Las experiencias y
        duraciones son propuestas ficticias, no itinerarios operativos.
      </div>
    </main>
  );
}

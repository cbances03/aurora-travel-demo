import type { Metadata } from "next";
import { destinations } from "@/lib/travel";
export const metadata: Metadata = { title: "Créditos y alcance" };
export default function Credits() {
  return (
    <main id="contenido" className="container credits-page">
      <header className="page-title">
        <span className="overline">LAS MIRADAS DETRÁS DEL VIAJE</span>
        <h1>
          Créditos y<br />
          <em>cosas claras.</em>
        </h1>
        <p>
          La fotografía nos acerca a los lugares antes de estar ahí. Estas son
          las personas cuyas imágenes acompañan nuestra demo.
        </p>
      </header>
      <section>
        <h2>Fotografía de Unsplash</h2>
        <p>
          Imágenes descargadas y servidas localmente bajo la{" "}
          <a
            href="https://unsplash.com/license"
            target="_blank"
            rel="noreferrer"
          >
            licencia Unsplash (abre otra pestaña)
          </a>
          . No se utilizan imágenes de Unsplash+.
        </p>
        <ul className="credit-list">
          {destinations.map((d) => (
            <li key={d.slug}>
              <span>{d.name}</span>
              <a
                href={`https://unsplash.com/photos/${d.photoId}`}
                target="_blank"
                rel="noreferrer"
              >
                {d.credit} / Unsplash
                <span className="sr-only">, abre otra pestaña</span> ↗
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Una demo para imaginar</h2>
        <p>
          Aurora Travel es un proyecto ficticio. Los destinos y las fotografías
          corresponden a lugares reales; las experiencias, duraciones y
          presupuestos son contenido de demostración. No se consulta
          disponibilidad ni se realizan reservas, pagos o envíos de datos.
        </p>
        <p>
          El planificador guarda datos en localStorage de este navegador. Sin
          cuenta, sincronización ni servidor. Las simulaciones de reserva no
          conservan tu nombre o correo electrónico.
        </p>
      </section>
      <section>
        <h2>Identidad y recursos</h2>
        <p>
          Composición, icono solar y sistema visual creados para Aurora. Iconos
          de Lucide bajo licencia ISC. Fuentes DM Sans y Cormorant Garamond bajo
          SIL Open Font License, autoalojadas mediante Fontsource.
        </p>
      </section>
    </main>
  );
}

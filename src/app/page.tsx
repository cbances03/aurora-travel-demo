import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Map,
  Heart,
  MoveDown,
  Sun,
  Mountain,
  Leaf,
  Camera,
} from "lucide-react";
import { destinations } from "@/lib/travel";
import { DestinationCard } from "@/components/destination-card";
import { Reveal } from "@/components/ui";
export default function Home() {
  return (
    <main id="contenido">
      <section className="travel-hero">
        <Image
          src="/images/dolomitas.webp"
          alt="Reflejos de montañas nevadas en un lago de las Dolomitas"
          fill
          preload
          sizes="100vw"
        />
        <div className="hero-shade" />
        <div className="container hero-inner">
          <span className="overline light">
            PARA QUIENES VIAJAN CON CURIOSIDAD
          </span>
          <h1>
            Hay lugares.
            <br />Y hay <em>encuentros.</em>
          </h1>
          <p>
            Sal del mapa de siempre. Descubre paisajes, historias
            <br className="desktop-break" /> y pequeños momentos que se quedan
            contigo.
          </p>
          <Link href="/destinos" className="button button-cream">
            Encuentra tu próximo lugar <ArrowUpRight size={17} />
          </Link>
          <div className="hero-location">
            <span>01 / EN EL HORIZONTE</span>
            <Link href="/destinos/dolomitas">
              Dolomitas, Italia <ArrowUpRight size={13} />
            </Link>
          </div>
          <Link
            href="#descubre"
            className="hero-scroll"
            aria-label="Descubrir destinos"
          >
            <MoveDown size={20} />
          </Link>
        </div>
      </section>
      <div className="travel-manifesto">
        <div className="container manifesto-row">
          <p>
            Menos itinerarios imposibles.
            <br />
            <span>Más viajes que se sienten tuyos.</span>
          </p>
          <span>
            <Compass size={19} /> Lugares con carácter
          </span>
          <span>
            <Leaf size={19} /> Un ritmo más humano
          </span>
          <span>
            <Heart size={19} /> Ideas para guardar
          </span>
        </div>
      </div>
      <section className="section container" id="descubre">
        <Reveal>
          <div className="section-top">
            <div>
              <span className="overline">LA COLECCIÓN AURORA / 01</span>
              <h2>
                Elige qué quieres <em>sentir.</em>
              </h2>
            </div>
            <Link href="/destinos" className="text-link">
              Explorar todos los destinos <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="destination-grid home-destinations">
            {destinations.slice(0, 3).map((d, i) => (
              <DestinationCard key={d.slug} destination={d} index={i} />
            ))}
          </div>
        </Reveal>
      </section>
      <section className="editorial-band">
        <div className="container editorial-grid">
          <div className="editorial-photo">
            <Image
              src="/images/valle-sagrado.webp"
              alt="Terrazas incas entre las montañas del Valle Sagrado"
              fill
              sizes="(max-width:767px) 100vw, 50vw"
            />
            <span>PERÚ / VALLE SAGRADO</span>
          </div>
          <Reveal className="editorial-copy">
            <span className="overline">EL ARTE DE IR MÁS DESPACIO</span>
            <h2>
              El mejor recuerdo
              <br />
              no siempre está
              <br />
              en <em>el mapa.</em>
            </h2>
            <p>
              A veces es una conversación. Una luz que cambia. Un camino que no
              esperabas. Creemos en viajar dejando espacio para lo que no se
              puede planear.
            </p>
            <p>
              Nuestra colección reúne seis destinos para imaginar una próxima
              escapada, a tu ritmo y con tu propia mirada.
            </p>
            <Link href="/destinos/valle-sagrado" className="text-link">
              Una pausa en el Valle Sagrado <ArrowRight size={17} />
            </Link>
            <span className="editorial-stamp">
              <Sun size={27} strokeWidth={1} /> VIAJA CON LOS OJOS ABIERTOS
            </span>
          </Reveal>
        </div>
      </section>
      <section className="section container">
        <div className="section-top">
          <div>
            <span className="overline">MÁS QUE UN LUGAR / 02</span>
            <h2>
              Sigue tu <em>curiosidad.</em>
            </h2>
          </div>
          <p>
            Una forma distinta de descubrir.
            <br />
            El mismo deseo de estar ahí.
          </p>
        </div>
        <div className="mood-grid">
          {[
            {
              icon: Mountain,
              title: "Perderse en la montaña",
              filter: "Montaña",
              text: "Aire fresco. Perspectivas nuevas.",
            },
            {
              icon: Sun,
              title: "Seguir la línea del mar",
              filter: "Costa",
              text: "El horizonte pone el ritmo.",
            },
            {
              icon: Camera,
              title: "Encontrar otras historias",
              filter: "Cultura",
              text: "Mira más allá de la postal.",
            },
          ].map((m, i) => (
            <Link
              href={`/destinos?categoria=${encodeURIComponent(m.filter)}`}
              className="mood-card"
              key={m.title}
            >
              <span>0{i + 1}</span>
              <m.icon size={27} strokeWidth={1.3} />
              <h3>{m.title}</h3>
              <p>{m.text}</p>
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </div>
      </section>
      <section className="container planner-invitation">
        <div>
          <span className="overline">
            DE LA INSPIRACIÓN AL PRIMER PASO / 03
          </span>
          <h2>
            Tu viaje empieza
            <br />
            en una <em>página en blanco.</em>
          </h2>
          <p>
            Guarda los lugares que te llaman. Elige tus fechas. Une las
            experiencias que te gustaría vivir. El resto puede esperar.
          </p>
          <Link href="/planificador" className="button">
            Dibuja tu próxima escapada <ArrowUpRight size={17} />
          </Link>
          <small>Planificador local · Sin cuenta · Sin reservas reales</small>
        </div>
        <div className="trip-paper">
          <div className="paper-top">
            <Map size={20} />
            <span>MI PRÓXIMA ESCAPADA</span>
            <span>05 DÍAS</span>
          </div>
          <h3>
            Un poco de aire.
            <br />
            Un mundo por descubrir.
          </h3>
          {[
            ["01", "Llegar. Respirar. Mirar alrededor."],
            ["02", "Encontrar un camino diferente."],
            ["03", "Dejar una tarde sin planes."],
          ].map(([n, t]) => (
            <div className="paper-day" key={n}>
              <span>{n}</span>
              <p>{t}</p>
            </div>
          ))}
          <Link href="/planificador" className="paper-add">
            + Añadir tu propia historia <ArrowUpRight size={16} />
          </Link>
          <div className="paper-note">
            Las mejores rutas empiezan con una idea.
          </div>
        </div>
      </section>
      <section className="container travel-clarity">
        <Compass size={22} />
        <p>
          <strong>Un viaje imaginado, con las cosas claras.</strong> Aurora es
          una demo: los destinos son reales, las experiencias y presupuestos son
          ficticios. No vendemos viajes ni confirmamos reservas.
        </p>
        <Link href="/experiencias" className="text-link">
          Explora la demo <ArrowUpRight size={16} />
        </Link>
      </section>
    </main>
  );
}

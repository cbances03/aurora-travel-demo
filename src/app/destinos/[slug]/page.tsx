import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock, Compass, MapPin } from "lucide-react";
import { destinations, destinationBySlug, experiences } from "@/lib/travel";
import { FavoriteButton, DestinationCard } from "@/components/destination-card";
import { GalleryButton } from "@/components/gallery";
import { ExperienceCard } from "@/components/experience-card";
export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = destinationBySlug(slug);
  return { title: d ? `${d.name}, ${d.country}` : "Destino no encontrado" };
}
export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = destinationBySlug(slug);
  if (!d) notFound();
  const index = destinations.findIndex((v) => v.slug === slug);
  return (
    <main id="contenido">
      <div className="container detail-heading">
        <Link href="/destinos" className="back-link">
          <ArrowLeft size={14} />
          Volver a destinos
        </Link>
        <div className="detail-title-row">
          <div>
            <span className="overline">
              {d.country} / {d.category}
            </span>
            <h1>
              {d.name}
              <span>.</span>
            </h1>
          </div>
          <div className="detail-title-actions">
            <span>Guarda este lugar</span>
            <FavoriteButton slug={d.slug} name={d.name} />
            <GalleryButton initial={index} label="Ver fotografías" />
          </div>
        </div>
        <p className="detail-tagline">{d.tagline}</p>
      </div>
      <figure className="detail-hero">
        <Image src={d.image} alt={d.alt} fill preload sizes="100vw" />
        <figcaption>
          {d.coordinates}
          <span>Fotografía: {d.credit} / Unsplash</span>
        </figcaption>
      </figure>
      <section className="container detail-story">
        <div>
          <span className="overline">UNA INVITACIÓN A DESCUBRIR</span>
          <h2>
            Otra forma
            <br />
            de <em>mirar.</em>
          </h2>
        </div>
        <div>
          <p className="story-lead">{d.description}</p>
          <p>{d.story}</p>
          <div className="detail-facts">
            <span>
              <Clock size={18} />
              {d.days} sugeridos
            </span>
            <span>
              <Compass size={18} />
              {d.mood}
            </span>
            <span>
              <MapPin size={18} />
              {d.region}
            </span>
          </div>
          <p className="small-note">
            Inspiración editorial de demostración. No incluye logística
            operativa, disponibilidad ni condiciones actuales del destino.
          </p>
        </div>
      </section>
      <section className="container detail-highlights">
        <div className="section-top">
          <div>
            <span className="overline">PEQUEÑAS RAZONES PARA IR</span>
            <h2>
              Haz sitio para <em>la sorpresa.</em>
            </h2>
          </div>
        </div>
        <div className="highlight-list">
          {d.highlights.map((h, i) => (
            <div key={h}>
              <span>0{i + 1}</span>
              <h3>{h}</h3>
              <ArrowUpRight size={22} />
            </div>
          ))}
        </div>
      </section>
      <section className="section container">
        <div className="section-top">
          <div>
            <span className="overline">IMAGINA CÓMO VIVIRLO</span>
            <h2>
              Un lugar. Muchas <em>posibilidades.</em>
            </h2>
          </div>
          <Link className="text-link" href="/planificador">
            Ver mi itinerario <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="experience-grid">
          {experiences
            .filter((e) => e.destination === slug)
            .map((e) => (
              <ExperienceCard key={e.id} experience={e} />
            ))}
        </div>
      </section>
      <section className="section container">
        <div className="section-top">
          <div>
            <span className="overline">EL VIAJE CONTINÚA</span>
            <h2>
              Más allá del <em>horizonte.</em>
            </h2>
          </div>
        </div>
        <div className="destination-grid">
          {destinations
            .filter((v) => v.slug !== slug)
            .slice(0, 3)
            .map((v, i) => (
              <DestinationCard key={v.slug} destination={v} index={i} />
            ))}
        </div>
      </section>
    </main>
  );
}

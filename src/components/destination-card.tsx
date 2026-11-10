"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowUpRight, MapPin } from "lucide-react";
import { useState } from "react";
import { type Destination } from "@/lib/travel";
import { useTravel } from "@/lib/store";
export function FavoriteButton({
  slug,
  name,
  className = "",
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const { data, update } = useTravel();
  const [notice, setNotice] = useState("");
  const favorite = data.favorites.includes(slug);
  return (
    <span className={`favorite-control ${className}`}>
      <button
        className={`favorite-button ${favorite ? "saved" : ""}`}
        aria-label={`${favorite ? "Quitar" : "Guardar"} ${name} ${favorite ? "de" : "en"} favoritos`}
        aria-pressed={favorite}
        onClick={() => {
          const saved = update((s) => ({
            ...s,
            favorites: s.favorites.includes(slug)
              ? s.favorites.filter((f) => f !== slug)
              : [...s.favorites, slug],
          }));
          setNotice(
            saved
              ? `${name} ${favorite ? "eliminado de" : "guardado en"} favoritos.`
              : "Almacenamiento no disponible. El cambio dura solo en esta pestaña.",
          );
        }}
      >
        <Heart size={18} fill={favorite ? "currentColor" : "none"} />
      </button>
      <span className="sr-only" role="status">
        {notice}
      </span>
    </span>
  );
}
export function DestinationCard({
  destination: d,
  index = 0,
}: {
  destination: Destination;
  index?: number;
}) {
  return (
    <article className="destination-card">
      <div className="destination-image">
        <Link href={`/destinos/${d.slug}`} aria-label={`Explorar ${d.name}`}>
          <Image
            src={d.image}
            alt={d.alt}
            fill
            sizes="(max-width: 767px) 90vw, (max-width: 1023px) 45vw, 33vw"
          />
        </Link>
        <span className="image-category">{d.category}</span>
        <FavoriteButton slug={d.slug} name={d.name} />
      </div>
      <div className="destination-meta">
        <span>
          <MapPin size={12} />
          {d.country}
        </span>
        <span>0{index + 1} / EXPLORAR</span>
      </div>
      <Link href={`/destinos/${d.slug}`} className="destination-title">
        <h3>{d.name}</h3>
        <ArrowUpRight size={22} />
      </Link>
      <p>{d.tagline}</p>
      <div className="destination-bottom">
        <span>{d.days} para imaginar</span>
        <span>{d.mood}</span>
      </div>
    </article>
  );
}

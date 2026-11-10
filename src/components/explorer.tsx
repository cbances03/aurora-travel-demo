"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Search,
  X,
  Heart,
  ArrowUpRight,
  SlidersHorizontal,
} from "lucide-react";
import { destinations, categories, normalize } from "@/lib/travel";
import { useTravel } from "@/lib/store";
import { DestinationCard } from "./destination-card";
import { GalleryButton } from "./gallery";
export function Explorer({
  initialCategory = "Todos",
  favoritesOnly = false,
}: {
  initialCategory?: string;
  favoritesOnly?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(
    categories.includes(initialCategory) ? initialCategory : "Todos",
  );
  const [region, setRegion] = useState("Todas");
  const [sort, setSort] = useState("collection");
  const { data } = useTravel();
  const list = destinations.filter(
    (d) =>
      (!favoritesOnly || data.favorites.includes(d.slug)) &&
      (category === "Todos" || d.category === category) &&
      (region === "Todas" || d.region === region) &&
      normalize(`${d.name} ${d.country} ${d.description}`).includes(
        normalize(query),
      ),
  );
  const sorted =
    sort === "name"
      ? [...list].sort((a, b) => a.name.localeCompare(b.name, "es"))
      : list;
  function reset() {
    setQuery("");
    setCategory("Todos");
    setRegion("Todas");
  }
  return (
    <>
      <section className="explore-controls" aria-label="Filtros de destinos">
        <div className="search-field">
          <Search size={19} />
          <label htmlFor="destination-search" className="sr-only">
            Buscar destinos
          </label>
          <input
            id="destination-search"
            placeholder="¿Qué lugar te llama?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="icon-button"
              aria-label="Limpiar búsqueda"
              onClick={() => setQuery("")}
            >
              <X size={16} />
            </button>
          )}
        </div>
        <label className="region-select">
          <SlidersHorizontal size={16} />
          <span>Región</span>
          <select
            aria-label="Filtrar por región"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            {["Todas", "Europa", "América", "Asia"].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <GalleryButton items={sorted} />
      </section>
      <div className="category-filters" aria-label="Tipo de destino">
        {categories.map((c) => (
          <button
            key={c}
            className={category === c ? "active" : ""}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="results-bar">
        <p role="status">
          {sorted.length}{" "}
          {sorted.length === 1
            ? "lugar para descubrir"
            : "lugares para descubrir"}
          {favoritesOnly ? " en tu colección" : ""}
        </p>
        <label>
          Ordenar
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Ordenar destinos"
          >
            <option value="collection">Selección Aurora</option>
            <option value="name">Nombre A–Z</option>
          </select>
        </label>
      </div>
      <div className="destination-grid">
        {sorted.map((d, i) => (
          <DestinationCard key={d.slug} destination={d} index={i} />
        ))}
      </div>
      {!sorted.length && (
        <div className="empty-state">
          {favoritesOnly ? <Heart size={30} /> : <Search size={30} />}
          <h2>
            {favoritesOnly && !data.favorites.length
              ? "Tu colección empieza con una mirada."
              : "Todavía no encontramos ese lugar."}
          </h2>
          <p>
            {favoritesOnly && !data.favorites.length
              ? "Guarda un destino con el corazón y vuelve cuando quieras imaginar tu viaje."
              : "Prueba con otro nombre o abre un poco el horizonte de tus filtros."}
          </p>
          {favoritesOnly && !data.favorites.length ? (
            <Link href="/destinos" className="button">
              Descubrir destinos <ArrowUpRight size={16} />
            </Link>
          ) : (
            <button className="button button-outline" onClick={reset}>
              Restablecer filtros
            </button>
          )}
        </div>
      )}
    </>
  );
}

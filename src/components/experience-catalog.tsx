"use client";
import { useState } from "react";
import { experiences, destinationBySlug, normalize } from "@/lib/travel";
import { ExperienceCard } from "./experience-card";
import { Search } from "lucide-react";
export function ExperienceCatalog() {
  const [category, setCategory] = useState("Todas");
  const [query, setQuery] = useState("");
  const list = experiences.filter(
    (e) =>
      (category === "Todas" || e.category === category) &&
      normalize(
        `${e.name} ${e.description} ${destinationBySlug(e.destination)?.name}`,
      ).includes(normalize(query)),
  );
  return (
    <>
      <div className="experience-filter-row">
        <div className="category-filters" aria-label="Tipo de experiencia">
          {["Todas", "Naturaleza", "Cultura", "Fotografía"].map((c) => (
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
        <div className="search-field">
          <Search size={17} />
          <label className="sr-only" htmlFor="experience-search">
            Buscar experiencias
          </label>
          <input
            id="experience-search"
            placeholder="Encuentra tu experiencia"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <p className="result-summary" role="status">
        {list.length} experiencias para imaginar · todas son demostrativas
      </p>
      <div className="experience-grid">
        {list.map((e) => (
          <ExperienceCard key={e.id} experience={e} />
        ))}
      </div>
      {!list.length && (
        <div className="empty-state">
          <h2>Otro camino por descubrir.</h2>
          <p>No hay experiencias con esa combinación.</p>
          <button
            className="button button-outline"
            onClick={() => {
              setCategory("Todas");
              setQuery("");
            }}
          >
            Restablecer búsqueda
          </button>
        </div>
      )}
    </>
  );
}

"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand } from "lucide-react";
import { destinations, type Destination } from "@/lib/travel";
import { Modal } from "./ui";
export function GalleryButton({
  items = destinations,
  initial = 0,
  label = "Abrir cuaderno visual",
}: {
  items?: readonly Destination[];
  initial?: number;
  label?: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const current = index === null ? undefined : items[index];
  function move(delta: number) {
    setIndex((i) =>
      i === null ? null : (i + delta + items.length) % items.length,
    );
  }
  useEffect(() => {
    if (index === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setIndex((i) => (i === null ? null : (i + 1) % items.length));
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIndex((i) =>
          i === null ? null : (i - 1 + items.length) % items.length,
        );
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [index, items.length]);
  return (
    <>
      <button
        className="button button-outline gallery-trigger"
        disabled={!items.length}
        onClick={() => setIndex(Math.min(initial, items.length - 1))}
      >
        <Expand size={15} />
        {label}
      </button>
      {current && (
        <Modal
          title="Cuaderno visual"
          close={() => setIndex(null)}
          className="gallery-dialog"
        >
          <figure>
            <div className="gallery-image">
              <Image src={current.image} alt={current.alt} fill sizes="90vw" />
            </div>
            <figcaption>
              <div>
                <span className="overline">
                  {current.country} / {current.category}
                </span>
                <h3>{current.name}</h3>
                <span className="photo-credit">
                  Fotografía: {current.credit} / Unsplash
                </span>
              </div>
              <div className="gallery-controls">
                <button
                  className="icon-button"
                  onClick={() => move(-1)}
                  aria-label="Fotografía anterior"
                >
                  <ArrowLeft size={20} />
                </button>
                <span aria-live="polite">
                  {(index ?? 0) + 1} / {items.length}
                </span>
                <button
                  className="icon-button"
                  onClick={() => move(1)}
                  aria-label="Fotografía siguiente"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </figcaption>
          </figure>
          <Link
            href={`/destinos/${current.slug}`}
            className="text-link"
            onClick={() => setIndex(null)}
          >
            Explorar {current.name}
            <ArrowUpRight size={16} />
          </Link>
          <p className="gallery-help">
            Flechas para navegar · Escape para cerrar. Esta colección muestra
            distintos destinos Aurora.
          </p>
        </Modal>
      )}
    </>
  );
}

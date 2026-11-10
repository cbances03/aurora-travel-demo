"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, Menu, X, Sun, Heart, Compass } from "lucide-react";
import { useTravel } from "@/lib/store";
const links = [
  { href: "/destinos", text: "Destinos" },
  { href: "/experiencias", text: "Experiencias" },
  { href: "/favoritos", text: "Mis lugares" },
];
export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="Aurora Travel, inicio">
      <Sun size={29} strokeWidth={1.2} />
      <span>
        aurora<small>TRAVEL JOURNAL</small>
      </span>
    </Link>
  );
}
export function Navigation() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const { data, corrupt } = useTravel();
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  return (
    <>
      <div className="top-note">
        Un poco más lejos. Un poco más cerca de ti.{" "}
        <span>Una experiencia de viaje demostrativa</span>
      </div>
      <header className="site-nav">
        <div className="nav-inner">
          <Logo />
          <nav aria-label="Navegación principal" className="desktop-links">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={path.startsWith(l.href) ? "page" : undefined}
              >
                {l.text}
                {l.href === "/favoritos" && (
                  <span className="favorite-count">
                    {data.favorites.length}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <Link href="/planificador" className="button nav-plan">
            Diseña tu viaje <ArrowUpRight size={16} />
          </Link>
          <button
            className="icon-button menu-button"
            ref={button}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-controls="travel-mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav
            id="travel-mobile-menu"
            className="mobile-links"
            aria-label="Navegación móvil"
          >
            {[...links, { href: "/planificador", text: "Diseña tu viaje" }].map(
              (l) => (
                <Link
                  href={l.href}
                  key={l.href}
                  aria-current={path.startsWith(l.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {l.text}
                  <ArrowUpRight size={16} />
                </Link>
              ),
            )}
          </nav>
        )}
      </header>
      {corrupt && (
        <div className="storage-alert" role="alert">
          No pudimos leer tus datos locales. Mostramos una vista segura; tu
          siguiente cambio reemplazará los datos dañados.
        </div>
      )}
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div>
          <Logo />
          <p>
            Viajar no es ir más rápido.
            <br />
            Es aprender a mirar de nuevo.
          </p>
        </div>
        <nav aria-label="Navegación del pie">
          {links.map((l) => (
            <Link href={l.href} key={l.href}>
              {l.text}
            </Link>
          ))}
          <Link href="/planificador">Planificador</Link>
        </nav>
        <div className="footer-demo">
          <Compass size={22} />
          <p>
            Una demo para explorar.
            <br />
            Sin pagos, cuentas ni reservas reales.
          </p>
          <Link href="/creditos">
            Créditos de fotografía <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Aurora Travel · Proyecto ficticio
        </span>
        <span>
          <Heart size={12} /> Guarda los lugares. Vive las posibilidades.
        </span>
      </div>
    </footer>
  );
}

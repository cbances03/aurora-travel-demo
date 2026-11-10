"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Clock, ArrowUpRight, Plus, Check, CalendarDays } from "lucide-react";
import {
  type Experience,
  destinationBySlug,
  money,
  validDate,
  dateLabel,
} from "@/lib/travel";
import { useTravel } from "@/lib/store";
import { Modal, Notice } from "./ui";
export function ExperienceCard({ experience: e }: { experience: Experience }) {
  const d = destinationBySlug(e.destination)!;
  const { data, update } = useTravel();
  const [notice, setNotice] = useState("");
  const [booking, setBooking] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  function add() {
    if (data.trip.activities.length >= 60) {
      setNotice(
        "Tu itinerario tiene 60 actividades. Elimina alguna antes de añadir otra.",
      );
      return;
    }
    const saved = update((s) => ({
      ...s,
      trip: {
        ...s.trip,
        activities: [
          ...s.trip.activities,
          {
            id: crypto.randomUUID(),
            experienceId: e.id,
            day: 0,
            time: "09:00",
          },
        ],
      },
    }));
    setNotice(
      saved
        ? `${e.name} añadida al día 1. Puedes moverla en tu planificador.`
        : "Añadida temporalmente. El navegador no permite guardar los cambios.",
    );
  }
  function simulate(ev: FormEvent) {
    ev.preventDefault();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!validDate(date) || new Date(date + "T12:00:00") < today) {
      setError("Elige una fecha válida desde hoy.");
      return;
    }
    if (!Number.isInteger(guests) || guests < 1 || guests > 6) {
      setError("El número de viajeros debe estar entre 1 y 6.");
      return;
    }
    if (name.trim().length < 2) {
      setError("Escribe un nombre de al menos 2 caracteres.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Escribe un correo electrónico válido.");
      return;
    }
    setError("");
    setName("");
    setEmail("");
    setCompleted(true);
  }
  function close() {
    setBooking(false);
    setCompleted(false);
    setError("");
    setName("");
    setEmail("");
  }
  return (
    <article className="experience-card">
      <div className="experience-image">
        <Image
          src={d.image}
          alt={d.alt}
          fill
          sizes="(max-width:767px) 90vw, 33vw"
        />
        <span>{e.category}</span>
      </div>
      <div className="experience-body">
        <Link href={`/destinos/${d.slug}`} className="experience-place">
          {d.name}, {d.country}
          <ArrowUpRight size={13} />
        </Link>
        <h3>{e.name}</h3>
        <p>{e.description}</p>
        <div className="experience-facts">
          <span>
            <Clock size={14} />
            {e.duration} h
          </span>
          <span>
            Desde <strong>{money(e.price)}</strong> / persona
          </span>
        </div>
        <span className="demo-caption">Precio y experiencia ficticios</span>
        <div className="experience-actions">
          <button className="button" onClick={add}>
            <Plus size={15} />
            Añadir al itinerario
          </button>
          <button className="text-link" onClick={() => setBooking(true)}>
            Simular reserva <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
      <Notice>{notice}</Notice>
      {booking && (
        <Modal
          title={completed ? "Un viaje imaginado" : "Simula tu experiencia"}
          close={close}
        >
          {completed ? (
            <div className="booking-complete">
              <span className="success-mark">
                <Check size={27} />
              </span>
              <h3>Simulación completada.</h3>
              <p>
                <strong>No existe una reserva real.</strong> No se han enviado
                datos, procesado pagos ni contactado proveedores.
              </p>
              <dl>
                <div>
                  <dt>Experiencia</dt>
                  <dd>{e.name}</dd>
                </div>
                <div>
                  <dt>Fecha de ejemplo</dt>
                  <dd>{dateLabel(date)}</dd>
                </div>
                <div>
                  <dt>Viajeros</dt>
                  <dd>{guests}</dd>
                </div>
                <div>
                  <dt>Total ficticio</dt>
                  <dd>{money(e.price * guests)}</dd>
                </div>
              </dl>
              <button className="button full" onClick={close}>
                Seguir explorando
              </button>
            </div>
          ) : (
            <>
              <p className="dialog-description">
                {e.name} · {d.name}
                <br />
                Demostración sin reserva, pago ni envío de datos.
              </p>
              <form noValidate onSubmit={simulate}>
                <div className="field-row">
                  <label>
                    Fecha
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      aria-describedby={
                        error ? `booking-error-${e.id}` : undefined
                      }
                    />
                  </label>
                  <label>
                    Viajeros
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      required
                    />
                  </label>
                </div>
                <label>
                  Nombre
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={80}
                    autoComplete="given-name"
                    required
                  />
                </label>
                <label>
                  Correo electrónico
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={160}
                    autoComplete="email"
                    required
                  />
                </label>
                <div className="booking-summary">
                  <span>
                    <CalendarDays size={14} />
                    Total ficticio
                  </span>
                  <strong>
                    {money(e.price * (Number.isFinite(guests) ? guests : 0))}
                  </strong>
                </div>
                {error && (
                  <p
                    role="alert"
                    className="form-error"
                    id={`booking-error-${e.id}`}
                  >
                    {error}
                  </p>
                )}
                <button className="button full" type="submit">
                  Completar simulación <ArrowUpRight size={16} />
                </button>
              </form>
            </>
          )}
        </Modal>
      )}
    </article>
  );
}

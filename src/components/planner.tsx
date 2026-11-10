"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import {
  CalendarDays,
  Users,
  ArrowUpRight,
  Plus,
  Trash2,
  MapPin,
  Compass,
  RotateCcw,
  Clock,
  Heart,
} from "lucide-react";
import { useTravel, emptyTrip, type Trip } from "@/lib/store";
import {
  experiences,
  destinations,
  destinationBySlug,
  tripDays,
  dateAt,
  dateLabel,
  money,
} from "@/lib/travel";
import { Modal, Notice } from "./ui";
function TripSettings({
  trip,
  onSave,
}: {
  trip: Trip;
  onSave: (trip: Trip) => void;
}) {
  const [name, setName] = useState(trip.name);
  const [start, setStart] = useState(trip.start);
  const [end, setEnd] = useState(trip.end);
  const [travelers, setTravelers] = useState(trip.travelers);
  const [error, setError] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    const days = tripDays(start, end);
    if (name.trim().length < 2) {
      setError("Dale a tu viaje un nombre de al menos 2 caracteres.");
      return;
    }
    if (days < 1 || days > 14) {
      setError(
        "Elige un rango válido de entre 1 y 14 días. La fecha final debe ser igual o posterior al inicio.",
      );
      return;
    }
    if (!Number.isInteger(travelers) || travelers < 1 || travelers > 6) {
      setError("Elige entre 1 y 6 viajeros.");
      return;
    }
    if (trip.activities.some((a) => a.day >= days)) {
      setError(
        "Hay actividades en días que quedarían fuera. Muévelas o elimínalas antes de acortar el viaje.",
      );
      return;
    }
    setError("");
    onSave({ ...trip, name: name.trim(), start, end, travelers });
  }
  return (
    <form className="trip-settings" onSubmit={submit} noValidate>
      <span className="overline">01 / EL PUNTO DE PARTIDA</span>
      <h2>Tu viaje, tus tiempos.</h2>
      <label>
        Nombre del viaje
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          required
        />
      </label>
      <div className="field-row">
        <label>
          Inicio
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
          />
        </label>
        <label>
          Final
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
          />
        </label>
      </div>
      <label>
        Viajeros
        <select
          value={travelers}
          onChange={(e) => setTravelers(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "persona" : "personas"}
            </option>
          ))}
        </select>
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="button button-outline full">
        Guardar detalles <ArrowUpRight size={15} />
      </button>
      <p className="small-note">
        Hasta 14 días y 6 viajeros. Las actividades no se eliminan al cambiar
        las fechas.
      </p>
    </form>
  );
}
export function Planner() {
  const { data, update } = useTravel();
  const trip = data.trip;
  const days = tripDays(trip.start, trip.end);
  const [experienceId, setExperienceId] = useState<string>(experiences[0].id);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState("09:00");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [reset, setReset] = useState(false);
  const total = trip.activities.reduce(
    (sum, a) =>
      sum +
      (experiences.find((e) => e.id === a.experienceId)?.price ?? 0) *
        trip.travelers,
    0,
  );
  const savedDestinations = destinations.filter((d) =>
    data.favorites.includes(d.slug),
  );
  function save(next: Trip, message: string) {
    const saved = update((s) => ({ ...s, trip: next }));
    setNotice(
      saved
        ? message
        : "El cambio es temporal. Este navegador no permite guardar los datos.",
    );
  }
  function add(e: FormEvent) {
    e.preventDefault();
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
      setError("Elige una hora válida para tu experiencia.");
      return;
    }
    if (trip.activities.length >= 60) {
      setError(
        "El itinerario admite hasta 60 actividades. Elimina alguna para continuar.",
      );
      return;
    }
    const target = Math.min(day, days - 1);
    save(
      {
        ...trip,
        activities: [
          ...trip.activities,
          { id: crypto.randomUUID(), experienceId, day: target, time },
        ],
      },
      `Experiencia añadida al día ${target + 1}.`,
    );
    setError("");
  }
  function edit(
    id: string,
    field: "day" | "time" | "experienceId",
    value: string | number,
  ) {
    if (field === "time" && !/^([01]\d|2[0-3]):[0-5]\d$/.test(String(value)))
      return;
    save(
      {
        ...trip,
        activities: trip.activities.map((a) =>
          a.id === id ? { ...a, [field]: value } : a,
        ),
      },
      "Actividad actualizada.",
    );
  }
  return (
    <main id="contenido" className="container planner-page">
      <header className="planner-heading">
        <div>
          <span className="overline">TU CUADERNO DE VIAJE</span>
          <h1>
            {trip.name}
            <span>.</span>
          </h1>
          <p>
            Una idea por día. Espacio para todo lo que no estaba en el plan.
          </p>
        </div>
        <button className="text-link reset-trip" onClick={() => setReset(true)}>
          <RotateCcw size={15} />
          Empezar de nuevo
        </button>
      </header>
      <div className="trip-statbar">
        <span>
          <CalendarDays size={17} />
          {days} {days === 1 ? "día" : "días"}
          <small>
            {dateLabel(trip.start)} — {dateLabel(trip.end)}
          </small>
        </span>
        <span>
          <Users size={17} />
          {trip.travelers} {trip.travelers === 1 ? "viajero" : "viajeros"}
        </span>
        <span>
          <Compass size={17} />
          {trip.activities.length} experiencias
        </span>
        <span className="trip-budget">
          {money(total)}
          <small>Presupuesto ficticio de actividades</small>
        </span>
      </div>
      <div className="planner-layout">
        <aside className="planner-sidebar">
          <TripSettings
            key={`${trip.name}|${trip.start}|${trip.end}|${trip.travelers}`}
            trip={trip}
            onSave={(t) => save(t, "Detalles del viaje guardados.")}
          />
          <form className="add-experience-form" onSubmit={add} noValidate>
            <span className="overline">02 / DALE FORMA AL CAMINO</span>
            <h2>Añade un momento.</h2>
            <label>
              Experiencia
              <select
                value={experienceId}
                onChange={(e) => setExperienceId(e.target.value)}
              >
                {experiences.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} · {destinationBySlug(e.destination)?.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="field-row">
              <label>
                Día
                <select
                  value={Math.min(day, days - 1)}
                  onChange={(e) => setDay(Number(e.target.value))}
                >
                  {Array.from({ length: days }, (_, i) => (
                    <option key={i} value={i}>
                      Día {i + 1}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Hora
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </label>
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="button full">
              <Plus size={16} />
              Añadir al viaje
            </button>
            <p className="small-note">
              Experiencias ficticias, sin traslados incluidos. Puedes moverlas
              de día y cambiar su hora.
            </p>
          </form>
          <div className="saved-inspiration">
            <span className="overline">
              <Heart size={12} /> TUS LUGARES GUARDADOS
            </span>
            {savedDestinations.length ? (
              savedDestinations.map((d) => (
                <Link href={`/destinos/${d.slug}`} key={d.slug}>
                  <Image src={d.image} alt="" width={45} height={45} />
                  <span>
                    {d.name}
                    <small>{d.country}</small>
                  </span>
                  <ArrowUpRight size={15} />
                </Link>
              ))
            ) : (
              <p>
                Guarda destinos para tener tu inspiración a mano.
                <Link href="/destinos">
                  Explorar lugares <ArrowUpRight size={13} />
                </Link>
              </p>
            )}
          </div>
        </aside>
        <section className="itinerary" aria-label="Itinerario por días">
          <div className="itinerary-heading">
            <span className="overline">03 / UN VIAJE QUE SE PARECE A TI</span>
            <h2>
              Tu hoja de <em>ruta.</em>
            </h2>
            <p>
              La organización y el presupuesto son demostrativos. No comprueban
              disponibilidad, distancias ni viabilidad logística entre destinos.
            </p>
          </div>
          {Array.from({ length: days }, (_, i) => {
            const activities = trip.activities
              .filter((a) => a.day === i)
              .sort((a, b) => a.time.localeCompare(b.time));
            return (
              <article
                className="day-sheet"
                key={i}
                aria-label={`Día ${i + 1}`}
              >
                <header>
                  <div>
                    <span className="day-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3>Día {i + 1}</h3>
                      <span>{dateLabel(dateAt(trip.start, i))}</span>
                    </div>
                  </div>
                  <span>
                    {activities.length}{" "}
                    {activities.length === 1 ? "momento" : "momentos"}
                  </span>
                </header>
                {!activities.length ? (
                  <div className="empty-day">
                    <Compass size={22} strokeWidth={1.2} />
                    <p>Un día abierto a las posibilidades.</p>
                    <button
                      className="text-link"
                      onClick={() => {
                        setDay(i);
                        document
                          .querySelector<HTMLSelectElement>(
                            ".add-experience-form select",
                          )
                          ?.focus();
                      }}
                    >
                      Elegir una experiencia <Plus size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="day-activities">
                    {activities.map((a) => {
                      const exp = experiences.find(
                        (e) => e.id === a.experienceId,
                      )!;
                      const d = destinationBySlug(exp.destination)!;
                      return (
                        <div className="activity" key={a.id}>
                          <div className="activity-top">
                            <span className="activity-time">
                              <Clock size={12} />
                              {a.time}
                            </span>
                            <span>
                              {exp.duration} h ·{" "}
                              {money(exp.price * trip.travelers)} ficticios
                            </span>
                            <button
                              className="icon-button"
                              aria-label={`Eliminar ${exp.name}`}
                              onClick={() => setRemoveId(a.id)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <h4>{exp.name}</h4>
                          <p>
                            <MapPin size={12} />
                            {d.name}, {d.country}
                          </p>
                          <div className="activity-edit">
                            <label>
                              Cambiar día
                              <select
                                aria-label={`Día de ${exp.name}`}
                                value={a.day}
                                onChange={(e) =>
                                  edit(a.id, "day", Number(e.target.value))
                                }
                              >
                                {Array.from({ length: days }, (_, j) => (
                                  <option key={j} value={j}>
                                    Día {j + 1}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label>
                              Hora
                              <input
                                type="time"
                                aria-label={`Hora de ${exp.name}`}
                                value={a.time}
                                onChange={(e) =>
                                  edit(a.id, "time", e.target.value)
                                }
                              />
                            </label>
                          </div>
                          <label className="replace-experience">
                            Cambiar experiencia
                            <select
                              aria-label={`Cambiar ${exp.name}`}
                              value={exp.id}
                              onChange={(e) =>
                                edit(a.id, "experienceId", e.target.value)
                              }
                            >
                              {experiences.map((ex) => (
                                <option key={ex.id} value={ex.id}>
                                  {ex.name}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>
            );
          })}
          <div className="itinerary-total">
            <div>
              <span className="overline">EL RESUMEN DE TU IDEA</span>
              <h3>Lo que llevas en el cuaderno.</h3>
              <p>
                {trip.activities.length} experiencias · {trip.travelers}{" "}
                viajeros · {days} días
              </p>
            </div>
            <div>
              <strong>{money(total)}</strong>
              <span>Total ficticio de actividades</span>
            </div>
          </div>
          <p className="small-note">
            No incluye alojamiento, transporte, comidas ni condiciones reales de
            contratación. No es una cotización.
          </p>
        </section>
      </div>
      <Notice>{notice}</Notice>
      {removeId && (
        <Modal title="¿Quitar este momento?" close={() => setRemoveId(null)}>
          <p className="dialog-description">
            Se eliminará esta actividad del itinerario local. Puedes volver a
            añadirla desde la colección.
          </p>
          <div className="dialog-actions">
            <button
              className="button button-outline"
              onClick={() => setRemoveId(null)}
            >
              Cancelar
            </button>
            <button
              className="button"
              onClick={() => {
                save(
                  {
                    ...trip,
                    activities: trip.activities.filter(
                      (a) => a.id !== removeId,
                    ),
                  },
                  "Actividad eliminada del itinerario.",
                );
                setRemoveId(null);
              }}
            >
              Eliminar actividad
            </button>
          </div>
        </Modal>
      )}
      {reset && (
        <Modal title="¿Abrir un nuevo cuaderno?" close={() => setReset(false)}>
          <p className="dialog-description">
            Se restablecerán los detalles y las actividades del viaje. Tus
            destinos favoritos se conservarán.
          </p>
          <div className="dialog-actions">
            <button
              className="button button-outline"
              onClick={() => setReset(false)}
            >
              Cancelar
            </button>
            <button
              className="button"
              onClick={() => {
                save(
                  emptyTrip,
                  "Itinerario restablecido. Tus favoritos siguen contigo.",
                );
                setDay(0);
                setReset(false);
              }}
            >
              Restablecer viaje
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}

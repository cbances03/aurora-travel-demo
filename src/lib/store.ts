"use client";
import { useMemo, useSyncExternalStore } from "react";
import { destinations, experiences, tripDays } from "./travel";
export type Activity = {
  id: string;
  experienceId: string;
  day: number;
  time: string;
};
export type Trip = {
  name: string;
  start: string;
  end: string;
  travelers: number;
  activities: Activity[];
};
export type TravelData = { favorites: string[]; trip: Trip };
const KEY = "aurora.travel.v1";
let temporary: string | null = null;
export const emptyTrip: Trip = {
  name: "Mi próxima escapada",
  start: "2027-05-10",
  end: "2027-05-14",
  travelers: 2,
  activities: [],
};
const initial: TravelData = { favorites: [], trip: emptyTrip };
function valid(value: unknown): value is TravelData {
  if (!value || typeof value !== "object") return false;
  const s = value as TravelData;
  const t = s.trip;
  return (
    Array.isArray(s.favorites) &&
    s.favorites.every((f) => destinations.some((d) => d.slug === f)) &&
    s.favorites.length <= destinations.length &&
    new Set(s.favorites).size === s.favorites.length &&
    !!t &&
    typeof t.name === "string" &&
    t.name.length > 0 &&
    t.name.length <= 80 &&
    typeof t.start === "string" &&
    typeof t.end === "string" &&
    tripDays(t.start, t.end) >= 1 &&
    tripDays(t.start, t.end) <= 14 &&
    Number.isInteger(t.travelers) &&
    t.travelers >= 1 &&
    t.travelers <= 6 &&
    Array.isArray(t.activities) &&
    t.activities.length <= 60 &&
    t.activities.every(
      (a) =>
        a &&
        typeof a.id === "string" &&
        experiences.some((e) => e.id === a.experienceId) &&
        Number.isInteger(a.day) &&
        a.day >= 0 &&
        a.day < tripDays(t.start, t.end) &&
        /^([01]\d|2[0-3]):[0-5]\d$/.test(a.time),
    ) &&
    new Set(t.activities.map((a) => a.id)).size === t.activities.length
  );
}
function read() {
  if (temporary !== null) return temporary;
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}
function parse(raw: string) {
  if (!raw) return { data: initial, corrupt: false };
  try {
    const value: unknown = JSON.parse(raw);
    if (valid(value)) return { data: value, corrupt: false };
  } catch {}
  return { data: initial, corrupt: true };
}
function subscribe(fn: () => void) {
  window.addEventListener("storage", fn);
  window.addEventListener("aurora-change", fn);
  return () => {
    window.removeEventListener("storage", fn);
    window.removeEventListener("aurora-change", fn);
  };
}
const server = () => "";
export function useTravel() {
  const raw = useSyncExternalStore(subscribe, read, server);
  const parsed = useMemo(() => parse(raw), [raw]);
  function update(fn: (s: TravelData) => TravelData) {
    const next = JSON.stringify(fn(parse(read()).data));
    let saved = true;
    try {
      localStorage.setItem(KEY, next);
      temporary = null;
    } catch {
      temporary = next;
      saved = false;
    }
    window.dispatchEvent(new Event("aurora-change"));
    return saved;
  }
  return { ...parsed, update };
}

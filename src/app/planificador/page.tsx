import type { Metadata } from "next";
import { Planner } from "@/components/planner";
export const metadata: Metadata = { title: "Diseña tu viaje" };
export default function PlannerPage() {
  return <Planner />;
}

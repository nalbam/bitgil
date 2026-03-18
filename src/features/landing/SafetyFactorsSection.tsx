import { SectionTitle } from "@/components/ui/SectionTitle";
import { SafetyLegend } from "@/components/safety/SafetyLegend";

const FACTORS = [
  { icon: "💡", title: "Streetlights", description: "Well-lit paths are statistically safer. We map public streetlight locations to score lighting coverage along each route.", color: "yellow" },
  { icon: "📷", title: "CCTV Coverage", description: "Camera-monitored areas deter crime. Routes with higher CCTV density receive better safety scores.", color: "blue" },
  { icon: "🚔", title: "Police Stations", description: "Proximity to police stations and patrol areas adds a layer of security and rapid response potential.", color: "indigo" },
  { icon: "🚶", title: "Crosswalks", description: "Designated pedestrian crossings improve safety at intersections and reduce exposure to traffic.", color: "green" },
  { icon: "⚠️", title: "Danger Zones", description: "Areas with reported incidents or known hazards are flagged to help users avoid potential risks.", color: "red" },
];

const colorMap: Record<string, string> = {
  yellow: "border-yellow-500/20 bg-yellow-500/5",
  blue: "border-blue-500/20 bg-blue-500/5",
  indigo: "border-indigo-500/20 bg-indigo-500/5",
  green: "border-green-500/20 bg-green-500/5",
  red: "border-red-500/20 bg-red-500/5",
};

export function SafetyFactorsSection() {
  return (
    <section id="safety" className="bg-white/[0.01] px-6 py-24">
      <div className="mx-auto max-w-7xl space-y-16">
        <SectionTitle label="Safety" title="Data-driven safety scoring" description="We combine multiple public data sources into a comprehensive safety score for every route." />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FACTORS.map((f) => (
            <div key={f.title} className={`rounded-xl border p-6 ${colorMap[f.color]}`}>
              <div className="mb-4 text-3xl">{f.icon}</div>
              <h3 className="mb-2 text-base font-semibold text-white">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{f.description}</p>
            </div>
          ))}
          <div className="flex flex-col justify-center rounded-xl border border-white/5 bg-white/[0.03] p-6">
            <p className="mb-4 text-sm font-medium text-slate-300">Safety Legend</p>
            <SafetyLegend />
          </div>
        </div>
      </div>
    </section>
  );
}

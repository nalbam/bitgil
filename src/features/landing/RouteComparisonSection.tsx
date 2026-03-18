import { SectionTitle } from "@/components/ui/SectionTitle";
import { RouteComparisonPanel } from "@/components/route/RouteComparisonPanel";
import type { Route } from "@/lib/maps/types";

const MOCK_ROUTES: Route[] = [
  { id: "safe", name: "Safest Route", safetyLevel: "safe", score: 92, distanceKm: 1.8, estimatedMinutes: 22, points: [] },
  { id: "moderate", name: "Balanced Route", safetyLevel: "moderate", score: 74, distanceKm: 1.4, estimatedMinutes: 17, points: [] },
  { id: "fast", name: "Fastest Route", safetyLevel: "caution", score: 51, distanceKm: 1.1, estimatedMinutes: 13, points: [] },
];

export function RouteComparisonSection() {
  return (
    <section id="routes" className="px-6 py-24">
      <div className="mx-auto max-w-7xl space-y-16">
        <SectionTitle label="Routes" title="Compare routes at a glance" description="Every suggested route comes with a safety score, estimated time, and distance so you can make an informed choice." />
        <div className="mx-auto max-w-2xl">
          <RouteComparisonPanel routes={MOCK_ROUTES} />
        </div>
      </div>
    </section>
  );
}

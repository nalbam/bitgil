import { SectionTitle } from "@/components/ui/SectionTitle";
import { RouteComparisonPanel } from "@/components/route/RouteComparisonPanel";
import { MOCK_ROUTES } from "@/data/mock/routes";

export function RouteComparisonSection() {
  return (
    <section id="routes" className="px-6 py-24">
      <div className="mx-auto max-w-7xl space-y-16">
        <SectionTitle
          label="Routes"
          title="Compare routes at a glance"
          description="Every suggested route comes with a safety score, estimated time, distance, and an explanation so you can make an informed choice."
        />
        <div className="mx-auto max-w-2xl">
          <RouteComparisonPanel routes={MOCK_ROUTES} />
        </div>
      </div>
    </section>
  );
}

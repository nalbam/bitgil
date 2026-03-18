import { SectionTitle } from "@/components/ui/SectionTitle";
import { MapPlaceholder } from "@/components/map/MapPlaceholder";

export function MapPreviewSection() {
  return (
    <section id="map" className="bg-white/[0.01] px-6 py-24">
      <div className="mx-auto max-w-7xl space-y-16">
        <SectionTitle label="Map" title="Visualize your safe path" description="An interactive map will display your route options, nearby safety infrastructure, and risk zones in real time." />
        <MapPlaceholder className="aspect-[16/9] w-full md:aspect-[21/9]" />
      </div>
    </section>
  );
}

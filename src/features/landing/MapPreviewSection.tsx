import { SectionTitle } from "@/components/ui/SectionTitle";
import { MapPlaceholder } from "@/components/map/MapPlaceholder";
import { DEFAULT_SCHOOL } from "@/data/mock/schools";
import { MOCK_FACILITIES } from "@/data/mock/facilities";

export function MapPreviewSection() {
  return (
    <section id="map" className="bg-white/[0.01] px-6 py-24">
      <div className="mx-auto max-w-7xl space-y-16">
        <SectionTitle
          label="Map"
          title={`Visualize routes from ${DEFAULT_SCHOOL.name}`}
          description={`Showing ${MOCK_FACILITIES.length} safety facilities near ${DEFAULT_SCHOOL.address}. An interactive map will display your route options in real time.`}
        />
        <MapPlaceholder className="aspect-[16/9] w-full md:aspect-[21/9]" />
      </div>
    </section>
  );
}

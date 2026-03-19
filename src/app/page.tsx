import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/features/landing/HeroSection";
import { OverviewSection } from "@/features/landing/OverviewSection";
import { SafetyFactorsSection } from "@/features/landing/SafetyFactorsSection";
import { RouteComparisonSection } from "@/features/landing/RouteComparisonSection";
import { MapPreviewSection } from "@/features/landing/MapPreviewSection";
import { AiSection } from "@/features/landing/AiSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100">
      <Header />
      <main>
        <HeroSection />
        <OverviewSection />
        <SafetyFactorsSection />
        <RouteComparisonSection />
        <MapPreviewSection />
        <AiSection />
      </main>
      <Footer />
    </div>
  );
}

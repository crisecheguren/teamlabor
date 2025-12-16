import { HeroSection } from "@/components/home/hero";
import { MissionSection } from "@/components/home/mission";
import { FeaturedGradesSection } from "@/components/home/featured-grades";
import { CTASection } from "@/components/home/cta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MissionSection />
      <FeaturedGradesSection />
      <CTASection />
    </>
  );
}

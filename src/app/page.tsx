import { HeroSection } from "@/components/sections/HeroSection";
import { GapSection } from "@/components/sections/GapSection";
import { JTBDSection } from "@/components/sections/JTBDSection";
import { TrackRecordSection } from "@/components/sections/TrackRecordSection";
import { ExpertiseSection } from "@/components/sections/ExpertiseSection";
import { LeadMagnetSection } from "@/components/sections/LeadMagnetSection";
import { StrategicPicksSection } from "@/components/sections/StrategicPicksSection";
import { LandTeaserSection } from "@/components/sections/LandTeaserSection";
import { LegalSecuritySection } from "@/components/sections/LegalSecuritySection";
import { ManagementSection } from "@/components/sections/ManagementSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { getFeaturedPlots } from "@/lib/land";
import { homepageGraph } from "@/lib/seo";

export default function Home() {
  const featuredPlots = getFeaturedPlots();
  return (
    <main className="overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageGraph()) }}
      />
      <HeroSection />
      <GapSection />
      <JTBDSection />
      <TrackRecordSection />
      <ExpertiseSection />
      <LeadMagnetSection />
      <StrategicPicksSection />
      <LandTeaserSection plots={featuredPlots} />
      <LegalSecuritySection />
      <ManagementSection />
      <FaqSection />
      <FooterSection />
    </main>
  );
}

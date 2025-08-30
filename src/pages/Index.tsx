import HeroSection from "../components/HeroSection";
import HighDemandCropsTeaser from "../components/HighDemandCropsTeaser";
import StateAnalyticsSection from "../components/StateAnalyticsSection";
import InvestmentSection from "../components/InvestmentSection";
import GovernmentSchemesSection from "../components/GovernmentSchemesSection";
import FloatingActionButtons from "../components/FloatingActionButtons";
import { Button } from "../components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <HighDemandCropsTeaser />
      <StateAnalyticsSection />
      <InvestmentSection />
      <GovernmentSchemesSection />
      <FloatingActionButtons />
    </div>
  );
};

export default Index;


import { Button } from "../components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StateAnalyticsSection = () => {
  const navigate = useNavigate();

  const handleExploreStates = () => {
    navigate('/states');
  };

  return (
    <section className="section-container bg-gradient-to-br from-primary/5 to-surface/50">
      <div className="max-w-4xl mx-auto text-center">
        <div className="professional-card p-12 hover-card">
          <div className="space-y-8">
            {/* Main Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              🌾 State-wise Crop Insights
            </h2>
            
            {/* Description */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore high-demand crops and agricultural patterns across different states to plan your cultivation effectively.
            </p>
            
            {/* Explore Button */}
            <div className="pt-6">
              <Button 
                variant="professional" 
                size="lg" 
                className="px-12 py-4 text-lg md:text-xl font-semibold"
                onClick={handleExploreStates}
              >
                Explore States <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Subtle Hint */}
            <p className="text-sm text-muted-foreground">
              Discover agricultural insights and patterns across Indian states
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StateAnalyticsSection;

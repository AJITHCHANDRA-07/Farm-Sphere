import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HighDemandCropsTeaser = () => {
  const navigate = useNavigate();

  const handleExploreCrops = () => {
    navigate("/explore-crops");
  };

  return (
    <section className="section-container bg-gradient-to-br from-primary/5 to-surface/50">
      <div className="max-w-4xl mx-auto text-center">
        <div className="professional-card p-12 hover-card">
          <div className="space-y-8">
            {/* Main Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              🌱 Low Supply High Demand Crops    
            </h2>
            
            {/* Description */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover profitable crops with high market demand and optimize your farming strategy
            </p>
            
            {/* Explore Button */}
            <div className="pt-6">
              <Button 
                variant="professional" 
                size="lg" 
                className="px-12 py-4 text-lg md:text-xl font-semibold"
                onClick={handleExploreCrops}
              >
                Explore Crops
              </Button>
            </div>
            
            {/* Subtle Hint */}
            <p className="text-sm text-muted-foreground">
              Discover interactive crop insights with advanced visualization
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighDemandCropsTeaser;

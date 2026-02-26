import { Button } from "../components/ui/button";
import heroImage from "../assets/hero-agriculture.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary/10 via-background to-surface/30 flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <div className="space-y-8 animate-fade-in">
          {/* Main Title with Gradient */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Farm<span className="text-foreground">Sphere</span>
            </h1>
            
            {/* Animated Subtitle */}
            <div className="animate-fade-in-up">
              <p className="text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto font-light">
                Professional Digital Agriculture Platform
              </p>
            </div>
          </div>
          
          {/* Description with Enhanced Typography */}
          <div className="animate-fade-in-up delay-300">
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-normal">
              Empowering farmers with <span className="text-primary font-semibold">data-driven insights</span>, 
              comprehensive analytics, and seamless government scheme integration. 
              Make informed decisions with our professional agricultural ecosystem.
            </p>
          </div>
          
          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-12 animate-fade-in-up delay-500">
            <Button 
              variant="professional" 
              size="lg" 
              className="px-12 py-6 text-xl font-semibold hover-lift transition-all duration-300"
            >
              🚀 Explore Platform
            </Button>
            <Button 
              variant="clean" 
              size="lg" 
              className="px-12 py-6 text-xl font-semibold border-2 hover-lift transition-all duration-300"
            >
              📊 View Analytics
            </Button>
          </div>
          
          {/* Enhanced Features Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-20 max-w-6xl mx-auto animate-fade-in-up delay-700">
            <div className="feature-card text-center hover-lift professional-card p-6">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">Crop Insights</h3>
              <p className="text-sm text-muted-foreground">AI-powered crop recommendations</p>
            </div>
            <div className="feature-card text-center hover-lift professional-card p-6">
              <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">Analytics</h3>
              <p className="text-sm text-muted-foreground">Comprehensive data insights</p>
            </div>
            <div className="feature-card text-center hover-lift professional-card p-6">
              <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">💼</span>
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">Investments</h3>
              <p className="text-sm text-muted-foreground">Strategic opportunities</p>
            </div>
            <div className="feature-card text-center hover-lift professional-card p-6">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">🏛️</span>
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">Schemes</h3>
              <p className="text-sm text-muted-foreground">Government support</p>
            </div>
          </div>
          
          {/* Stats Counter */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 max-w-4xl mx-auto animate-fade-in-up delay-1000">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">5000+</div>
              <div className="text-sm text-muted-foreground">Farmers Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary">₹2.5Cr+</div>
              <div className="text-sm text-muted-foreground">Investment Facilitated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent">25+</div>
              <div className="text-sm text-muted-foreground">Crop Varieties</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
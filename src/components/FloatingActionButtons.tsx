import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Users, TrendingUp, Rocket, X } from "lucide-react";

interface FABItem {
  id: string;
  icon: any;
  label: string;
  content: string;
  color: string;
}

const fabItems: FABItem[] = [
  {
    id: "schemes",
    icon: Zap,
    label: "Quick Schemes",
    content: "Searchable repository of government schemes with smart filters and instant eligibility check.",
    color: "text-yellow-400"
  },
  {
    id: "networking",
    icon: Users,
    label: "Networking Hub",
    content: "Connect with farmers, investors, and agri-entrepreneurs. Build partnerships and explore collaborations.",
    color: "text-blue-400"
  },
  {
    id: "market",
    icon: TrendingUp,
    label: "Market Trends",
    content: "Real-time price updates, demand forecasts, and market intelligence powered by AI analytics.",
    color: "text-green-400"
  },
  {
    id: "vision",
    icon: Rocket,
    label: "Our Vision",
    content: "FarmSphere aims to revolutionize agriculture through technology, making farming profitable and sustainable for everyone.",
    color: "text-purple-400"
  }
];

const FloatingActionButtons = () => {
  const [activePopup, setActivePopup] = useState<string | null>(null);

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 space-y-4">
        {fabItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActivePopup(item.id)}
            className="professional-card w-12 h-12 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-110 group shadow-lg"
            style={{ animationDelay: `${index * 0.1}s` }}
            title={item.label}
          >
            <item.icon className="h-5 w-5" />
            <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-foreground text-background px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Popup Overlay */}
      {activePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="professional-card max-w-2xl w-full p-8 animate-scale-in">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {(() => {
                    const item = fabItems.find(item => item.id === activePopup);
                    if (!item) return null;
                    return (
                      <>
                        <item.icon className={`h-8 w-8 ${item.color}`} />
                        <h3 className="text-2xl font-bold text-foreground">{item.label}</h3>
                      </>
                    );
                  })()}
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setActivePopup(null)}
                  className="h-10 w-10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {fabItems.find(item => item.id === activePopup)?.content}
                </p>

                {/* Dynamic Content Based on Type */}
                {activePopup === 'schemes' && (
                  <div className="space-y-4">
                    <div className="feature-card p-4">
                      <h4 className="font-semibold text-foreground mb-2">🔍 Smart Search</h4>
                      <p className="text-sm text-muted-foreground">Find schemes by category, loan amount, or eligibility criteria</p>
                    </div>
                    <div className="feature-card p-4">
                      <h4 className="font-semibold text-foreground mb-2">⚡ Instant Check</h4>
                      <p className="text-sm text-muted-foreground">AI-powered eligibility verification in seconds</p>
                    </div>
                  </div>
                )}

                {activePopup === 'networking' && (
                  <div className="space-y-4">
                    <div className="feature-card p-4">
                      <h4 className="font-semibold text-foreground mb-2">👥 Farmer Network</h4>
                      <p className="text-sm text-muted-foreground">Connect with 10,000+ verified farmers across India</p>
                    </div>
                    <div className="feature-card p-4">
                      <h4 className="font-semibold text-foreground mb-2">💼 Investor Portal</h4>
                      <p className="text-sm text-muted-foreground">Access to pre-verified agricultural investors</p>
                    </div>
                  </div>
                )}

                {activePopup === 'market' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="feature-card p-4 text-center">
                        <div className="text-lg font-bold text-primary">₹2,450</div>
                        <div className="text-sm text-muted-foreground">Wheat/Quintal</div>
                      </div>
                      <div className="feature-card p-4 text-center">
                        <div className="text-lg font-bold text-green-600">+12%</div>
                        <div className="text-sm text-muted-foreground">This Month</div>
                      </div>
                    </div>
                  </div>
                )}

                {activePopup === 'vision' && (
                  <div className="space-y-4">
                    <div className="feature-card p-4">
                      <h4 className="font-semibold text-foreground mb-2">🎯 Mission</h4>
                      <p className="text-sm text-muted-foreground">Empower 1M+ farmers with technology and data-driven insights</p>
                    </div>
                    <div className="feature-card p-4">
                      <h4 className="font-semibold text-foreground mb-2">🚀 Vision 2030</h4>
                      <p className="text-sm text-muted-foreground">Make India's agriculture the most profitable and sustainable globally</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button variant="professional" className="w-full">
                  {activePopup === 'schemes' && 'Explore Schemes'}
                  {activePopup === 'networking' && 'Join Network'}
                  {activePopup === 'market' && 'View Market Data'}
                  {activePopup === 'vision' && 'Learn More'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingActionButtons;
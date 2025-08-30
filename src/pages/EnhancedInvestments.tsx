import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, TrendingUp, DollarSign, Building, ArrowUpDown, ArrowLeft } from "lucide-react";

interface InvestmentUnit {
  id: string;
  name: string;
  icon: string;
  investment: string;
  subsidy: string;
  roi: string;
  payback: string;
  profit: string;
  description: string;
  category: string;
  riskLevel: string;
  marketDemand: string;
}

const investmentUnits: InvestmentUnit[] = [
  {
    id: "food-processing",
    name: "Food Processing",
    icon: "🏭",
    investment: "₹25-50 Lakhs",
    subsidy: "35% Govt Support",
    roi: "25-30% annually",
    payback: "3-4 years",
    profit: "₹8-15 Lakhs/year",
    description: "Modern food processing facilities with cold chain integration",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "High"
  },
  {
    id: "cold-storage",
    name: "Cold Storage",
    icon: "❄️",
    investment: "₹40-80 Lakhs",
    subsidy: "40% Govt Support",
    roi: "20-25% annually",
    payback: "4-5 years",
    profit: "₹10-20 Lakhs/year",
    description: "Temperature-controlled storage for fruits and vegetables",
    category: "Storage",
    riskLevel: "Low",
    marketDemand: "Very High"
  },
  {
    id: "dairy",
    name: "Dairy Processing",
    icon: "🥛",
    investment: "₹30-60 Lakhs",
    subsidy: "50% Govt Support",
    roi: "22-28% annually",
    payback: "3-4 years",
    profit: "₹8-18 Lakhs/year",
    description: "Milk processing and dairy product manufacturing units",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "High"
  },
  {
    id: "oilseed",
    name: "Oilseed Processing",
    icon: "🫒",
    investment: "₹20-40 Lakhs",
    subsidy: "30% Govt Support",
    roi: "18-24% annually",
    payback: "4-5 years",
    profit: "₹6-12 Lakhs/year",
    description: "Oil extraction and refining facilities",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "Medium"
  },
  {
    id: "fisheries",
    name: "Fisheries",
    icon: "🐟",
    investment: "₹15-35 Lakhs",
    subsidy: "45% Govt Support",
    roi: "20-26% annually",
    payback: "3-4 years",
    profit: "₹5-12 Lakhs/year",
    description: "Aquaculture and fish processing facilities",
    category: "Production",
    riskLevel: "High",
    marketDemand: "High"
  },
  {
    id: "organic",
    name: "Organic Farming",
    icon: "🌿",
    investment: "₹10-25 Lakhs",
    subsidy: "25% Govt Support",
    roi: "30-40% annually",
    payback: "2-3 years",
    profit: "₹8-15 Lakhs/year",
    description: "Certified organic farming and processing operations",
    category: "Production",
    riskLevel: "Low",
    marketDemand: "Growing"
  }
];

const EnhancedInvestments = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [sortBy, setSortBy] = useState<'name' | 'roi' | 'investment'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [selectedInvestment, setSelectedInvestment] = useState<InvestmentUnit | null>(null);

  const filteredAndSortedInvestments = useMemo(() => {
    let investments = [...investmentUnits];
    console.log("Initial investments:", investments); // Log initial investments

    // Apply search filter
    if (searchTerm) {
      investments = investments.filter(investment =>
        investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investment.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      investments = investments.filter(investment => investment.category === categoryFilter);
    }

    // Apply risk filter
    if (riskFilter !== 'all') {
      investments = investments.filter(investment => investment.riskLevel === riskFilter);
    }

    // Apply sorting
    investments.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'roi':
          aValue = parseFloat(a.roi.split('-')[0]);
          bValue = parseFloat(b.roi.split('-')[0]);
          break;
        case 'investment':
          aValue = parseFloat(a.investment.split('-')[0].replace('₹', '').replace(' Lakhs', ''));
          bValue = parseFloat(b.investment.split('-')[0].replace('₹', '').replace(' Lakhs', ''));
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
    });

    return investments;
  }, [searchTerm, sortBy, sortOrder, categoryFilter, riskFilter]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const renderInvestmentCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAndSortedInvestments.map((investment) => (
        <Card 
          key={investment.id}
          className="cursor-pointer hover-card group transition-all duration-300 hover:shadow-xl border-border/50"
          onClick={() => setSelectedInvestment(investment)}
        >
          <CardContent className="p-6">
            <div className="relative mb-4 overflow-hidden rounded-lg">
              <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                <span className="text-4xl">{investment.icon}</span>
              </div>
              <div className="absolute top-3 right-3">
                <Badge className="bg-primary/90 backdrop-blur-sm text-white">
                  {investment.category}
                </Badge>
              </div>
              <div className="absolute bottom-3 left-3">
                <Badge 
                  variant="secondary" 
                  className={`backdrop-blur-sm bg-white/90 ${
                    investment.riskLevel === 'Low' ? 'text-green-600' :
                    investment.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}
                >
                  {investment.riskLevel} Risk
                </Badge>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
              {investment.name}
            </h3>
            
            <p className="text-muted-foreground text-sm mb-4">
              {investment.description}
            </p>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Investment:</span>
                <span className="font-semibold text-foreground">{investment.investment}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Govt. Subsidy:</span>
                <span className="font-semibold text-accent">{investment.subsidy}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Annual ROI:</span>
                <span className="font-semibold text-secondary">{investment.roi}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <DollarSign className="h-4 w-4 mx-auto mb-1 text-green-600" />
                <span className="text-xs text-muted-foreground">Payback</span>
                <p className="font-semibold text-green-600 text-sm">{investment.payback}</p>
              </div>
              
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <TrendingUp className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                <span className="text-xs text-muted-foreground">Profit</span>
                <p className="font-semibold text-sm">{investment.profit}</p>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4">
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
        <Search className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No investments found</h3>
      <p className="text-muted-foreground">Try adjusting your search or filters to find more investment opportunities.</p>
    </div>
  );

  const [investmentAmount, setInvestmentAmount] = useState('');
  const [calculatedROI, setCalculatedROI] = useState<number | null>(null);
  const [showROICalculator, setShowROICalculator] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);

  const calculateROI = () => {
    if (!selectedInvestment || !investmentAmount) return;
    
    const investment = parseFloat(investmentAmount.replace(/[^\d.]/g, ''));
    const roiPercentage = parseFloat(selectedInvestment.roi.split('-')[0]);
    const annualReturn = investment * (roiPercentage / 100);
    
    setCalculatedROI(annualReturn);
  };

  const renderInvestmentDetail = () => (
    <div className="glass-card p-6 animate-fade-in-scale max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{selectedInvestment?.icon}</span>
            <div>
              <h3 className="text-xl font-bold text-foreground">{selectedInvestment?.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedInvestment?.description}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setSelectedInvestment(null);
              setShowROICalculator(false);
              setCalculatedROI(null);
              setInvestmentAmount('');
            }}
            className="h-8 w-8 p-0"
          >
            ✕
          </Button>
        </div>

        {/* Investment Metrics - Compact Layout */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <DollarSign className="h-4 w-4 text-orange-400 mx-auto mb-1" />
            <div className="text-xs text-muted-foreground mb-1">Investment</div>
            <div className="text-sm font-bold text-foreground">{selectedInvestment?.investment}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <Building className="h-4 w-4 text-accent mx-auto mb-1" />
            <div className="text-xs text-muted-foreground mb-1">Subsidy</div>
            <div className="text-sm font-bold text-foreground">{selectedInvestment?.subsidy}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <TrendingUp className="h-4 w-4 text-secondary mx-auto mb-1" />
            <div className="text-xs text-muted-foreground mb-1">ROI</div>
            <div className="text-sm font-bold text-secondary">{selectedInvestment?.roi}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <span className="text-sm">⏱️</span>
            <div className="text-xs text-muted-foreground mb-1">Payback</div>
            <div className="text-sm font-bold text-foreground">{selectedInvestment?.payback}</div>
          </div>
        </div>

        {/* Annual Profit - Highlighted with different color */}
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-3 border border-green-400/30">
          <h4 className="text-sm font-semibold text-foreground mb-1">💰 Annual Profit</h4>
          <div className="text-lg font-bold text-green-600">{selectedInvestment?.profit}</div>
          <p className="text-xs text-muted-foreground mt-1">Expected yearly earnings after all expenses</p>
        </div>

        {/* Additional Details - Compact */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-foreground mb-1">Risk Level</h4>
            <div className={`text-sm font-bold ${
              selectedInvestment?.riskLevel === 'Low' ? 'text-green-600' :
              selectedInvestment?.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {selectedInvestment?.riskLevel}
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-foreground mb-1">Market Demand</h4>
            <div className="text-sm font-bold text-secondary">{selectedInvestment?.marketDemand}</div>
          </div>
        </div>

        {/* ROI Calculator */}
        {showROICalculator && (
          <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-200">
            <h4 className="text-sm font-semibold text-foreground mb-3">📊 ROI Calculator</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Investment Amount (₹)</label>
                <Input
                  type="text"
                  placeholder="Enter amount"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="text-sm"
                />
              </div>
              <Button onClick={calculateROI} size="sm" className="w-full">
                Calculate ROI
              </Button>
              {calculatedROI !== null && (
                <div className="text-center p-2 bg-green-100/50 rounded">
                  <p className="text-sm text-muted-foreground">Annual Return:</p>
                  <p className="text-lg font-bold text-green-700">₹{calculatedROI.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Information */}
        {showContactDetails && (
          <div className="bg-purple-50/50 rounded-lg p-4 border border-purple-200">
            <h4 className="text-sm font-semibold text-foreground mb-3">📞 Contact Support</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Toll Free:</span>
                <span className="font-semibold text-foreground">1800-123-4567</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mobile:</span>
                <span className="font-semibold text-foreground">+91-9876543210</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-semibold text-foreground">support@farmsphere.in</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Support Hours:</span>
                <span className="font-semibold text-foreground">24/7</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons - Compact */}
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs"
            onClick={() => setShowROICalculator(!showROICalculator)}
          >
            {showROICalculator ? 'Hide Calculator' : 'ROI Calculator'}
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            📄 Business Plan
          </Button>
          <Button 
            variant="professional" 
            size="sm" 
            className="flex-1 text-xs"
            onClick={() => setShowContactDetails(!showContactDetails)}
          >
            {showContactDetails ? 'Hide Contact' : '💬 Contact'}
          </Button>
        </div>
      </div>
    </div>
  );

  const handleBack = () => {
    navigate("/"); // Navigate back to home
    window.scrollTo(0, 0); // Ensure scroll position is reset
  };

  return (
    <section className="section-container bg-gradient-to-br from-background to-muted/30 min-h-screen">
      {/* Back Button */}
      <div className="px-4 pt-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
      <div>
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            🏭 Agro Production Units
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Strategic long-term investments in agricultural processing units with government support and guaranteed returns
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg border">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search investment opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Storage">Storage</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Risk Filter */}
            <div>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger>
                  <span className="text-sm">⚠️</span>
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="Low">Low Risk</SelectItem>
                  <SelectItem value="Medium">Medium Risk</SelectItem>
                  <SelectItem value="High">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Button */}
            <div>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={toggleSortOrder}
              >
                <div className="flex items-center">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <span>
                    {sortBy === 'name' && 'Name'}
                    {sortBy === 'roi' && 'ROI'}
                    {sortBy === 'investment' && 'Investment'}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              </Button>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('name')}
            >
              Sort by Name
            </Button>
            <Button
              variant={sortBy === 'roi' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('roi')}
            >
              Sort by ROI
            </Button>
            <Button
              variant={sortBy === 'investment' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('investment')}
            >
              Sort by Investment
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {filteredAndSortedInvestments.length} of {investmentUnits.length} investment opportunities
          </p>
          {(searchTerm || categoryFilter !== 'all' || riskFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setRiskFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Investments Grid */}
        <div className="space-y-6">
          {selectedInvestment ? renderInvestmentDetail() : (
            filteredAndSortedInvestments.length > 0 ? renderInvestmentCards() : renderEmptyState()
          )}
        </div>
      </div>

      <style>{`
        .hover-card {
          transition: all 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-4px);
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.3s ease-out;
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
};

export default EnhancedInvestments;

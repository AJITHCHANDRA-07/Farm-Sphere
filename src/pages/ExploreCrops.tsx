import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, TrendingUp, Clock, Droplets, ArrowUpDown, BarChart3, Target, Leaf, Sparkles } from "lucide-react";
import { getCropsByCategory, cropData } from "@/data/cropData";
import CropDetailModal from "@/components/CropDetailModal";
import { useCropModal } from "@/hooks/useCropModal";

const ExploreCrops = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'short' | 'medium' | 'long'>('short');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'profit' | 'name' | 'duration' | 'roi'>('profit');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [waterFilter, setWaterFilter] = useState<string>('all');
  const [demandFilter, setDemandFilter] = useState<string>('all');
  const { selectedCrop, isModalOpen, openModal, closeModal } = useCropModal();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const shortTermCrops = getCropsByCategory('short');
  const mediumTermCrops = getCropsByCategory('medium');
  const longTermCrops = getCropsByCategory('long');

  const getCurrentCrops = () => {
    switch (activeTab) {
      case 'short': return shortTermCrops;
      case 'medium': return mediumTermCrops;
      case 'long': return longTermCrops;
      default: return shortTermCrops;
    }
  };

  const filteredAndSortedCrops = useMemo(() => {
    let crops = getCurrentCrops();

    // Apply search filter
    if (searchTerm) {
      crops = crops.filter(crop =>
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.cultivationSteps.some(step => step.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply water filter
    if (waterFilter !== 'all') {
      crops = crops.filter(crop => {
        const waterLevel = crop.waterNeeds.toLowerCase();
        if (waterFilter === 'low') return waterLevel.includes('low') || waterLevel.includes('minimal');
        if (waterFilter === 'moderate') return waterLevel.includes('moderate');
        if (waterFilter === 'high') return waterLevel.includes('high') || waterLevel.includes('very high');
        return true;
      });
    }

    // Apply demand filter
    if (demandFilter !== 'all') {
      crops = crops.filter(crop => crop.demand.toLowerCase().includes(demandFilter.toLowerCase()));
    }

    // Apply sorting
    crops.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'profit':
          aValue = a.profitPerAcre;
          bValue = b.profitPerAcre;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'duration':
          aValue = a.durationDays;
          bValue = b.durationDays;
          break;
        case 'roi':
          aValue = a.quickReturns.avgROIPercent;
          bValue = b.quickReturns.avgROIPercent;
          break;
        default:
          aValue = a.profitPerAcre;
          bValue = b.profitPerAcre;
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

    return crops;
  }, [activeTab, searchTerm, sortBy, sortOrder, waterFilter, demandFilter]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getProfitColor = (profit: number) => {
    if (profit > 200000) return 'text-green-600';
    if (profit > 100000) return 'text-green-500';
    if (profit > 50000) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getROIColor = (roi: number) => {
    if (roi > 300) return 'text-green-600';
    if (roi > 200) return 'text-green-500';
    if (roi > 100) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const renderCropCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAndSortedCrops.map((crop) => (
        <Card 
          key={crop.id} 
          className="cursor-pointer hover-card group transition-all duration-300 hover:shadow-2xl border-border/30 bg-white/95 backdrop-blur-sm"
          onClick={() => openModal(crop)}
        >
          <CardContent className="p-6">
            {/* Image with badges */}
            <div className="relative mb-4 overflow-hidden rounded-xl">
              <img 
                src={crop.image} 
                alt={crop.name}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3">
                <div className="bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {crop.duration}
                </div>
              </div>
              <div className="absolute bottom-3 left-3">
                <div className="bg-white/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  {crop.demand}
                </div>
              </div>
            </div>
            
            {/* Crop Name */}
            <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
              {crop.name}
            </h3>
            
            {/* Description */}
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {crop.description}
            </p>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-600" />
                <span className="text-xs text-muted-foreground">Profit/Acre</span>
                <p className={`font-bold text-sm ${getProfitColor(crop.profitPerAcre)}`}>
                  ₹{(crop.profitPerAcre / 100000).toFixed(1)}L
                </p>
              </div>
              
              <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <Target className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                <span className="text-xs text-muted-foreground">ROI</span>
                <p className={`font-bold text-sm ${getROIColor(crop.quickReturns.avgROIPercent)}`}>
                  {crop.quickReturns.avgROIPercent}%
                </p>
              </div>
              
              <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                <Droplets className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                <span className="text-xs text-muted-foreground">Water</span>
                <p className="font-semibold text-sm truncate" title={crop.waterNeeds}>
                  {crop.waterNeeds.split(';')[0]}
                </p>
              </div>
              
              <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <Clock className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                <span className="text-xs text-muted-foreground">Duration</span>
                <p className="font-semibold text-sm">{crop.duration}</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-border/20">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Investment: ₹{(crop.investmentCost / 1000).toFixed(0)}K</span>
                <span>Yield: {crop.expectedYield.toLocaleString()}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center">
        <Search className="h-12 w-12 text-primary/60" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No crops found</h3>
      <p className="text-muted-foreground mb-6">Try adjusting your search or filters to find more crops.</p>
      <Button onClick={() => {
        setSearchTerm('');
        setWaterFilter('all');
        setDemandFilter('all');
      }}>
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl mb-6">
            <Leaf className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            🌱 Low Supply High Demand Crops
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover profitable crops with high market demand and optimize your farming strategy
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => {
                console.log("Explore States button clicked");
                navigate('/enhanced-states');
              }}
              className="px-8 py-3"
            >
              Explore States
            </Button>
            <Button 
              variant="professional" 
              size="lg"
              onClick={() => navigate('/crops')}
              className="px-8 py-3"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Advanced Analytics
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/')}
              className="px-8 py-3"
            >
              ← Back to Home
            </Button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-xl border">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search crops by name, description, or cultivation steps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {/* Water Filter */}
            <div>
              <Select value={waterFilter} onValueChange={setWaterFilter}>
                <SelectTrigger className="h-12">
                  <Droplets className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Water Needs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Water Needs</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Demand Filter */}
            <div>
              <Select value={demandFilter} onValueChange={setDemandFilter}>
                <SelectTrigger className="h-12">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Demand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Demand</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Button */}
            <div>
              <Button
                variant="outline"
                className="w-full justify-between h-12"
                onClick={toggleSortOrder}
              >
                <div className="flex items-center">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <span>
                    {sortBy === 'profit' && 'Profit'}
                    {sortBy === 'name' && 'Name'}
                    {sortBy === 'duration' && 'Duration'}
                    {sortBy === 'roi' && 'ROI'}
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
              variant={sortBy === 'profit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('profit')}
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Profit
            </Button>
            <Button
              variant={sortBy === 'roi' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('roi')}
            >
              <Target className="h-4 w-4 mr-1" />
              ROI
            </Button>
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('name')}
            >
              A-Z
            </Button>
            <Button
              variant={sortBy === 'duration' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('duration')}
            >
              <Clock className="h-4 w-4 mr-1" />
              Duration
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {filteredAndSortedCrops.length} of {getCurrentCrops().length} crops
          </p>
          {(searchTerm || waterFilter !== 'all' || demandFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setWaterFilter('all');
                setDemandFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'short' | 'medium' | 'long')} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="short" className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Clock className="h-4 w-4" />
              Short-Term
              <span className="text-xs text-muted-foreground">(3-6m)</span>
            </TabsTrigger>
            <TabsTrigger value="medium" className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <TrendingUp className="h-4 w-4" />
              Medium-Term
              <span className="text-xs text-muted-foreground">(6-12m)</span>
            </TabsTrigger>
            <TabsTrigger value="long" className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Sparkles className="h-4 w-4" />
              Long-Term
              <span className="text-xs text-muted-foreground">(12+m)</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="short" className="space-y-6">
            {filteredAndSortedCrops.length > 0 ? renderCropCards() : renderEmptyState()}
          </TabsContent>

          <TabsContent value="medium" className="space-y-6">
            {filteredAndSortedCrops.length > 0 ? renderCropCards() : renderEmptyState()}
          </TabsContent>

          <TabsContent value="long" className="space-y-6">
            {filteredAndSortedCrops.length > 0 ? renderCropCards() : renderEmptyState()}
          </TabsContent>
        </Tabs>
      </div>

      <CropDetailModal 
        crop={selectedCrop} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .hover-card {
          transition: all 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </section>
  );
};

export default ExploreCrops;

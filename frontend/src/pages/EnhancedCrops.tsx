import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, TrendingUp, Clock, Droplets, ArrowUpDown } from "lucide-react";
import { getCropsByCategory, cropData } from "@/data/cropData";
import CropDetailModal from "@/components/CropDetailModal";
import { useCropModal } from "@/hooks/useCropModal";

const EnhancedCrops = () => {
  const [activeTab, setActiveTab] = useState<'short' | 'medium' | 'long'>('short');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [sortBy, setSortBy] = useState<'profit' | 'name' | 'duration'>('profit');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [waterFilter, setWaterFilter] = useState<string>('all');
  const [demandFilter, setDemandFilter] = useState<string>('all');
  const { selectedCrop, isModalOpen, openModal, closeModal } = useCropModal();

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
        crop.description.toLowerCase().includes(searchTerm.toLowerCase())
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
      crops = crops.filter(crop => crop.demand.toLowerCase() === demandFilter.toLowerCase());
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

  const renderCropCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAndSortedCrops.map((crop) => (
        <Card 
          key={crop.id} 
          className="cursor-pointer hover-card group transition-all duration-300 hover:shadow-xl border-border/50"
          onClick={() => openModal(crop)}
        >
          <CardContent className="p-6">
            <div className="relative mb-4 overflow-hidden rounded-lg">
              <img 
                src={crop.image} 
                alt={crop.name}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-primary/90 backdrop-blur-sm text-white">
                  {crop.duration}
                </Badge>
              </div>
              <div className="absolute bottom-3 left-3">
                <Badge variant="secondary" className="backdrop-blur-sm bg-white/90">
                  {crop.demand}
                </Badge>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
              {crop.name}
            </h3>
            
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {crop.description}
            </p>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <TrendingUp className="h-4 w-4 mx-auto mb-1 text-green-600" />
                <span className="text-xs text-muted-foreground">Profit</span>
                <p className="font-semibold text-green-600 text-sm">
                  ₹{(crop.profitPerAcre / 100000).toFixed(1)}L
                </p>
              </div>
              
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <Droplets className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                <span className="text-xs text-muted-foreground">Water</span>
                <p className="font-semibold text-sm truncate" title={crop.waterNeeds}>
                  {crop.waterNeeds.split(';')[0]}
                </p>
              </div>
              
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <Clock className="h-4 w-4 mx-auto mb-1 text-orange-600" />
                <span className="text-xs text-muted-foreground">ROI</span>
                <p className="font-semibold text-sm text-orange-600">
                  {crop.quickReturns.avgROIPercent}%
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Investment: ₹{(crop.investmentCost / 1000).toFixed(0)}K</span>
                <span>Yield: {crop.expectedYield.toLocaleString()}</span>
              </div>
            </div>
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
      <h3 className="text-lg font-semibold text-foreground mb-2">No crops found</h3>
      <p className="text-muted-foreground">Try adjusting your search or filters to find more crops.</p>
    </div>
  );

  return (
    <section className="section-container bg-gradient-to-br from-background to-muted/30 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            🌱 Crop Explorer
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover profitable farming opportunities with our comprehensive crop database. 
            Filter by duration, water needs, and market demand to find your perfect match.
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
                  placeholder="Search crops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Water Filter */}
            <div>
              <Select value={waterFilter} onValueChange={setWaterFilter}>
                <SelectTrigger>
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
                <SelectTrigger>
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
                className="w-full justify-between"
                onClick={toggleSortOrder}
              >
                <div className="flex items-center">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <span>
                    {sortBy === 'profit' && 'Profit'}
                    {sortBy === 'name' && 'Name'}
                    {sortBy === 'duration' && 'Duration'}
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
              Sort by Profit
            </Button>
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('name')}
            >
              Sort by Name
            </Button>
            <Button
              variant={sortBy === 'duration' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('duration')}
            >
              Sort by Duration
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
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="short" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Short-Term (3-6 months)
            </TabsTrigger>
            <TabsTrigger value="medium" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Medium-Term (6-12 months)
            </TabsTrigger>
            <TabsTrigger value="long" className="flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Long-Term (12+ months)
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
          transform: translateY(-4px);
        }
      `}</style>
    </section>
  );
};

export default EnhancedCrops;

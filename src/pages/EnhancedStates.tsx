import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, TrendingUp, MapPin, Droplets, ArrowUpDown, ArrowLeft } from "lucide-react";
import { stateCropData } from "@/data/stateCropData";
import { cropData } from "@/data/cropData";
import CropDetailModal from "@/components/CropDetailModal";
import StateDetailModal from "@/components/StateDetailModal";
import { useCropModal } from "@/hooks/useCropModal";

const EnhancedStates = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [sortBy, setSortBy] = useState<'state' | 'crops'>('state');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [climateFilter, setClimateFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const { selectedCrop, isModalOpen, openModal, closeModal } = useCropModal();
  const [selectedState, setSelectedState] = useState<any>(null);
  const [isStateModalOpen, setIsStateModalOpen] = useState(false);

  const filteredAndSortedStates = useMemo(() => {
    let states = [...stateCropData];
    console.log("Initial states:", states); // Log initial states

    // Apply search filter
    if (searchTerm) {
      states = states.filter(state =>
        state.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        state.majorCrops.some(crop => crop.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply climate filter
    if (climateFilter !== 'all') {
      states = states.filter(state =>
        state.majorCrops.some(crop => {
          const avgTemp = (crop.climate.temperatureC[0] + crop.climate.temperatureC[1]) / 2;
          if (climateFilter === 'tropical') return avgTemp >= 25;
          if (climateFilter === 'temperate') return avgTemp >= 15 && avgTemp < 25;
          if (climateFilter === 'cool') return avgTemp < 15;
          return true;
        })
      );
    }

    // Apply region filter
    if (regionFilter !== 'all') {
      const regions: Record<string, string[]> = {
        'north': ['Punjab', 'Haryana', 'Uttar Pradesh'],
        'south': ['Telangana', 'Andhra Pradesh', 'Karnataka', 'Kerala'],
        'west': ['Maharashtra', 'Gujarat'],
        'east': ['West Bengal'],
        'central': ['Gujarat-MadhyaPradesh-Misc']
      };
      
      if (regions[regionFilter]) {
        states = states.filter(state => regions[regionFilter].includes(state.state));
      }
    }

    // Apply sorting
    states.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'state':
          aValue = a.state;
          bValue = b.state;
          break;
        case 'crops':
          aValue = a.majorCrops.length;
          bValue = b.majorCrops.length;
          break;
        default:
          aValue = a.state;
          bValue = b.state;
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

    return states;
  }, [searchTerm, sortBy, sortOrder, climateFilter, regionFilter]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getClimateZone = (avgTemp: number) => {
    if (avgTemp >= 25) return 'Tropical';
    if (avgTemp >= 15) return 'Temperate';
    return 'Cool';
  };

  const renderStateCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAndSortedStates.map((state) => {
        const avgTemp = state.majorCrops.reduce((sum, crop) => {
          const cropAvg = (crop.climate.temperatureC[0] + crop.climate.temperatureC[1]) / 2;
          return sum + cropAvg;
        }, 0) / state.majorCrops.length;
        
        const climateZone = getClimateZone(avgTemp);

        return (
          <Card 
            key={state.state}
            className="cursor-pointer hover-card group transition-all duration-300 hover:shadow-xl border-border/50"
            onClick={() => {
              setSelectedState({
                name: state.state,
                weather: `${avgTemp.toFixed(1)}°C average temperature`,
                soil: 'Fertile alluvial soil',
                returnPerAcre: Math.round(state.majorCrops.reduce((sum, crop) => {
                  return sum + ((crop.returnRangeINR.max - crop.investmentRangeINR.min) * 0.7);
                }, 0) / state.majorCrops.length),
                investmentPerAcre: Math.round(state.majorCrops.reduce((sum, crop) => {
                  return sum + crop.investmentRangeINR.min;
                }, 0) / state.majorCrops.length),
                roi: Math.round(state.majorCrops.reduce((sum, crop) => {
                  const roi = ((crop.returnRangeINR.max - crop.investmentRangeINR.min) / crop.investmentRangeINR.min) * 100;
                  return sum + roi;
                }, 0) / state.majorCrops.length),
                additionalDetails: `Major crops include: ${state.majorCrops.map(c => c.name).join(', ')}. Climate zone: ${climateZone}.`
              });
              setIsStateModalOpen(true);
            }}
          >
            <CardContent className="p-6">
              <div className="relative mb-4 overflow-hidden rounded-lg">
                <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                  <MapPin className="h-16 w-16 text-white" />
                </div>
                <div className="absolute top-3 right-3">
                  <Badge className="bg-primary/90 backdrop-blur-sm text-white">
                    {state.majorCrops.length} Crops
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge variant="secondary" className="backdrop-blur-sm bg-white/90">
                    {climateZone}
                  </Badge>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                {state.state}
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Avg. Temperature:</span>
                  <span className="font-semibold">{avgTemp.toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Rainfall Range:</span>
                  <span className="font-semibold">
                    {Math.min(...state.majorCrops.map(c => c.climate.rainfallMm[0]))}-
                    {Math.max(...state.majorCrops.map(c => c.climate.rainfallMm[1]))}mm
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Major Crops:</h4>
                <div className="flex flex-wrap gap-1">
                  {state.majorCrops.slice(0, 3).map((crop) => (
                    <Badge 
                      key={crop.id} 
                      variant="outline" 
                      className="text-xs cursor-pointer hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        const fullCrop = cropData.find(c => c.id === crop.id);
                        if (fullCrop) {
                          openModal(fullCrop);
                        }
                      }}
                    >
                      {crop.name}
                    </Badge>
                  ))}
                  {state.majorCrops.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{state.majorCrops.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <TrendingUp className="h-4 w-4 mx-auto mb-1 text-green-600" />
                  <span className="text-xs text-muted-foreground">Avg. ROI</span>
                  <p className="font-semibold text-green-600 text-sm">
                    {Math.round(state.majorCrops.reduce((sum, crop) => {
                      const roi = ((crop.returnRangeINR.max - crop.investmentRangeINR.min) / crop.investmentRangeINR.min) * 100;
                      return sum + roi;
                    }, 0) / state.majorCrops.length)}%
                  </p>
                </div>
                
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <Droplets className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                  <span className="text-xs text-muted-foreground">Water Needs</span>
                  <p className="font-semibold text-sm">
                    {state.majorCrops.some(c => c.irrigation.toLowerCase().includes('high')) ? 'High' : 'Moderate'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
        <Search className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No states found</h3>
      <p className="text-muted-foreground">Try adjusting your search or filters to find more states.</p>
    </div>
  );

  return (
    <section className="section-container bg-gradient-to-br from-background to-muted/30 min-h-screen">
      <div>
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-start mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            🗺️ State Explorer
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover agricultural opportunities across different Indian states. 
            Explore state-wise crop patterns, climate conditions, and investment insights.
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
                  placeholder="Search states or crops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Climate Filter */}
            <div>
              <Select value={climateFilter} onValueChange={setClimateFilter}>
                <SelectTrigger>
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Climate Zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Climates</SelectItem>
                  <SelectItem value="tropical">Tropical</SelectItem>
                  <SelectItem value="temperate">Temperate</SelectItem>
                  <SelectItem value="cool">Cool</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Region Filter */}
            <div>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="north">North India</SelectItem>
                  <SelectItem value="south">South India</SelectItem>
                  <SelectItem value="west">West India</SelectItem>
                  <SelectItem value="east">East India</SelectItem>
                  <SelectItem value="central">Central India</SelectItem>
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
                    {sortBy === 'state' && 'State'}
                    {sortBy === 'crops' && 'Crops'}
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
              variant={sortBy === 'state' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('state')}
            >
              Sort by State
            </Button>
            <Button
              variant={sortBy === 'crops' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('crops')}
            >
              Sort by Crop Count
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {filteredAndSortedStates.length} of {stateCropData.length} states
          </p>
          {(searchTerm || climateFilter !== 'all' || regionFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setClimateFilter('all');
                setRegionFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* States Grid */}
        <div className="space-y-6">
          {filteredAndSortedStates.length > 0 ? renderStateCards() : renderEmptyState()}
        </div>
      </div>

      <CropDetailModal 
        crop={selectedCrop} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />

      <StateDetailModal
        state={selectedState}
        isOpen={isStateModalOpen}
        onClose={() => setIsStateModalOpen(false)}
      />

      <style>{`
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

export default EnhancedStates;

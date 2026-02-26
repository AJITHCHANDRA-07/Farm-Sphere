import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, TrendingUp, DollarSign, Droplets, BarChart3, Calculator, Image, Building } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface StateData {
  id: number;
  state_name: string;
  state_image?: string;
  major_crop_1: string;
  crop_1_price_per_quintal: number;
  crop_1_turnover: number;
  crop_1_export_destinations: string;
  crop_1_demand_status: string;
  major_crop_2: string;
  crop_2_price_per_quintal: number;
  crop_2_turnover: number;
  crop_2_export_destinations: string;
  crop_2_demand_status: string;
  major_crop_3: string;
  crop_3_price_per_quintal: number;
  crop_3_turnover: number;
  crop_3_export_destinations: string;
  crop_3_demand_status: string;
}

interface CropDetail {
  crop_name: string;
  crop_image?: string;
  price_per_quintal: number;
  turnover: number;
  export_destinations: string;
  demand_status: string;
  roi: number;
}

const StatesPage = () => {
  const [states, setStates] = useState<StateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<CropDetail | null>(null);
  
  // Dynamic ROI Calculator States
  const [landArea, setLandArea] = useState(1);
  const [investmentCost, setInvestmentCost] = useState(0);
  const [marketPrice, setMarketPrice] = useState(0);
  const [expectedYield, setExpectedYield] = useState(0);

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const { data, error } = await supabase
        .from('State_Wise_Major_Crops')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching states:', error);
        return;
      }

      setStates(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Unexpected error:', error);
      setLoading(false);
    }
  };

  const openStateModal = (state: StateData) => {
    setSelectedState(state);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedState(null);
    setSelectedCrop(null);
    setLandArea(1);
    setInvestmentCost(0);
    setMarketPrice(0);
    setExpectedYield(0);
  };

  const openCropDetails = (cropName: string, price: number, turnover: number, destinations: string, demand: string) => {
    // Convert price per quintal to price per kg (divide by 100)
    const pricePerKg = price / 100;
    
    setSelectedCrop({
      crop_name: cropName,
      crop_image: '', // Placeholder for future crop images
      price_per_quintal: price,
      turnover: turnover,
      export_destinations: destinations,
      demand_status: demand,
      roi: 0
    });
    
    // Set ROI calculator values based on crop data
    setLandArea(1);
    setInvestmentCost(25000); // Default investment per acre
    setMarketPrice(pricePerKg);
    setExpectedYield(2000); // Default yield per acre in kg
  };

  const calculateROI = () => {
    if (!selectedCrop) return;
    
    const totalRevenue = landArea * expectedYield * marketPrice;
    const totalInvestment = landArea * investmentCost;
    const netProfit = totalRevenue - totalInvestment;
    const roiPercentage = totalInvestment > 0 ? ((netProfit / totalInvestment) * 100).toFixed(2) : '0.00';
    
    return {
      totalRevenue,
      totalInvestment,
      netProfit,
      roiPercentage
    };
  };

  const getDemandColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDemandBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading states data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white py-20 shadow-2xl">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <Building className="h-16 w-16 mx-auto mb-4 text-white opacity-90" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-wide">
            🌾 INDIAN STATES AGRICULTURAL HUB
          </h1>
          <p className="text-2xl opacity-95 max-w-4xl mx-auto font-medium">
            Explore Major Crops • Export Opportunities • Market Insights
          </p>
          <div className="mt-8 flex justify-center space-x-8">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 mr-2" />
              <span className="text-lg font-semibold">28 States</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 mr-2" />
              <span className="text-lg font-semibold">84+ Crops</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-6 w-6 mr-2" />
              <span className="text-lg font-semibold">Export Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* States Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {states.map((state) => (
            <Card 
              key={state.id} 
              className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary hover:scale-105"
              onClick={() => openStateModal(state)}
            >
              {/* Space for future state image */}
              <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg flex items-center justify-center">
                <div className="text-center">
                  <Image className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">State Image</p>
                </div>
              </div>
              
              <CardHeader className="pb-3 pt-2">
                <CardTitle className="text-3xl font-black text-center mb-3 tracking-wide leading-tight">
                  {state.state_name}
                </CardTitle>
                <div className="text-center text-xs text-gray-600 font-medium mb-2">
                  🌾 Agricultural State
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Major Crops */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">🌾 Major Crops:</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded">
                      <span className="text-sm">• {state.major_crop_1}</span>
                      <Badge className={`text-xs ${getDemandBadgeColor(state.crop_1_demand_status)}`}>
                        {state.crop_1_demand_status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded">
                      <span className="text-sm">• {state.major_crop_2}</span>
                      <Badge className={`text-xs ${getDemandBadgeColor(state.crop_2_demand_status)}`}>
                        {state.crop_2_demand_status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded">
                      <span className="text-sm">• {state.major_crop_3}</span>
                      <Badge className={`text-xs ${getDemandBadgeColor(state.crop_3_demand_status)}`}>
                        {state.crop_3_demand_status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Total Turnover */}
                <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                  <div className="flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-base font-bold text-green-800">
                      Total Turnover: ₹{(state.crop_1_turnover + state.crop_2_turnover + state.crop_3_turnover).toLocaleString()} Cr
                    </span>
                  </div>
                </div>

                {/* Export Destinations */}
                <div className="text-center p-2.5 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center">
                    <TrendingUp className="h-3 w-3 text-blue-600 mr-2" />
                    <span className="text-xs font-bold text-blue-800">
                      Export: {state.crop_1_export_destinations.split(',')[0]}...
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* State Details Modal */}
      {isModalOpen && selectedState && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            {/* State Image at Top */}
            {selectedState.state_image && (
              <div className="relative h-64 overflow-hidden rounded-t-xl">
                <img 
                  src={selectedState.state_image} 
                  alt={selectedState.state_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h2 className="text-4xl font-black mb-2 tracking-wide">
                    {selectedState.state_name}
                  </h2>
                  <p className="text-lg opacity-90 font-medium">🌾 Major Crops & Export Insights</p>
                </div>
                <Button
                  onClick={closeModal}
                  variant="ghost"
                  className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
                >
                  ✕
                </Button>
              </div>
            )}
            
            {/* Modal Header (when no image) */}
            {!selectedState.state_image && (
              <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white p-8 rounded-t-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-4xl font-black mb-2 tracking-wide">
                      {selectedState.state_name}
                    </h2>
                    <p className="text-lg opacity-90 font-medium">🌾 Major Crops & Export Insights</p>
                  </div>
                  <Button
                    onClick={closeModal}
                    variant="ghost"
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            )}

            <div className="p-6 space-y-6">
              {/* Crop Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Crop 1 */}
                <Card className={`border-2 ${getDemandColor(selectedState.crop_1_demand_status)}`}>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-center mb-2">
                      🌾 {selectedState.major_crop_1}
                    </CardTitle>
                    <Badge className={`w-full justify-center ${getDemandBadgeColor(selectedState.crop_1_demand_status)}`}>
                      {selectedState.crop_1_demand_status} Demand
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">💰 Price/Quintal:</span>
                      <span className="font-bold">₹{selectedState.crop_1_price_per_quintal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">💰 Turnover:</span>
                      <span className="font-bold">₹{selectedState.crop_1_turnover.toLocaleString()} Cr</span>
                    </div>
                    <div className="text-xs">
                      <span className="font-medium">🌍 Export: </span>
                      <span>{selectedState.crop_1_export_destinations}</span>
                    </div>
                    <Button
                      onClick={() => openCropDetails(
                        selectedState.major_crop_1,
                        selectedState.crop_1_price_per_quintal,
                        selectedState.crop_1_turnover,
                        selectedState.crop_1_export_destinations,
                        selectedState.crop_1_demand_status
                      )}
                      className="w-full mt-3"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>

                {/* Crop 2 */}
                <Card className={`border-2 ${getDemandColor(selectedState.crop_2_demand_status)}`}>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-center mb-2">
                      🌾 {selectedState.major_crop_2}
                    </CardTitle>
                    <Badge className={`w-full justify-center ${getDemandBadgeColor(selectedState.crop_2_demand_status)}`}>
                      {selectedState.crop_2_demand_status} Demand
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">💰 Price/Quintal:</span>
                      <span className="font-bold">₹{selectedState.crop_2_price_per_quintal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">💰 Turnover:</span>
                      <span className="font-bold">₹{selectedState.crop_2_turnover.toLocaleString()} Cr</span>
                    </div>
                    <div className="text-xs">
                      <span className="font-medium">🌍 Export: </span>
                      <span>{selectedState.crop_2_export_destinations}</span>
                    </div>
                    <Button
                      onClick={() => openCropDetails(
                        selectedState.major_crop_2,
                        selectedState.crop_2_price_per_quintal,
                        selectedState.crop_2_turnover,
                        selectedState.crop_2_export_destinations,
                        selectedState.crop_2_demand_status
                      )}
                      className="w-full mt-3"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>

                {/* Crop 3 */}
                <Card className={`border-2 ${getDemandColor(selectedState.crop_3_demand_status)}`}>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-center mb-2">
                      🌾 {selectedState.major_crop_3}
                    </CardTitle>
                    <Badge className={`w-full justify-center ${getDemandBadgeColor(selectedState.crop_3_demand_status)}`}>
                      {selectedState.crop_3_demand_status} Demand
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">💰 Price/Quintal:</span>
                      <span className="font-bold">₹{selectedState.crop_3_price_per_quintal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">💰 Turnover:</span>
                      <span className="font-bold">₹{selectedState.crop_3_turnover.toLocaleString()} Cr</span>
                    </div>
                    <div className="text-xs">
                      <span className="font-medium">🌍 Export: </span>
                      <span>{selectedState.crop_3_export_destinations}</span>
                    </div>
                    <Button
                      onClick={() => openCropDetails(
                        selectedState.major_crop_3,
                        selectedState.crop_3_price_per_quintal,
                        selectedState.crop_3_turnover,
                        selectedState.crop_3_export_destinations,
                        selectedState.crop_3_demand_status
                      )}
                      className="w-full mt-3"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Crop Details with Tabs */}
              {selectedCrop && (
                <Card className="mt-6 border-2 border-primary">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-primary">
                      🌾 {selectedCrop.crop_name} - Detailed Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="roi">ROI Calculator</TabsTrigger>
                      </TabsList>

                      {/* Overview Tab */}
                      <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                              <span className="text-sm">💰 Price/Quintal:</span>
                              <span className="font-bold">₹{selectedCrop.price_per_quintal.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                              <span className="text-sm">💰 Annual Turnover:</span>
                              <span className="font-bold">₹{selectedCrop.turnover.toLocaleString()} Cr</span>
                            </div>
                            <div className="p-3 bg-blue-50 rounded">
                              <span className="text-sm font-medium">🌍 Export Destinations:</span>
                              <p className="text-xs mt-1">{selectedCrop.export_destinations}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="p-3 bg-green-50 rounded">
                              <span className="text-sm font-medium">📊 Demand Status:</span>
                              <Badge className={`ml-2 ${getDemandBadgeColor(selectedCrop.demand_status)}`}>
                                {selectedCrop.demand_status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* ROI Calculator Tab */}
                      <TabsContent value="roi" className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>ROI Calculator for {selectedCrop.crop_name}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="landArea">Land Area (acres)</Label>
                                <Input
                                  id="landArea"
                                  type="number"
                                  value={landArea}
                                  onChange={(e) => setLandArea(Number(e.target.value))}
                                  min="0.1"
                                  step="0.1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="investmentCost">Investment Cost (₹/acre)</Label>
                                <Input
                                  id="investmentCost"
                                  type="number"
                                  value={investmentCost}
                                  onChange={(e) => setInvestmentCost(Number(e.target.value))}
                                  min="0"
                                />
                              </div>
                              <div>
                                <Label htmlFor="expectedYield">Expected Yield (kg/acre)</Label>
                                <Input
                                  id="expectedYield"
                                  type="number"
                                  value={expectedYield}
                                  onChange={(e) => setExpectedYield(Number(e.target.value))}
                                  min="0"
                                />
                              </div>
                              <div>
                                <Label htmlFor="marketPrice">Market Price (₹/kg)</Label>
                                <Input
                                  id="marketPrice"
                                  type="number"
                                  value={marketPrice}
                                  onChange={(e) => setMarketPrice(Number(e.target.value))}
                                  min="0"
                                />
                              </div>
                            </div>

                            <div className="mt-4 p-4 bg-green-100 rounded-lg">
                              <h4 className="font-semibold mb-3 text-center">💰 ROI Calculation Results</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                  <span className="text-xs text-gray-600">Total Investment</span>
                                  <p className="font-bold text-lg">₹{calculateROI().totalInvestment.toLocaleString()}</p>
                                </div>
                                <div className="text-center">
                                  <span className="text-xs text-gray-600">Total Revenue</span>
                                  <p className="font-bold text-lg text-green-600">₹{calculateROI().totalRevenue.toLocaleString()}</p>
                                </div>
                                <div className="text-center">
                                  <span className="text-xs text-gray-600">Net Profit</span>
                                  <p className="font-bold text-lg text-blue-600">₹{calculateROI().netProfit.toLocaleString()}</p>
                                </div>
                                <div className="text-center">
                                  <span className="text-xs text-gray-600">ROI %</span>
                                  <p className="font-bold text-lg text-purple-600">{calculateROI().roiPercentage}%</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatesPage;

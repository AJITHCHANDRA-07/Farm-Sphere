import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Droplets, TrendingUp, MapPin, DollarSign, Sprout, Sun, Wind, Thermometer } from "lucide-react";

interface Crop {
  id: number;
  crop_name: string;
  crop_type: string;
  district: string;
  section: string;
  duration_days: number;
  water_requirement: string;
  soil_type: string;
  yield_estimate: string;
  season: string;
  image_url?: string;
  demand_status?: string;
  climate_suitability?: string;
  risk_factors?: string;
  mitigation_strategies?: string;
}

interface CropDetailModalProps {
  crop: Crop | null;
  isOpen: boolean;
  onClose: () => void;
}

const CropDetailModal = ({ crop, isOpen, onClose }: CropDetailModalProps) => {
  const [landArea, setLandArea] = useState(1);
  const [investmentCost, setInvestmentCost] = useState(50000);
  const [marketPrice, setMarketPrice] = useState(50);
  const [expectedYield, setExpectedYield] = useState(2000);

  if (!crop) return null;

  // 🔹 ROI CALCULATION
  const calculateROI = () => {
    const totalRevenue = landArea * expectedYield * marketPrice;
    const totalInvestment = landArea * investmentCost;
    const netProfit = totalRevenue - totalInvestment;
    const roiPercentage = totalInvestment > 0 ? ((netProfit / totalInvestment) * 100).toFixed(2) : '0';
    
    return {
      totalRevenue,
      totalInvestment,
      netProfit,
      roiPercentage: parseFloat(roiPercentage)
    };
  };

  const roi = calculateROI();

  // 🔹 CULTIVATION GUIDE DATA
  const cultivationGuide = {
    landPreparation: [
      `Plow the land to a depth of 20-25 cm for ${crop.crop_name}`,
      'Add well-decomposed farmyard manure at 10-15 tons per hectare',
      'Level the field properly to ensure uniform water distribution',
      'Create appropriate drainage channels to prevent water logging'
    ],
    seedMethod: [
      `Select high-quality ${crop.crop_name} seeds from certified sources`,
      'Treat seeds with fungicides to prevent soil-borne diseases',
      `Maintain seed spacing of ${crop.duration_days < 120 ? '15-20 cm' : '30-45 cm'} between plants`,
      'Plant at a depth of 2-3 cm in prepared soil'
    ],
    irrigation: [
      `Provide ${crop.water_requirement.toLowerCase().includes('high') ? 'frequent' : 'moderate'} irrigation based on crop needs`,
      'Follow the 2-3 day interval during dry season',
      'Use drip irrigation for water efficiency and cost reduction',
      'Avoid irrigation during flowering stage to prevent flower drop'
    ],
    fertilizer: [
      'Apply basal dose of NPK (60:40:20 kg/ha) at planting time',
      'Top-dress with nitrogen (30 kg/ha) 30 days after planting',
      'Apply potash (20 kg/ha) during critical growth stages',
      'Conduct soil testing every 2-3 years for precise fertilization'
    ],
    pestControl: [
      'Monitor fields regularly for pest and disease symptoms',
      'Use integrated pest management (IPM) practices',
      'Apply appropriate pesticides only when economic threshold is reached',
      'Encourage natural predators for biological pest control'
    ],
    harvesting: [
      `Harvest ${crop.crop_name} when ${crop.duration_days < 120 ? 'leaves are tender' : 'crop reaches full maturity'}`,
      'Harvest early morning or late evening to maintain quality',
      'Use sharp tools to prevent damage to plants',
      'Handle harvested produce carefully to avoid bruising'
    ],
    postHarvest: [
      'Clean and sort the harvest immediately after collection',
      'Store in cool, dry place with proper ventilation',
      'Use appropriate packaging to maintain freshness',
      'Transport to market quickly to get best prices'
    ]
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-green-800">{crop.crop_name}</DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            {crop.crop_type} • {crop.district} District • {crop.section}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="text-lg">📋 Overview</TabsTrigger>
            <TabsTrigger value="cultivation" className="text-lg">🌱 Cultivation Guide</TabsTrigger>
            <TabsTrigger value="roi" className="text-lg">💰 ROI Calculator</TabsTrigger>
          </TabsList>

          {/* 🔹 OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Basic Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                    <Clock className="h-5 w-5" />
                    Duration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-700">{crop.duration_days} days</p>
                  <p className="text-sm text-green-600">{crop.section}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                    <TrendingUp className="h-5 w-5" />
                    Yield Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-700">{crop.yield_estimate}</p>
                  <p className="text-sm text-blue-600">per hectare</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-purple-800">
                    <Droplets className="h-5 w-5" />
                    Water Needs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold text-purple-700">{crop.water_requirement}</p>
                  <p className="text-sm text-purple-600">irrigation level</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                    <Sun className="h-5 w-5" />
                    Season
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold text-orange-700">{crop.season || 'All Season'}</p>
                  <p className="text-sm text-orange-600">optimal time</p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <MapPin className="h-5 w-5" />
                    Growing Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="font-semibold">Soil Type</Label>
                    <p className="text-muted-foreground">{crop.soil_type || 'Well-drained loamy soil'}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Climate Suitability</Label>
                    <p className="text-muted-foreground">{crop.climate_suitability || 'Tropical and subtropical regions'}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Demand Status</Label>
                    <div className="mt-1">
                      <Badge className={crop.demand_status === 'High' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {crop.demand_status || 'Medium'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Wind className="h-5 w-5" />
                    Risk Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="font-semibold">Risk Factors</Label>
                    <p className="text-muted-foreground text-sm">{crop.risk_factors || 'Pest attacks, weather fluctuations, market price volatility'}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Mitigation Strategies</Label>
                    <p className="text-muted-foreground text-sm">{crop.mitigation_strategies || 'Regular monitoring, crop insurance, diversified planting'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Crop Image */}
            {crop.image_url && (
              <Card>
                <CardHeader>
                  <CardTitle>Crop Reference</CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={crop.image_url} 
                    alt={crop.crop_name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 🔹 CULTIVATION GUIDE TAB */}
          <TabsContent value="cultivation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sprout className="h-5 w-5" />
                    Land Preparation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {cultivationGuide.landPreparation.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5" />
                    Seed & Planting Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {cultivationGuide.seedMethod.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Droplets className="h-5 w-5" />
                    Irrigation Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {cultivationGuide.irrigation.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-cyan-600 mt-1">•</span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5" />
                    Fertilizer Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {cultivationGuide.fertilizer.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-600 mt-1">•</span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wind className="h-5 w-5" />
                    Pest & Disease Control
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {cultivationGuide.pestControl.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5" />
                    Harvesting & Post-Harvest
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {cultivationGuide.harvesting.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                  <Separator className="my-4" />
                  <ul className="space-y-2">
                    {cultivationGuide.postHarvest.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 🔹 ROI CALCULATOR TAB */}
          <TabsContent value="roi" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Parameters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">📊 Investment Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="landArea" className="font-semibold">Land Area (Acres)</Label>
                    <Input
                      id="landArea"
                      type="number"
                      value={landArea}
                      onChange={(e) => setLandArea(parseFloat(e.target.value) || 1)}
                      min="0.1"
                      step="0.1"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="investmentCost" className="font-semibold">Investment Cost per Acre (₹)</Label>
                    <Input
                      id="investmentCost"
                      type="number"
                      value={investmentCost}
                      onChange={(e) => setInvestmentCost(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="1000"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="marketPrice" className="font-semibold">Market Price per Unit (₹)</Label>
                    <Input
                      id="marketPrice"
                      type="number"
                      value={marketPrice}
                      onChange={(e) => setMarketPrice(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="1"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="expectedYield" className="font-semibold">Expected Yield per Acre (Units)</Label>
                    <Input
                      id="expectedYield"
                      type="number"
                      value={expectedYield}
                      onChange={(e) => setExpectedYield(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="100"
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* ROI Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">💰 Financial Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-sm text-green-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-700">₹{roi.totalRevenue.toLocaleString()}</p>
                    </div>
                    
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-red-600" />
                      <p className="text-sm text-red-600">Total Investment</p>
                      <p className="text-2xl font-bold text-red-700">₹{roi.totalInvestment.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <p className="text-sm text-blue-600 mb-2">Net Profit</p>
                    <p className={`text-3xl font-bold mb-2 ${roi.netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      ₹{roi.netProfit.toLocaleString()}
                    </p>
                    <p className="text-sm text-purple-600">ROI: {roi.roiPercentage}%</p>
                  </div>
                  
                  <div className="text-center">
                    <Badge className={`${roi.roiPercentage >= 20 ? 'bg-green-100 text-green-800' : roi.roiPercentage >= 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'} px-4 py-2`}>
                      {roi.roiPercentage >= 20 ? 'Excellent ROI' : roi.roiPercentage >= 10 ? 'Good ROI' : 'Low ROI'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Break-even Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">📈 Break-even Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Investment per Acre</p>
                    <p className="text-xl font-bold">₹{investmentCost.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Revenue per Acre</p>
                    <p className="text-xl font-bold">₹{(expectedYield * marketPrice).toLocaleString()}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Profit per Acre</p>
                    <p className={`text-xl font-bold ${(expectedYield * marketPrice - investmentCost) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{((expectedYield * marketPrice - investmentCost)).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Break-even Point:</strong> You need to sell at ₹{(investmentCost / expectedYield).toFixed(2)} per unit to break even.
                    Current market price is ₹{marketPrice}, giving you a margin of ₹{(marketPrice - investmentCost / expectedYield).toFixed(2)} per unit.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CropDetailModal;

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
import { Crop } from "@/data/cropData";
import { Calendar, Clock, Droplets, TrendingUp, MapPin, DollarSign } from "lucide-react";

interface CropDetailModalProps {
  crop: Crop | null;
  isOpen: boolean;
  onClose: () => void;
}

const CropDetailModal = ({ crop, isOpen, onClose }: CropDetailModalProps) => {
  const [landArea, setLandArea] = useState(1);
  const [investmentCost, setInvestmentCost] = useState(crop?.investmentCost || 0);
  const [marketPrice, setMarketPrice] = useState(crop?.marketPrice || 0);
  const [expectedYield, setExpectedYield] = useState(crop?.expectedYield || 0);

  if (!crop) return null;

  const calculateROI = () => {
    const totalRevenue = landArea * expectedYield * marketPrice;
    const totalInvestment = landArea * investmentCost;
    const netProfit = totalRevenue - totalInvestment;
    const roiPercentage = ((netProfit / totalInvestment) * 100).toFixed(2);
    
    return {
      totalRevenue,
      totalInvestment,
      netProfit,
      roiPercentage
    };
  };

  const roi = calculateROI();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{crop.name}</DialogTitle>
          <DialogDescription className="text-base">
            {crop.description}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cultivation">Cultivation Guide</TabsTrigger>
            <TabsTrigger value="roi">ROI Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Duration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{crop.duration}</p>
                  <p className="text-sm text-muted-foreground">{crop.durationDays} days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Profit Potential
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{crop.profitPerAcre.toLocaleString()}/acre
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Droplets className="h-4 w-4" />
                    Water Needs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={crop.waterNeeds === 'Low' ? 'secondary' : crop.waterNeeds === 'Medium' ? 'default' : 'destructive'}>
                    {crop.waterNeeds}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Market Demand
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={crop.demand === 'Very High' ? 'default' : 'secondary'}>
                    {crop.demand}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Investment & Returns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Investment Cost:</span>
                  <span className="font-semibold">₹{crop.investmentCost.toLocaleString()}/acre</span>
                </div>
                <div className="flex justify-between">
                  <span>Expected Yield:</span>
                  <span className="font-semibold">{crop.expectedYield.toLocaleString()} kg/acre</span>
                </div>
                <div className="flex justify-between">
                  <span>Market Price:</span>
                  <span className="font-semibold">₹{crop.marketPrice}/kg</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cultivation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cultivation Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {crop.cultivationSteps.map((step, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="font-semibold text-primary">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Seasonal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{crop.seasonalInfo}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pest Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {crop.pestManagement.map((pest, index) => (
                      <li key={index} className="text-sm">• {pest}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Harvest Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {crop.harvestTimeline.map((timeline, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{timeline}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roi" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>ROI Calculator</CardTitle>
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

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Investment:</span>
                    <span className="font-bold">₹{roi.totalInvestment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Revenue:</span>
                    <span className="font-bold text-green-600">₹{roi.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Net Profit:</span>
                    <span className="font-bold text-blue-600">₹{roi.netProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">ROI Percentage:</span>
                    <span className="font-bold text-purple-600">{roi.roiPercentage}%</span>
                  </div>
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

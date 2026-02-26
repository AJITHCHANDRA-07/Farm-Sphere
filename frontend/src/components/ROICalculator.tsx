import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Crop } from "@/data/cropData";

interface ROICalculatorProps {
  crop: Crop;
  landArea: number;
  onLandAreaChange: (value: number) => void;
  onInvestmentCostChange: (value: number) => void;
  onExpectedYieldChange: (value: number) => void;
  onMarketPriceChange: (value: number) => void;
}

export const ROICalculator = ({
  crop,
  landArea,
  onLandAreaChange,
  onInvestmentCostChange,
  onExpectedYieldChange,
  onMarketPriceChange,
}: ROICalculatorProps) => {
  const calculateROI = () => {
    const totalRevenue = landArea * crop.expectedYield * crop.marketPrice;
    const totalInvestment = landArea * crop.investmentCost;
    const netProfit = totalRevenue - totalInvestment;
    const roiPercentage = ((netProfit / totalInvestment) * 100).toFixed(2);
    
    return {
      totalRevenue,
      totalInvestment,
      netProfit,
      roiPercentage,
    };
  };

  const roi = calculateROI();

  return (
    <div className="max-w-4xl mx-auto text-center"> {/* matches other panels */}
      <Card className="p-8"> {/* add same padding as other panels */}
        <CardHeader>
          <CardTitle className="text-4xl font-bold">ROI Calculator</CardTitle> {/* match heading size */}
        </CardHeader>
        <CardContent className="space-y-6"> {/* increased spacing like other panels */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="landArea">Land Area (acres)</Label>
              <Input
                id="landArea"
                type="number"
                value={landArea}
                onChange={(e) => onLandAreaChange(Number(e.target.value))}
                min="0.1"
                step="0.1"
                className="text-lg" // match text size
              />
            </div>
            <div>
              <Label htmlFor="investmentCost">Investment Cost (₹/acre)</Label>
              <Input
                id="investmentCost"
                type="number"
                value={crop.investmentCost}
                onChange={(e) => onInvestmentCostChange(Number(e.target.value))}
                min="0"
                className="text-lg"
              />
            </div>
            <div>
              <Label htmlFor="expectedYield">Expected Yield (kg/acre)</Label>
              <Input
                id="expectedYield"
                type="number"
                value={crop.expectedYield}
                onChange={(e) => onExpectedYieldChange(Number(e.target.value))}
                min="0"
                className="text-lg"
              />
            </div>
            <div>
              <Label htmlFor="marketPrice">Market Price (₹/kg)</Label>
              <Input
                id="marketPrice"
                type="number"
                value={crop.marketPrice}
                onChange={(e) => onMarketPriceChange(Number(e.target.value))}
                min="0"
                className="text-lg"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="font-medium">Total Investment:</span>
              <span className="font-bold">₹{roi.totalInvestment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="font-medium">Total Revenue:</span>
              <span className="font-bold text-green-600">₹{roi.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="font-medium">Net Profit:</span>
              <span className="font-bold text-blue-600">₹{roi.netProfit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="font-medium">ROI Percentage:</span>
              <span className="font-bold text-purple-600">{roi.roiPercentage}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

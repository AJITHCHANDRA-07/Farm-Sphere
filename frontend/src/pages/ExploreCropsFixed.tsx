import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Leaf, Search } from 'lucide-react';

const ExploreCropsFixed = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('short');
  const [shortTermCrops, setShortTermCrops] = useState<any[]>([]);
  const [mediumTermCrops, setMediumTermCrops] = useState<any[]>([]);
  const [longTermCrops, setLongTermCrops] = useState<any[]>([]);
  const [district, setDistrict] = useState('Rangareddy');

  useEffect(() => {
    console.log('🌱 FIXED COMPONENT LOADING...');
    
    const loadCrops = async () => {
      try {
        setLoading(true);
        
        // Simulate API call with mock data
        setTimeout(() => {
          const mockShortCrops = [
            { id: 1, name: 'Rice', duration: 90, profit: 120000, investment: 50000, water: 'High', demand: 'High' },
            { id: 2, name: 'Wheat', duration: 110, profit: 150000, investment: 60000, water: 'Medium', demand: 'High' },
            { id: 3, name: 'Maize', duration: 100, profit: 130000, investment: 55000, water: 'Medium', demand: 'Medium' }
          ];
          
          const mockMediumCrops = [
            { id: 4, name: 'Mango', duration: 200, profit: 300000, investment: 100000, water: 'Medium', demand: 'High' },
            { id: 5, name: 'Guava', duration: 180, profit: 250000, investment: 80000, water: 'Low', demand: 'Medium' }
          ];
          
          const mockLongCrops = [
            { id: 6, name: 'Coconut', duration: 400, profit: 500000, investment: 150000, water: 'High', demand: 'High' },
            { id: 7, name: 'Mango Orchard', duration: 500, profit: 800000, investment: 200000, water: 'Medium', demand: 'High' }
          ];
          
          setShortTermCrops(mockShortCrops);
          setMediumTermCrops(mockMediumCrops);
          setLongTermCrops(mockLongCrops);
          setLoading(false);
          
          console.log('✅ FIXED COMPONENT LOADED SUCCESSFULLY');
          console.log(`📊 District: ${district}`);
          console.log(`🌱 Short-term: ${mockShortCrops.length} crops`);
          console.log(`🌿 Medium-term: ${mockMediumCrops.length} crops`);
          console.log(`🌳 Long-term: ${mockLongCrops.length} crops`);
        }, 1500);
        
      } catch (error) {
        console.error('❌ Error loading crops:', error);
        setLoading(false);
      }
    };
    
    loadCrops();
  }, [district]);

  const getCurrentCrops = () => {
    switch (activeTab) {
      case 'short': return shortTermCrops;
      case 'medium': return mediumTermCrops;
      case 'long': return longTermCrops;
      default: return shortTermCrops;
    }
  };

  const renderCropCards = () => {
    const crops = getCurrentCrops();
    
    if (crops.length === 0) {
      return (
        <div className="text-center py-8">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No crops found</h3>
          <p className="text-gray-500">Try adjusting your filters</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((crop) => (
          <Card key={crop.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">{crop.name}</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Duration:</span> {crop.duration} days</p>
                <p><span className="font-medium">Profit:</span> ₹{crop.profit.toLocaleString()}</p>
                <p><span className="font-medium">Investment:</span> ₹{crop.investment.toLocaleString()}</p>
                <p><span className="font-medium">Water:</span> {crop.water}</p>
                <p><span className="font-medium">Demand:</span> {crop.demand}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Crops...</h2>
          <p className="text-gray-600">Fetching data for {district} district</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <Leaf className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🌱 Location-Based Crop Explorer</h1>
          <p className="text-xl text-gray-600 mb-6">Discover profitable crops for your location</p>
          
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
            <MapPin className="h-4 w-4 mr-2" />
            📍 {district} District
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-8">
          <h3 className="font-bold text-yellow-800 mb-2">🐛 Debug Info:</h3>
          <div className="text-yellow-700 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="font-medium">District:</span> {district}
            </div>
            <div>
              <span className="font-medium">Short-term:</span> {shortTermCrops.length}
            </div>
            <div>
              <span className="font-medium">Medium-term:</span> {mediumTermCrops.length}
            </div>
            <div>
              <span className="font-medium">Long-term:</span> {longTermCrops.length}
            </div>
          </div>
        </div>

        {/* Crop Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="short" className="text-base">
              🌱 Short-term ({shortTermCrops.length})
            </TabsTrigger>
            <TabsTrigger value="medium" className="text-base">
              🌿 Medium-term ({mediumTermCrops.length})
            </TabsTrigger>
            <TabsTrigger value="long" className="text-base">
              🌳 Long-term ({longTermCrops.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="short">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🌱 Short-term Crops</h2>
              <p className="text-gray-600">Quick returns (&le;120 days) - Perfect for rapid turnover</p>
            </div>
            {renderCropCards()}
          </TabsContent>

          <TabsContent value="medium">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🌿 Medium-term Crops</h2>
              <p className="text-gray-600">Balanced returns (121-365 days) - Good for steady income</p>
            </div>
            {renderCropCards()}
          </TabsContent>

          <TabsContent value="long">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🌳 Long-term Crops</h2>
              <p className="text-gray-600">High-value crops (&gt;365 days) - Long-term investment</p>
            </div>
            {renderCropCards()}
          </TabsContent>
        </Tabs>

        {/* Test Buttons */}
        <div className="mt-12 text-center">
          <div className="space-y-4">
            <p className="text-gray-600">Test different districts:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button onClick={() => setDistrict('Rangareddy')} variant="outline">Rangareddy</Button>
              <Button onClick={() => setDistrict('Hyderabad')} variant="outline">Hyderabad</Button>
              <Button onClick={() => setDistrict('Khammam')} variant="outline">Khammam</Button>
              <Button onClick={() => setDistrict('Nalgonda')} variant="outline">Nalgonda</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreCropsFixed;

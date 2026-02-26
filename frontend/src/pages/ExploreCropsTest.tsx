import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const ExploreCropsTest = () => {
  const [loading, setLoading] = useState(true);
  const [crops, setCrops] = useState<any[]>([]);
  const [district, setDistrict] = useState('Rangareddy');

  useEffect(() => {
    console.log('🌱 TEST COMPONENT LOADING...');
    
    // Simulate loading
    setTimeout(() => {
      setCrops([
        { id: 1, name: 'Test Crop 1', category: 'short' },
        { id: 2, name: 'Test Crop 2', category: 'medium' },
        { id: 3, name: 'Test Crop 3', category: 'long' }
      ]);
      setLoading(false);
      console.log('✅ TEST COMPONENT LOADED SUCCESSFULLY');
    }, 2000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading crops...</p>
          <p className="text-sm text-gray-600">District: {district}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🌱 Test Explore Crops</h1>
        
        <div className="bg-yellow-100 border border-yellow-300 rounded p-4 mb-6">
          <h2 className="font-bold text-yellow-800">🐛 Debug Info:</h2>
          <p className="text-yellow-700">
            District: {district}<br/>
            Crops Loaded: {crops.length}<br/>
            Status: ✅ Working
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {crops.map(crop => (
            <div key={crop.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">{crop.name}</h3>
              <p className="text-gray-600">Category: {crop.category}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button onClick={() => window.location.href = '/explore-crops'}>
            🚀 Go to Full Explore Crops
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExploreCropsTest;

import React from 'react';

const SimpleHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🌱 FarmSphere Visions
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Agricultural Management Platform for Telangana
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-green-600 mb-2">📊 Crops Data</h2>
            <p className="text-gray-600">Access comprehensive crop database</p>
            <a 
              href="/crops-data" 
              className="inline-block mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              View Crops
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">📍 Districts</h2>
            <p className="text-gray-600">Explore district-wise analytics</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Explore Districts
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-purple-600 mb-2">💰 ROI Calculator</h2>
            <p className="text-gray-600">Calculate investment returns</p>
            <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              Calculate ROI
            </button>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to FarmSphere</h2>
          <p className="text-lg text-gray-600 mb-6">
            Your comprehensive agricultural platform featuring real-time crop data, 
            district analytics, and investment insights for the Telangana region.
          </p>
          
          <div className="flex justify-center gap-4">
            <a 
              href="/crops-data" 
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              🌱 View Crops Database
            </a>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition">
              📈 View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleHome;

import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Search, Droplets, Thermometer, Clock, TrendingUp, AlertCircle, Leaf, Tree, Sprout } from 'lucide-react';

// Sample crop data - in production, this would come from API or JSON import
const CROPS_DATABASE = [
  // Short-Term Crops (45-120 days)
  {
    id: 1,
    name: "Asparagus",
    cropType: "Vegetable",
    duration: "90-120 days",
    category: "short",
    supplyStatus: "Very Low",
    demandStatus: "Very High",
    importDependency: "Yes",
    primarySoilType: "Sandy Loam, Deep Red Loam",
    waterRequirement: "Medium",
    climateSuitability: "Warm days, cool nights; 15-30°C",
    irrigationCompatibility: "Drip recommended",
    suitableDistricts: ["Rangareddy", "Medak", "Sangareddy", "Vikarabad"],
    landAreaSuitability: "Medium",
    riskFactors: "High cost, crown rot, water stress",
    mitigationStrategies: "Use disease-free crowns, precise drip, raised beds"
  },
  {
    id: 2,
    name: "Broccoli",
    cropType: "Vegetable",
    duration: "60-90 days",
    category: "short",
    supplyStatus: "Low",
    demandStatus: "Very High",
    importDependency: "Yes",
    primarySoilType: "Clay Loam, Sandy Loam with high OM",
    waterRequirement: "Medium",
    climateSuitability: "Cool, 15-20°C; sensitive to heat",
    irrigationCompatibility: "Drip/Sprinkler",
    suitableDistricts: ["Rangareddy", "Vikarabad", "Adilabad"],
    landAreaSuitability: "Small",
    riskFactors: "Heat stress, aphids, downy mildew",
    mitigationStrategies: "Heat-tolerant varieties, shade nets, IPM"
  },
  {
    id: 3,
    name: "Lettuce (Iceberg)",
    cropType: "Vegetable",
    duration: "50-80 days",
    category: "short",
    supplyStatus: "Low",
    demandStatus: "High",
    importDependency: "Yes",
    primarySoilType: "Sandy Loam, Rich Organic Loam",
    waterRequirement: "Medium",
    climateSuitability: "Cool, 12-22°C; bolts in heat",
    irrigationCompatibility: "Drip/Sprinkler",
    suitableDistricts: ["Rangareddy", "Medak", "Sangareddy"],
    landAreaSuitability: "Small",
    riskFactors: "Bolting, tip burn, aphids",
    mitigationStrategies: "Summer-less varieties, shade netting, balanced N-K fertigation"
  },
  {
    id: 4,
    name: "Bell Pepper (Colored)",
    cropType: "Vegetable",
    duration: "90-110 days",
    category: "short",
    supplyStatus: "Low",
    demandStatus: "Very High",
    importDependency: "Yes",
    primarySoilType: "Well-draining Sandy Loam, Red Soil",
    waterRequirement: "High",
    climateSuitability: "Warm, 21-30°C; frost sensitive",
    irrigationCompatibility: "Drip essential",
    suitableDistricts: ["Khammam", "Nalgonda", "Mahabubnagar"],
    landAreaSuitability: "Medium",
    riskFactors: "Blossom end rot, viruses, mites",
    mitigationStrategies: "Grafting on resistant rootstock, drip with calcium, bio-pesticides"
  },
  {
    id: 5,
    name: "Sunflower (Hybrid, Oil)",
    cropType: "Oilseed",
    duration: "85-95 days",
    category: "short",
    supplyStatus: "Low",
    demandStatus: "High",
    importDependency: "Yes",
    primarySoilType: "Well-draining Loam, Red/Black",
    waterRequirement: "Medium",
    climateSuitability: "Warm, 20-30°C",
    irrigationCompatibility: "Drip/Rainfed",
    suitableDistricts: ["Nizamabad", "Karimnagar", "Jagtial"],
    landAreaSuitability: "Large",
    riskFactors: "Downy mildew, bird damage",
    mitigationStrategies: "Resistant hybrids, bird scaring, timely sowing"
  },
  {
    id: 6,
    name: "Moong (Green Gram)",
    cropType: "Pulse",
    duration: "60-75 days",
    category: "short",
    supplyStatus: "Low",
    demandStatus: "High",
    importDependency: "No",
    primarySoilType: "Sandy Loam, Black Cotton Soil",
    waterRequirement: "Low",
    climateSuitability: "Warm, 25-35°C",
    irrigationCompatibility: "Rainfed",
    suitableDistricts: ["Nizamabad", "Karimnagar", "Warangal"],
    landAreaSuitability: "Medium",
    riskFactors: "Yellow mosaic virus, cercospora",
    mitigationStrategies: "Resistant varieties, crop rotation"
  },
  // Medium-Term Crops (4-12 months)
  {
    id: 101,
    name: "Tomato (Indeterminate)",
    cropType: "Vegetable",
    duration: "4-6 months",
    category: "medium",
    supplyStatus: "Low",
    demandStatus: "Very High",
    importDependency: "No",
    primarySoilType: "Well-draining Loam, Red Soil",
    waterRequirement: "High",
    climateSuitability: "Warm, 20-30°C",
    irrigationCompatibility: "Drip/Rainfed",
    suitableDistricts: ["All districts"],
    landAreaSuitability: "Medium",
    riskFactors: "Leaf curl virus, fruit borer",
    mitigationStrategies: "Resistant hybrids, IPM"
  },
  {
    id: 102,
    name: "Brinjal (Long Green)",
    cropType: "Vegetable",
    duration: "4-5 months",
    category: "medium",
    supplyStatus: "Low",
    demandStatus: "High",
    importDependency: "No",
    primarySoilType: "Red Soil, Black Soil",
    waterRequirement: "Medium",
    climateSuitability: "Warm, 25-35°C",
    irrigationCompatibility: "Drip/Rainfed",
    suitableDistricts: ["All districts"],
    landAreaSuitability: "Medium",
    riskFactors: "Shoot & fruit borer, wilt",
    mitigationStrategies: "Bt. varieties, IPM"
  },
  {
    id: 103,
    name: "Chilli (High value)",
    cropType: "Vegetable",
    duration: "4-5 months",
    category: "medium",
    supplyStatus: "Low",
    demandStatus: "High",
    importDependency: "No",
    primarySoilType: "Red Soil, Black Soil",
    waterRequirement: "Medium",
    climateSuitability: "Warm, 20-35°C",
    irrigationCompatibility: "Drip/Rainfed",
    suitableDistricts: ["Ghanpur", "Jangoan", "Warangal"],
    landAreaSuitability: "Medium",
    riskFactors: "Dieback, thrips, viruses",
    mitigationStrategies: "Resistant varieties, seed treatment"
  },
  // Long-Term Crops (1-30 years)
  {
    id: 201,
    name: "Mango (Benishan)",
    cropType: "Fruit Tree",
    duration: "10-20 years",
    category: "long",
    supplyStatus: "Low",
    demandStatus: "Very High",
    importDependency: "Yes",
    primarySoilType: "Deep, well-draining Sandy Loam, Red Soil",
    waterRequirement: "Medium to High",
    climateSuitability: "Warm, tropical; dry period for flowering",
    irrigationCompatibility: "Drip recommended",
    suitableDistricts: ["All districts", "especially Nizamabad, Karimnagar, Jagtial, Medak, Sangareddy"],
    landAreaSuitability: "Large",
    riskFactors: "Hopper, Powdery Mildew, Mango Fly, Malnutrition",
    mitigationStrategies: "Integrated pest management, balanced nutrition"
  },
  {
    id: 202,
    name: "Pomegranate (Ganesh)",
    cropType: "Fruit Tree",
    duration: "8-15 years",
    category: "long",
    supplyStatus: "Low",
    demandStatus: "Very High",
    importDependency: "No",
    primarySoilType: "Red Soil, adaptable, well-drained",
    waterRequirement: "Low",
    climateSuitability: "Arid to semi-arid, hot/dry climate improves fruit quality",
    irrigationCompatibility: "Drip",
    suitableDistricts: ["Mahabubnagar", "Nagarkurnool", "Vikarabad", "Rangareddy"],
    landAreaSuitability: "Medium",
    riskFactors: "Bacterial Blight (Xanthomonas), Fruit Borer, Fruit Cracking",
    mitigationStrategies: "Drought stress management, proper pruning"
  },
  {
    id: 203,
    name: "Guava (Allahabad Safeda)",
    cropType: "Fruit Tree",
    duration: "5-20 years",
    category: "long",
    supplyStatus: "Low",
    demandStatus: "High",
    importDependency: "No",
    primarySoilType: "Well-draining Loam, Laterite, tolerates poor soils",
    waterRequirement: "Medium to High",
    climateSuitability: "Wide range, 15-35°C; hardy",
    irrigationCompatibility: "Drip/Rainfed",
    suitableDistricts: ["All districts", "especially riverine belts (Khammam, Bhadradri)"],
    landAreaSuitability: "Large",
    riskFactors: "Fruit Fly, Nematodes, Wilt",
    mitigationStrategies: "IPM, sanitation"
  }
];

// All Telangana districts for dropdown
const TELANGANA_DISTRICTS = [
  "Adilabad", "Bhadradri Kothagudem", "Hanumakonda", "Hyderabad", "Jagtial",
  "Jayashankar Bhupalpally", "Jangaon", "Jogulamba Gadwal", "Kamareddy",
  "Karimnagar", "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad",
  "Mahabubnagar", "Mancherial", "Medak", "Medchal Malkajgiri", "Mulugu",
  "Nagar Kurnool", "Nalgonda", "Nirmal", "Nizamabad", "Peddapalli",
  "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet",
  "Vikarabad", "Wanaparthy", "Warangal (Rural)", "Yadadri Bhuvanagiri"
];

const ExploreCropsPage = () => {
  const [userDistrict, setUserDistrict] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredCrops, setFilteredCrops] = useState({
    short: [],
    medium: [],
    long: []
  });
  const [locationPermission, setLocationPermission] = useState('pending'); // pending, granted, denied
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);

  // Filter crops based on user's district
  const filterCropsByDistrict = useCallback((district) => {
    if (!district) return;

    const filtered = {
      short: [],
      medium: [],
      long: []
    };

    CROPS_DATABASE.forEach(crop => {
      // Check if crop is suitable for the selected district
      const isSuitable = crop.suitableDistricts.some(d => 
        d.toLowerCase().includes(district.toLowerCase()) || 
        district.toLowerCase().includes(d.toLowerCase())
      );

      if (isSuitable) {
        filtered[crop.category].push(crop);
      }
    });

    setFilteredCrops(filtered);
  }, []);

  // Request location permission
  const requestLocationPermission = () => {
    setIsLoading(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In production, you would use a reverse geocoding API
          // For now, we'll simulate district detection
          const { latitude, longitude } = position.coords;
          
          // Simulate reverse geocoding (in production, use actual API)
          // This is a mock mapping - replace with actual geocoding
          const mockDistrictMapping = {
            // Hyderabad coordinates
            '17.3850,78.4867': 'Hyderabad',
            // Karimnagar coordinates  
            '18.4386,79.1285': 'Karimnagar',
            // Nizamabad coordinates
            '18.6725,78.0943': 'Nizamabad',
            // Khammam coordinates
            '17.2473,80.1514': 'Khammam',
            // Mahabubnagar coordinates
            '16.7339,77.9793': 'Mahabubnagar'
          };

          const coordKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
          const detectedDistrict = mockDistrictMapping[coordKey] || 'Rangareddy'; // Default fallback
          
          setUserDistrict(detectedDistrict);
          setLocationPermission('granted');
          setShowLocationPrompt(false);
          filterCropsByDistrict(detectedDistrict);
          setIsLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationPermission('denied');
          setShowLocationPrompt(false);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocationPermission('denied');
      setShowLocationPrompt(false);
      setIsLoading(false);
    }
  };

  // Handle manual district selection
  const handleDistrictSelection = (district) => {
    setUserDistrict(district);
    filterCropsByDistrict(district);
    setShowLocationPrompt(false);
  };

  // Filter districts based on search query
  const filteredDistricts = TELANGANA_DISTRICTS.filter(district =>
    district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate "Why this crop?" explanation
  const generateWhyExplanation = (crop, district) => {
    return `This crop is a good match for your farm because it is well-suited for ${crop.primarySoilType} found in ${district} and there is a ${crop.demandStatus} demand for it in the market.`;
  };

  // Crop Card Component
  const CropCard = ({ crop }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 hover:border-green-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900">{crop.name}</h3>
        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
          {crop.cropType}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-gray-400" />
          <span className="font-medium">Duration:</span>
          <span className="ml-2 text-gray-900">{crop.duration}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Droplets className="w-4 h-4 mr-2 text-gray-400" />
          <span className="font-medium">Water:</span>
          <span className="ml-2 text-gray-900">{crop.waterRequirement}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Thermometer className="w-4 h-4 mr-2 text-gray-400" />
          <span className="font-medium">Climate:</span>
          <span className="ml-2 text-gray-900">{crop.climateSuitability}</span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Why this crop?
        </h4>
        <p className="text-blue-800 text-sm leading-relaxed">
          {generateWhyExplanation(crop, userDistrict)}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {crop.importDependency === "Yes" && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
              Import Dependent
            </span>
          )}
          {crop.supplyStatus === "Very Low" && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
              Low Supply
            </span>
          )}
          {crop.demandStatus === "Very High" && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
              High Demand
            </span>
          )}
        </div>
        
        <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200">
          View Details
        </button>
      </div>
    </div>
  );

  // Sector Section Component
  const SectorSection = ({ title, icon: Icon, crops, emptyMessage }) => (
    <div className="mb-12">
      <div className="flex items-center mb-6">
        <Icon className="w-8 h-8 text-green-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
          {crops.length} crops
        </span>
      </div>
      
      {crops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map(crop => (
            <CropCard key={crop.id} crop={crop} />
          ))}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <p className="text-yellow-800 font-medium">{emptyMessage}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Location Permission Prompt */}
      {showLocationPrompt && (
        <div className="bg-blue-600 text-white p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="w-6 h-6 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    Find the best crops for your location
                  </h3>
                  <p className="text-blue-100">
                    To show you most suitable crops for your farm, we need to know your location. 
                    This data is used only to filter our crop database.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={requestLocationPermission}
                  disabled={isLoading}
                  className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Detecting...' : 'Use My Location'}
                </button>
                <button
                  onClick={() => setShowLocationPrompt(false)}
                  className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors duration-200"
                >
                  Search Manually
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Message */}
        {!userDistrict && !showLocationPrompt && (
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Crops for Telangana Farmers
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the perfect crops for your farm based on soil type, climate, and market demand
            </p>
          </div>
        )}

        {/* Manual District Search */}
        {!userDistrict && !showLocationPrompt && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center mb-4">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Select Your District
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              No problem! You can search for your district manually.
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="Start typing your district name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
            
            {searchQuery && (
              <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredDistricts.map(district => (
                  <button
                    key={district}
                    onClick={() => handleDistrictSelection(district)}
                    className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                  >
                    {district}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-3 text-lg text-gray-600">Detecting your location...</span>
            </div>
          </div>
        )}

        {/* Results Header */}
        {userDistrict && !isLoading && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <MapPin className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-green-900">
                  Showing crops recommended for {userDistrict}
                </h2>
                <p className="text-green-800 mt-1">
                  Based on soil compatibility and market demand analysis
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Crops Display */}
        {userDistrict && !isLoading && (
          <div>
            <SectorSection
              title="🌱 Short-Term Crops (45-120 days)"
              icon={Sprout}
              crops={filteredCrops.short}
              emptyMessage="While there are no Short-Term crops perfectly suited for your area in our current database, we have great options in Medium and Long-Term crops!"
            />
            
            <SectorSection
              title="🌾 Medium-Term Crops (4-12 months)"
              icon={Leaf}
              crops={filteredCrops.medium}
              emptyMessage="While there are no Medium-Term crops perfectly suited for your area in our current database, we have great options in Short and Long-Term crops!"
            />
            
            <SectorSection
              title="🌳 Long-Term Crops (1-30 years)"
              icon={Tree}
              crops={filteredCrops.long}
              emptyMessage="While there are no Long-Term crops perfectly suited for your area in our current database, we have great options in Short and Medium-Term crops!"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreCropsPage;

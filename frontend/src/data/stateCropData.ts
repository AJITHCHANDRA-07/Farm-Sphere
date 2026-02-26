export interface StateCropData {
  state: string;
  stateImage: string;
  capital: string;
  totalArea: string;
  majorCrops: CropDetail[];
  productionData: {
    totalProduction: string;
    majorCropProduction: Array<{ crop: string; quantity: string; percentage: number }>;
    annualGrowth: string;
  };
  climateInfo: {
    temperatureRange: string;
    rainfall: string;
    soilType: string;
  };
}

export interface CropDetail {
  id: string;
  name: string;
  soilTypes: string[];
  climate: {
    temperatureC: number[];
    rainfallMm: number[];
    season: string;
    notes: string;
  };
  irrigation: string;
  fertilizerGuideline: string;
  pestsAndDiseases: string;
  stages: CropStage[];
  investmentRangeINR: { min: number; max: number };
  returnRangeINR: { min: number; max: number };
  notes: string;
  sources: string[];
}

export interface CropStage {
  name: string;
  daysFromStart: number;
}

export const stateCropData: StateCropData[] = [
  {
    state: "Telangana",
    stateImage: "/images/states/telangana-charminar.jpg",
    capital: "Hyderabad",
    totalArea: "112,077 km²",
    majorCrops: [
      {
        id: "tel_tomato",
        name: "Tomato",
        soilTypes: ["Loamy", "Well-drained", "pH 6.0-7.5"],
        climate: { temperatureC: [18, 30], rainfallMm: [600, 900], season: "Monsoon→Post-monsoon", notes: "Avoid frost; avoid >35°C at flowering" },
        irrigation: "Frequent; drip preferred (off-season polyhouse gives premium yields)",
        fertilizerGuideline: "Balanced NPK + micronutrients; FYM/compost; staking/pruning",
        pestsAndDiseases: "Fruit borer, early/late blight (use IPM, pheromone traps)",
        stages: [
          { name: "Nursery", daysFromStart: 0 },
          { name: "Transplant", daysFromStart: 25 },
          { name: "Flowering", daysFromStart: 50 },
          { name: "Fruiting", daysFromStart: 70 },
          { name: "Harvest", daysFromStart: 90 }
        ],
        investmentRangeINR: { min: 55000, max: 200000 },
        returnRangeINR: { min: 200000, max: 500000 },
        notes: "Major vegetable crop; high demand in Hyderabad market",
        sources: ["Telangana Horticulture Department"]
      },
      {
        id: "tel_paddy",
        name: "Rice (Paddy)",
        soilTypes: ["Clay loam", "Well-drained", "pH 5.5-6.5"],
        climate: { temperatureC: [20, 35], rainfallMm: [800, 1200], season: "Kharif", notes: "Requires standing water during initial growth" },
        irrigation: "Continuous flooding during early stages",
        fertilizerGuideline: "NPK 10:5:5 + urea; zinc supplementation",
        pestsAndDiseases: "Brown plant hopper, blast disease, bacterial leaf blight",
        stages: [
          { name: "Nursery", daysFromStart: 0 },
          { name: "Transplant", daysFromStart: 25 },
          { name: "Tillering", daysFromStart: 45 },
          { name: "Flowering", daysFromStart: 75 },
          { name: "Harvest", daysFromStart: 120 }
        ],
        investmentRangeINR: { min: 40000, max: 150000 },
        returnRangeINR: { min: 250000, max: 450000 },
        notes: "Staple food crop; government procurement available",
        sources: ["Telangana Agriculture Department"]
      }
    ],
    productionData: {
      totalProduction: "12.5 million tonnes",
      majorCropProduction: [
        { crop: "Rice", quantity: "8.2 million tonnes", percentage: 65.6 },
        { crop: "Tomato", quantity: "1.8 million tonnes", percentage: 14.4 },
        { crop: "Chili", quantity: "1.2 million tonnes", percentage: 9.6 },
        { crop: "Turmeric", quantity: "0.8 million tonnes", percentage: 6.4 },
        { crop: "Others", quantity: "0.5 million tonnes", percentage: 4.0 }
      ],
      annualGrowth: "6.8%"
    },
    climateInfo: {
      temperatureRange: "15°C - 45°C",
      rainfall: "750-1200 mm annually",
      soilType: "Red loamy and black cotton soils"
    }
  },
  {
    state: "Andhra Pradesh",
    stateImage: "/images/states/andhra-pradesh-beach.jpg",
    capital: "Amaravati",
    totalArea: "160,205 km²",
    majorCrops: [
      {
        id: "ap_chili",
        name: "Chili",
        soilTypes: ["Black cotton", "Red loamy", "pH 6.0-7.0"],
        climate: { temperatureC: [20, 35], rainfallMm: [700, 1000], season: "Kharif", notes: "High humidity required" },
        irrigation: "Regular irrigation during dry periods",
        fertilizerGuideline: "NPK 20:20:20 + organic matter",
        pestsAndDiseases: "Leaf curl, fruit borer, wilt",
        stages: [
          { name: "Sowing", daysFromStart: 0 },
          { name: "Transplant", daysFromStart: 30 },
          { name: "Flowering", daysFromStart: 60 },
          { name: "Fruit set", daysFromStart: 75 },
          { name: "Harvest", daysFromStart: 105 }
        ],
        investmentRangeINR: { min: 45000, max: 180000 },
        returnRangeINR: { min: 300000, max: 600000 },
        notes: "Largest chili producing state",
        sources: ["Andhra Pradesh Horticulture Department"]
      }
    ],
    productionData: {
      totalProduction: "15.8 million tonnes",
      majorCropProduction: [
        { crop: "Chili", quantity: "4.2 million tonnes", percentage: 26.6 },
        { crop: "Rice", quantity: "6.8 million tonnes", percentage: 43.0 },
        { crop: "Cotton", quantity: "2.1 million tonnes", percentage: 13.3 },
        { crop: "Groundnut", quantity: "1.5 million tonnes", percentage: 9.5 },
        { crop: "Others", quantity: "1.2 million tonnes", percentage: 7.6 }
      ],
      annualGrowth: "7.2%"
    },
    climateInfo: {
      temperatureRange: "18°C - 42°C",
      rainfall: "900-1400 mm annually",
      soilType: "Black cotton soils and alluvial soils"
    }
  },
  {
    state: "Karnataka",
    stateImage: "/images/states/karnataka-palace.jpg",
    capital: "Bengaluru",
    totalArea: "191,791 km²",
    majorCrops: [
      {
        id: "ka_mango",
        name: "Mango",
        soilTypes: ["Red loamy", "Well-drained", "pH 6.0-7.0"],
        climate: { temperatureC: [15, 38], rainfallMm: [600, 900], season: "Summer", notes: "Dry weather during flowering essential" },
        irrigation: "Supplemental irrigation during fruit development",
        fertilizerGuideline: "NPK 10:5:20 + organic compost",
        pestsAndDiseases: "Mango hopper, powdery mildew, anthracnose",
        stages: [
          { name: "Planting", daysFromStart: 0 },
          { name: "Establishment", daysFromStart: 365 },
          { name: "First flowering", daysFromStart: 730 },
          { name: "First harvest", daysFromStart: 1200 }
        ],
        investmentRangeINR: { min: 80000, max: 250000 },
        returnRangeINR: { min: 400000, max: 800000 },
        notes: "Premium export quality mangoes",
        sources: ["Karnataka Horticulture Department"]
      }
    ],
    productionData: {
      totalProduction: "18.2 million tonnes",
      majorCropProduction: [
        { crop: "Rice", quantity: "5.8 million tonnes", percentage: 31.9 },
        { crop: "Mango", quantity: "3.2 million tonnes", percentage: 17.6 },
        { crop: "Sugarcane", quantity: "2.8 million tonnes", percentage: 15.4 },
        { crop: "Ragi", quantity: "2.1 million tonnes", percentage: 11.5 },
        { crop: "Others", quantity: "4.3 million tonnes", percentage: 23.6 }
      ],
      annualGrowth: "5.9%"
    },
    climateInfo: {
      temperatureRange: "12°C - 40°C",
      rainfall: "700-1500 mm annually",
      soilType: "Red laterite and black soils"
    }
  },
  {
    state: "Tamil Nadu",
    stateImage: "/images/states/tamil-nadu-temple.jpg",
    capital: "Chennai",
    totalArea: "130,058 km²",
    majorCrops: [
      {
        id: "tn_coconut",
        name: "Coconut",
        soilTypes: ["Alluvial", "Sandy loam", "pH 5.5-7.0"],
        climate: { temperatureC: [22, 35], rainfallMm: [800, 1500], season: "All seasons", notes: "Coastal areas ideal" },
        irrigation: "Regular irrigation in dry periods",
        fertilizerGuideline: "NPK 15:5:25 + organic manure",
        pestsAndDiseases: "Rhinoceros beetle, bud rot, leaf rot",
        stages: [
          { name: "Planting", daysFromStart: 0 },
          { name: "Establishment", daysFromStart: 180 },
          { name: "First flowering", daysFromStart: 540 },
          { name: "First harvest", daysFromStart: 720 }
        ],
        investmentRangeINR: { min: 60000, max: 200000 },
        returnRangeINR: { min: 350000, max: 700000 },
        notes: "Highest coconut production in India",
        sources: ["Tamil Nadu Horticulture Department"]
      }
    ],
    productionData: {
      totalProduction: "22.5 million tonnes",
      majorCropProduction: [
        { crop: "Rice", quantity: "8.5 million tonnes", percentage: 37.8 },
        { crop: "Coconut", quantity: "4.2 million tonnes", percentage: 18.7 },
        { crop: "Sugarcane", quantity: "3.8 million tonnes", percentage: 16.9 },
        { crop: "Banana", quantity: "2.9 million tonnes", percentage: 12.9 },
        { crop: "Others", quantity: "3.1 million tonnes", percentage: 13.7 }
      ],
      annualGrowth: "6.3%"
    },
    climateInfo: {
      temperatureRange: "20°C - 45°C",
      rainfall: "900-1400 mm annually",
      soilType: "Alluvial and red laterite soils"
    }
  },
  {
    state: "Maharashtra",
    stateImage: "/images/states/maharashtra-gateway.jpg",
    capital: "Mumbai",
    totalArea: "307,713 km²",
    majorCrops: [
      {
        id: "mh_cotton",
        name: "Cotton",
        soilTypes: ["Black cotton", "Well-drained", "pH 6.0-7.5"],
        climate: { temperatureC: [20, 35], rainfallMm: [600, 900], season: "Kharif", notes: "Requires moderate rainfall" },
        irrigation: "Supplemental irrigation during dry spells",
        fertilizerGuideline: "NPK 15:10:20 + micronutrients",
        pestsAndDiseases: "Bollworm, aphids, wilt",
        stages: [
          { name: "Sowing", daysFromStart: 0 },
          { name: "Germination", daysFromStart: 7 },
          { name: "Flowering", daysFromStart: 60 },
          { name: "Boll formation", daysFromStart: 90 },
          { name: "Harvest", daysFromStart: 150 }
        ],
        investmentRangeINR: { min: 70000, max: 220000 },
        returnRangeINR: { min: 300000, max: 650000 },
        notes: "Largest cotton producing state",
        sources: ["Maharashtra Agriculture Department"]
      }
    ],
    productionData: {
      totalProduction: "28.5 million tonnes",
      majorCropProduction: [
        { crop: "Cotton", quantity: "6.8 million tonnes", percentage: 23.9 },
        { crop: "Sugarcane", quantity: "8.2 million tonnes", percentage: 28.8 },
        { crop: "Rice", quantity: "4.5 million tonnes", percentage: 15.8 },
        { crop: "Jowar", quantity: "3.2 million tonnes", percentage: 11.2 },
        { crop: "Others", quantity: "5.8 million tonnes", percentage: 20.3 }
      ],
      annualGrowth: "8.1%"
    },
    climateInfo: {
      temperatureRange: "15°C - 45°C",
      rainfall: "600-1500 mm annually",
      soilType: "Black cotton and laterite soils"
    }
  },
  {
    state: "Uttar Pradesh",
    stateImage: "/images/states/uttar-pradesh-tajmahal.jpg",
    capital: "Lucknow",
    totalArea: "240,928 km²",
    majorCrops: [
      {
        id: "up_wheat",
        name: "Wheat",
        soilTypes: ["Alluvial", "Clay loam", "pH 6.0-7.0"],
        climate: { temperatureC: [15, 25], rainfallMm: [500, 800], season: "Rabi", notes: "Cool weather essential" },
        irrigation: "2-3 irrigations during critical stages",
        fertilizerGuideline: "NPK 15:10:20 + zinc and sulphur",
        pestsAndDiseases: "Aphids, rust, Karnal bunt",
        stages: [
          { name: "Sowing", daysFromStart: 0 },
          { name: "Germination", daysFromStart: 7 },
          { name: "Tillering", daysFromStart: 35 },
          { name: "Flowering", daysFromStart: 70 },
          { name: "Harvest", daysFromStart: 120 }
        ],
        investmentRangeINR: { min: 50000, max: 180000 },
        returnRangeINR: { min: 280000, max: 550000 },
        notes: "Largest wheat producing state",
        sources: ["Uttar Pradesh Agriculture Department"]
      }
    ],
    productionData: {
      totalProduction: "45.8 million tonnes",
      majorCropProduction: [
        { crop: "Wheat", quantity: "18.5 million tonnes", percentage: 40.4 },
        { crop: "Rice", quantity: "12.8 million tonnes", percentage: 27.9 },
        { crop: "Sugarcane", quantity: "8.2 million tonnes", percentage: 17.9 },
        { crop: "Potato", quantity: "3.5 million tonnes", percentage: 7.6 },
        { crop: "Others", quantity: "2.8 million tonnes", percentage: 6.2 }
      ],
      annualGrowth: "4.5%"
    },
    climateInfo: {
      temperatureRange: "5°C - 45°C",
      rainfall: "600-1200 mm annually",
      soilType: "Alluvial and clay loam soils"
    }
  },
  {
    state: "Punjab",
    stateImage: "/images/states/punjab-golden-temple.jpg",
    capital: "Chandigarh",
    totalArea: "50,362 km²",
    majorCrops: [
      {
        id: "pb_wheat",
        name: "Wheat",
        soilTypes: ["Alluvial", "Sandy loam", "pH 6.0-7.5"],
        climate: { temperatureC: [10, 25], rainfallMm: [400, 700], season: "Rabi", notes: "Ideal wheat growing conditions" },
        irrigation: "5-6 irrigations during crop season",
        fertilizerGuideline: "NPK 20:10:15 + micronutrients",
        pestsAndDiseases: "Aphids, rust, loose smut",
        stages: [
          { name: "Sowing", daysFromStart: 0 },
          { name: "Germination", daysFromStart: 7 },
          { name: "Tillering", daysFromStart: 35 },
          { name: "Flowering", daysFromStart: 70 },
          { name: "Harvest", daysFromStart: 120 }
        ],
        investmentRangeINR: { min: 60000, max: 200000 },
        returnRangeINR: { min: 350000, max: 700000 },
        notes: "Highest wheat productivity in India",
        sources: ["Punjab Agriculture Department"]
      }
    ],
    productionData: {
      totalProduction: "25.2 million tonnes",
      majorCropProduction: [
        { crop: "Wheat", quantity: "16.8 million tonnes", percentage: 66.7 },
        { crop: "Rice", quantity: "5.2 million tonnes", percentage: 20.6 },
        { crop: "Cotton", quantity: "1.8 million tonnes", percentage: 7.1 },
        { crop: "Maize", quantity: "1.4 million tonnes", percentage: 5.6 },
        { crop: "Others", quantity: "0.0 million tonnes", percentage: 0.0 }
      ],
      annualGrowth: "3.2%"
    },
    climateInfo: {
      temperatureRange: "0°C - 45°C",
      rainfall: "400-800 mm annually",
      soilType: "Alluvial and sandy loam soils"
    }
  },
  {
    state: "West Bengal",
    stateImage: "/images/states/west-bengal-howrah.jpg",
    capital: "Kolkata",
    totalArea: "88,752 km²",
    majorCrops: [
      {
        id: "wb_rice",
        name: "Rice",
        soilTypes: ["Alluvial", "Clay loam", "pH 5.5-6.5"],
        climate: { temperatureC: [22, 35], rainfallMm: [1200, 2000], season: "Kharif", notes: "High rainfall areas" },
        irrigation: "Supplemental during dry periods",
        fertilizerGuideline: "NPK 10:5:10 + organic matter",
        pestsAndDiseases: "Stem borer, blast disease, sheath blight",
        stages: [
          { name: "Nursery", daysFromStart: 0 },
          { name: "Transplant", daysFromStart: 25 },
          { name: "Tillering", daysFromStart: 45 },
          { name: "Flowering", daysFromStart: 75 },
          { name: "Harvest", daysFromStart: 120 }
        ],
        investmentRangeINR: { min: 45000, max: 150000 },
        returnRangeINR: { min: 250000, max: 500000 },
        notes: "Highest rice productivity in eastern India",
        sources: ["West Bengal Agriculture Department"]
      }
    ],
    productionData: {
      totalProduction: "16.8 million tonnes",
      majorCropProduction: [
        { crop: "Rice", quantity: "12.5 million tonnes", percentage: 74.4 },
        { crop: "Potato", quantity: "2.1 million tonnes", percentage: 12.5 },
        { crop: "Jute", quantity: "1.2 million tonnes", percentage: 7.1 },
        { crop: "Vegetables", quantity: "1.0 million tonnes", percentage: 6.0 },
        { crop: "Others", quantity: "0.0 million tonnes", percentage: 0.0 }
      ],
      annualGrowth: "5.8%"
    },
    climateInfo: {
      temperatureRange: "18°C - 40°C",
      rainfall: "1200-2000 mm annually",
      soilType: "Alluvial and deltaic soils"
    }
  },
  {
    state: "Gujarat",
    stateImage: "/images/states/gujarat-statue.jpg",
    capital: "Gandhinagar",
    totalArea: "196,244 km²",
    majorCrops: [
      {
        id: "gj_cotton",
        name: "Cotton",
        soilTypes: ["Black cotton", "Alluvial", "pH 7.0-8.5"],
        climate: { temperatureC: [20, 40], rainfallMm: [500, 800], season: "Kharif", notes: "Drought tolerant varieties preferred" },
        irrigation: "2-3 irrigations during critical stages",
        fertilizerGuideline: "NPK 15:10:20 + micronutrients",
        pestsAndDiseases: "Bollworm, aphids, wilt",
        stages: [
          { name: "Sowing", daysFromStart: 0 },
          { name: "Germination", daysFromStart: 7 },
          { name: "Flowering", daysFromStart: 60 },
          { name: "Boll formation", daysFromStart: 90 },
          { name: "Harvest", daysFromStart: 150 }
        ],
        investmentRangeINR: { min: 65000, max: 200000 },
        returnRangeINR: { min: 320000, max: 650000 },
        notes: "Second largest cotton producer",
        sources: ["Gujarat Agriculture Department"]
      }
    ],
    productionData: {
      totalProduction: "19.5 million tonnes",
      majorCropProduction: [
        { crop: "Cotton", quantity: "5.8 million tonnes", percentage: 29.7 },
        { crop: "Groundnut", quantity: "4.2 million tonnes", percentage: 21.5 },
        { crop: "Sugarcane", quantity: "3.5 million tonnes", percentage: 17.9 },
        { crop: "Wheat", quantity: "2.8 million tonnes", percentage: 14.4 },
        { crop: "Others", quantity: "3.2 million tonnes", percentage: 16.5 }
      ],
      annualGrowth: "7.5%"
    },
    climateInfo: {
      temperatureRange: "15°C - 45°C",
      rainfall: "500-1000 mm annually",
      soilType: "Black cotton and alluvial soils"
    }
  },
  {
    state: "Rajasthan",
    stateImage: "/images/states/rajasthan-fort.jpg",
    capital: "Jaipur",
    totalArea: "342,239 km²",
    majorCrops: [
      {
        id: "rj_bajra",
        name: "Bajra (Pearl Millet)",
        soilTypes: ["Sandy", "Alluvial", "pH 6.5-7.5"],
        climate: { temperatureC: [25, 40], rainfallMm: [300, 600], season: "Kharif", notes: "Drought tolerant" },
        irrigation: "Minimal water requirement",
        fertilizerGuideline: "NPK 15:10:15 + organic matter",
        pestsAndDiseases: "Downy mildew, ergot, blast",
        stages: [
          { name: "Sowing", daysFromStart: 0 },
          { name: "Germination", daysFromStart: 5 },
          { name: "Tillering", daysFromStart: 30 },
          { name: "Flowering", daysFromStart: 50 },
          { name: "Harvest", daysFromStart: 75 }
        ],
        investmentRangeINR: { min: 30000, max: 100000 },
        returnRangeINR: { min: 150000, max: 350000 },
        notes: "Largest bajra producing state",
        sources: ["Rajasthan Agriculture Department"]
      }
    ],
    productionData: {
      totalProduction: "8.5 million tonnes",
      majorCropProduction: [
        { crop: "Bajra", quantity: "2.8 million tonnes", percentage: 32.9 },
        { crop: "Wheat", quantity: "2.5 million tonnes", percentage: 29.4 },
        { crop: "Mustard", quantity: "1.8 million tonnes", percentage: 21.2 },
        { crop: "Gram", quantity: "1.4 million tonnes", percentage: 16.5 },
        { crop: "Others", quantity: "0.0 million tonnes", percentage: 0.0 }
      ],
      annualGrowth: "4.2%"
    },
    climateInfo: {
      temperatureRange: "20°C - 48°C",
      rainfall: "300-600 mm annually",
      soilType: "Sandy and alluvial soils"
    }
  }
];

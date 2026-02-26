// 🌾 CROP DATA INTERFACE - Enhanced for Popup Tables + Original Tables
export interface Crop {
  id: string;
  name: string;
  category: 'short' | 'medium' | 'long';
  duration: string;
  durationDays: number;
  profitPerAcre: number;
  investmentCost: number;
  expectedYield: number;
  marketPrice: number;
  waterNeeds: string;
  demand: string;
  image: string;
  description: string;
  cultivationSteps: string[];
  seasonalInfo: string;
  pestManagement: string[];
  harvestTimeline: string[];
  soilTypes: string[];
  climate: {
    temperatureC: [number, number];
    rainfallMm: [number, number];
    season: string;
    notes?: string;
  };
  irrigation: string;
  fertilizerGuideline: string;
  pestsAndDiseases: string;
  stages: { name: string; daysFromStart: number }[];
  roiDefaults: {
    landAreaAcre: number;
    investmentPerAcreINR: number;
    expectedYieldPerAcre: number;
    pricePerUnitINR: number;
    unit: string;
  };
  quickReturns: {
    totalRevenuePerAcreINR: number;
    netProfitPerAcreINR: number;
    avgROIPercent: number;
  };
  notes?: string;
  district: string;
  // 🎯 ADDITIONAL PROPERTIES FOR POPUP TABLE DATA
  costBreakdown?: string;
  priceRange?: string;
  yieldRange?: string;
  breakEvenTime?: string;
  // 🎯 ORIGINAL TABLES DATA FOR ENHANCED POPUP
  supplyStatus?: string;
  originalDemandStatus?: string;
  riskFactors?: string;
  cropDuration?: string;
  primarySoilType?: string;
  waterRequirement?: string;
  climateSuitability?: string;
  irrigationCompatibility?: string;
  landAreaSuitability?: string;
  mitigationStrategies?: string;
  cropType?: string;
  suitableDistrict?: string;
}

// Import Supabase client
import { supabase } from '../supabaseClient';

// 🌱 Database-driven crop data with fallback to static data
const shortTermCrops: Crop[] = [
  {
    id: "palm-oil",
    name: "Palm Oil",
    category: "short",
    duration: "3.5 months",
    durationDays: 105,
    profitPerAcre: 260000,
    investmentCost: 60000,
    expectedYield: 8000,
    marketPrice: 40,
    waterNeeds: "Moderate, avoid waterlogging",
    demand: "High",
    image: "/images/palm-oil.jpg",
    description: "Low supply high demand oil crop with excellent market potential.",
    cultivationSteps: ["Nursery", "Transplant", "Flowering", "Harvest"],
    seasonalInfo: "Grew mostly in Kharif; off-season fetches premium price.",
    pestManagement: ["Thrips – neem sprays", "Bacterial wilt – resistant varieties"],
    harvestTimeline: ["Begin harvest at 75–110 days"],
    soilTypes: ["Red loamy", "Well-drained", "pH 6.0-7.0"],
    climate: { temperatureC: [22, 35], rainfallMm: [1200, 1500], season: "Kharif", notes: "Requires high humidity" },
    irrigation: "Drip irrigation recommended",
    fertilizerGuideline: "NPK 15:5:25 + organic matter",
    pestsAndDiseases: "Thrips, rhinoceros beetle, bud rot",
    stages: [
      { name: "Nursery", daysFromStart: 0 },
      { name: "Transplant", daysFromStart: 30 },
      { name: "Flowering", daysFromStart: 60 },
      { name: "Fruiting", daysFromStart: 75 },
      { name: "Harvest", daysFromStart: 105 }
    ],
    roiDefaults: { landAreaAcre: 1, investmentPerAcreINR: 60000, expectedYieldPerAcre: 8000, pricePerUnitINR: 40, unit: "kg" },
    quickReturns: { totalRevenuePerAcreINR: 320000, netProfitPerAcreINR: 260000, avgROIPercent: 433 },
    notes: "High demand in edible oil industry.",
    district: "Khammam"
  },
  {
    id: "litchi",
    name: "Litchi",
    category: "short",
    duration: "4 months",
    durationDays: 120,
    profitPerAcre: 280000,
    investmentCost: 65000,
    expectedYield: 6000,
    marketPrice: 55,
    waterNeeds: "Moderate, well-drained",
    demand: "Very High",
    image: "/images/litchi.jpg",
    description: "Premium fruit crop with high export potential and low domestic supply.",
    cultivationSteps: ["Land preparation", "Planting", "Irrigation setup", "Fertilizer application", "Harvesting"],
    seasonalInfo: "Summer season crop; March-June harvest.",
    pestManagement: ["Fruit fly – bait traps", "Leaf roller – organic pesticides"],
    harvestTimeline: ["Harvest when fruits turn red"],
    soilTypes: ["Sandy loam", "Acidic", "pH 5.5-6.5"],
    climate: { temperatureC: [15, 30], rainfallMm: [1000, 1200], season: "Summer", notes: "Requires winter chilling" },
    irrigation: "Regular during fruit development",
    fertilizerGuideline: "NPK 10:6:8 + micronutrients",
    pestsAndDiseases: "Fruit fly, litchi mite, powdery mildew",
    stages: [
      { name: "Planting", daysFromStart: 0 },
      { name: "Vegetative", daysFromStart: 30 },
      { name: "Flowering", daysFromStart: 60 },
      { name: "Fruit set", daysFromStart: 90 },
      { name: "Harvest", daysFromStart: 120 }
    ],
    roiDefaults: { landAreaAcre: 1, investmentPerAcreINR: 65000, expectedYieldPerAcre: 6000, pricePerUnitINR: 55, unit: "kg" },
    quickReturns: { totalRevenuePerAcreINR: 330000, netProfitPerAcreINR: 280000, avgROIPercent: 430 },
    notes: "High demand in urban markets.",
    district: "Nalgonda"
  },
  {
    id: "dragon-fruit",
    name: "Dragon Fruit",
    category: "short",
    duration: "3 months",
    durationDays: 90,
    profitPerAcre: 320000,
    investmentCost: 75000,
    expectedYield: 5000,
    marketPrice: 80,
    waterNeeds: "Low to moderate",
    demand: "Very High",
    image: "/images/dragon-fruit.jpg",
    description: "Exotic fruit with high market value and increasing demand.",
    cultivationSteps: ["Cutting preparation", "Planting", "Training", "Fertilizer", "Harvest"],
    seasonalInfo: "Multiple harvests per year possible.",
    pestManagement: ["Fruit fly – organic control", "Snail management"],
    harvestTimeline: ["Harvest 30-35 days after flowering"],
    soilTypes: ["Sandy", "Well-drained", "pH 6.0-7.0"],
    climate: { temperatureC: [20, 35], rainfallMm: [600, 800], season: "All seasons", notes: "Drought tolerant" },
    irrigation: "Drip with low water requirement",
    fertilizerGuideline: "NPK 20:20:20 + organic compost",
    pestsAndDiseases: "Fruit fly, aphids, root rot",
    stages: [
      { name: "Planting", daysFromStart: 0 },
      { name: "Establishment", daysFromStart: 30 },
      { name: "Flowering", daysFromStart: 60 },
      { name: "Fruit development", daysFromStart: 75 },
      { name: "Harvest", daysFromStart: 90 }
    ],
    roiDefaults: { landAreaAcre: 1, investmentPerAcreINR: 75000, expectedYieldPerAcre: 5000, pricePerUnitINR: 80, unit: "kg" },
    quickReturns: { totalRevenuePerAcreINR: 400000, netProfitPerAcreINR: 320000, avgROIPercent: 426 },
    notes: "High-value niche crop.",
    district: "Mahabubnagar"
  },
  {
    id: "strawberry",
    name: "Strawberry",
    category: "short",
    duration: "3.5 months",
    durationDays: 105,
    profitPerAcre: 300000,
    investmentCost: 70000,
    expectedYield: 4000,
    marketPrice: 95,
    waterNeeds: "Moderate, consistent",
    demand: "Very High",
    image: "/images/strawberry.jpg",
    description: "High-value berry crop with premium market prices.",
    cultivationSteps: ["Runner selection", "Planting", "Mulching", "Irrigation", "Harvest"],
    seasonalInfo: "Winter season crop; November-February harvest.",
    pestManagement: ["Spider mites – neem oil", "Gray mold – fungicide"],
    harvestTimeline: ["Harvest every 2-3 days"],
    soilTypes: ["Sandy loam", "Rich organic", "pH 5.5-6.5"],
    climate: { temperatureC: [15, 25], rainfallMm: [500, 700], season: "Winter", notes: "Requires cool nights" },
    irrigation: "Drip with fertigation",
    fertilizerGuideline: "NPK 10:5:20 + organic matter",
    pestsAndDiseases: "Spider mites, gray mold, aphids",
    stages: [
      { name: "Planting", daysFromStart: 0 },
      { name: "Establishment", daysFromStart: 30 },
      { name: "Flowering", daysFromStart: 60 },
      { name: "Fruit set", daysFromStart: 75 },
      { name: "Harvest", daysFromStart: 105 }
    ],
    roiDefaults: { landAreaAcre: 1, investmentPerAcreINR: 70000, expectedYieldPerAcre: 4000, pricePerUnitINR: 95, unit: "kg" },
    quickReturns: { totalRevenuePerAcreINR: 380000, netProfitPerAcreINR: 300000, avgROIPercent: 428 },
    notes: "High demand in metro cities.",
    district: "Ranga Reddy"
  },
  {
    id: "broccoli",
    name: "Broccoli",
    category: "short",
    duration: "3 months",
    durationDays: 90,
    profitPerAcre: 240000,
    investmentCost: 55000,
    expectedYield: 6000,
    marketPrice: 45,
    waterNeeds: "Moderate, regular",
    demand: "High",
    image: "/images/broccoli.jpg",
    description: "Nutritious vegetable with growing health-conscious market.",
    cultivationSteps: ["Seed sowing", "Transplanting", "Fertilizer", "Pest control", "Harvest"],
    seasonalInfo: "Cool season crop; winter cultivation preferred.",
    pestManagement: ["Aphids – organic sprays", "Cabbage worm – Bt"],
    harvestTimeline: ["Harvest main head at 60-70 days"],
    soilTypes: ["Loamy", "Rich organic", "pH 6.0-7.0"],
    climate: { temperatureC: [15, 22], rainfallMm: [400, 600], season: "Winter", notes: "Cool weather essential" },
    irrigation: "Regular with good drainage",
    fertilizerGuideline: "NPK 15:10:20 + micronutrients",
    pestsAndDiseases: "Aphids, cabbage worm, downy mildew",
    stages: [
      { name: "Nursery", daysFromStart: 0 },
      { name: "Transplant", daysFromStart: 25 },
      { name: "Head formation", daysFromStart: 60 },
      { name: "Harvest", daysFromStart: 90 }
    ],
    roiDefaults: { landAreaAcre: 1, investmentPerAcreINR: 55000, expectedYieldPerAcre: 6000, pricePerUnitINR: 45, unit: "kg" },
    quickReturns: { totalRevenuePerAcreINR: 270000, netProfitPerAcreINR: 240000, avgROIPercent: 436 },
    notes: "Increasing demand in urban areas.",
    district: "Medak"
  },
  {
    id: "capsicum",
    name: "Capsicum (Bell Pepper)",
    category: "short",
    duration: "3 months",
    durationDays: 90,
    profitPerAcre: 280000,
    investmentCost: 65000,
    expectedYield: 7000,
    marketPrice: 50,
    waterNeeds: "Moderate, consistent",
    demand: "High",
    image: "/images/capsicum.jpg",
    description: "Colorful vegetable with high demand in hospitality sector.",
    cultivationSteps: ["Seed sowing", "Transplanting", "Staking", "Pruning", "Harvest"],
    seasonalInfo: "Year-round cultivation under protected conditions.",
    pestManagement: ["Thrips – neem sprays", "Fruit rot – fungicide"],
    harvestTimeline: ["Harvest 60-70 days after transplanting"],
    soilTypes: ["Well-drained", "Rich organic", "pH 6.0-6.8"],
    climate: { temperatureC: [18, 28], rainfallMm: [500, 700], season: "All seasons", notes: "Protected cultivation preferred" },
    irrigation: "Drip with fertigation",
    fertilizerGuideline: "NPK 15:10:25 + calcium",
    pestsAndDiseases: "Thrips, aphids, bacterial wilt",
    stages: [
      { name: "Nursery", daysFromStart: 0 },
      { name: "Transplant", daysFromStart: 25 },
      { name: "Flowering", daysFromStart: 50 },
      { name: "Fruit set", daysFromStart: 65 },
      { name: "Harvest", daysFromStart: 90 }
    ],
    roiDefaults: { landAreaAcre: 1, investmentPerAcreINR: 65000, expectedYieldPerAcre: 7000, pricePerUnitINR: 50, unit: "kg" },
    quickReturns: { totalRevenuePerAcreINR: 350000, netProfitPerAcreINR: 280000, avgROIPercent: 430 },
    notes: "High demand in hotels and restaurants.",
    district: "Warangal"
  },
  {
    id: "cherry-tomato",
    name: "Cherry Tomato",
    category: "short",
    duration: "3 months",
    durationDays: 90,
    profitPerAcre: 290000,
    investmentCost: 60000,
    expectedYield: 8000,
    marketPrice: 55,
    waterNeeds: "Moderate, regular",
    demand: "Very High",
    image: "/images/cherry-tomato.jpg",
    description: "Premium tomato variety with high export potential.",
    cultivationSteps: ["Seed sowing", "Transplanting", "Training", "Pruning", "Harvest"],
    seasonalInfo: "Year-round under protected cultivation.",
    pestManagement: ["Whitefly – yellow traps", "Leaf miner"],
    harvestTimeline: ["Continuous harvest 60-90 days"],
    soilTypes: ["Loamy", "Well-drained", "pH 6.0-7.0"],
    climate: { temperatureC: [20, 30], rainfallMm: [600, 800], season: "All seasons", notes: "Greenhouse preferred" },
    irrigation: "Drip irrigation",
    fertilizerGuideline: "NPK 20:10:20 + micronutrients",
    pestsAndDiseases: "Whitefly, leaf miner, blight",
    stages: [
      { name: "Nursery", daysFromStart: 0 },
      { name: "Transplant", daysFromStart: 25 },
      { name: "Flowering", daysFromStart: 50 },
      { name: "Fruiting", daysFromStart: 60 },
      { name: "Harvest", daysFromStart: 90 }
    ],
    roiDefaults: { landAreaAcre: 1, investmentPerAcreINR: 60000, expectedYieldPerAcre: 8000, pricePerUnitINR: 55, unit: "kg" },
    quickReturns: { totalRevenuePerAcreINR: 440000, netProfitPerAcreINR: 290000, avgROIPercent: 483 },
    notes: "Premium pricing in export markets.",
    district: "Nizamabad"
  },
  {
    id: "zucchini",
    name: "Zucchini",
    category: "short",
    duration: "2.5 months",
    durationDays: 75,
    profitPerAcre: 250000,
    investmentCost: 55000,
    expectedYield: 7500,
    marketPrice: 40,
    waterNeeds: "Moderate, consistent",
    demand: "High",
    image: "/images/zucchini.jpg",
    description: "Fast-growing summer squash with increasing demand.",
    cultivationSteps: ["Direct sowing", "Thinning", "Fertilizer", "Pest control", "Harvest"],
    seasonalInfo: "Summer season crop; quick harvest cycle.",
    pestManagement: ["Squash bugs", "Powdery mildew"],
    harvestTimeline: ["Harvest 50-55 days after sowing"],
    soilTypes: ["Well-drained", "Rich organic", "pH 6.0-7.5"],
    climate: { temperatureC: [18, 30], rainfallMm: [500, 700], season: "Summer", notes: "Warm weather essential" },
    irrigation: "Regular irrigation",
    fertilizerGuideline: "NPK 15:10:15 + organic matter",
    pestsAndDiseases: "Squash bugs, powdery mildew, cucumber beetles",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Germination", daysFromStart: 7 },
      { name: "Flowering", daysFromStart: 35 },
      { name: "Fruit set", daysFromStart: 45 },
      { name: "Harvest", daysFromStart: 75 }
    ],
    roiDefaults: { landAreaAcre: 1, investmentPerAcreINR: 55000, expectedYieldPerAcre: 7500, pricePerUnitINR: 40, unit: "kg" },
    quickReturns: { totalRevenuePerAcreINR: 300000, netProfitPerAcreINR: 250000, avgROIPercent: 454 },
    notes: "Growing demand in urban markets.",
    district: "Karimnagar"
  }
];

const mediumTermCrops: Crop[] = [
  // Static crops for other districts (not Rangareddy)
  // Rangareddy medicinal crops will be fetched from database
];

const longTermCrops: Crop[] = [
  {
    id: "mango",
    name: "Mango",
    category: "long",
    duration: "3-4 years",
    durationDays: 1200,
    profitPerAcre: 500000,
    investmentCost: 120000,
    expectedYield: 8000,
    marketPrice: 75,
    waterNeeds: "Moderate, seasonal",
    demand: "Very High",
    image: "/images/mango.jpg",
    description: "King of fruits with premium market prices and export potential.",
    cultivationSteps: ["Land preparation", "Planting", "Training", "Fertilizer", "Harvest"],
    seasonalInfo: "Summer season harvest; May-July.",
    pestManagement: ["Mango hopper", "Powdery mildew"],
    harvestTimeline: ["Harvest when fruits mature"],
    soilTypes: ["Well-drained", "Deep soils", "pH 6.0-7.0"],
    climate: { temperatureC: [15, 40], rainfallMm: [800, 1200], season: "Summer" },
    irrigation: "Supplemental irrigation during dry periods",
    fertilizerGuideline: "NPK 10:5:20 + organic matter",
    pestsAndDiseases: "Mango hopper, powdery mildew, anthracnose",
    stages: [
      { name: "Planting", daysFromStart: 0 },
      { name: "Establishment", daysFromStart: 365 },
      { name: "First flowering", daysFromStart: 730 },
      { name: "First harvest", daysFromStart: 1200 }
    ],
    roiDefaults: { landAreaAcre: 1, investmentPerAcreINR: 120000, expectedYieldPerAcre: 8000, pricePerUnitINR: 75, unit: "kg" },
    quickReturns: { totalRevenuePerAcreINR: 600000, netProfitPerAcreINR: 500000, avgROIPercent: 416 },
    notes: "Premium prices for export quality.",
    district: "Nizamabad"
  }
];

// 🚀 DATABASE-DIVEN FUNCTIONS - Get real data from Popup Tables + Original Tables
const mapDatabaseCropToCrop = (dbCrop: any, category: 'short' | 'medium' | 'long'): Crop => {
  // 🎯 HANDLE DIFFERENT COLUMN NAMES IN POPUP TABLES
  const cropName = dbCrop['Crop Name'] || dbCrop['Crop_Name'] || 'Unknown Crop';
  
  // 🎯 USE DYNAMIC CROP DURATION FROM DATABASE (NOT STATIC 90 DAYS)
  const durationStr = dbCrop['Crop_Duration'] || dbCrop['Crop Duration'] || '90 days';
  const durationDays = 90; // Keep as default for calculations
  
  // 🎯 USE INDIVIDUAL CROP DATA FROM 15 DATABASE COLUMNS
  // Each crop shows its OWN unique data from popup tables
  let popupInvestment = dbCrop['Investment_Per_Acre'] || 0;
  let popupYield = dbCrop['Expected_Yield_Per_Acre'] || 0;
  let popupPrice = dbCrop['Market_Price_Per_KG'] || 0;
  let popupProfit = dbCrop['Profit_Per_Acre'] || 0;
  const popupDemand = dbCrop['Market_Demand_Level'] || 'Medium';
  const popupROI = dbCrop['ROI_Percentage'] || 0;
  const popupBreakEven = dbCrop['Break_Even_Time'] || 'Not specified';
  
  // 🎯 FOR SHORT-TERM AND LONG-TERM CROPS: PROVIDE DEFAULT VALUES WHEN POPUP DATA IS MISSING
  if ((category === 'short' || category === 'long') && (popupInvestment === 0 || popupYield === 0 || popupPrice === 0)) {
    console.log(`🎯 Using default financial values for ${category}-term crop: ${cropName}`);
    
    // Default values based on crop type and duration
    const cropType = dbCrop['Crop Type'] || 'Vegetable';
    const duration = parseInt(dbCrop['Crop Duration']?.match(/\d+/)?.[0] || '90');
    
    // Set reasonable defaults based on crop type
    if (cropType === 'Vegetable') {
      popupInvestment = category === 'long' ? 80000 : 25000;
      popupYield = category === 'long' ? 8000 : 3000;
      popupPrice = category === 'long' ? 40 : 30;
      popupProfit = category === 'long' ? 240000 : 65000;
    } else if (cropType === 'Herb') {
      popupInvestment = category === 'long' ? 60000 : 20000;
      popupYield = category === 'long' ? 4000 : 2000;
      popupPrice = category === 'long' ? 80 : 50;
      popupProfit = category === 'long' ? 260000 : 80000;
    } else if (cropType === 'Berry Fruit') {
      popupInvestment = category === 'long' ? 100000 : 30000;
      popupYield = category === 'long' ? 6000 : 2500;
      popupPrice = category === 'long' ? 100 : 60;
      popupProfit = category === 'long' ? 500000 : 120000;
    } else if (cropType === 'Medicinal') {
      popupInvestment = category === 'long' ? 70000 : 22000;
      popupYield = category === 'long' ? 3000 : 1500;
      popupPrice = category === 'long' ? 150 : 80;
      popupProfit = category === 'long' ? 380000 : 98000;
    } else if (cropType === 'Fruit') {
      popupInvestment = category === 'long' ? 120000 : 35000;
      popupYield = category === 'long' ? 10000 : 4000;
      popupPrice = category === 'long' ? 75 : 45;
      popupProfit = category === 'long' ? 630000 : 145000;
    } else {
      // Default for other types
      popupInvestment = category === 'long' ? 50000 : 20000;
      popupYield = category === 'long' ? 5000 : 2000;
      popupPrice = category === 'long' ? 60 : 40;
      popupProfit = category === 'long' ? 250000 : 60000;
    }
    
    console.log(`🎯 Default values set: Investment=₹${popupInvestment}, Yield=${popupYield}kg, Price=₹${popupPrice}, Profit=₹${popupProfit}`);
  }
  
  // 🎯 ORIGINAL TABLES DATA - REAL CROP DATA FROM ORIGINAL TABLES
  const supplyStatus = dbCrop['Supply Status'] || 'Not specified';
  const originalDemandStatus = dbCrop['Demand Status'] || 'Not specified';
  const riskFactors = dbCrop['Risk Factors'] || 'Not specified';
  const cropDuration = dbCrop['Crop_Duration'] || dbCrop['Crop Duration'] || 'Not specified';
  const primarySoilType = dbCrop['Primary Soil Type Required'] || 'Not specified';
  const waterRequirement = dbCrop['Water Requirement'] || 'Not specified';
  const climateSuitability = dbCrop['Climate Suitability'] || 'Not specified';
  const irrigationCompatibility = dbCrop['Irrigation Compatibility'] || 'Not specified';
  const landAreaSuitability = dbCrop['Land Area Suitability'] || 'Not specified';
  const mitigationStrategies = dbCrop['Mitigation Strategies'] || 'Not specified';
  const cropType = dbCrop['Crop Type'] || 'Not specified';
  const suitableDistrict = dbCrop['Suitable Telangana District'] || 'Not specified';
  
  console.log(`🌱 Mapping ${cropName}: Duration=${durationStr}, District=${suitableDistrict}, Investment=${popupInvestment}, Supply=${supplyStatus}`);
  
  return {
    id: dbCrop['Id']?.toString() || cropName.toLowerCase().replace(/\s+/g, '-') || 'unknown',
    name: cropName,
    category,
    duration: durationStr, // 🎯 USE DYNAMIC DURATION FROM DATABASE
    durationDays,
    profitPerAcre: popupProfit,
    investmentCost: popupInvestment,
    expectedYield: popupYield,
    marketPrice: popupPrice,
    waterNeeds: waterRequirement || 'Moderate',
    demand: popupDemand,
    image: `/images/${cropName.toLowerCase().replace(/\s+/g, '-') || 'crop'}.jpg`,
    description: `${cropType} crop with ${supplyStatus} supply and ${originalDemandStatus} demand. Investment: ₹${popupInvestment}/acre, Expected ROI: ${popupROI}%`,
    
    // Cultivation Guide - Use individual crop data from popup tables
    cultivationSteps: dbCrop['Cultivation_Steps'] ? 
      dbCrop['Cultivation_Steps'].split(', ').filter(step => step.trim()) :
      ["Land preparation", "Planting", "Irrigation setup", "Fertilizer application", "Harvesting"],
    seasonalInfo: dbCrop['Best_Season'] || `Suitable for ${climateSuitability} conditions`,
    pestManagement: dbCrop['Pest_And_Disease_Management'] ? 
      [dbCrop['Pest_And_Disease_Management']] :
      [riskFactors || 'Standard pest management'],
    harvestTimeline: dbCrop['Harvest_Information'] ? 
      [dbCrop['Harvest_Information']] :
      [`Harvest based on ${durationStr} duration`],
    
    soilTypes: [primarySoilType || 'Well-drained soil'],
    climate: { 
      temperatureC: [15, 35], 
      rainfallMm: [500, 1500], 
      season: "All seasons",
      notes: climateSuitability 
    },
    irrigation: irrigationCompatibility || 'Standard irrigation',
    fertilizerGuideline: "NPK balanced with organic matter",
    pestsAndDiseases: riskFactors || 'Standard pests and diseases',
    stages: [
      { name: "Planting", daysFromStart: 0 },
      { name: "Establishment", daysFromStart: Math.round(durationDays * 0.3) },
      { name: "Growth", daysFromStart: Math.round(durationDays * 0.6) },
      { name: "Harvest", daysFromStart: durationDays }
    ],
    
    // ROI Calculator - Use individual crop data for accurate calculations
    roiDefaults: { 
      landAreaAcre: 1, 
      investmentPerAcreINR: popupInvestment, 
      expectedYieldPerAcre: popupYield, 
      pricePerUnitINR: popupPrice, 
      unit: "kg" 
    },
    quickReturns: { 
      totalRevenuePerAcreINR: popupYield * popupPrice, 
      netProfitPerAcreINR: popupProfit, 
      avgROIPercent: popupROI 
    },
    
    notes: dbCrop['Cost_Breakdown_Per_Acre'] || mitigationStrategies || 'Standard cultivation practices',
    district: suitableDistrict || 'Telangana', // 🎯 USE DYNAMIC DISTRICT FROM DATABASE
    
    // 🎯 ADDITIONAL PROPERTIES FOR INDIVIDUAL CROP DATA FROM POPUP TABLES
    costBreakdown: dbCrop['Cost_Breakdown_Per_Acre'] || 'Not specified',
    priceRange: dbCrop['Price_Range_Per_KG'] || `₹${popupPrice} per kg`,
    yieldRange: dbCrop['Yield_Range_Per_Acre'] || `${popupYield} kg per acre`,
    breakEvenTime: popupBreakEven,
    
    // 🎯 ORIGINAL TABLES DATA FOR ENHANCED POPUP - KEEPING EXISTING 15 COLUMNS
    supplyStatus,
    originalDemandStatus,
    riskFactors,
    cropDuration,
    primarySoilType,
    waterRequirement,
    climateSuitability,
    irrigationCompatibility,
    landAreaSuitability,
    mitigationStrategies,
    cropType,
    suitableDistrict
  };
};

// 🌱 ASYNC FUNCTIONS TO GET DATABASE CROPS FROM BOTH TABLES (DYNAMIC DISTRICT SUPPORT)
export const getCropsByCategory = async (category: 'short' | 'medium' | 'long', district?: string): Promise<Crop[]> => {
  try {
    // 🎯 DEFAULT TO RANGAREDDY IF NO DISTRICT PROVIDED (BACKWARD COMPATIBILITY)
    const targetDistrict = district || 'Rangareddy';
    console.log(`🔍 Fetching ${category}-term crops for district: ${targetDistrict}`);
    
    // 🎯 GET DATA FROM BOTH TABLES FOR COMPLETE CROP INFORMATION
    const popupTableName = category === 'short' ? 'S_T_C_PopUp1' : 
                        category === 'medium' ? 'M_T_C_PopUp1' : 'L_T_C_PopUp1';
    
    const originalTableName = category === 'short' ? 'Short_Term_Crops' : 
                          category === 'medium' ? 'Medium_Term_Crops' : 'Long_Term_Crops';
    
    console.log(`🔍 Fetching ${category}-term crops from BOTH tables: ${popupTableName} + ${originalTableName}`);
    
    // 🎯 FETCH FROM POPUP TABLE (Investment, Yield, Price, ROI)
    let popupQuery = supabase.from(popupTableName).select('*');
    
    // 🎯 FOR MEDIUM TERM: SHOW ALL CROPS FOR THE DISTRICT (NOT JUST MEDICINAL)
    // This allows each district to show its specific crops
    if (category === 'medium') {
      // Only filter by district, not by crop type
      console.log(`🎯 Fetching all medium-term crops for ${targetDistrict}`);
      // Don't filter by medicinal crops - let each district show its own crops
      // popupQuery = popupQuery.in('Crop_Name', medicinalCrops);
    }
    
    const { data: popupData, error: popupError } = await popupQuery;
    
    // 🎯 FETCH FROM ORIGINAL TABLE (Supply, Demand, Risk, Duration, Soil, Water, Climate)
    // 🎯 DYNAMIC DISTRICT FILTERING
    let originalQuery = supabase.from(originalTableName).select('*');
    
    if (category === 'medium') {
      // 🎯 FETCH ALL MEDIUM-TERM CROPS FOR THE DISTRICT (NOT JUST MEDICINAL)
      // This allows each district to show its specific crops
      console.log(`🎯 Fetching all medium-term crops for ${targetDistrict}`);
      originalQuery = originalQuery
        .eq('Suitable Telangana District', targetDistrict);
      // Don't filter by medicinal crops - let each district show its own crops
      // .in('Crop Name', medicinalCrops);
    } else if (category === 'short') {
      // Filter for short-term crops in the target district
      console.log(`🎯 Filtering for ${targetDistrict} short-term crops`);
      originalQuery = originalQuery
        .eq('Suitable Telangana District', targetDistrict);
    } else if (category === 'long') {
      // Filter for long-term crops in the target district
      console.log(`🎯 Filtering for ${targetDistrict} long-term crops`);
      originalQuery = originalQuery
        .eq('Suitable Telangana District', targetDistrict);
    }
    
    const { data: originalData, error: originalError } = await originalQuery;
    
    if (popupError || originalError) {
      console.error(`Error fetching ${category} crops:`, popupError || originalError);
      // Return static data as fallback
      return category === 'short' ? shortTermCrops : 
             category === 'medium' ? mediumTermCrops : longTermCrops;
    }
    
    if (popupData && originalData && popupData.length > 0 && originalData.length > 0) {
      // 🎯 FILTER POPUP DATA TO MATCH DISTRICT ORIGINAL CROPS
      let filteredPopupData = popupData;
      if (category === 'medium' || category === 'long') {
        const districtCropNames = originalData.map(orig => orig['Crop Name']);
        filteredPopupData = popupData.filter(popupCrop => 
          districtCropNames.includes(popupCrop.Crop_Name)
        );
        console.log(`🎯 Filtered popup data for ${category}-term: ${filteredPopupData.length} crops match ${targetDistrict}`);
      }
      
      // 🎯 REMOVE DUPLICATES FROM POPUP DATA
      const uniquePopupData = filteredPopupData.filter((popupCrop, index, self) => 
        index === self.findIndex(c => c.Crop_Name === popupCrop.Crop_Name)
      );
      
      console.log(`🎯 Removed duplicates: ${uniquePopupData.length} unique popup crops`);
      
      // 🎯 MERGE DATA FROM BOTH TABLES
      const mergedCrops = uniquePopupData.map((popupCrop, index) => {
        const originalCrop = originalData.find(orig => 
          orig['Crop Name'] === popupCrop['Crop Name'] || 
          orig['Crop Name'] === popupCrop['Crop_Name']
        );
        
        if (originalCrop) {
          // 🎯 COMBINE BOTH DATA SOURCES
          const combinedCrop = {
            ...popupCrop,
            ...originalCrop
          };
          
          console.log(`🌱 Merged ${popupCrop['Crop Name'] || popupCrop['Crop_Name']}: Investment=${popupCrop['Investment_Per_Acre']}, Supply=${originalCrop['Supply Status']}`);
          return mapDatabaseCropToCrop(combinedCrop, category);
        } else {
          console.log(`⚠️ No match found for ${popupCrop['Crop Name'] || popupCrop['Crop_Name']} in original table`);
          return mapDatabaseCropToCrop(popupCrop, category);
        }
      });
      
      // 🎯 FOR SHORT TERM, MEDIUM TERM AND LONG TERM: ADD ORIGINAL CROPS THAT DON'T HAVE POPUP DATA
      if (category === 'short' || category === 'medium' || category === 'long') {
        const originalCropNames = uniquePopupData.map(p => p.Crop_Name);
        const originalCropsWithoutPopup = originalData.filter(orig => 
          !originalCropNames.includes(orig['Crop Name'])
        );
        
        console.log(`🎯 Adding ${originalCropsWithoutPopup.length} original crops without popup data`);
        
        const originalCropsMapped = originalCropsWithoutPopup.map(originalCrop => {
          console.log(`🌱 Adding original-only crop: ${originalCrop['Crop Name']}`);
          return mapDatabaseCropToCrop(originalCrop, category);
        });
        
        const allCrops = [...mergedCrops, ...originalCropsMapped];
        console.log(`🎯 Final ${category}-term crops for ${targetDistrict}: ${allCrops.length}`);
        return allCrops;
      }
      
      console.log(`🎯 Final merged crops: ${mergedCrops.length}`);
      return mergedCrops;
    }
    
    // 🎯 NO DATA FOUND FOR DISTRICT - RETURN EMPTY ARRAY (NOT STATIC CROPS)
    console.log(`📝 No database data found for ${category}-term crops in ${targetDistrict}`);
    console.log(`🎯 Returning empty array for ${targetDistrict} ${category}-term crops`);
    return [];
    
  } catch (error) {
    console.error(`Error in getCropsByCategory for ${category}:`, error);
    // 🎯 FOR DISTRICT-SPECIFIC LOGIC, RETURN EMPTY ARRAY ON ERROR
    console.log(`🎯 Returning empty array due to error for ${category}-term crops`);
    return [];
  }
};

// 🌱 ASYNC FUNCTIONS TO GET DATABASE CROPS FROM POPUP TABLES (FOR INVESTMENT, YIELD, PRICE)
export const getCropsByCategoryFromPopup = async (category: 'short' | 'medium' | 'long'): Promise<Crop[]> => {
  try {
    // 🎯 USE POPUP TABLES FOR INVESTMENT, YIELD, PRICE DATA
    const tableName = category === 'short' ? 'S_T_C_PopUp1' : 
                     category === 'medium' ? 'M_T_C_PopUp1' : 'L_T_C_PopUp1';
    
    console.log(`🔍 Fetching ${category}-term crops from POPUP table: ${tableName}`);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
    
    if (error) {
      console.error(`Error fetching ${category} crops from popup table:`, error);
      // Return static data as fallback
      return category === 'short' ? shortTermCrops : 
             category === 'medium' ? mediumTermCrops : longTermCrops;
    }
    
    if (data && data.length > 0) {
      console.log(`🌱 Loaded ${data.length} ${category}-term crops from POPUP table`);
      const firstCropName = data[0]['Crop Name'] || data[0]['Crop_Name'] || 'Unknown';
      console.log(`📊 Sample crop: ${firstCropName} - Investment: ${data[0]['Investment_Per_Acre']}, Yield: ${data[0]['Expected_Yield_Per_Acre']}, Price: ${data[0]['Market_Price_Per_KG']}`);
      return data.map(crop => mapDatabaseCropToCrop(crop, category));
    }
    
    // Fallback to static data if no database data
    return category === 'short' ? shortTermCrops : 
           category === 'medium' ? mediumTermCrops : longTermCrops;
    
  } catch (error) {
    console.error(`Error in getCropsByCategoryFromPopup for ${category}:`, error);
    // Return static data as fallback
    return category === 'short' ? shortTermCrops : 
           category === 'medium' ? mediumTermCrops : longTermCrops;
  }
};

// 🔄 SYNC VERSION FOR BACKWARD COMPATIBILITY (returns static data)
export const getCropsByCategorySync = (category: 'short' | 'medium' | 'long') => {
  switch (category) {
    case 'short':
      return shortTermCrops;
    case 'medium':
      return mediumTermCrops;
    case 'long':
      return longTermCrops;
    default:
      return shortTermCrops;
  }
};

// Export static data for backward compatibility
export { shortTermCrops, mediumTermCrops, longTermCrops };
export const cropData = [...shortTermCrops, ...mediumTermCrops, ...longTermCrops];

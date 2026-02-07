// Crop Interface
export interface Crop {
  id: string;
  name: string;
  category: "short" | "medium" | "long";
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
    temperatureC: number[];
    rainfallMm: number[];
    season: string;
    notes?: string;
  };
  irrigation: string;
  fertilizerGuideline: string;
  pestsAndDiseases: string;
  stages: Array<{
    name: string;
    daysFromStart: number;
  }>;
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
  district: string;
  majorStates: string;
  notes?: string;
}


type CropInput = {
  name: string;
  district: string;
  majorStates: string;
};

const imageUrl = (query: string) => {
  const encoded = encodeURIComponent(query);
  return `https://www.sourcesplash.com/i/random?q=${encoded}`;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const categoryDefaults = {
  short: {
    duration: "45-120 days",
    durationDays: 90,
    investmentCost: 45000,
    expectedYield: 9000,
    marketPrice: 20,
    waterNeeds: "High",
    demand: "High",
    climate: { temperatureC: [18, 32], rainfallMm: [500, 800], season: "Kharif/Rabi" },
    irrigation: "Frequent light irrigation",
    fertilizerGuideline: "Balanced NPK with organic matter",
    pestsAndDiseases: "Common vegetable pests; IPM recommended",
    cultivationSteps: ["Land preparation", "Sowing/Transplanting", "Nutrient management", "Harvest"],
    seasonalInfo: "Short-duration crop suited for quick market cycles.",
    pestManagement: ["Use resistant varieties", "Sticky traps and IPM", "Regular scouting"],
    harvestTimeline: ["Harvest between 45-120 days depending on variety"],
    soilTypes: ["Loam", "Sandy-loam", "Well-drained"],
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Vegetative", daysFromStart: 20 },
      { name: "Flowering", daysFromStart: 40 },
      { name: "Harvest", daysFromStart: 90 }
    ],
    unit: "kg"
  },
  medium: {
    duration: "4-9 months",
    durationDays: 210,
    investmentCost: 80000,
    expectedYield: 4000,
    marketPrice: 60,
    waterNeeds: "Medium",
    demand: "High",
    climate: { temperatureC: [18, 30], rainfallMm: [600, 1000], season: "Kharif/Rabi" },
    irrigation: "Moderate irrigation; avoid waterlogging",
    fertilizerGuideline: "Split NPK doses with organic inputs",
    pestsAndDiseases: "Seasonal pests; timely sprays and IPM",
    cultivationSteps: ["Land preparation", "Sowing/Planting", "Intercultural operations", "Harvest"],
    seasonalInfo: "Medium-duration crop with strong demand-supply gap.",
    pestManagement: ["Crop rotation", "Seed treatment", "IPM practices"],
    harvestTimeline: ["Harvest between 4-9 months depending on variety"],
    soilTypes: ["Loam", "Clay-loam", "Well-drained"],
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Vegetative", daysFromStart: 50 },
      { name: "Reproductive", daysFromStart: 120 },
      { name: "Harvest", daysFromStart: 210 }
    ],
    unit: "kg"
  },
  long: {
    duration: "1.5-7 years",
    durationDays: 1460,
    investmentCost: 120000,
    expectedYield: 2000,
    marketPrice: 200,
    waterNeeds: "Medium",
    demand: "Very High",
    climate: { temperatureC: [16, 32], rainfallMm: [700, 1200], season: "Perennial" },
    irrigation: "Regular irrigation with mulching",
    fertilizerGuideline: "FYM + balanced NPK annually",
    pestsAndDiseases: "Perennial pests; periodic monitoring",
    cultivationSteps: ["Planting", "Canopy management", "Nutrition and irrigation", "Harvest"],
    seasonalInfo: "Long-term perennial crop with high future demand.",
    pestManagement: ["Pruning and sanitation", "IPM and traps", "Soil health management"],
    harvestTimeline: ["First harvest depends on variety and age"],
    soilTypes: ["Loam", "Well-drained", "Organic-rich"],
    stages: [
      { name: "Planting", daysFromStart: 0 },
      { name: "Establishment", daysFromStart: 365 },
      { name: "First bearing", daysFromStart: 1460 }
    ],
    unit: "kg"
  }
} as const;

const shortTermOverrides: Record<string, Partial<Crop>> = {
  "broccoli-short": {
    duration: "80-100 days",
    durationDays: 90,
    investmentCost: 40000,
    expectedYield: 4250,
    marketPrice: 32,
    waterNeeds: "Medium",
    demand: "High",
    description: "Short-duration winter vegetable with strong urban demand.",
    cultivationSteps: [
      "Deep ploughing and fine tilth",
      "Nursery raising and transplanting",
      "Split NPK application",
      "Irrigation and head protection",
      "Harvest central head and side shoots"
    ],
    seasonalInfo: "Best in Rabi; ideal temperature 15-25 C.",
    pestManagement: ["Aphids and caterpillars - IPM", "Sticky traps and neem sprays"],
    harvestTimeline: ["First harvest 70-80 days after transplanting", "Crop duration up to 100 days"],
    soilTypes: ["Well-drained loam", "pH 6.0-7.0"],
    climate: { temperatureC: [15, 25], rainfallMm: [500, 800], season: "Rabi" },
    irrigation: "Irrigate every 6-8 days; critical at head formation",
    fertilizerGuideline: "FYM 8-10 t/acre + N60 P40 K40 kg/acre in splits",
    pestsAndDiseases: "Aphids, caterpillars; manage with IPM",
    stages: [
      { name: "Nursery", daysFromStart: 0 },
      { name: "Transplant", daysFromStart: 25 },
      { name: "Head formation", daysFromStart: 60 },
      { name: "Harvest", daysFromStart: 90 }
    ]
  },
  "lettuce-iceberg-short": {
    duration: "45-60 days",
    durationDays: 55,
    investmentCost: 35000,
    expectedYield: 4500,
    marketPrice: 28,
    waterNeeds: "Medium (light frequent irrigation)",
    demand: "Very High",
    description: "Short-duration leafy vegetable for hotels and retail.",
    cultivationSteps: [
      "Fine tilth and raised beds",
      "Nursery transplanting",
      "Light N application",
      "Frequent irrigation",
      "Harvest firm heads"
    ],
    seasonalInfo: "Rabi and early summer; ideal temperature 15-22 C.",
    pestManagement: ["Aphids - neem oil", "Sticky traps"],
    harvestTimeline: ["Harvest 45-55 days after transplanting"],
    soilTypes: ["Sandy loam", "Well-drained"],
    climate: { temperatureC: [15, 22], rainfallMm: [400, 700], season: "Rabi/Early summer" },
    irrigation: "Light irrigation every 3-4 days",
    fertilizerGuideline: "FYM + light N in splits",
    pestsAndDiseases: "Aphids, leaf miners; manage with IPM",
    stages: [
      { name: "Nursery", daysFromStart: 0 },
      { name: "Transplant", daysFromStart: 20 },
      { name: "Head formation", daysFromStart: 40 },
      { name: "Harvest", daysFromStart: 55 }
    ]
  },
  "lettuce-romaine-short": {
    duration: "50-65 days",
    durationDays: 58,
    investmentCost: 33000,
    expectedYield: 5000,
    marketPrice: 24,
    waterNeeds: "Medium",
    demand: "High",
    description: "Romaine lettuce for salad and sandwich markets.",
    cultivationSteps: [
      "Fine soil preparation",
      "Nursery transplanting",
      "FYM + split nitrogen",
      "Light frequent irrigation",
      "Harvest at head elongation"
    ],
    seasonalInfo: "Rabi and mild winter preferred.",
    pestManagement: ["Aphids and leaf miners - IPM"],
    harvestTimeline: ["Harvest at 50-60 days"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [15, 24], rainfallMm: [400, 700], season: "Rabi/Winter" },
    irrigation: "Light frequent irrigation",
    fertilizerGuideline: "FYM + split nitrogen doses",
    pestsAndDiseases: "Aphids, leaf miner; manage with IPM",
    stages: [
      { name: "Nursery", daysFromStart: 0 },
      { name: "Transplant", daysFromStart: 22 },
      { name: "Head elongation", daysFromStart: 45 },
      { name: "Harvest", daysFromStart: 58 }
    ]
  },
  "zucchini-short": {
    duration: "50-70 days",
    durationDays: 60,
    investmentCost: 40000,
    expectedYield: 7000,
    marketPrice: 20,
    waterNeeds: "Medium to High",
    demand: "High",
    description: "High-demand urban vegetable with quick harvest.",
    cultivationSteps: [
      "Well-drained sandy loam soil prep",
      "Direct sowing or transplanting",
      "FYM + NPK in splits",
      "Drip irrigation preferred",
      "Harvest tender fruits"
    ],
    seasonalInfo: "Performs best in mild climate (18-30 C).",
    pestManagement: ["Fruit borer and aphids - IPM"],
    harvestTimeline: ["Harvest starts at 40-45 days; continues up to 70 days"],
    soilTypes: ["Sandy loam", "Well-drained"],
    climate: { temperatureC: [18, 30], rainfallMm: [400, 700], season: "Kharif/Rabi" },
    irrigation: "Regular irrigation; avoid water stress",
    fertilizerGuideline: "FYM + balanced NPK",
    pestsAndDiseases: "Fruit borer, aphids; IPM recommended",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Vining", daysFromStart: 20 },
      { name: "Flowering", daysFromStart: 35 },
      { name: "Harvest", daysFromStart: 60 }
    ]
  },
  "cherry-tomato-short": {
    duration: "90-110 days",
    durationDays: 100,
    investmentCost: 45000,
    expectedYield: 8000,
    marketPrice: 28,
    waterNeeds: "Medium",
    demand: "Very High",
    description: "High-value tomato for retail and export markets.",
    cultivationSteps: [
      "Well-drained loam preparation",
      "Transplant 25-30 day seedlings",
      "FYM + split NPK",
      "Drip irrigation preferred",
      "Cluster harvesting"
    ],
    seasonalInfo: "Rabi and Kharif; optimal 18-30 C.",
    pestManagement: ["Fruit borer and whitefly - IPM"],
    harvestTimeline: ["Harvest 60-70 days after transplanting"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [18, 30], rainfallMm: [500, 800], season: "Kharif/Rabi" },
    irrigation: "Regular drip irrigation",
    fertilizerGuideline: "FYM + split NPK application",
    pestsAndDiseases: "Fruit borer, whitefly; IPM recommended",
    stages: [
      { name: "Nursery", daysFromStart: 0 },
      { name: "Transplant", daysFromStart: 25 },
      { name: "Flowering", daysFromStart: 50 },
      { name: "Harvest", daysFromStart: 100 }
    ]
  },
  "baby-corn-short": {
    duration: "60-75 days",
    durationDays: 68,
    investmentCost: 25000,
    expectedYield: 1300,
    marketPrice: 50,
    waterNeeds: "Medium",
    demand: "High",
    description: "Short-duration maize harvested before pollination.",
    cultivationSteps: [
      "Fine tilth and direct sowing",
      "N-rich basal dose",
      "Irrigation at 5-7 day interval",
      "Harvest before pollination"
    ],
    seasonalInfo: "Suitable in Kharif and Rabi; short cycle.",
    pestManagement: ["Stem borer management"],
    harvestTimeline: ["Harvest 45-55 days after sowing"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [20, 32], rainfallMm: [500, 800], season: "Kharif/Rabi" },
    irrigation: "Irrigate every 5-7 days",
    fertilizerGuideline: "Higher nitrogen with split application",
    pestsAndDiseases: "Stem borer; IPM recommended",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Vegetative", daysFromStart: 20 },
      { name: "Silk emergence", daysFromStart: 45 },
      { name: "Harvest", daysFromStart: 55 }
    ]
  },
  "coloured-capsicum-short": {
    duration: "90-120 days",
    durationDays: 105,
    investmentCost: 45000,
    expectedYield: 9000,
    marketPrice: 24,
    waterNeeds: "Medium to High",
    demand: "Very High",
    description: "Bell pepper hybrids with strong urban and export demand.",
    cultivationSteps: [
      "Deep ploughing and raised beds",
      "Transplant 30-35 day seedlings",
      "FYM + split NPK application",
      "Drip irrigation every 2-3 days",
      "Harvest at color break stage"
    ],
    seasonalInfo: "Suitable in Kharif and Rabi; best at 18-30 C.",
    pestManagement: ["Thrips, aphids, mites - IPM", "Sticky traps and neem sprays"],
    harvestTimeline: ["First harvest 60-70 days after transplanting", "Multiple pickings"],
    soilTypes: ["Loamy", "Well-drained", "pH 6.0-6.8"],
    climate: { temperatureC: [18, 30], rainfallMm: [600, 900], season: "Kharif/Rabi" },
    irrigation: "Drip irrigation every 2-3 days",
    fertilizerGuideline: "FYM 10-12 t/acre + N60-70 P40-50 K40-50 kg/acre in splits",
    pestsAndDiseases: "Thrips, aphids, mites; IPM recommended",
    stages: [
      { name: "Nursery", daysFromStart: 0 },
      { name: "Transplant", daysFromStart: 30 },
      { name: "Flowering", daysFromStart: 55 },
      { name: "Harvest", daysFromStart: 105 }
    ]
  },
  "kale-short": {
    duration: "60-80 days",
    durationDays: 70,
    investmentCost: 35000,
    expectedYield: 4000,
    marketPrice: 32,
    waterNeeds: "Medium",
    demand: "High",
    description: "Leafy green for urban health markets.",
    cultivationSteps: [
      "Sandy loam preparation",
      "Transplant 25 day seedlings",
      "FYM + split nitrogen",
      "Light frequent irrigation",
      "Harvest by leaf plucking"
    ],
    seasonalInfo: "Cool season crop; performs in mild winter.",
    pestManagement: ["Aphids - IPM"],
    harvestTimeline: ["Harvest 50-60 days after transplanting"],
    soilTypes: ["Sandy loam", "Well-drained"],
    climate: { temperatureC: [12, 24], rainfallMm: [400, 700], season: "Rabi/Winter" },
    irrigation: "Light frequent irrigation",
    fertilizerGuideline: "FYM + split nitrogen doses",
    pestsAndDiseases: "Aphids; manage with IPM",
    stages: [
      { name: "Nursery", daysFromStart: 0 },
      { name: "Transplant", daysFromStart: 25 },
      { name: "Leaf growth", daysFromStart: 45 },
      { name: "Harvest", daysFromStart: 70 }
    ]
  },
  "celery-short": {
    duration: "90-110 days",
    durationDays: 100,
    investmentCost: 45000,
    expectedYield: 5500,
    marketPrice: 25,
    waterNeeds: "High",
    demand: "High",
    description: "High-value leafy crop for hotels and pharma use.",
    cultivationSteps: [
      "Moist loam soil preparation",
      "Transplant 30 day seedlings",
      "High organic matter and N supply",
      "Regular irrigation",
      "Harvest whole plants"
    ],
    seasonalInfo: "Prefers cool season with steady moisture.",
    pestManagement: ["Leaf miners - IPM"],
    harvestTimeline: ["Harvest 80-90 days after transplanting"],
    soilTypes: ["Moist loam", "Organic rich"],
    climate: { temperatureC: [15, 24], rainfallMm: [500, 800], season: "Rabi/Winter" },
    irrigation: "Regular irrigation; avoid moisture stress",
    fertilizerGuideline: "High organic matter + balanced NPK",
    pestsAndDiseases: "Leaf miners; manage with IPM",
    stages: [
      { name: "Nursery", daysFromStart: 0 },
      { name: "Transplant", daysFromStart: 30 },
      { name: "Vegetative", daysFromStart: 60 },
      { name: "Harvest", daysFromStart: 100 }
    ]
  },
  "parsley-short": {
    duration: "70-90 days",
    durationDays: 80,
    investmentCost: 30000,
    expectedYield: 3000,
    marketPrice: 38,
    waterNeeds: "Medium",
    demand: "High",
    description: "Culinary herb with export and hotel demand.",
    cultivationSteps: [
      "Well-drained soil preparation",
      "Direct sowing or transplant",
      "FYM + light nitrogen",
      "Irrigation every 4-5 days",
      "Harvest leaf cuttings"
    ],
    seasonalInfo: "Cool season; multiple cuttings possible.",
    pestManagement: ["Aphids - IPM"],
    harvestTimeline: ["Harvest 60-70 days after sowing"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [15, 25], rainfallMm: [400, 700], season: "Rabi/Winter" },
    irrigation: "Irrigation every 4-5 days",
    fertilizerGuideline: "FYM + light nitrogen",
    pestsAndDiseases: "Aphids; manage with IPM",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Vegetative", daysFromStart: 30 },
      { name: "First cutting", daysFromStart: 60 },
      { name: "Harvest", daysFromStart: 80 }
    ]
  },
  "basil-sweet-short": {
    duration: "80-90 days",
    durationDays: 85,
    investmentCost: 25000,
    expectedYield: 8900,
    marketPrice: 160,
    waterNeeds: "Medium",
    demand: "High",
    description: "High-yielding basil with strong culinary and export demand.",
    cultivationSteps: [
      "Light loamy soil preparation",
      "Direct sowing or transplant",
      "FYM + split nitrogen",
      "Irrigate every 4-5 days",
      "Harvest leaf cuttings from 40 days"
    ],
    seasonalInfo: "Short-duration herb crop; typical maturity 80-90 days.",
    pestManagement: ["Aphids and leaf spot - IPM"],
    harvestTimeline: ["Harvest from 60-80 days; multiple cuttings possible"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [18, 30], rainfallMm: [400, 800], season: "Kharif/Rabi" },
    irrigation: "Regular light irrigation",
    fertilizerGuideline: "FYM + split nitrogen application",
    pestsAndDiseases: "Aphids, leaf spot; IPM recommended",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Vegetative", daysFromStart: 25 },
      { name: "First cutting", daysFromStart: 60 },
      { name: "Harvest", daysFromStart: 85 }
    ],
    notes: "Yield based on high-yield basil variety reports; price reflects retail leafy herb listings."
  },
  "basil-thai-short": {
    duration: "60-80 days",
    durationDays: 75,
    investmentCost: 25000,
    expectedYield: 8000,
    marketPrice: 160,
    waterNeeds: "Medium",
    demand: "High",
    description: "Aromatic basil variety used in culinary markets.",
    cultivationSteps: [
      "Light loamy soil preparation",
      "Direct sowing or transplant",
      "FYM + split nitrogen",
      "Irrigate every 4-5 days",
      "Harvest at pre-flower stage"
    ],
    seasonalInfo: "Short-duration herb crop; multiple cuttings possible.",
    pestManagement: ["Aphids - IPM"],
    harvestTimeline: ["Harvest starts around 55-70 days"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [18, 30], rainfallMm: [400, 800], season: "Kharif/Rabi" },
    irrigation: "Regular light irrigation",
    fertilizerGuideline: "FYM + split nitrogen application",
    pestsAndDiseases: "Aphids, leaf spot; IPM recommended",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Vegetative", daysFromStart: 25 },
      { name: "Harvest", daysFromStart: 75 }
    ],
    notes: "Yield and cycle aligned to basil variety references; price reflects retail herb listings."
  },
  "bok-choy-short": {
    duration: "45-60 days",
    durationDays: 55,
    investmentCost: 33000,
    expectedYield: 2860,
    marketPrice: 30,
    waterNeeds: "Medium",
    demand: "High",
    description: "Fast-growing leafy vegetable with rising urban demand.",
    cultivationSteps: [
      "Fine tilth and raised beds",
      "Nursery transplanting",
      "Split NPK application",
      "Light frequent irrigation",
      "Harvest whole plants at market size"
    ],
    seasonalInfo: "Cool season crop; best in mild winters.",
    pestManagement: ["Aphids and flea beetles - IPM"],
    harvestTimeline: ["Harvest at 45-60 days"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [15, 25], rainfallMm: [400, 700], season: "Rabi/Winter" },
    irrigation: "Light frequent irrigation",
    fertilizerGuideline: "Balanced NPK; avoid water stress",
    pestsAndDiseases: "Aphids, flea beetles; IPM recommended",
    stages: [
      { name: "Nursery", daysFromStart: 0 },
      { name: "Transplant", daysFromStart: 20 },
      { name: "Harvest", daysFromStart: 55 }
    ],
    notes: "Yield derived from Pak Choi yield/ha research; price inferred from gross return/yield."
  },
  "pak-choi-short": {
    duration: "45-60 days",
    durationDays: 55,
    investmentCost: 33000,
    expectedYield: 2860,
    marketPrice: 30,
    waterNeeds: "Medium",
    demand: "High",
    description: "Short-duration leafy crop suited for quick market cycles.",
    cultivationSteps: [
      "Fine tilth and raised beds",
      "Nursery transplanting",
      "Split NPK application",
      "Light frequent irrigation",
      "Harvest whole plants"
    ],
    seasonalInfo: "Cool season crop; best in mild winters.",
    pestManagement: ["Aphids - IPM"],
    harvestTimeline: ["Harvest at 45-60 days"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [15, 25], rainfallMm: [400, 700], season: "Rabi/Winter" },
    irrigation: "Light frequent irrigation",
    fertilizerGuideline: "Balanced NPK; avoid water stress",
    pestsAndDiseases: "Aphids; IPM recommended",
    stages: [
      { name: "Nursery", daysFromStart: 0 },
      { name: "Transplant", daysFromStart: 20 },
      { name: "Harvest", daysFromStart: 55 }
    ],
    notes: "Yield and gross return sourced from Pak Choi research; price inferred from gross return/yield."
  },
  "baby-spinach-short": {
    duration: "30-45 days",
    durationDays: 40,
    investmentCost: 38000,
    expectedYield: 10000,
    marketPrice: 20,
    waterNeeds: "Medium",
    demand: "High",
    description: "Quick-cycle leafy crop for urban markets.",
    cultivationSteps: [
      "Direct sowing on fine tilth",
      "Light frequent irrigation",
      "Weed control",
      "Harvest tender leaves"
    ],
    seasonalInfo: "Cool season crop with multiple cuttings.",
    pestManagement: ["Leaf miner - IPM"],
    harvestTimeline: ["First harvest 25-35 days after sowing"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [15, 25], rainfallMm: [400, 700], season: "Rabi/Winter" },
    irrigation: "Light frequent irrigation",
    fertilizerGuideline: "Light N application with organic matter",
    pestsAndDiseases: "Leaf miner; IPM recommended",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Vegetative", daysFromStart: 20 },
      { name: "Harvest", daysFromStart: 40 }
    ]
  },
  "microgreens-mixed-short": {
    duration: "10-20 days",
    durationDays: 14,
    investmentCost: 120000,
    expectedYield: 1200,
    marketPrice: 3000,
    waterNeeds: "Low",
    demand: "Very High",
    description: "Ultra-short cycle greens for premium urban markets.",
    cultivationSteps: [
      "Tray-based cultivation",
      "Cocopeat or grow mat medium",
      "Daily misting",
      "Harvest at cotyledon stage"
    ],
    seasonalInfo: "Year-round under controlled conditions.",
    pestManagement: ["Sanitation and humidity control"],
    harvestTimeline: ["Harvest at 10-14 days"],
    soilTypes: ["Soilless media (cocopeat/grow mat)"],
    climate: { temperatureC: [18, 22], rainfallMm: [0, 0], season: "Year-round (controlled)" },
    irrigation: "Misting; avoid waterlogging",
    fertilizerGuideline: "Minimal; clean water and sterile media",
    pestsAndDiseases: "Mold; prevent with airflow and sanitation",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Cotyledon", daysFromStart: 7 },
      { name: "Harvest", daysFromStart: 14 }
    ],
    notes: "Yield approximated from published microgreens yield per m2 per week; price from market listings."
  },
  "button-mushroom-short": {
    duration: "45-60 days",
    durationDays: 55,
    investmentCost: 150000,
    expectedYield: 2000,
    marketPrice: 180,
    waterNeeds: "High humidity",
    demand: "High",
    description: "Indoor crop with strong hotel and retail demand.",
    cultivationSteps: [
      "Compost preparation",
      "Spawning and incubation",
      "Casing and pinning",
      "Harvest flushes"
    ],
    seasonalInfo: "Year-round under controlled conditions.",
    pestManagement: ["Hygiene and sanitation protocols"],
    harvestTimeline: ["First harvest in ~35-45 days"],
    soilTypes: ["Compost-based substrate"],
    climate: { temperatureC: [14, 20], rainfallMm: [0, 0], season: "Year-round (controlled)" },
    irrigation: "Maintain humidity; mist as required",
    fertilizerGuideline: "Compost quality is key",
    pestsAndDiseases: "Molds; managed by hygiene",
    stages: [
      { name: "Compost", daysFromStart: 0 },
      { name: "Spawn run", daysFromStart: 20 },
      { name: "Pinning", daysFromStart: 30 },
      { name: "Harvest", daysFromStart: 55 }
    ],
    notes: "Yield per compost bag from published studies; price based on wholesale/retail listings."
  },
  "oyster-mushroom-short": {
    duration: "30-45 days",
    durationDays: 40,
    investmentCost: 120000,
    expectedYield: 2500,
    marketPrice: 150,
    waterNeeds: "High humidity",
    demand: "High",
    description: "Fast-cycle mushroom crop with strong local demand.",
    cultivationSteps: [
      "Substrate preparation",
      "Spawning and incubation",
      "Fruiting with humidity control",
      "Harvest clusters"
    ],
    seasonalInfo: "Year-round under controlled conditions.",
    pestManagement: ["Hygiene and ventilation"],
    harvestTimeline: ["Harvest starts in ~30-40 days"],
    soilTypes: ["Straw-based substrate"],
    climate: { temperatureC: [20, 28], rainfallMm: [0, 0], season: "Year-round (controlled)" },
    irrigation: "Maintain humidity; mist as required",
    fertilizerGuideline: "Quality substrate and spawn",
    pestsAndDiseases: "Molds; managed by hygiene",
    stages: [
      { name: "Spawn run", daysFromStart: 0 },
      { name: "Pinning", daysFromStart: 18 },
      { name: "Harvest", daysFromStart: 40 }
    ],
    notes: "Yield based on biological efficiency reports; price from wholesale listings."
  },
  "leeks-short": {
    duration: "90-120 days",
    durationDays: 105,
    investmentCost: 50000,
    expectedYield: 12000,
    marketPrice: 160,
    waterNeeds: "Medium",
    demand: "High",
    description: "Cool-season crop for urban and export markets.",
    cultivationSteps: [
      "Nursery raising and transplanting",
      "Earthing up for blanching",
      "Balanced fertilization",
      "Regular irrigation",
      "Harvest at 1 inch diameter"
    ],
    seasonalInfo: "Cool season; typically 90-120 days to maturity.",
    pestManagement: ["Thrips and rust - IPM"],
    harvestTimeline: ["Harvest at 90-120 days"],
    soilTypes: ["Deep loam", "pH 6.5-7.0"],
    climate: { temperatureC: [12, 20], rainfallMm: [400, 700], season: "Rabi/Winter" },
    irrigation: "Regular irrigation; avoid water stress",
    fertilizerGuideline: "Split N with balanced P and K",
    pestsAndDiseases: "Thrips, rust; IPM recommended",
    stages: [
      { name: "Nursery", daysFromStart: 0 },
      { name: "Transplant", daysFromStart: 35 },
      { name: "Blanching", daysFromStart: 70 },
      { name: "Harvest", daysFromStart: 105 }
    ],
    notes: "Yield based on national productivity stats; price based on market listing."
  },
  "sweet-pea-vegetable-short": {
    duration: "70-90 days",
    durationDays: 80,
    investmentCost: 30000,
    expectedYield: 5000,
    marketPrice: 50,
    waterNeeds: "Medium",
    demand: "High",
    description: "Vegetable pea with strong winter demand.",
    cultivationSteps: [
      "Fine tilth preparation",
      "Direct sowing",
      "Rhizobium seed treatment",
      "Irrigation at flowering and pod filling",
      "Harvest tender pods"
    ],
    seasonalInfo: "Cool-season crop; best in Rabi.",
    pestManagement: ["Pod borer - IPM"],
    harvestTimeline: ["Harvest starts around 60-70 days"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [12, 22], rainfallMm: [400, 700], season: "Rabi/Winter" },
    irrigation: "Irrigation at flowering and pod filling",
    fertilizerGuideline: "Balanced NPK with Rhizobium inoculation",
    pestsAndDiseases: "Pod borer; IPM recommended",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Flowering", daysFromStart: 40 },
      { name: "Pod filling", daysFromStart: 60 },
      { name: "Harvest", daysFromStart: 80 }
    ],
    notes: "Yield based on ICAR garden pea cultivar data; price from mandi averages."
  },
  "asparagus-short": {
    duration: "90-120 days",
    durationDays: 105,
    investmentCost: 40000,
    expectedYield: 2023,
    marketPrice: 350,
    waterNeeds: "Medium",
    demand: "Very High",
    description: "Premium vegetable with strong hotel and retail demand.",
    cultivationSteps: [
      "Sandy loam soil preparation",
      "Crown planting",
      "Organic-rich nutrition",
      "Drip irrigation",
      "Harvest tender spears"
    ],
    seasonalInfo: "Short-term tender harvest window in cool season.",
    pestManagement: ["Crown rot prevention", "Sanitation and IPM"],
    harvestTimeline: ["Harvest tender spears in 90-120 days (short-term phase)"],
    soilTypes: ["Sandy loam", "Well-drained"],
    climate: { temperatureC: [15, 25], rainfallMm: [300, 600], season: "Rabi/Winter" },
    irrigation: "Drip irrigation; avoid waterlogging",
    fertilizerGuideline: "Organic matter + balanced NPK",
    pestsAndDiseases: "Crown rot; manage with drainage",
    stages: [
      { name: "Planting", daysFromStart: 0 },
      { name: "Establishment", daysFromStart: 45 },
      { name: "Harvest", daysFromStart: 105 }
    ],
    notes: "Yield based on international production references; price from retail listings."
  },
  "red-cabbage-short": {
    duration: "90-110 days",
    durationDays: 100,
    investmentCost: 38000,
    expectedYield: 16188,
    marketPrice: 100,
    waterNeeds: "Medium",
    demand: "High",
    description: "Cool-season brassica with high urban demand.",
    cultivationSteps: [
      "Nursery raising and transplanting",
      "FYM + split NPK",
      "Regular irrigation",
      "Harvest firm heads"
    ],
    seasonalInfo: "Cool season crop; best in Rabi.",
    pestManagement: ["Cabbage butterfly - IPM"],
    harvestTimeline: ["Harvest 90-110 days after transplanting"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [15, 25], rainfallMm: [500, 800], season: "Rabi/Winter" },
    irrigation: "Regular irrigation; avoid water stress",
    fertilizerGuideline: "FYM + NPK in splits",
    pestsAndDiseases: "Cabbage butterfly, aphids; IPM",
    stages: [
      { name: "Nursery", daysFromStart: 0 },
      { name: "Transplant", daysFromStart: 25 },
      { name: "Head formation", daysFromStart: 60 },
      { name: "Harvest", daysFromStart: 100 }
    ],
    notes: "Yield based on red cabbage productivity data; price from retail listings."
  },
  "chinese-cabbage-short": {
    duration: "60-80 days",
    durationDays: 70,
    investmentCost: 38000,
    expectedYield: 8094,
    marketPrice: 84,
    waterNeeds: "Medium",
    demand: "High",
    description: "Fast-growing brassica for urban markets.",
    cultivationSteps: [
      "Fine tilth preparation",
      "Nursery transplanting",
      "Split NPK application",
      "Light frequent irrigation",
      "Harvest at head formation"
    ],
    seasonalInfo: "Cool season crop with quick turnover.",
    pestManagement: ["Aphids and flea beetles - IPM"],
    harvestTimeline: ["Harvest at 60-80 days"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [15, 25], rainfallMm: [400, 700], season: "Rabi/Winter" },
    irrigation: "Light frequent irrigation",
    fertilizerGuideline: "Balanced NPK with organic matter",
    pestsAndDiseases: "Aphids, flea beetles; IPM",
    stages: [
      { name: "Nursery", daysFromStart: 0 },
      { name: "Transplant", daysFromStart: 20 },
      { name: "Harvest", daysFromStart: 70 }
    ],
    notes: "Yield based on Chinese cabbage yield references; price from retail listings."
  },
  "dill-leaves-short": {
    duration: "45-60 days",
    durationDays: 55,
    investmentCost: 30000,
    expectedYield: 4047,
    marketPrice: 132,
    waterNeeds: "Medium",
    demand: "High",
    description: "Leafy herb with culinary and export demand.",
    cultivationSteps: [
      "Direct sowing",
      "Light nitrogen application",
      "Irrigation every 4-5 days",
      "Harvest tender leaves"
    ],
    seasonalInfo: "Cool season leafy herb; quick harvest.",
    pestManagement: ["Aphids - IPM"],
    harvestTimeline: ["Harvest at 45-60 days"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [15, 25], rainfallMm: [400, 700], season: "Rabi/Winter" },
    irrigation: "Light frequent irrigation",
    fertilizerGuideline: "Light N with organic matter",
    pestsAndDiseases: "Aphids; IPM recommended",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Vegetative", daysFromStart: 25 },
      { name: "Harvest", daysFromStart: 55 }
    ],
    notes: "Yield based on herb yield references; price from retail listings."
  },
  "rocket-leaves-short": {
    duration: "30-45 days",
    durationDays: 40,
    investmentCost: 32000,
    expectedYield: 3035,
    marketPrice: 830,
    waterNeeds: "Medium",
    demand: "High",
    description: "Fast-cycle leafy green for urban health markets.",
    cultivationSteps: [
      "Direct sowing on fine tilth",
      "Frequent irrigation",
      "Harvest young leaves",
      "Multiple cuttings possible"
    ],
    seasonalInfo: "Cool season crop with very short cycle.",
    pestManagement: ["Aphids - IPM"],
    harvestTimeline: ["Harvest at 30-45 days"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [15, 25], rainfallMm: [400, 700], season: "Rabi/Winter" },
    irrigation: "Frequent irrigation",
    fertilizerGuideline: "Light N application",
    pestsAndDiseases: "Aphids; IPM recommended",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Vegetative", daysFromStart: 20 },
      { name: "Harvest", daysFromStart: 40 }
    ],
    notes: "Yield based on rocket/arugula seed yield references; price from retail listings."
  },
  "mustard-greens-short": {
    duration: "30-45 days",
    durationDays: 40,
    investmentCost: 30000,
    expectedYield: 4047,
    marketPrice: 450,
    waterNeeds: "Medium",
    demand: "High",
    description: "Leafy mustard with strong local demand.",
    cultivationSteps: [
      "Direct sowing",
      "Light irrigation",
      "Leaf plucking",
      "Multiple cuttings"
    ],
    seasonalInfo: "Cool season leafy crop with quick harvest.",
    pestManagement: ["Aphids - IPM"],
    harvestTimeline: ["Harvest at 30-45 days"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [15, 25], rainfallMm: [400, 700], season: "Rabi/Winter" },
    irrigation: "Light frequent irrigation",
    fertilizerGuideline: "Light N application",
    pestsAndDiseases: "Aphids; IPM recommended",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Vegetative", daysFromStart: 20 },
      { name: "Harvest", daysFromStart: 40 }
    ],
    notes: "Yield based on mustard greens yield references; price from retail listings."
  },
  "spring-onion-short": {
    duration: "60-80 days",
    durationDays: 70,
    investmentCost: 35000,
    expectedYield: 10117,
    marketPrice: 115,
    waterNeeds: "Medium",
    demand: "High",
    description: "High-demand crop for retail and food service.",
    cultivationSteps: [
      "Nursery raising or direct sowing",
      "Regular irrigation",
      "Balanced fertilization",
      "Harvest at pencil thickness"
    ],
    seasonalInfo: "Cool season; multiple harvests possible.",
    pestManagement: ["Thrips - IPM"],
    harvestTimeline: ["Harvest at 60-80 days"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [15, 25], rainfallMm: [400, 700], season: "Rabi/Winter" },
    irrigation: "Regular irrigation; avoid water stress",
    fertilizerGuideline: "Balanced NPK in splits",
    pestsAndDiseases: "Thrips; IPM recommended",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Vegetative", daysFromStart: 35 },
      { name: "Harvest", daysFromStart: 70 }
    ],
    notes: "Yield based on expected spring onion productivity; price from retail listings."
  },
  "baby-carrot-short": {
    duration: "60-75 days",
    durationDays: 68,
    investmentCost: 35000,
    expectedYield: 6070,
    marketPrice: 84,
    waterNeeds: "Medium",
    demand: "High",
    description: "Short-duration carrot for premium markets.",
    cultivationSteps: [
      "Loose sandy soil preparation",
      "Direct sowing",
      "Light irrigation",
      "Harvest young roots"
    ],
    seasonalInfo: "Cool season crop; best in Rabi.",
    pestManagement: ["Root fly - IPM"],
    harvestTimeline: ["Harvest at 60-75 days"],
    soilTypes: ["Sandy loam", "Loose soil"],
    climate: { temperatureC: [15, 25], rainfallMm: [400, 700], season: "Rabi/Winter" },
    irrigation: "Light frequent irrigation",
    fertilizerGuideline: "Balanced NPK with organic matter",
    pestsAndDiseases: "Root fly; IPM recommended",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Root development", daysFromStart: 35 },
      { name: "Harvest", daysFromStart: 68 }
    ],
    notes: "Yield based on expected baby carrot yields; price from retail listings."
  },
  "radicchio-short": {
    duration: "80-100 days",
    durationDays: 90,
    investmentCost: 40000,
    expectedYield: 5463,
    marketPrice: 1080,
    waterNeeds: "Medium",
    demand: "High",
    description: "Premium salad crop with strong urban demand.",
    cultivationSteps: [
      "Nursery raising and transplanting",
      "Balanced fertilization",
      "Regular irrigation",
      "Harvest compact heads"
    ],
    seasonalInfo: "Cool season crop; performs best in mild winters.",
    pestManagement: ["Aphids - IPM"],
    harvestTimeline: ["Harvest at 80-100 days"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [12, 22], rainfallMm: [400, 700], season: "Rabi/Winter" },
    irrigation: "Regular irrigation; avoid water stress",
    fertilizerGuideline: "FYM + NPK in splits",
    pestsAndDiseases: "Aphids; IPM recommended",
    stages: [
      { name: "Nursery", daysFromStart: 0 },
      { name: "Transplant", daysFromStart: 25 },
      { name: "Harvest", daysFromStart: 90 }
    ],
    notes: "Yield based on radicchio productivity references; price from retail listings."
  },
  "endive-short": {
    duration: "70-90 days",
    durationDays: 80,
    investmentCost: 38000,
    expectedYield: 5585,
    marketPrice: 280,
    waterNeeds: "Medium",
    demand: "High",
    description: "Salad green with steady urban demand.",
    cultivationSteps: [
      "Fine tilth preparation",
      "Nursery transplanting",
      "Balanced fertilization",
      "Regular irrigation",
      "Harvest rosettes"
    ],
    seasonalInfo: "Cool season crop with moderate duration.",
    pestManagement: ["Aphids - IPM"],
    harvestTimeline: ["Harvest at 70-90 days"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [12, 22], rainfallMm: [400, 700], season: "Rabi/Winter" },
    irrigation: "Regular irrigation",
    fertilizerGuideline: "Balanced NPK with organic matter",
    pestsAndDiseases: "Aphids; IPM recommended",
    stages: [
      { name: "Nursery", daysFromStart: 0 },
      { name: "Transplant", daysFromStart: 25 },
      { name: "Harvest", daysFromStart: 80 }
    ],
    notes: "Yield based on endive yield statistics; price from retail listings."
  },
  "fennel-leaves-short": {
    duration: "70-90 days",
    durationDays: 80,
    investmentCost: 30000,
    expectedYield: 2631,
    marketPrice: 80,
    waterNeeds: "Medium",
    demand: "High",
    description: "Aromatic leafy herb used in culinary and export markets.",
    cultivationSteps: [
      "Fine tilth preparation",
      "Direct sowing",
      "Light irrigation",
      "Leaf harvesting in cuttings"
    ],
    seasonalInfo: "Cool season herb with multiple cuttings.",
    pestManagement: ["Aphids - IPM"],
    harvestTimeline: ["Harvest in 70-90 days; multiple cuttings possible"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [15, 25], rainfallMm: [400, 700], season: "Rabi/Winter" },
    irrigation: "Light frequent irrigation",
    fertilizerGuideline: "FYM + light N application",
    pestsAndDiseases: "Aphids; IPM recommended",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Vegetative", daysFromStart: 30 },
      { name: "Harvest", daysFromStart: 80 }
    ],
    notes: "Yield approximated from leafy herb yields; price from market listing for fennel leaf."
  },
  "swiss-chard-short": {
    duration: "60-80 days",
    durationDays: 70,
    investmentCost: 35000,
    expectedYield: 12142,
    marketPrice: 342,
    waterNeeds: "Medium",
    demand: "High",
    description: "Nutrient-rich leafy vegetable for urban health markets.",
    cultivationSteps: [
      "Fine tilth preparation",
      "Direct sowing or transplant",
      "Balanced fertilization",
      "Regular irrigation",
      "Harvest outer leaves"
    ],
    seasonalInfo: "Cool season crop; harvest over a long window.",
    pestManagement: ["Leaf miners and aphids - IPM"],
    harvestTimeline: ["Harvest starts around 45-60 days; multiple pickings"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [15, 25], rainfallMm: [400, 700], season: "Rabi/Winter" },
    irrigation: "Regular irrigation; avoid water stress",
    fertilizerGuideline: "FYM + NPK in splits",
    pestsAndDiseases: "Leaf miners, aphids; IPM recommended",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Vegetative", daysFromStart: 30 },
      { name: "Harvest", daysFromStart: 70 }
    ],
    notes: "Yield based on Swiss chard productivity guidance; price from retail listing."
  },
  "coriander-leaf-export-short": {
    duration: "30-40 days",
    durationDays: 35,
    investmentCost: 25000,
    expectedYield: 2631,
    marketPrice: 141,
    waterNeeds: "Medium",
    demand: "High",
    description: "Short-duration coriander for fresh leaf exports.",
    cultivationSteps: [
      "Fine tilth preparation",
      "Direct sowing",
      "Light irrigation",
      "Harvest tender leaves"
    ],
    seasonalInfo: "Quick leafy crop; multiple cuttings possible.",
    pestManagement: ["Aphids - IPM"],
    harvestTimeline: ["Harvest in 30-40 days"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [15, 25], rainfallMm: [400, 700], season: "Rabi/Winter" },
    irrigation: "Light frequent irrigation",
    fertilizerGuideline: "Light N application with organic matter",
    pestsAndDiseases: "Aphids; IPM recommended",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Vegetative", daysFromStart: 20 },
      { name: "Harvest", daysFromStart: 35 }
    ],
    notes: "Leaf yield based on coriander leaf yield references; price from retail listing."
  },
  "fenugreek-leaf-short": {
    duration: "25-35 days",
    durationDays: 30,
    investmentCost: 25000,
    expectedYield: 3035,
    marketPrice: 185,
    waterNeeds: "Medium",
    demand: "High",
    description: "Quick leafy methi crop with strong urban demand.",
    cultivationSteps: [
      "Direct sowing on fine tilth",
      "Light irrigation",
      "Leaf cutting harvests",
      "Multiple cuttings"
    ],
    seasonalInfo: "Cool season leafy crop; best in Rabi.",
    pestManagement: ["Aphids - IPM"],
    harvestTimeline: ["Harvest in 25-35 days with multiple cuttings"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [15, 25], rainfallMm: [400, 700], season: "Rabi/Winter" },
    irrigation: "Light frequent irrigation",
    fertilizerGuideline: "FYM + light N application",
    pestsAndDiseases: "Aphids; IPM recommended",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Vegetative", daysFromStart: 15 },
      { name: "Harvest", daysFromStart: 30 }
    ],
    notes: "Leaf yield based on fenugreek green leaf yield references; price from retail listing."
  },
  "drumstick-leaves-short": {
    duration: "90-120 days",
    durationDays: 105,
    investmentCost: 60000,
    expectedYield: 25000,
    marketPrice: 187,
    waterNeeds: "Medium",
    demand: "High",
    description: "High-value leaf crop used in culinary and nutrition markets.",
    cultivationSteps: [
      "Planting of cuttings",
      "Regular irrigation",
      "Nutrient management",
      "Leaf plucking harvests"
    ],
    seasonalInfo: "Leaf harvests possible multiple times after establishment.",
    pestManagement: ["Leaf spot and caterpillars - IPM"],
    harvestTimeline: ["First leaf harvest around 90-120 days"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [20, 32], rainfallMm: [600, 900], season: "Kharif/Rabi" },
    irrigation: "Regular irrigation; avoid water stress",
    fertilizerGuideline: "FYM + balanced NPK",
    pestsAndDiseases: "Leaf spot; IPM recommended",
    stages: [
      { name: "Planting", daysFromStart: 0 },
      { name: "Vegetative", daysFromStart: 60 },
      { name: "Harvest", daysFromStart: 105 }
    ],
    notes: "Leaf yield based on moringa leaf yield per acre references; price from retail listing."
  },
  "mint-export-grade-short": {
    duration: "90-120 days",
    durationDays: 105,
    investmentCost: 50000,
    expectedYield: 4857,
    marketPrice: 325,
    waterNeeds: "Medium",
    demand: "Very High",
    description: "Export-grade mint with strong culinary and pharma demand.",
    cultivationSteps: [
      "Rooted cuttings planting",
      "High organic matter",
      "Regular irrigation",
      "Multiple cuttings"
    ],
    seasonalInfo: "Multiple cuttings possible within 90-120 days.",
    pestManagement: ["Leaf miner - IPM"],
    harvestTimeline: ["First cutting around 60 days; multiple cuttings"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [20, 30], rainfallMm: [600, 900], season: "Kharif/Rabi" },
    irrigation: "Regular irrigation; avoid water stress",
    fertilizerGuideline: "FYM + split nitrogen",
    pestsAndDiseases: "Leaf miner; IPM recommended",
    stages: [
      { name: "Planting", daysFromStart: 0 },
      { name: "Vegetative", daysFromStart: 30 },
      { name: "First cutting", daysFromStart: 60 },
      { name: "Harvest", daysFromStart: 105 }
    ],
    notes: "Yield based on Mentha arvensis fresh herbage data; price from market listing."
  },
  "spinach-beet-short": {
    duration: "45-60 days",
    durationDays: 55,
    investmentCost: 30000,
    expectedYield: 10000,
    marketPrice: 31,
    waterNeeds: "Medium",
    demand: "High",
    description: "Leafy beet crop for quick harvests.",
    cultivationSteps: [
      "Direct sowing",
      "Light frequent irrigation",
      "Leaf harvesting",
      "Multiple cuttings"
    ],
    seasonalInfo: "Cool season crop; quick harvest cycle.",
    pestManagement: ["Leaf miner - IPM"],
    harvestTimeline: ["Harvest at 45-60 days"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [15, 25], rainfallMm: [400, 700], season: "Rabi/Winter" },
    irrigation: "Light frequent irrigation",
    fertilizerGuideline: "FYM + light N application",
    pestsAndDiseases: "Leaf miner; IPM recommended",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Vegetative", daysFromStart: 25 },
      { name: "Harvest", daysFromStart: 55 }
    ],
    notes: "Yield based on spinach yield references; price from retail listing."
  },
  "tender-okra-export-short": {
    duration: "60-90 days",
    durationDays: 75,
    investmentCost: 40000,
    expectedYield: 5463,
    marketPrice: 35,
    waterNeeds: "Medium",
    demand: "High",
    description: "Export-grade okra with steady demand.",
    cultivationSteps: [
      "Direct sowing",
      "Balanced fertilization",
      "Irrigation every 5-7 days",
      "Harvest tender pods regularly"
    ],
    seasonalInfo: "Suitable in Kharif and summer; harvest starts early.",
    pestManagement: ["Shoot and fruit borer - IPM"],
    harvestTimeline: ["Harvest starts around 45-55 days"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [22, 32], rainfallMm: [600, 900], season: "Kharif/Summer" },
    irrigation: "Irrigation every 5-7 days",
    fertilizerGuideline: "FYM + NPK in splits",
    pestsAndDiseases: "YVMV, borer; IPM recommended",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Flowering", daysFromStart: 35 },
      { name: "Harvest", daysFromStart: 75 }
    ],
    notes: "Yield based on okra productivity data; price from retail listing."
  },
  "baby-bottle-gourd-short": {
    duration: "70-90 days",
    durationDays: 80,
    investmentCost: 35000,
    expectedYield: 11656,
    marketPrice: 58,
    waterNeeds: "Medium",
    demand: "High",
    description: "High-yield gourd crop for fresh markets.",
    cultivationSteps: [
      "Land prep and sowing",
      "Trellis or bower training",
      "Regular irrigation",
      "Harvest immature fruits"
    ],
    seasonalInfo: "Suitable for Kharif and summer; harvest starts early.",
    pestManagement: ["Fruit fly - IPM"],
    harvestTimeline: ["Harvest at 70-90 days"],
    soilTypes: ["Loam", "Well-drained"],
    climate: { temperatureC: [22, 32], rainfallMm: [600, 900], season: "Kharif/Summer" },
    irrigation: "Regular irrigation",
    fertilizerGuideline: "FYM + balanced NPK",
    pestsAndDiseases: "Fruit fly; IPM recommended",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Vining", daysFromStart: 25 },
      { name: "Harvest", daysFromStart: 80 }
    ],
    notes: "Yield based on ICAR-IARI bottle gourd yield; price from retail listing."
  },
  "baby-ridge-gourd-short": {
    duration: "70-90 days",
    durationDays: 80,
    investmentCost: 35000,
    expectedYield: 6475,
    marketPrice: 79,
    waterNeeds: "Medium",
    demand: "High",
    description: "Ridge gourd harvested at tender stage for premium markets.",
    cultivationSteps: [
      "Land prep and sowing",
      "Trellis or bower training",
      "Regular irrigation",
      "Harvest tender fruits"
    ],
    seasonalInfo: "Warm season crop; harvest starts early.",
    pestManagement: ["Fruit fly - IPM"],
    harvestTimeline: ["Harvest at 70-90 days"],
    soilTypes: ["Sandy loam", "Well-drained"],
    climate: { temperatureC: [22, 32], rainfallMm: [600, 900], season: "Kharif/Summer" },
    irrigation: "Regular irrigation",
    fertilizerGuideline: "FYM + balanced NPK",
    pestsAndDiseases: "Fruit fly, powdery mildew; IPM recommended",
    stages: [
      { name: "Sowing", daysFromStart: 0 },
      { name: "Vining", daysFromStart: 25 },
      { name: "Harvest", daysFromStart: 80 }
    ],
    notes: "Yield based on ICAR-IIVR ridge gourd yield; price from retail listing."
  }
};

const cropOverrides: Record<string, Partial<Crop>> = {
  ...shortTermOverrides
};

const buildCrop = (input: CropInput, category: keyof typeof categoryDefaults): Crop => {
  const base = categoryDefaults[category];
  const id = slugify(`${input.name}-${category}`);
  const override = cropOverrides[id] || {};
  const investmentCost = override.investmentCost ?? base.investmentCost;
  const expectedYield = override.expectedYield ?? base.expectedYield;
  const marketPrice = override.marketPrice ?? base.marketPrice;
  const totalRevenue = expectedYield * marketPrice;
  const netProfit = totalRevenue - investmentCost;
  const avgROIPercent = investmentCost > 0 ? Math.round((netProfit / investmentCost) * 100) : 0;

  return {
    id,
    name: input.name,
    category,
    duration: override.duration ?? base.duration,
    durationDays: override.durationDays ?? base.durationDays,
    profitPerAcre: Math.max(0, netProfit),
    investmentCost,
    expectedYield,
    marketPrice,
    waterNeeds: override.waterNeeds ?? base.waterNeeds,
    demand: override.demand ?? base.demand,
    image: override.image ?? imageUrl(`${input.name} crop`),
    description: override.description ?? `High-demand ${input.name} suitable for ${input.district}.`,
    cultivationSteps: override.cultivationSteps ?? base.cultivationSteps,
    seasonalInfo: override.seasonalInfo ?? base.seasonalInfo,
    pestManagement: override.pestManagement ?? base.pestManagement,
    harvestTimeline: override.harvestTimeline ?? base.harvestTimeline,
    soilTypes: override.soilTypes ?? base.soilTypes,
    climate: override.climate ?? base.climate,
    irrigation: override.irrigation ?? base.irrigation,
    fertilizerGuideline: override.fertilizerGuideline ?? base.fertilizerGuideline,
    pestsAndDiseases: override.pestsAndDiseases ?? base.pestsAndDiseases,
    stages: override.stages ?? base.stages,
    roiDefaults: {
      landAreaAcre: 1,
      investmentPerAcreINR: investmentCost,
      expectedYieldPerAcre: expectedYield,
      pricePerUnitINR: marketPrice,
      unit: base.unit
    },
    quickReturns: {
      totalRevenuePerAcreINR: totalRevenue,
      netProfitPerAcreINR: Math.max(0, netProfit),
      avgROIPercent
    },
    district: input.district,
    majorStates: input.majorStates,
    notes: override.notes
  };
};


const shortTermInputs: CropInput[] = [
  { name: "Broccoli", district: "Ranga Reddy", majorStates: "Maharashtra" },
  { name: "Lettuce (Iceberg)", district: "Vikarabad", majorStates: "Maharashtra" },
  { name: "Lettuce (Romaine)", district: "Medak", majorStates: "Karnataka" },
  { name: "Zucchini", district: "Medchal", majorStates: "Karnataka" },
  { name: "Cherry Tomato", district: "Nalgonda", majorStates: "Maharashtra" },
  { name: "Baby Corn", district: "Warangal", majorStates: "Karnataka" },
  { name: "Coloured Capsicum", district: "Sangareddy", majorStates: "Himachal Pradesh" },
  { name: "Kale", district: "Vikarabad", majorStates: "Maharashtra" },
  { name: "Celery", district: "Medchal", majorStates: "Maharashtra" },
  { name: "Parsley", district: "Ranga Reddy", majorStates: "Karnataka" },
  { name: "Basil (Sweet)", district: "Medchal", majorStates: "Karnataka" },
  { name: "Basil (Thai)", district: "Medchal", majorStates: "Karnataka" },
  { name: "Bok Choy", district: "Hyderabad Periphery", majorStates: "NE India" },
  { name: "Pak Choi", district: "Hyderabad Periphery", majorStates: "NE India" },
  { name: "Baby Spinach", district: "Medak", majorStates: "Karnataka" },
  { name: "Microgreens (Mixed)", district: "Hyderabad", majorStates: "Metro imports" },
  { name: "Button Mushroom", district: "Karimnagar", majorStates: "Himachal Pradesh" },
  { name: "Oyster Mushroom", district: "Peddapalli", majorStates: "Odisha" },
  { name: "Leeks", district: "Vikarabad", majorStates: "Jammu & Kashmir" },
  { name: "Sweet Pea (Vegetable)", district: "Adilabad", majorStates: "Himachal Pradesh" },
  { name: "Asparagus", district: "Vikarabad", majorStates: "Punjab" },
  { name: "Red Cabbage", district: "Medak", majorStates: "Karnataka" },
  { name: "Chinese Cabbage", district: "Ranga Reddy", majorStates: "NE India" },
  { name: "Iceberg Lettuce", district: "Sangareddy", majorStates: "Maharashtra" },
  { name: "Dill Leaves", district: "Medchal", majorStates: "Punjab" },
  { name: "Rocket Leaves", district: "Vikarabad", majorStates: "Maharashtra" },
  { name: "Mustard Greens", district: "Medak", majorStates: "Punjab" },
  { name: "Spring Onion", district: "Nalgonda", majorStates: "Maharashtra" },
  { name: "Baby Carrot", district: "Medak", majorStates: "Punjab" },
  { name: "Radicchio", district: "Sangareddy", majorStates: "Imports" },
  { name: "Endive", district: "Vikarabad", majorStates: "Imports" },
  { name: "Fennel Leaves", district: "Karimnagar", majorStates: "Gujarat" },
  { name: "Swiss Chard", district: "Medak", majorStates: "Maharashtra" },
  { name: "Coriander (leaf - export)", district: "Warangal", majorStates: "Karnataka" },
  { name: "Fenugreek (leaf)", district: "Sangareddy", majorStates: "Rajasthan" },
  { name: "Drumstick Leaves", district: "Karimnagar", majorStates: "Tamil Nadu" },
  { name: "Mint (export grade)", district: "Medchal", majorStates: "Uttar Pradesh" },
  { name: "Spinach Beet", district: "Medak", majorStates: "Punjab" },
  { name: "Tender Okra (export)", district: "Jangaon", majorStates: "Karnataka" },
  { name: "Baby Bottle Gourd", district: "Warangal", majorStates: "Karnataka" },
  { name: "Baby Ridge Gourd", district: "Karimnagar", majorStates: "Karnataka" },
  { name: "Tender Snake Gourd", district: "Nalgonda", majorStates: "Tamil Nadu" },
  { name: "Cherry Capsicum", district: "Sangareddy", majorStates: "Himachal Pradesh" },
  { name: "Mini Pumpkin", district: "Adilabad", majorStates: "Odisha" },
  { name: "Edamame (Green Soybean)", district: "Khammam", majorStates: "Madhya Pradesh" },
  { name: "Snow Peas", district: "Vikarabad", majorStates: "Himachal Pradesh" },
  { name: "Tender French Beans", district: "Medak", majorStates: "Karnataka" },
  { name: "Baby Beetroot", district: "Sangareddy", majorStates: "Punjab" },
  { name: "Salad Cucumber", district: "Ranga Reddy", majorStates: "Maharashtra" },
];

const mediumTermInputs: CropInput[] = [
  { name: "Grapes", district: "Vikarabad", majorStates: "Maharashtra" },
  { name: "Isabgol", district: "Medak", majorStates: "Gujarat" },
  { name: "Cumin", district: "Kamareddy", majorStates: "Gujarat" },
  { name: "Fennel", district: "Karimnagar", majorStates: "Gujarat" },
  { name: "Kabuli Chickpea", district: "Nizamabad", majorStates: "Madhya Pradesh" },
  { name: "Desi Chickpea", district: "Adilabad", majorStates: "Madhya Pradesh" },
  { name: "White Sesame", district: "Mahabubabad", majorStates: "Rajasthan" },
  { name: "Black Sesame", district: "Warangal", majorStates: "Odisha" },
  { name: "Niger Seed", district: "Jayashankar Bhupalpally", majorStates: "Odisha" },
  { name: "Coriander (seed)", district: "Nizamabad", majorStates: "Rajasthan" },
  { name: "Garlic", district: "Sangareddy", majorStates: "Madhya Pradesh" },
  { name: "Onion (export type)", district: "Nalgonda", majorStates: "Maharashtra" },
  { name: "Paprika Chilli", district: "Khammam", majorStates: "Karnataka" },
  { name: "Byadgi Chilli", district: "Mulugu", majorStates: "Karnataka" },
  { name: "Turmeric (high curcumin)", district: "Sangareddy", majorStates: "Andhra Pradesh" },
  { name: "Ginger (processing)", district: "Bhadradri", majorStates: "Kerala" },
  { name: "Soybean", district: "Khammam", majorStates: "Madhya Pradesh" },
  { name: "Guar", district: "Adilabad", majorStates: "Rajasthan" },
  { name: "Marigold (loose)", district: "Jagtial", majorStates: "Karnataka" },
  { name: "Tuberose", district: "Karimnagar", majorStates: "West Bengal" },
  { name: "Gerbera", district: "Medak", majorStates: "Karnataka" },
  { name: "Gladiolus", district: "Vikarabad", majorStates: "West Bengal" },
  { name: "Rose (cut flower)", district: "Sangareddy", majorStates: "Karnataka" },
  { name: "Sunflower", district: "Narayanpet", majorStates: "Karnataka" },
  { name: "Safflower", district: "Adilabad", majorStates: "Maharashtra" },
  { name: "Linseed", district: "Nirmal", majorStates: "Madhya Pradesh" },
  { name: "Mustard", district: "Kamareddy", majorStates: "Rajasthan" },
  { name: "Castor", district: "Mahabubnagar", majorStates: "Gujarat" },
  { name: "Black Gram", district: "Nizamabad", majorStates: "Uttar Pradesh" },
  { name: "Green Gram", district: "Adilabad", majorStates: "Odisha" },
  { name: "Red Gram", district: "Sangareddy", majorStates: "Maharashtra" },
  { name: "Horse Gram", district: "Nagarkurnool", majorStates: "Karnataka" },
  { name: "Cowpea (grain)", district: "Bhupalpally", majorStates: "Odisha" },
  { name: "Foxtail Millet", district: "Sangareddy", majorStates: "Karnataka" },
  { name: "Little Millet", district: "Adilabad", majorStates: "Chhattisgarh" },
  { name: "Proso Millet", district: "Medak", majorStates: "Madhya Pradesh" },
  { name: "Barnyard Millet", district: "Komaram Bheem", majorStates: "Uttarakhand" },
  { name: "Amaranthus (grain)", district: "Warangal", majorStates: "Maharashtra" },
  { name: "Quinoa", district: "Vikarabad", majorStates: "Imports" },
  { name: "Chia Seed", district: "Medak", majorStates: "Imports" },
  { name: "Fenugreek (seed)", district: "Karimnagar", majorStates: "Rajasthan" },
  { name: "Aniseed", district: "Nizamabad", majorStates: "Gujarat" },
  { name: "Caraway", district: "Sangareddy", majorStates: "Himachal Pradesh" },
  { name: "Poppy (regulated)", district: "Pilot areas", majorStates: "Rajasthan" },
  { name: "Saffron (protected)", district: "Vikarabad", majorStates: "Jammu & Kashmir" },
  { name: "Stevia (annual)", district: "Medak", majorStates: "Karnataka" },
  { name: "Industrial Maize", district: "Khammam", majorStates: "Bihar" },
  { name: "Sweet Sorghum", district: "Narayanpet", majorStates: "Maharashtra" },
  { name: "Industrial Barley", district: "Vikarabad", majorStates: "Rajasthan" },
];

const longTermInputs: CropInput[] = [
  { name: "Oil Palm", district: "Khammam", majorStates: "Andhra Pradesh" },
  { name: "Cocoa", district: "Bhadradri", majorStates: "Kerala" },
  { name: "Avocado", district: "Vikarabad", majorStates: "Imports" },
  { name: "Dragon Fruit", district: "Medak", majorStates: "Vietnam (import)" },
  { name: "Blueberry", district: "Sangareddy", majorStates: "Imports" },
  { name: "Fig (Anjeer)", district: "Medak", majorStates: "Maharashtra" },
  { name: "Pomegranate", district: "Siddipet", majorStates: "Maharashtra" },
  { name: "Custard Apple (hybrid)", district: "Vikarabad", majorStates: "Maharashtra" },
  { name: "Amla", district: "Nagarkurnool", majorStates: "Uttar Pradesh" },
  { name: "Jamun", district: "Siddipet", majorStates: "Madhya Pradesh" },
  { name: "Moringa (leaf export)", district: "Karimnagar", majorStates: "Tamil Nadu" },
  { name: "Coconut (tall)", district: "Khammam", majorStates: "Kerala" },
  { name: "Arecanut (pilot)", district: "Bhadradri", majorStates: "Karnataka" },
  { name: "Clove (pilot)", district: "Adilabad", majorStates: "Kerala" },
  { name: "Nutmeg", district: "Bhadradri", majorStates: "Kerala" },
  { name: "Cinnamon", district: "Komaram Bheem", majorStates: "Kerala" },
  { name: "Vanilla", district: "Bhadradri", majorStates: "Kerala" },
  { name: "Coffee (robusta)", district: "Adilabad", majorStates: "Karnataka" },
  { name: "Rubber", district: "Bhadradri", majorStates: "Kerala" },
  { name: "Bamboo (industrial)", district: "Bhupalpally", majorStates: "Assam" },
  { name: "Teak (clonal)", district: "Adilabad", majorStates: "Maharashtra" },
  { name: "Melia Dubia", district: "Mulugu", majorStates: "Tamil Nadu" },
  { name: "Sandalwood", district: "Sangareddy", majorStates: "Karnataka" },
  { name: "Agarwood", district: "Komaram Bheem", majorStates: "Assam" },
  { name: "Lemongrass", district: "Warangal", majorStates: "Assam" },
  { name: "Vetiver", district: "Adilabad", majorStates: "Uttar Pradesh" },
  { name: "Patchouli", district: "Bhadradri", majorStates: "Karnataka" },
  { name: "Citronella", district: "Mulugu", majorStates: "Assam" },
  { name: "Aloe Vera", district: "Wanaparthy", majorStates: "Rajasthan" },
  { name: "Ashwagandha", district: "Nagarkurnool", majorStates: "Madhya Pradesh" },
  { name: "Kalmegh", district: "Bhupalpally", majorStates: "Odisha" },
  { name: "Shatavari", district: "Vikarabad", majorStates: "Maharashtra" },
  { name: "Safed Musli", district: "Sangareddy", majorStates: "Madhya Pradesh" },
  { name: "Stevia (perennial)", district: "Medak", majorStates: "Karnataka" },
  { name: "Jatropha", district: "Narayanpet", majorStates: "Chhattisgarh" },
  { name: "Pongamia", district: "Khammam", majorStates: "Karnataka" },
  { name: "Mahua", district: "Adilabad", majorStates: "Chhattisgarh" },
  { name: "Jackfruit", district: "Bhadradri", majorStates: "Kerala" },
  { name: "Rambutan", district: "Bhadradri", majorStates: "Kerala" },
  { name: "Mangosteen", district: "Bhadradri", majorStates: "Kerala" },
  { name: "Durian (pilot)", district: "Bhadradri", majorStates: "Imports" },
  { name: "Longan", district: "Bhadradri", majorStates: "Imports" },
  { name: "Litchi", district: "Adilabad", majorStates: "Bihar" },
  { name: "Macadamia", district: "Vikarabad", majorStates: "Imports" },
  { name: "Pistachio (pilot)", district: "Medak", majorStates: "Imports" },
  { name: "Walnut (pilot)", district: "Vikarabad", majorStates: "J&K" },
  { name: "Hazelnut", district: "Sangareddy", majorStates: "Imports" },
  { name: "Chestnut", district: "Adilabad", majorStates: "Himachal Pradesh" },
  { name: "Date Palm", district: "Nalgonda", majorStates: "Rajasthan" },
];

// Short-Term Crops
const shortTermCrops: Crop[] = shortTermInputs.map((input) => buildCrop(input, "short"));

// Medium-Term Crops
const mediumTermCrops: Crop[] = mediumTermInputs.map((input) => buildCrop(input, "medium"));

// Long-Term Crops
const longTermCrops: Crop[] = longTermInputs.map((input) => buildCrop(input, "long"));

// Combined Crop Data
export const cropData: Crop[] = [
  ...shortTermCrops,
  ...mediumTermCrops,
  ...longTermCrops
];

// Utility to Filter
export const getCropsByCategory = (category: 'short' | 'medium' | 'long') => {
  return cropData.filter(crop => crop.category === category);
};

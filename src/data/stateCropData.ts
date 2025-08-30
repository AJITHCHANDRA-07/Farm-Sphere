export interface StateCropData {
  state: string;
  majorCrops: CropDetail[];
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
        returnRangeINR: { min: 300000, max: 300000 },
        notes: "Highly volatile — off-season polyhouse production fetches premiums. Example season highs reported in local news.",
        sources: ["agri.telangana.gov.in", "The Times of India", "Agri Farming"]
      },
      {
        id: "tel_paddy",
        name: "Paddy (Rice)",
        soilTypes: ["Alluvial", "Clay-loam", "Well-leveled paddies"],
        climate: { temperatureC: [20, 32], rainfallMm: [1000, 2000], season: "Monsoon", notes: "Water-sufficient zones best" },
        irrigation: "Flood/Basin / canal irrigation (many districts irrigated)",
        fertilizerGuideline: "Basal NPK + urea splits; Zn & S where deficient",
        pestsAndDiseases: "Blast, BLB, stem borers",
        stages: [
          { name: "Nursery", daysFromStart: 0 },
          { name: "Transplanting", daysFromStart: 25 },
          { name: "Tillering", daysFromStart: 45 },
          { name: "Harvest", daysFromStart: 120 }
        ],
        investmentRangeINR: { min: 20000, max: 40000 },
        returnRangeINR: { min: 40000, max: 80000 },
        notes: "Varies by planting method (transplant vs direct seeding) and MSP.",
        sources: ["agri.telangana.gov.in", "AgriTech"]
      },
      {
        id: "tel_cotton",
        name: "Cotton",
        soilTypes: ["Black regur", "Red loams"],
        climate: { temperatureC: [20, 32], rainfallMm: [600, 900], season: "Kharif", notes: "Bt varieties common" },
        irrigation: "Rainfed with protective irrigations in some pockets; irrigated where available",
        fertilizerGuideline: "High N demand, split doses; potash for lint",
        pestsAndDiseases: "Heliothis, bollworm (Bt reduces damage but monitor secondary pests)",
        stages: [
          { name: "Sowing", daysFromStart: 0 },
          { name: "Flowering", daysFromStart: 50 },
          { name: "Boll maturity", daysFromStart: 120 },
          { name: "Harvest", daysFromStart: 150 }
        ],
        investmentRangeINR: { min: 30000, max: 60000 },
        returnRangeINR: { min: 60000, max: 120000 },
        notes: "Returns depend on lint price and yield. Government/MSP influences and Bt adoption affect input patterns.",
        sources: ["AgriTech", "angrau.ac.in"]
      }
    ]
  },
  {
    state: "Andhra Pradesh",
    majorCrops: [
      {
        id: "ap_paddy",
        name: "Rice (Paddy)",
        soilTypes: ["Delta alluvial soils", "Well-leveled paddies"],
        climate: { temperatureC: [20, 32], rainfallMm: [800, 1500], season: "Monsoon/Rabi (coastal deltas)", notes: "High irrigation availability in Godavari/Krishna deltas" },
        irrigation: "Flood/canal/pump irrigation in deltas",
        fertilizerGuideline: "Basal NPK + urea splits; Zn & S supplements",
        pestsAndDiseases: "Stem borer, blast, bacterial blight",
        stages: [
          { name: "Nursery", daysFromStart: 0 },
          { name: "Transplant", daysFromStart: 25 },
          { name: "Tillering", daysFromStart: 45 },
          { name: "Harvest", daysFromStart: 120 }
        ],
        investmentRangeINR: { min: 20000, max: 35000 },
        returnRangeINR: { min: 50000, max: 120000 },
        notes: "Major export & domestic staple; consult ANGRAU for district-specific yields.",
        sources: ["angrau.ac.in", "AgriTech"]
      },
      {
        id: "ap_mango",
        name: "Mango (Alphonso & local varieties)",
        soilTypes: ["Well-drained loam"],
        climate: { temperatureC: [24, 35], rainfallMm: [700, 1400], season: "Tropical / Dry flower period needed", notes: "Premium varieties give export returns" },
        irrigation: "Moderate; critical during flowering & fruit set",
        fertilizerGuideline: "NPK + FYM; potassium during fruiting",
        pestsAndDiseases: "Fruit fly, hopper, anthracnose",
        stages: [
          { name: "Planting", daysFromStart: 0 },
          { name: "Vegetative", daysFromStart: 365 },
          { name: "Flowering", daysFromStart: 1095 },
          { name: "Harvest", daysFromStart: 1460 }
        ],
        investmentRangeINR: { min: 75000, max: 150000 },
        returnRangeINR: { min: 0, max: 0 },
        notes: "Returns vary widely by variety & export access; leave return blank to compute from variety & market price.",
        sources: ["angrau.ac.in", "Agri Farming"]
      },
      {
        id: "ap_sugarcane",
        name: "Sugarcane",
        soilTypes: ["Deep loam", "Alluvial"],
        climate: { temperatureC: [20, 35], rainfallMm: [800, 1500], season: "Perennial/regional", notes: "Water-intensive" },
        irrigation: "High – canal / pump irrigation needed",
        fertilizerGuideline: "High N & K; FYM",
        pestsAndDiseases: "Ratoon stunting, borers",
        stages: [
          { name: "Planting", daysFromStart: 0 },
          { name: "Growth", daysFromStart: 180 },
          { name: "Maturity", daysFromStart: 360 },
          { name: "Harvest", daysFromStart: 365 }
        ],
        investmentRangeINR: { min: 80000, max: 120000 },
        returnRangeINR: { min: 85000, max: 100000 },
        notes: "Returns sometimes barely cover cost depending on mill payments; check local mill procurement.",
        sources: ["angrau.ac.in", "The Times of India"]
      }
    ]
  },
  {
    state: "Maharashtra",
    majorCrops: [
      {
        id: "mh_cotton",
        name: "Cotton",
        soilTypes: ["Black cotton soil", "Red loams"],
        climate: { temperatureC: [20, 32], rainfallMm: [400, 900], season: "Kharif", notes: "Groundwater concerns in some pockets" },
        irrigation: "Rainfed with protective irrigations; irrigated pockets produce higher yields",
        fertilizerGuideline: "High N (split), K for lint quality",
        pestsAndDiseases: "Bollworm (Bt reduced), aphids, whitefly",
        stages: [
          { name: "Sowing", daysFromStart: 0 },
          { name: "Square/Flower", daysFromStart: 50 },
          { name: "Boll maturity", daysFromStart: 120 },
          { name: "Harvest", daysFromStart: 150 }
        ],
        investmentRangeINR: { min: 30000, max: 50000 },
        returnRangeINR: { min: 60000, max: 120000 },
        notes: "Large producer; price & yield determine profitability strongly.",
        sources: ["Mongabay-India", "AgriTech"]
      },
      {
        id: "mh_sugarcane",
        name: "Sugarcane",
        soilTypes: ["Deep loam", "Alluvial"],
        climate: { temperatureC: [20, 35], rainfallMm: [800, 1400], season: "Perennial (irrigated)", notes: "Water intensive" },
        irrigation: "High (canal/pump/groundwater)",
        fertilizerGuideline: "High application of NPK & FYM",
        pestsAndDiseases: "Red rot, borers",
        stages: [
          { name: "Planting", daysFromStart: 0 },
          { name: "Grand growth", daysFromStart: 240 },
          { name: "Maturity", daysFromStart: 450 },
          { name: "Harvest", daysFromStart: 540 }
        ],
        investmentRangeINR: { min: 80000, max: 120000 },
        returnRangeINR: { min: 85000, max: 160000 },
        notes: "Profitability varies; factory payments & water costs matter.",
        sources: ["IndieJournal", "The Times of India"]
      },
      {
        id: "mh_grapes",
        name: "Grapes (Nashik)",
        soilTypes: ["Well-drained loam", "Good drainage required for vines"],
        climate: { temperatureC: [18, 30], rainfallMm: [600, 1000], season: "Mediterranean-like pockets (Nashik)", notes: "Export quality requires strict practices" },
        irrigation: "Drip irrigation with regulated water",
        fertilizerGuideline: "Balanced NPK + micronutrients; trellising & canopy management",
        pestsAndDiseases: "Powdery mildew, downy mildew, mealybugs",
        stages: [
          { name: "Planting/Training", daysFromStart: 0 },
          { name: "Canopy development", daysFromStart: 180 },
          { name: "Fruit set", daysFromStart: 365 },
          { name: "Harvest", daysFromStart: 420 }
        ],
        investmentRangeINR: { min: 100000, max: 250000 },
        returnRangeINR: { min: 120000, max: 500000 },
        notes: "High investment but high export returns possible when quality standards are met.",
        sources: ["Mongabay-India", "state agri reports"]
      }
    ]
  },
  {
    state: "Karnataka",
    majorCrops: [
      {
        id: "ka_coffee",
        name: "Coffee (Arabica/Robusta)",
        soilTypes: ["Well-drained loam", "Lateritic in highlands"],
        climate: { temperatureC: [15, 28], rainfallMm: [1500, 2500], season: "Perennial; shade preferred", notes: "Altitude & shade influence cup quality" },
        irrigation: "Supplemental irrigation during dry spells",
        fertilizerGuideline: "Organic compost + balanced NPK; soil test guided amendments",
        pestsAndDiseases: "Coffee berry borer, leaf rust",
        stages: [
          { name: "Nursery", daysFromStart: 0 },
          { name: "Transplant", daysFromStart: 365 },
          { name: "First flowering", daysFromStart: 1095 },
          { name: "First harvest", daysFromStart: 1460 }
        ],
        investmentRangeINR: { min: 75000, max: 200000 },
        returnRangeINR: { min: 120000, max: 300000 },
        notes: "Negative ROI in first 3 years typically; specialty coffee provides premium prices later.",
        sources: ["AgriTech", "Mongabay-India"]
      },
      {
        id: "ka_black_pepper",
        name: "Black Pepper",
        soilTypes: ["Red loam", "Lateritic; shady supports needed"],
        climate: { temperatureC: [22, 32], rainfallMm: [2000, 3000], season: "Humid tropical", notes: "Shade and humidity critical" },
        irrigation: "Maintain soil moisture; shade tree stands",
        fertilizerGuideline: "Organic manure + balanced NPK",
        pestsAndDiseases: "Quick wilt, pollu beetle",
        stages: [
          { name: "Planting", daysFromStart: 0 },
          { name: "Vine establishment", daysFromStart: 365 },
          { name: "First flowering", daysFromStart: 1095 },
          { name: "First harvest", daysFromStart: 1460 }
        ],
        investmentRangeINR: { min: 150000, max: 200000 },
        returnRangeINR: { min: 200000, max: 1000000 },
        notes: "High export demand; price varies greatly by quality and global markets.",
        sources: ["Mongabay-India", "state spice board"]
      },
      {
        id: "ka_banana",
        name: "Banana",
        soilTypes: ["Deep loam", "Organic-rich"],
        climate: { temperatureC: [20, 32], rainfallMm: [1000, 2000], season: "Year-round in irrigated pockets", notes: "Tissue-cultured planting widely used" },
        irrigation: "High; drip + mulching preferred",
        fertilizerGuideline: "Split NPK + FYM; micronutrients",
        pestsAndDiseases: "Nematodes, Sigatoka (leaf spots)",
        stages: [
          { name: "Planting", daysFromStart: 0 },
          { name: "Vegetative / sucker growth", daysFromStart: 180 },
          { name: "Flowering", daysFromStart: 270 },
          { name: "Harvest", daysFromStart: 360 }
        ],
        investmentRangeINR: { min: 60000, max: 150000 },
        returnRangeINR: { min: 120000, max: 300000 },
        notes: "High-yield export pockets exist with packhouses and cold chain.",
        sources: ["AgriTech", "state agri reports"]
      }
    ]
  },
  {
    state: "Punjab",
    majorCrops: [
      {
        id: "pb_wheat",
        name: "Wheat",
        soilTypes: ["Loamy alluvial soil"],
        climate: { temperatureC: [5, 25], rainfallMm: [300, 800], season: "Cool winter (Rabi)", notes: "Irrigated intensive cropping" },
        irrigation: "Well irrigated (canal/groundwater)",
        fertilizerGuideline: "NPK + S where required; split urea doses",
        pestsAndDiseases: "Rusts, aphids",
        stages: [
          { name: "Sowing", daysFromStart: 0 },
          { name: "Tillering", daysFromStart: 30 },
          { name: "Booting", daysFromStart: 90 },
          { name: "Harvest", daysFromStart: 140 }
        ],
        investmentRangeINR: { min: 25000, max: 40000 },
        returnRangeINR: { min: 50000, max: 90000 },
        notes: "High productivity state; MSP supports returns.",
        sources: ["AgriTech", "PJTAU"]
      },
      {
        id: "pb_basmati",
        name: "Basmati Rice",
        soilTypes: ["Alluvial loam"],
        climate: { temperatureC: [20, 32], rainfallMm: [800, 1200], season: "Irrigated Kharif/Rabi", notes: "Export-quality basmati yields premium prices" },
        irrigation: "Flood/canal irrigation; careful water management for quality",
        fertilizerGuideline: "Balanced NPK + S; Zn if deficient",
        pestsAndDiseases: "Stem borer, blast",
        stages: [
          { name: "Nursery", daysFromStart: 0 },
          { name: "Transplant", daysFromStart: 25 },
          { name: "Panicle initiation", daysFromStart: 65 },
          { name: "Harvest", daysFromStart: 140 }
        ],
        investmentRangeINR: { min: 30000, max: 60000 },
        returnRangeINR: { min: 70000, max: 160000 },
        notes: "Higher investment but export premiums can lift ROI.",
        sources: ["AgriTech", "PJTAU"]
      }
    ]
  },
  {
    state: "Gujarat",
    majorCrops: [
      {
        id: "gj_groundnut",
        name: "Groundnut",
        soilTypes: ["Sandy-loam", "Red loam"],
        climate: { temperatureC: [20, 32], rainfallMm: [400, 800], season: "Kharif", notes: "oilseed belt" },
        irrigation: "Light/moderate; avoid waterlogging",
        fertilizerGuideline: "FYM + basal NPK; gypsum on calcareous soils",
        pestsAndDiseases: "Leaf spot, stem rot, aphids",
        stages: [
          { name: "Sowing", daysFromStart: 0 },
          { name: "Flowering", daysFromStart: 30 },
          { name: "Pegging", daysFromStart: 70 },
          { name: "Harvest", daysFromStart: 120 }
        ],
        investmentRangeINR: { min: 30000, max: 45000 },
        returnRangeINR: { min: 40000, max: 72000 },
        notes: "Major groundnut oil zone; export & oil demand influence prices.",
        sources: ["PJTAU", "jau.in"]
      },
      {
        id: "gj_cotton",
        name: "Cotton",
        soilTypes: ["Black regur", "Alluvial pockets"],
        climate: { temperatureC: [20, 32], rainfallMm: [500, 900], season: "Kharif", notes: "rainfed + irrigated pockets" },
        irrigation: "Rainfed with protective irrigations",
        fertilizerGuideline: "High N split doses; potash for lint",
        pestsAndDiseases: "Bollworm, aphids",
        stages: [
          { name: "Sowing", daysFromStart: 0 },
          { name: "Flowering", daysFromStart: 50 },
          { name: "Boll maturity", daysFromStart: 120 },
          { name: "Harvest", daysFromStart: 150 }
        ],
        investmentRangeINR: { min: 30000, max: 55000 },
        returnRangeINR: { min: 60000, max: 120000 },
        notes: "Cotton economics vary widely; check state mandi prices for lint.",
        sources: ["PJTAU"]
      },
      {
        id: "gj_banana",
        name: "Banana",
        soilTypes: ["Deep loam", "Organic-rich"],
        climate: { temperatureC: [20, 32], rainfallMm: [900, 1600], season: "Tropical/irrigated", notes: "tissue-cultured saplings for export lanes" },
        irrigation: "High; drip + mulch",
        fertilizerGuideline: "Split NPK + FYM; micronutrients",
        pestsAndDiseases: "Nematodes, Sigatoka",
        stages: [
          { name: "Planting", daysFromStart: 0 },
          { name: "Vegetative", daysFromStart: 180 },
          { name: "Flowering", daysFromStart: 270 },
          { name: "Harvest", daysFromStart: 360 }
        ],
        investmentRangeINR: { min: 60000, max: 100000 },
        returnRangeINR: { min: 120000, max: 300000 },
        notes: "Export-grade banana needs packhouses and cold chain.",
        sources: ["PJTAU", "jau.in"]
      }
    ]
  },
  {
    state: "Kerala",
    majorCrops: [
      {
        id: "kl_coconut",
        name: "Coconut",
        soilTypes: ["Sandy/coastal loam"],
        climate: { temperatureC: [24, 32], rainfallMm: [1500, 3000], season: "Tropical", notes: "high humidity benefits productivity" },
        irrigation: "Regular in dry spells; basin method",
        fertilizerGuideline: "NPK + FYM; Mg/B where required",
        pestsAndDiseases: "Rhinoceros beetle, red palm weevil",
        stages: [
          { name: "Planting", daysFromStart: 0 },
          { name: "Juvenile", daysFromStart: 730 },
          { name: "First bearing", daysFromStart: 1460 }
        ],
        investmentRangeINR: { min: 60000, max: 150000 },
        returnRangeINR: { min: 108000, max: 108000 },
        notes: "Value-add (VCO, coir) increases ROI; state compendia show typical revenue at maturity.",
        sources: ["Kerala Agriculture", "Ecostat Kerala"]
      },
      {
        id: "kl_rubber",
        name: "Rubber",
        soilTypes: ["Lateritic", "Deep loam"],
        climate: { temperatureC: [25, 32], rainfallMm: [2000, 3000], season: "Humid tropical", notes: "best in south Kerala plateaus" },
        irrigation: "Rainfed with good drainage; avoid waterlogging",
        fertilizerGuideline: "NPK + FYM (soil test guided)",
        pestsAndDiseases: "Leaf fall disease, fungal issues",
        stages: [
          { name: "Planting", daysFromStart: 0 },
          { name: "Immature growth", daysFromStart: 1460 },
          { name: "Tapping begins", daysFromStart: 2190 }
        ],
        investmentRangeINR: { min: 40000, max: 90000 },
        returnRangeINR: { min: 200000, max: 300000 },
        notes: "Stable returns after tapping begins; sensitive to global price swings.",
        sources: ["Kerala Agriculture", "teaboard.gov.in"]
      },
      {
        id: "kl_pepper_cardamom",
        name: "Black Pepper & Cardamom (spices)",
        soilTypes: ["Humus-rich forest loam", "Shaded soils"],
        climate: { temperatureC: [10, 32], rainfallMm: [1500, 4000], season: "Humid and shaded", notes: "shade and humidity critical" },
        irrigation: "Frequent moisture; misting in dry months",
        fertilizerGuideline: "Organic manure + NPK; lime as needed",
        pestsAndDiseases: "Thrips, shoot borer, capsule rot",
        stages: [
          { name: "Planting under shade", daysFromStart: 0 },
          { name: "Establishment", daysFromStart: 365 },
          { name: "First bearing", daysFromStart: 1095 }
        ],
        investmentRangeINR: { min: 150000, max: 300000 },
        returnRangeINR: { min: 200000, max: 600000 },
        notes: "High export value; large initial establishment costs; spice boards provide trade data.",
        sources: ["Kerala Agriculture", "TeaBoard", "Spice Board"]
      }
    ]
  },
  {
    state: "Uttar Pradesh",
    majorCrops: [
      {
        id: "up_sugarcane",
        name: "Sugarcane",
        soilTypes: ["Deep alluvial soil"],
        climate: { temperatureC: [20, 35], rainfallMm: [800, 1200], season: "Perennial/irrigated", notes: "requires heavy irrigation or assured rainfall" },
        irrigation: "High (canal/pump groundwater)",
        fertilizerGuideline: "High NPK & FYM; soil test guided",
        pestsAndDiseases: "Red rot, ratoon stunting disease",
        stages: [
          { name: "Planting", daysFromStart: 0 },
          { name: "Grand growth", daysFromStart: 240 },
          { name: "Maturity & Harvest", daysFromStart: 365 }
        ],
        investmentRangeINR: { min: 80000, max: 120000 },
        returnRangeINR: { min: 85000, max: 160000 },
        notes: "State SAPs and mill payments strongly affect net returns.",
        sources: ["Business Standard", "USDA Apps"]
      },
      {
        id: "up_wheat",
        name: "Wheat",
        soilTypes: ["Alluvial loam"],
        climate: { temperatureC: [5, 25], rainfallMm: [300, 700], season: "Rabi (cool)", notes: "intensive irrigated farming in Punjab/UP belt" },
        irrigation: "Well irrigated (canal + groundwater)",
        fertilizerGuideline: "NPK + S; split urea",
        pestsAndDiseases: "Rusts, aphids",
        stages: [
          { name: "Sowing", daysFromStart: 0 },
          { name: "Tillering", daysFromStart: 30 },
          { name: "Booting", daysFromStart: 90 },
          { name: "Harvest", daysFromStart: 140 }
        ],
        investmentRangeINR: { min: 25000, max: 40000 },
        returnRangeINR: { min: 50000, max: 90000 },
        notes: "MSP-backed; yields high in irrigated districts.",
        sources: ["CEIC Data", "The Times of India"]
      },
      {
        id: "up_potato",
        name: "Potato",
        soilTypes: ["Loamy silt", "Cool season best"],
        climate: { temperatureC: [15, 25], rainfallMm: [400, 800], season: "Cool-season tuberization", notes: "storage infrastructure affects returns" },
        irrigation: "Moderate; irrigation at critical tuberization stages",
        fertilizerGuideline: "High-quality seed, balanced NPK, S in fertilizer",
        pestsAndDiseases: "Late blight, nematodes",
        stages: [
          { name: "Planting", daysFromStart: 0 },
          { name: "Tuber initiation", daysFromStart: 30 },
          { name: "Bulking", daysFromStart: 90 },
          { name: "Harvest", daysFromStart: 120 }
        ],
        investmentRangeINR: { min: 60000, max: 100000 },
        returnRangeINR: { min: 100000, max: 200000 },
        notes: "Processing & export districts have higher returns with cold storage.",
        sources: ["Business Standard", "The Times of India"]
      }
    ]
  },
  {
    state: "West Bengal",
    majorCrops: [
      {
        id: "wb_potato",
        name: "Potato",
        soilTypes: ["Alluvial silt-loam"],
        climate: { temperatureC: [15, 25], rainfallMm: [800, 1400], season: "Cool season important for tuberization", notes: "high seed cost; storage impacts profitability" },
        irrigation: "Moderate with drainage management",
        fertilizerGuideline: "High-quality seed tubers; NPK management",
        pestsAndDiseases: "Late blight, bacterial soft rot",
        stages: [
          { name: "Planting", daysFromStart: 0 },
          { name: "Tuber formation", daysFromStart: 30 },
          { name: "Bulking", daysFromStart: 90 },
          { name: "Harvest", daysFromStart: 120 }
        ],
        investmentRangeINR: { min: 70000, max: 120000 },
        returnRangeINR: { min: 100000, max: 300000 },
        notes: "Storage & cold chain significantly increase returns.",
        sources: ["CEIC Data"]
      },
      {
        id: "wb_gobindobhog",
        name: "Gobindobhog Rice (Aromatic)",
        soilTypes: ["Alluvial deltaic soils"],
        climate: { temperatureC: [20, 30], rainfallMm: [1200, 1500], season: "Kharif", notes: "Aromatic GI-tagged rice; premium demand" },
        irrigation: "Flood/canal irrigation in delta pockets",
        fertilizerGuideline: "Organic + NPK carefully managed for aroma",
        pestsAndDiseases: "Stem borer, blast",
        stages: [
          { name: "Nursery", daysFromStart: 0 },
          { name: "Transplant", daysFromStart: 25 },
          { name: "Tillering", daysFromStart: 45 },
          { name: "Harvest", daysFromStart: 120 }
        ],
        investmentRangeINR: { min: 30000, max: 60000 },
        returnRangeINR: { min: 720000, max: 720000 },
        notes: "Aromatic rice commands premium; small area cultivation can be very profitable.",
        sources: ["CEIC Data", "state crop reports"]
      },
      {
        id: "wb_jute",
        name: "Jute",
        soilTypes: ["Heavy alluvial soils; wetland suitability"],
        climate: { temperatureC: [20, 30], rainfallMm: [1200, 2500], season: "Monsoon; wetland", notes: "" },
        irrigation: "Rainfed wetlands; careful retting & processing needed",
        fertilizerGuideline: "Moderate NPK; retting quality affects fiber price",
        pestsAndDiseases: "Stem rot, wilt",
        stages: [
          { name: "Sowing", daysFromStart: 0 },
          { name: "Growth", daysFromStart: 60 },
          { name: "Harvest/Retting", daysFromStart: 120 }
        ],
        investmentRangeINR: { min: 15000, max: 40000 },
        returnRangeINR: { min: 30000, max: 80000 },
        notes: "Used for fiber & export; retting infrastructure influences returns.",
        sources: ["state crop reports"]
      }
    ]
  },
  {
    state: "Gujarat-MadhyaPradesh-Misc",
    majorCrops: [
      {
        id: "mp_soybean",
        name: "Soybean",
        soilTypes: ["Black regur", "Loam"],
        climate: { temperatureC: [20, 32], rainfallMm: [500, 900], season: "Kharif", notes: "major oilseed zone (MP)" },
        irrigation: "Mostly rainfed; protective irrigation where available",
        fertilizerGuideline: "Basal NPK; inoculants for soy",
        pestsAndDiseases: "Foliar diseases, stem rot",
        stages: [
          { name: "Sowing", daysFromStart: 0 },
          { name: "Flowering", daysFromStart: 40 },
          { name: "Pod fill", daysFromStart: 90 },
          { name: "Harvest", daysFromStart: 120 }
        ],
        investmentRangeINR: { min: 20000, max: 35000 },
        returnRangeINR: { min: 40000, max: 90000 },
        notes: "Major MP crop; global oilseed prices drive revenue fluctuations.",
        sources: ["MP Agri reports", "national stats"]
      }
    ]
  },
  {
    state: "Haryana",
    majorCrops: [
      {
        id: "hr_wheat",
        name: "Wheat",
        soilTypes: ["Alluvial loam", "Silty loam"],
        climate: { temperatureC: [5,25], rainfallMm: [300,700], season: "Rabi (winter)", notes: "Cool dry weather favours grain filling" },
        irrigation: "Well-irrigated (canal + tube well) — critical at tillering & grain filling",
        fertilizerGuideline: "NPK with split N applications; S in deficient soils",
        pestsAndDiseases: "Rusts, aphids, ear head blight",
        stages: [
          { name: "Sowing", daysFromStart: 0 },
          { name: "Tillering", daysFromStart: 30 },
          { name: "Booting", daysFromStart: 90 },
          { name: "Harvest", daysFromStart: 140 }
        ],
        investmentRangeINR: { min: 25000, max: 42000 },
        returnRangeINR: { min: 50000, max: 110000 },
        notes: "High productivity state; MSP support stabilizes returns.",
        sources: ["Haryana Agriculture Dept.", "ICAR / state crop reports"]
      },
      {
        id: "hr_basmati",
        name: "Basmati Rice",
        soilTypes: ["Alluvial loam", "Well-leveled puddled soils"],
        climate: { temperatureC: [20,32], rainfallMm: [700,1200], season: "Kharif/Rabi (irrigated)", notes: "Quality depends on water management" },
        irrigation: "Flooded paddies / controlled irrigation for quality",
        fertilizerGuideline: "Balanced NPK, sulphur & zinc where needed",
        pestsAndDiseases: "Stem borer, blast",
        stages: [
          { name: "Nursery", daysFromStart: 0 },
          { name: "Transplant", daysFromStart: 20 },
          { name: "Panicle initiation", daysFromStart: 60 },
          { name: "Harvest", daysFromStart: 140 }
        ],
        investmentRangeINR: { min: 30000, max: 65000 },
        returnRangeINR: { min: 70000, max: 160000 },
        notes: "Export-quality basmati offers premium prices; water management critical.",
        sources: ["Haryana Agriculture Dept.", "Agmarknet"]
      },
      {
        id: "hr_sugarcane",
        name: "Sugarcane",
        soilTypes: ["Deep alluvial", "Loam"],
        climate: { temperatureC: [20,35], rainfallMm: [800,1200], season: "Perennial/irrigated", notes: "needs long growing season & water" },
        irrigation: "High (canal/pump), critical throughout crop cycle",
        fertilizerGuideline: "High N & K doses; FYM and micronutrients",
        pestsAndDiseases: "Red rot, borers, smut",
        stages: [
          { name: "Planting", daysFromStart: 0 },
          { name: "Grand growth", daysFromStart: 240 },
          { name: "Maturity", daysFromStart: 450 },
          { name: "Harvest", daysFromStart: 540 }
        ],
        investmentRangeINR: { min: 80000, max: 120000 },
        returnRangeINR: { min: 85000, max: 160000 },
        notes: "Profitability varies; factory payments & water costs matter.",
        sources: ["Haryana Agriculture Dept.", "Agmarknet"]
      }
    ]
  }
];

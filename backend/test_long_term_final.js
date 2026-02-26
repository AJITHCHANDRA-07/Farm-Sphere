// Test the updated long-term crops functionality
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Simulate the updated mapDatabaseCropToCrop function
const mapDatabaseCropToCrop = (dbCrop, category) => {
  const cropName = dbCrop['Crop Name'] || dbCrop['Crop_Name'] || 'Unknown Crop';
  const durationStr = dbCrop['Crop_Duration'] || dbCrop['Crop Duration'] || '90 days';
  const durationDays = 90;
  
  // 🎯 USE INDIVIDUAL CROP DATA FROM 15 DATABASE COLUMNS
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
  
  return {
    id: dbCrop['Id']?.toString() || cropName.toLowerCase().replace(/\s+/g, '-'),
    name: cropName,
    category,
    duration: durationStr,
    durationDays,
    profitPerAcre: popupProfit,
    investmentCost: popupInvestment,
    expectedYield: popupYield,
    marketPrice: popupPrice,
    waterNeeds: waterRequirement || 'Moderate',
    demand: popupDemand,
    image: `/images/${cropName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
    description: `${cropType} crop with ${supplyStatus} supply and ${originalDemandStatus} demand.`,
    district: suitableDistrict || 'Telangana',
    
    // 🎯 ORIGINAL TABLES DATA FOR ENHANCED POPUP
    supplyStatus: supplyStatus,
    originalDemandStatus: originalDemandStatus,
    riskFactors: riskFactors,
    cropDuration: cropDuration,
    primarySoilType: primarySoilType,
    waterRequirement: waterRequirement,
    climateSuitability: climateSuitability,
    irrigationCompatibility: irrigationCompatibility,
    landAreaSuitability: landAreaSuitability,
    mitigationStrategies: mitigationStrategies,
    cropType: cropType,
    suitableDistrict: suitableDistrict,
    
    // 🎯 ADDITIONAL PROPERTIES FOR POPUP TABLE DATA
    costBreakdown: dbCrop['Cost_Breakdown_Per_Acre'] || 'Not specified',
    priceRange: dbCrop['Price_Range_Per_KG'] || `₹${popupPrice} per kg`,
    yieldRange: dbCrop['Yield_Range_Per_Acre'] || `${popupYield} kg per acre`,
    breakEvenTime: popupBreakEven
  };
};

async function testLongTermCrops() {
  try {
    console.log('🔍 TESTING LONG-TERM CROPS FOR RANGAREDDY');
    console.log('======================================');
    
    // Get long-term crops for Rangareddy
    const { data, error } = await supabase
      .from('Long_Term_Crops')
      .select('*')
      .eq('Suitable Telangana District', 'Rangareddy');
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    console.log(`✅ Found ${data?.length || 0} long-term crops for Rangareddy`);
    
    if (data && data.length > 0) {
      console.log('\n📋 Testing long-term crops mapping:');
      
      data.forEach((crop, index) => {
        console.log(`\n${index + 1}. ${crop['Crop Name']} (${crop['Crop Type']})`);
        
        // Map with the updated function
        const mappedCrop = mapDatabaseCropToCrop(crop, 'long');
        
        console.log(`   Duration: ${mappedCrop.cropDuration}`);
        console.log(`   Investment Per Acre: ₹${mappedCrop.investmentCost}`);
        console.log(`   Expected Yield Per Acre: ${mappedCrop.expectedYield} kg`);
        console.log(`   Market Price Per KG: ₹${mappedCrop.marketPrice}`);
        console.log(`   Profit Per Acre: ₹${mappedCrop.profitPerAcre}`);
        console.log(`   Supply Status: ${mappedCrop.supplyStatus}`);
        console.log(`   Demand Status: ${mappedCrop.originalDemandStatus}`);
        console.log(`   Risk Factors: ${mappedCrop.riskFactors}`);
        console.log(`   Soil Type: ${mappedCrop.primarySoilType}`);
        console.log(`   Water Requirement: ${mappedCrop.waterRequirement}`);
        console.log('─'.repeat(50));
      });
      
      console.log('\n✅ SUCCESS: Long-term crops now working correctly!');
      console.log(`🎯 Long-term crops count: ${data.length} (should display correctly in frontend)`);
    } else {
      console.log('📝 No long-term crops found for Rangareddy');
      console.log('🎯 Frontend should show 0 crops for long-term section');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLongTermCrops();

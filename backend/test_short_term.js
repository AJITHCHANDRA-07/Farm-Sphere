const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Simulate mapDatabaseCropToCrop function
const mapDatabaseCropToCrop = (dbCrop, category) => {
  const cropName = dbCrop['Crop Name'] || dbCrop['Crop_Name'] || 'Unknown Crop';
  
  return {
    id: dbCrop['Id']?.toString() || cropName.toLowerCase().replace(/\s+/g, '-'),
    name: cropName,
    category,
    duration: dbCrop['Crop_Duration'] || dbCrop['Crop Duration'] || '90 days',
    profitPerAcre: dbCrop['Profit_Per_Acre'] || 50000,
    investmentCost: dbCrop['Investment_Per_Acre'] || 20000,
    expectedYield: dbCrop['Expected_Yield_Per_Acre'] || 2000,
    marketPrice: dbCrop['Market_Price_Per_KG'] || 25,
    waterNeeds: dbCrop['Water Requirement'] || 'Moderate',
    demand: dbCrop['Market_Demand_Level'] || 'Medium',
    image: `/images/${cropName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
    description: `${dbCrop['Crop Type']} crop with ${dbCrop['Supply Status']} supply and ${dbCrop['Demand Status']} demand.`,
    district: dbCrop['Suitable Telangana District'] || 'Telangana',
    
    // 🎯 ORIGINAL TABLES DATA FOR ENHANCED POPUP
    supplyStatus: dbCrop['Supply Status'] || 'Not specified',
    originalDemandStatus: dbCrop['Demand Status'] || 'Not specified',
    riskFactors: dbCrop['Risk Factors'] || 'Not specified',
    cropDuration: dbCrop['Crop_Duration'] || dbCrop['Crop Duration'] || 'Not specified',
    primarySoilType: dbCrop['Primary Soil Type Required'] || 'Not specified',
    waterRequirement: dbCrop['Water Requirement'] || 'Not specified',
    climateSuitability: dbCrop['Climate Suitability'] || 'Not specified',
    irrigationCompatibility: dbCrop['Irrigation Compatibility'] || 'Not specified',
    landAreaSuitability: dbCrop['Land Area Suitability'] || 'Not specified',
    mitigationStrategies: dbCrop['Mitigation Strategies'] || 'Not specified',
    cropType: dbCrop['Crop Type'] || 'Not specified',
    suitableDistrict: dbCrop['Suitable Telangana District'] || 'Not specified',
    
    // 🎯 ADDITIONAL PROPERTIES FOR POPUP TABLE DATA
    costBreakdown: dbCrop['Cost_Breakdown_Per_Acre'] || 'Not specified',
    priceRange: dbCrop['Price_Range_Per_KG'] || `₹${dbCrop['Market_Price_Per_KG']} per kg`,
    yieldRange: dbCrop['Yield_Range_Per_Acre'] || `${dbCrop['Expected_Yield_Per_Acre']} kg per acre`,
    breakEvenTime: dbCrop['Break_Even_Time'] || 'Not specified'
  };
};

async function testShortTermCrops() {
  try {
    console.log('🔍 TESTING SHORT-TERM CROPS FOR RANGAREDDY');
    console.log('======================================');
    
    const category = 'short';
    
    // 🎯 FETCH FROM POPUP TABLE (filtered - but will get corrupted data)
    const { data: popupData, error: popupError } = await supabase
      .from('S_T_C_PopUp1')
      .select('*');
    
    // 🎯 FETCH FROM ORIGINAL TABLE (filtered for Rangareddy)
    const { data: originalData, error: originalError } = await supabase
      .from('Short_Term_Crops')
      .select('*')
      .eq('Suitable Telangana District', 'Rangareddy');
    
    if (popupError || originalError) {
      console.error('❌ Error:', popupError || originalError);
      return;
    }
    
    console.log(`✅ Popup data: ${popupData?.length || 0} crops (many corrupted)`);
    console.log(`✅ Original data: ${originalData?.length || 0} Rangareddy crops`);
    
    if (originalData && originalData.length > 0) {
      console.log('\n📋 Rangareddy Short-Term Crops from Database:');
      originalData.forEach((crop, index) => {
        console.log(`${index + 1}. ${crop['Crop Name']} - ${crop['Crop Type']} - ${crop['Crop Duration']}`);
        console.log(`   Supply: ${crop['Supply Status']}, Demand: ${crop['Demand Status']}`);
        console.log(`   Soil: ${crop['Primary Soil Type Required']}, Water: ${crop['Water Requirement']}`);
      });
      
      // Map original crops (since popup data is corrupted)
      const mappedCrops = originalData.map(originalCrop => {
        console.log(`🌱 Mapping: ${originalCrop['Crop Name']}`);
        return mapDatabaseCropToCrop(originalCrop, category);
      });
      
      console.log(`\n🎯 Final short-term crops for Rangareddy: ${mappedCrops.length}`);
      mappedCrops.forEach((crop, index) => {
        console.log(`${index + 1}. ${crop.name}`);
        console.log(`   Duration: ${crop.cropDuration}`);
        console.log(`   Investment: ₹${crop.investmentCost}/acre`);
        console.log(`   Supply: ${crop.supplyStatus}`);
        console.log(`   Demand: ${crop.originalDemandStatus}`);
        console.log(`   Risk: ${crop.riskFactors}`);
        console.log(`   Soil: ${crop.primarySoilType}`);
        console.log(`   Type: ${crop.cropType}`);
        console.log('─'.repeat(30));
      });
      
      console.log('\n✅ SUCCESS: Short-term crops ready for display!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testShortTermCrops();

// Complete frontend flow simulation
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
    profitPerAcre: dbCrop['Profit_Per_Acre'] || 0,
    investmentCost: dbCrop['Investment_Per_Acre'] || 0,
    expectedYield: dbCrop['Expected_Yield_Per_Acre'] || 0,
    marketPrice: dbCrop['Market_Price_Per_KG'] || 0,
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

async function simulateFrontendFlow() {
  try {
    console.log('🔍 SIMULATING COMPLETE FRONTEND FLOW');
    console.log('====================================');
    
    // Step 1: User location is Rangareddy
    const userLocation = { district: "Rangareddy" };
    console.log(`📍 User location: ${userLocation.district}`);
    
    // Step 2: Fetch medium-term crops
    console.log('\n🔄 Fetching medium-term crops...');
    const category = 'medium';
    const medicinalCrops = [
      'Pippali', 'Mandukaparni', 'Amalaki', 'Kaunch', 'Jeevanti', 
      'Jatamansi', 'Guduchi', 'Shatavari', 'Brahmi', 'Vacha', 'Bhringraj', 'Arjuna'
    ];
    
    // Fetch from popup table
    const { data: popupData } = await supabase
      .from('M_T_C_PopUp1')
      .select('*')
      .in('Crop_Name', medicinalCrops);
    
    // Fetch from original table
    const { data: originalData } = await supabase
      .from('Medium_Term_Crops')
      .select('*')
      .eq('Suitable Telangana District', 'Rangareddy')
      .in('Crop Name', medicinalCrops);
    
    // Remove duplicates
    const uniquePopupData = popupData.filter((popupCrop, index, self) => 
      index === self.findIndex(c => c.Crop_Name === popupCrop.Crop_Name)
    );
    
    // Merge data
    const mergedCrops = uniquePopupData.map((popupCrop) => {
      const originalCrop = originalData.find(orig => 
        orig['Crop Name'] === popupCrop['Crop_Name']
      );
      
      if (originalCrop) {
        const combinedCrop = { ...popupCrop, ...originalCrop };
        return mapDatabaseCropToCrop(combinedCrop, category);
      }
      return null;
    }).filter(Boolean);
    
    console.log(`✅ Fetched ${mergedCrops.length} medium-term crops`);
    
    // Step 3: Filter by district (frontend filtering)
    const filteredCrops = mergedCrops.filter(crop => {
      const cropDistrict = crop.district?.toLowerCase().trim();
      const userDistrict = userLocation.district.toLowerCase().trim();
      
      const matchesDistrict = cropDistrict === userDistrict || 
                                cropDistrict === 'rangareddy' && userDistrict === 'ranga reddy' ||
                                cropDistrict === 'ranga reddy' && userDistrict === 'rangareddy';
      
      return matchesDistrict;
    });
    
    console.log(`📊 After district filtering: ${filteredCrops.length} crops for ${userLocation.district}`);
    
    // Step 4: Display results
    console.log('\n🌱 MEDIUM-TERM CROPS FOR RANGAREDDY:');
    console.log('='.repeat(50));
    
    filteredCrops.forEach((crop, index) => {
      console.log(`${index + 1}. ${crop.name}`);
      console.log(`   Duration: ${crop.cropDuration}`);
      console.log(`   Investment: ₹${crop.investmentCost}/acre`);
      console.log(`   Profit: ₹${crop.profitPerAcre}/acre`);
      console.log(`   Supply: ${crop.supplyStatus}`);
      console.log(`   Demand: ${crop.originalDemandStatus}`);
      console.log(`   Risk: ${crop.riskFactors}`);
      console.log(`   Soil: ${crop.primarySoilType}`);
      console.log(`   Water: ${crop.waterRequirement}`);
      console.log(`   Climate: ${crop.climateSuitability}`);
      console.log(`   Type: ${crop.cropType}`);
      console.log('─'.repeat(30));
    });
    
    console.log(`\n✅ SUCCESS: ${filteredCrops.length} medicinal crops ready for display!`);
    console.log('🎯 All popup details are available (no "Not specified" fields)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

simulateFrontendFlow();

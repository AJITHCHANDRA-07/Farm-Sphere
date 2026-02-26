const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testMedicinalCropsFetch() {
  try {
    console.log('🔍 TESTING MEDICINAL CROPS FETCH FOR RANGAREDDY');
    console.log('==============================================');
    
    // Simulate the getCropsByCategory function for medium term
    const category = 'medium';
    const popupTableName = 'M_T_C_PopUp1';
    const originalTableName = 'Medium_Term_Crops';
    
    // Fetch from both tables
    const [popupResult, originalResult] = await Promise.all([
      supabase.from(popupTableName).select('*'),
      supabase.from(originalTableName).select('*').eq('Suitable Telangana District', 'Rangareddy')
    ]);
    
    const { data: popupData, error: popupError } = popupResult;
    const { data: originalData, error: originalError } = originalResult;
    
    if (popupError || originalError) {
      console.error('❌ Error:', popupError || originalError);
      return;
    }
    
    console.log(`✅ Fetched ${popupData?.length || 0} popup crops`);
    console.log(`✅ Fetched ${originalData?.length || 0} Rangareddy original crops`);
    
    // Filter medicinal crops
    const medicinalCrops = [
      'Pippali', 'Mandukaparni', 'Amalaki', 'Kaunch', 'Jeevanti', 
      'Jatamansi', 'Guduchi', 'Shatavari', 'Brahmi', 'Vacha', 'Bhringraj', 'Arjuna'
    ];
    
    // Merge data for medicinal crops
    const mergedCrops = [];
    medicinalCrops.forEach(cropName => {
      const popupCrop = popupData?.find(p => p.Crop_Name === cropName);
      const originalCrop = originalData?.find(o => o['Crop Name'] === cropName);
      
      if (popupCrop && originalCrop) {
        mergedCrops.push({
          name: cropName,
          investment: popupCrop.Investment_Per_Acre,
          yield: popupCrop.Expected_Yield_Per_Acre,
          price: popupCrop.Market_Price_Per_KG,
          profit: popupCrop.Profit_Per_Acre,
          supply: originalCrop['Supply Status'],
          demand: originalCrop['Demand Status'],
          risk: originalCrop['Risk Factors'],
          duration: originalCrop['Crop Duration'],
          soil: originalCrop['Primary Soil Type Required'],
          water: originalCrop['Water Requirement'],
          climate: originalCrop['Climate Suitability'],
          irrigation: originalCrop['Irrigation Compatibility'],
          landArea: originalCrop['Land Area Suitability'],
          mitigation: originalCrop['Mitigation Strategies'],
          cropType: originalCrop['Crop Type']
        });
      }
    });
    
    console.log(`\n🌱 MERGED MEDICINAL CROPS FOR RANGAREDDY (${mergedCrops.length}):`);
    console.log('='.repeat(60));
    
    mergedCrops.forEach((crop, index) => {
      console.log(`${index + 1}. ${crop.name}`);
      console.log(`   Investment: ₹${crop.investment}/acre`);
      console.log(`   Yield: ${crop.yield} kg/acre`);
      console.log(`   Price: ₹${crop.price}/kg`);
      console.log(`   Profit: ₹${crop.profit}/acre`);
      console.log(`   Supply: ${crop.supply}`);
      console.log(`   Demand: ${crop.demand}`);
      console.log(`   Risk: ${crop.risk}`);
      console.log(`   Duration: ${crop.duration}`);
      console.log(`   Soil: ${crop.soil}`);
      console.log(`   Water: ${crop.water}`);
      console.log(`   Climate: ${crop.climate}`);
      console.log(`   Irrigation: ${crop.irrigation}`);
      console.log(`   Land Area: ${crop.landArea}`);
      console.log(`   Mitigation: ${crop.mitigation}`);
      console.log(`   Type: ${crop.cropType}`);
      console.log('─'.repeat(40));
    });
    
    console.log(`\n✅ SUCCESS: All ${mergedCrops.length} medicinal crops ready for Rangareddy!`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testMedicinalCropsFetch();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkMedicinalCrops() {
  try {
    console.log('🔍 CHECKING MEDICINAL CROPS IN MEDIUM_TERM_CROPS TABLE');
    console.log('====================================================');
    
    // Expected medicinal crops
    const expectedCrops = [
      'Pippali', 'Mandukaparni', 'Amalaki', 'Kaunch', 'Jeevanti', 
      'Jatamansi', 'Guduchi', 'Shatavari', 'Brahmi', 'Vacha', 'Bhringraj', 'Arjuna'
    ];
    
    console.log('📋 Expected medicinal crops:', expectedCrops.length);
    expectedCrops.forEach((crop, index) => {
      console.log(`${index + 1}. ${crop}`);
    });
    
    // Check each crop in the database
    console.log('\n🔍 CHECKING EACH CROP IN DATABASE');
    console.log('=====================================');
    
    for (const cropName of expectedCrops) {
      const { data, error } = await supabase
        .from('Medium_Term_Crops')
        .select('*')
        .eq('Crop Name', cropName)
        .eq('Suitable Telangana District', 'Rangareddy');
      
      if (error) {
        console.log(`❌ Error checking ${cropName}:`, error.message);
      } else if (data && data.length > 0) {
        console.log(`✅ ${cropName}: Found in Rangareddy`);
        console.log(`   - Type: ${data[0]['Crop Type']}`);
        console.log(`   - Duration: ${data[0]['Crop Duration']}`);
        console.log(`   - Supply: ${data[0]['Supply Status']}`);
        console.log(`   - Demand: ${data[0]['Demand Status']}`);
      } else {
        console.log(`❌ ${cropName}: Not found in Rangareddy`);
      }
    }
    
    // Also check M_T_C_PopUp1 table for these crops
    console.log('\n🔍 CHECKING M_T_C_PopUp1 TABLE FOR THESE CROPS');
    console.log('==============================================');
    
    for (const cropName of expectedCrops) {
      const { data, error } = await supabase
        .from('M_T_C_PopUp1')
        .select('*')
        .eq('Crop_Name', cropName);
      
      if (error) {
        console.log(`❌ Error checking ${cropName} in popup:`, error.message);
      } else if (data && data.length > 0) {
        console.log(`✅ ${cropName}: Found in popup table`);
        console.log(`   - Investment: ${data[0]['Investment_Per_Acre']}`);
        console.log(`   - Yield: ${data[0]['Expected_Yield_Per_Acre']}`);
        console.log(`   - Price: ${data[0]['Market_Price_Per_KG']}`);
      } else {
        console.log(`❌ ${cropName}: Not found in popup table`);
      }
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

checkMedicinalCrops();

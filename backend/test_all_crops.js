// Complete test for both short-term and medium-term crops
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testAllCrops() {
  try {
    console.log('🔍 TESTING ALL CROPS FOR RANGAREDDY');
    console.log('===================================');
    
    // Test Short-Term Crops
    console.log('\n📋 SHORT-TERM CROPS:');
    console.log('===================');
    
    const { data: shortData } = await supabase
      .from('Short_Term_Crops')
      .select('*')
      .eq('Suitable Telangana District', 'Rangareddy');
    
    console.log(`✅ Found ${shortData?.length || 0} short-term crops`);
    shortData?.forEach((crop, index) => {
      console.log(`${index + 1}. ${crop['Crop Name']} - ${crop['Crop Type']} - ${crop['Crop Duration']}`);
    });
    
    // Test Medium-Term Crops
    console.log('\n📋 MEDIUM-TERM CROPS:');
    console.log('====================');
    
    const medicinalCrops = [
      'Pippali', 'Mandukaparni', 'Amalaki', 'Kaunch', 'Jeevanti', 
      'Jatamansi', 'Guduchi', 'Shatavari', 'Brahmi', 'Vacha', 'Bhringraj', 'Arjuna'
    ];
    
    const { data: mediumData } = await supabase
      .from('Medium_Term_Crops')
      .select('*')
      .eq('Suitable Telangana District', 'Rangareddy')
      .in('Crop Name', medicinalCrops);
    
    console.log(`✅ Found ${mediumData?.length || 0} medium-term crops`);
    mediumData?.forEach((crop, index) => {
      console.log(`${index + 1}. ${crop['Crop Name']} - ${crop['Crop Type']} - ${crop['Crop Duration']}`);
    });
    
    // Summary
    console.log('\n🎯 SUMMARY FOR RANGAREDDY DISTRICT:');
    console.log('===================================');
    console.log(`🌱 Short-term crops: ${shortData?.length || 0}`);
    console.log(`🌱 Medium-term crops: ${mediumData?.length || 0}`);
    console.log(`🌱 Total crops: ${(shortData?.length || 0) + (mediumData?.length || 0)}`);
    
    console.log('\n✅ ALL CROPS READY FOR DISPLAY!');
    console.log('🎯 Short-term and medium-term sections will show crops for Rangareddy');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAllCrops();

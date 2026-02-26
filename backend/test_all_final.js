// Complete test for all crop categories
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testAllCategories() {
  try {
    console.log('🔍 TESTING ALL CROP CATEGORIES FOR RANGAREDDY');
    console.log('========================================');
    
    // Test Short-Term Crops
    console.log('\n📋 SHORT-TERM CROPS:');
    console.log('===================');
    const { data: shortData } = await supabase
      .from('Short_Term_Crops')
      .select('*')
      .eq('Suitable Telangana District', 'Rangareddy');
    
    console.log(`✅ Short-term crops: ${shortData?.length || 0}`);
    shortData?.forEach((crop, index) => {
      console.log(`${index + 1}. ${crop['Crop Name']} - ${crop['Crop Type']}`);
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
    
    console.log(`✅ Medium-term crops: ${mediumData?.length || 0}`);
    mediumData?.forEach((crop, index) => {
      console.log(`${index + 1}. ${crop['Crop Name']} - ${crop['Crop Type']}`);
    });
    
    // Test Long-Term Crops
    console.log('\n📋 LONG-TERM CROPS:');
    console.log('==================');
    const { data: longData } = await supabase
      .from('Long_Term_Crops')
      .select('*')
      .eq('Suitable Telangana District', 'Rangareddy');
    
    console.log(`✅ Long-term crops: ${longData?.length || 0}`);
    longData?.forEach((crop, index) => {
      console.log(`${index + 1}. ${crop['Crop Name']} - ${crop['Crop Type']}`);
    });
    
    // Summary
    console.log('\n🎯 FINAL COUNTS FOR RANGAREDDY DISTRICT:');
    console.log('=====================================');
    console.log(`🌱 Short-term crops: ${shortData?.length || 0}`);
    console.log(`🌱 Medium-term crops: ${mediumData?.length || 0}`);
    console.log(`🌱 Long-term crops: ${longData?.length || 0}`);
    console.log(`🌱 Total crops: ${(shortData?.length || 0) + (mediumData?.length || 0) + (longData?.length || 0)}`);
    
    console.log('\n✅ ALL CATEGORIES READY FOR DISPLAY!');
    console.log('🎯 Frontend should show these exact counts:');
    console.log(`   Short-term: ${shortData?.length || 0} crops`);
    console.log(`   Medium-term: ${mediumData?.length || 0} crops`);
    console.log(`   Long-term: ${longData?.length || 0} crops`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAllCategories();

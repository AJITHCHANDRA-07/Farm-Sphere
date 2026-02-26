const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkDistrictField() {
  try {
    console.log('🔍 CHECKING DISTRICT FIELD IN DATABASE CROPS');
    console.log('==========================================');
    
    // Get Rangareddy crops from Medium_Term_Crops
    const { data, error } = await supabase
      .from('Medium_Term_Crops')
      .select('*')
      .eq('Suitable Telangana District', 'Rangareddy')
      .limit(3);
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    console.log('📋 Sample Rangareddy crops from database:');
    data.forEach((crop, index) => {
      console.log(`${index + 1}. ${crop['Crop Name']}`);
      console.log(`   Suitable Telangana District: "${crop['Suitable Telangana District']}"`);
      console.log(`   All fields:`, Object.keys(crop));
    });
    
    // Check how mapDatabaseCropToCrop maps the district
    console.log('\n🔍 CHECKING HOW DISTRICT IS MAPPED');
    console.log('===================================');
    
    // Simulate the mapping
    const sampleCrop = data[0];
    const mappedCrop = {
      ...sampleCrop,
      // This is how mapDatabaseCropToCrop sets the district
      district: sampleCrop['Suitable Telangana District'] || 'Telangana'
    };
    
    console.log(`Original district field: "${sampleCrop['Suitable Telangana District']}"`);
    console.log(`Mapped district field: "${mappedCrop.district}"`);
    console.log(`Lowercase: "${mappedCrop.district.toLowerCase()}"`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkDistrictField();

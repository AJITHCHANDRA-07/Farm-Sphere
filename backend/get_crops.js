const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function getCropData() {
  try {
    console.log('🌾 FARMSPHERE CROP DATA FROM SUPABASE');
    console.log('=====================================');
    
    // Get Short Term Crops
    console.log('\n📊 Short Term Crops:');
    const { data: shortCrops, error: shortError } = await supabase
      .from('Short_Term_Crops')
      .select('*');
    
    if (shortError) {
      console.log('❌ Error:', shortError.message);
    } else {
      console.log(`✅ Found ${shortCrops.length} short-term crops`);
      if (shortCrops.length > 0) {
        console.log('📋 Columns:', Object.keys(shortCrops[0]));
        shortCrops.forEach((crop, i) => {
          console.log(`${i+1}. ${JSON.stringify(crop, null, 2)}`);
        });
      }
    }
    
    // Get Medium Term Crops
    console.log('\n📊 Medium Term Crops:');
    const { data: mediumCrops, error: mediumError } = await supabase
      .from('Medium_Term_Crops')
      .select('*');
    
    if (mediumError) {
      console.log('❌ Error:', mediumError.message);
    } else {
      console.log(`✅ Found ${mediumCrops.length} medium-term crops`);
      if (mediumCrops.length > 0) {
        console.log('📋 Columns:', Object.keys(mediumCrops[0]));
        mediumCrops.forEach((crop, i) => {
          console.log(`${i+1}. ${JSON.stringify(crop, null, 2)}`);
        });
      }
    }
    
    // Get Long Term Crops
    console.log('\n📊 Long Term Crops:');
    const { data: longCrops, error: longError } = await supabase
      .from('Long_Term_Crops')
      .select('*');
    
    if (longError) {
      console.log('❌ Error:', longError.message);
    } else {
      console.log(`✅ Found ${longCrops.length} long-term crops`);
      if (longCrops.length > 0) {
        console.log('📋 Columns:', Object.keys(longCrops[0]));
        longCrops.forEach((crop, i) => {
          console.log(`${i+1}. ${JSON.stringify(crop, null, 2)}`);
        });
      }
    }
    
    // Get main crop_data
    console.log('\n📊 Main Crop Data:');
    const { data: mainCrops, error: mainError } = await supabase
      .from('crop_data')
      .select('*');
    
    if (mainError) {
      console.log('❌ Error:', mainError.message);
    } else {
      console.log(`✅ Found ${mainCrops.length} crops in main table`);
      if (mainCrops.length > 0) {
        console.log('📋 Columns:', Object.keys(mainCrops[0]));
        mainCrops.forEach((crop, i) => {
          console.log(`${i+1}. ${JSON.stringify(crop, null, 2)}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

getCropData();

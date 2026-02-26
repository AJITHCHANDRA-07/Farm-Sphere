const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkShortPopupData() {
  try {
    console.log('🔍 CHECKING S_T_C_PopUp1 TABLE DETAILS');
    console.log('=====================================');
    
    // Get all data from S_T_C_PopUp1
    const { data, error } = await supabase
      .from('S_T_C_PopUp1')
      .select('*');
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    console.log(`✅ Found ${data?.length || 0} records in S_T_C_PopUp1`);
    
    if (data && data.length > 0) {
      console.log('📋 All records in S_T_C_PopUp1:');
      data.forEach((crop, index) => {
        console.log(`${index + 1}. Crop_Name: "${crop.Crop_Name}" - Investment: ₹${crop.Investment_Per_Acre}`);
      });
    }
    
    // Check which short-term crops have popup data
    console.log('\n🔍 CHECKING WHICH RANGAREDDY CROPS HAVE POPUP DATA');
    console.log('================================================');
    
    const rangareddyCrops = ['Celery', 'Lettuce', 'Parsley', 'Strawberry', 'Thyme'];
    
    for (const cropName of rangareddyCrops) {
      const { data: popupCrop } = await supabase
        .from('S_T_C_PopUp1')
        .select('*')
        .eq('Crop_Name', cropName);
      
      if (popupCrop && popupCrop.length > 0) {
        console.log(`✅ ${cropName}: Found in popup table`);
        popupCrop.forEach(crop => {
          console.log(`   Investment: ₹${crop.Investment_Per_Acre}, Yield: ${crop.Expected_Yield_Per_Acre}`);
        });
      } else {
        console.log(`❌ ${cropName}: Not found in popup table`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkShortPopupData();

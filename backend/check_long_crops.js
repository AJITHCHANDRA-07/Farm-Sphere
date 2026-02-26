const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkLongTermCrops() {
  try {
    console.log('🔍 CHECKING LONG-TERM CROPS');
    console.log('============================');
    
    // Check Long_Term_Crops table
    const { data, error } = await supabase
      .from('Long_Term_Crops')
      .select('*');
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    console.log(`✅ Found ${data?.length || 0} total long-term crops`);
    
    // Check for Rangareddy specifically
    const { data: rangareddyData, error: rangareddyError } = await supabase
      .from('Long_Term_Crops')
      .select('*')
      .eq('Suitable Telangana District', 'Rangareddy');
    
    if (rangareddyError) {
      console.error('❌ Error checking Rangareddy:', rangareddyError.message);
    } else {
      console.log(`✅ Found ${rangareddyData?.length || 0} long-term crops for Rangareddy`);
      
      if (rangareddyData && rangareddyData.length > 0) {
        console.log('📋 Rangareddy Long-Term Crops:');
        rangareddyData.forEach((crop, index) => {
          console.log(`${index + 1}. ${crop['Crop Name']} - ${crop['Crop Type']} - ${crop['Crop Duration']}`);
        });
      }
    }
    
    // Check L_T_C_PopUp1 table
    console.log('\n🔍 CHECKING L_T_C_PopUp1 TABLE');
    console.log('===============================');
    
    const { data: popupData, error: popupError } = await supabase
      .from('L_T_C_PopUp1')
      .select('*')
      .limit(5);
    
    if (popupError) {
      console.error('❌ Error:', popupError.message);
    } else {
      console.log(`✅ Popup table has ${popupData?.length || 0} records`);
      if (popupData && popupData.length > 0) {
        console.log('📋 Sample popup crops:');
        popupData.forEach((crop, index) => {
          console.log(`${index + 1}. ${crop.Crop_Name} - Investment: ₹${crop.Investment_Per_Acre}`);
        });
      }
    }
    
    // Check all districts available
    console.log('\n🔍 CHECKING ALL DISTRICTS IN LONG-TERM CROPS');
    console.log('==========================================');
    
    const { data: allData } = await supabase
      .from('Long_Term_Crops')
      .select('Suitable Telangana District');
    
    if (allData) {
      const districts = [...new Set(allData.map(item => item['Suitable Telangana District']))];
      console.log('📋 Available districts:', districts);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkLongTermCrops();

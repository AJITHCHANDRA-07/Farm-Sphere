const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkShortTermCrops() {
  try {
    console.log('🔍 CHECKING SHORT-TERM CROPS FOR RANGAREDDY');
    console.log('=======================================');
    
    // Get short-term crops for Rangareddy
    const { data, error } = await supabase
      .from('Short_Term_Crops')
      .select('*')
      .eq('Suitable Telangana District', 'Rangareddy');
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    console.log(`✅ Found ${data?.length || 0} short-term crops for Rangareddy`);
    
    if (data && data.length > 0) {
      console.log('📋 Rangareddy Short-Term Crops:');
      data.forEach((crop, index) => {
        console.log(`${index + 1}. ${crop['Crop Name']} - ${crop['Crop Type']} - ${crop['Crop Duration']}`);
      });
    }
    
    // Also check popup table
    console.log('\n🔍 CHECKING S_T_C_PopUp1 TABLE');
    console.log('===============================');
    
    const { data: popupData, error: popupError } = await supabase
      .from('S_T_C_PopUp1')
      .select('*')
      .limit(10);
    
    if (popupError) {
      console.error('❌ Error:', popupError.message);
    } else {
      console.log(`✅ Popup table has ${popupData?.length || 0} records`);
      console.log('📋 Sample popup crops:');
      popupData?.slice(0, 5).forEach((crop, index) => {
        console.log(`${index + 1}. ${crop.Crop_Name} - Investment: ₹${crop.Investment_Per_Acre}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkShortTermCrops();

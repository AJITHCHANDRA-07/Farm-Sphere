const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkRangareddyMediumCrops() {
  try {
    console.log('🔍 CHECKING MEDIUM_TERM_CROPS FOR RANGAREDDY');
    console.log('==========================================');
    
    // Get crops specifically for Rangareddy district
    const { data, error, count } = await supabase
      .from('Medium_Term_Crops')
      .select('*', { count: 'exact' })
      .eq('Suitable Telangana District', 'Rangareddy');
    
    if (error) {
      console.log('❌ Error accessing Medium_Term_Crops:', error.message);
    } else {
      console.log('✅ Successfully accessed Medium_Term_Crops table');
      console.log('📊 Total Rangareddy Records:', count);
      
      if (data && data.length > 0) {
        console.log('📋 Rangareddy Medium-Term Crops:');
        data.forEach((crop, index) => {
          console.log(`${index + 1}. ${crop['Crop Name']} - ${crop['Crop Type']} - ${crop['Crop Duration']}`);
        });
      } else {
        console.log('📝 No crops found for Rangareddy district');
      }
    }
    
    // Also check for variations in district names
    console.log('\n🔍 CHECKING FOR DISTRICT NAME VARIATIONS');
    console.log('========================================');
    
    const { data: allData, error: allError } = await supabase
      .from('Medium_Term_Crops')
      .select('Suitable Telangana District')
      .limit(10);
    
    if (allData) {
      const districts = [...new Set(allData.map(item => item['Suitable Telangana District']))];
      console.log('📋 Available districts:', districts);
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

checkRangareddyMediumCrops();

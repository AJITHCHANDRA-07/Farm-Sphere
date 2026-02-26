const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkMTPopUp1() {
  try {
    console.log('🔍 CHECKING M_T_C_PopUp1 TABLE');
    console.log('===============================');
    
    // Get all data from M_T_C_PopUp1 table
    const { data, error, count } = await supabase
      .from('M_T_C_PopUp1')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.log('❌ Error accessing M_T_C_PopUp1:', error.message);
    } else {
      console.log('✅ Successfully accessed M_T_C_PopUp1 table');
      console.log('📊 Total Records:', count);
      
      if (data && data.length > 0) {
        console.log('📋 Table Columns:', Object.keys(data[0]));
        console.log('');
        console.log('📄 FIRST 5 RECORDS:');
        console.log('─'.repeat(80));
        
        data.slice(0, 5).forEach((crop, index) => {
          console.log(`🌱 Record ${index + 1}:`);
          console.log(JSON.stringify(crop, null, 2));
          console.log('─'.repeat(40));
        });
        
        // Check for Rangareddy crops
        console.log('\n🔍 CHECKING FOR RANGAREDDY CROPS');
        console.log('====================================');
        
        const rangareddyCrops = data.filter(crop => 
          crop.District === 'Rangareddy' || 
          crop.district === 'Rangareddy' ||
          crop.Suitable_District === 'Rangareddy'
        );
        
        if (rangareddyCrops.length > 0) {
          console.log(`📊 Found ${rangareddyCrops.length} Rangareddy crops in M_T_C_PopUp1:`);
          rangareddyCrops.forEach((crop, index) => {
            console.log(`${index + 1}. ${crop.Crop_Name || crop['Crop Name'] || crop.name}`);
          });
        } else {
          console.log('📝 No Rangareddy crops found in M_T_C_PopUp1');
        }
        
        // Check for the 13 expected crops
        console.log('\n🔍 CHECKING FOR EXPECTED CROPS');
        console.log('================================');
        const expectedCrops = ['Papaya', 'Turmeric', 'Ginger', 'Sugarcane', 'Cotton', 'Chilli', 'Tomato', 'Brinjal', 'Onion', 'Coriander', 'Fenugreek', 'Marigold', 'Jasmine'];
        
        expectedCrops.forEach(cropName => {
          const found = data.find(crop => 
            (crop.Crop_Name || crop['Crop Name'] || crop.name || '').toLowerCase().includes(cropName.toLowerCase())
          );
          if (found) {
            console.log(`✅ ${cropName}: Found`);
          } else {
            console.log(`❌ ${cropName}: Not found`);
          }
        });
        
      } else {
        console.log('📝 Table is empty - no records found');
      }
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

checkMTPopUp1();

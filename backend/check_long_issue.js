// Check the specific issue with long-term crops
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkLongTermIssue() {
  try {
    console.log('🔍 CHECKING LONG-TERM CROPS ISSUE');
    console.log('===============================');
    
    // Check original Long_Term_Crops for Rangareddy
    const { data: originalData, error: originalError } = await supabase
      .from('Long_Term_Crops')
      .select('*')
      .eq('Suitable Telangana District', 'Rangareddy');
    
    if (originalError) {
      console.error('❌ Error:', originalError.message);
      return;
    }
    
    console.log(`✅ Original Long_Term_Crops for Rangareddy: ${originalData?.length || 0}`);
    originalData?.forEach((crop, index) => {
      console.log(`${index + 1}. ${crop['Crop Name']} - ${crop['Crop Type']}`);
    });
    
    // Check popup table for Strawberry (Perennial)
    console.log('\n🔍 CHECKING L_T_C_PopUp1 FOR STRAWBERRY');
    console.log('====================================');
    
    const { data: popupData, error: popupError } = await supabase
      .from('L_T_C_PopUp1')
      .select('*')
      .eq('Crop_Name', 'Strawberry (Perennial)');
    
    if (popupError) {
      console.error('❌ Error:', popupError.message);
    } else {
      console.log(`✅ Found ${popupData?.length || 0} Strawberry (Perennial) in popup table`);
      popupData?.forEach((crop, index) => {
        console.log(`${index + 1}. Investment: ₹${crop.Investment_Per_Acre}`);
      });
    }
    
    // Check all popup data
    console.log('\n🔍 CHECKING ALL L_T_C_PopUp1 DATA');
    console.log('=================================');
    
    const { data: allPopupData, error: allPopupError } = await supabase
      .from('L_T_C_PopUp1')
      .select('*');
    
    if (allPopupError) {
      console.error('❌ Error:', allPopupError.message);
    } else {
      console.log(`✅ Total popup records: ${allPopupData?.length || 0}`);
      
      // Check if Strawberry (Perennial) exists in popup
      const strawberryExists = allPopupData?.some(crop => 
        crop.Crop_Name === 'Strawberry (Perennial)'
      );
      console.log(`🎯 Strawberry (Perennial) exists in popup: ${strawberryExists ? 'YES' : 'NO'}`);
      
      if (strawberryExists) {
        const strawberry = allPopupData?.find(crop => 
          crop.Crop_Name === 'Strawberry (Perennial)'
        );
        console.log(`📋 Strawberry popup data:`, strawberry);
      }
    }
    
    // Test the merging logic
    console.log('\n🔍 TESTING MERGING LOGIC');
    console.log('========================');
    
    if (originalData && allPopupData) {
      const strawberryOriginal = originalData.find(crop => 
        crop['Crop Name'] === 'Strawberry (Perennial)'
      );
      
      const strawberryPopup = allPopupData.find(crop => 
        crop.Crop_Name === 'Strawberry (Perennial)'
      );
      
      console.log(`📋 Original Strawberry:`, strawberryOriginal ? 'FOUND' : 'NOT FOUND');
      console.log(`📋 Popup Strawberry:`, strawberryPopup ? 'FOUND' : 'NOT FOUND');
      
      if (strawberryOriginal && strawberryPopup) {
        console.log('🌱 Both found - should merge correctly');
        const merged = { ...strawberryPopup, ...strawberryOriginal };
        console.log('📋 Merged data:', merged);
      } else {
        console.log('❌ Missing data - this is the problem');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkLongTermIssue();

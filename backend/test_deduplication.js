const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testDeduplication() {
  try {
    console.log('🔍 TESTING DEDUPLICATION LOGIC');
    console.log('==============================');
    
    const medicinalCrops = [
      'Pippali', 'Mandukaparni', 'Amalaki', 'Kaunch', 'Jeevanti', 
      'Jatamansi', 'Guduchi', 'Shatavari', 'Brahmi', 'Vacha', 'Bhringraj', 'Arjuna'
    ];
    
    // 🎯 FETCH FROM POPUP TABLE (filtered)
    const { data: popupData, error: popupError } = await supabase
      .from('M_T_C_PopUp1')
      .select('*')
      .in('Crop_Name', medicinalCrops);
    
    // 🎯 FETCH FROM ORIGINAL TABLE (filtered)
    const { data: originalData, error: originalError } = await supabase
      .from('Medium_Term_Crops')
      .select('*')
      .eq('Suitable Telangana District', 'Rangareddy')
      .in('Crop Name', medicinalCrops);
    
    if (popupError || originalError) {
      console.error('❌ Error:', popupError || originalError);
      return;
    }
    
    console.log(`✅ Popup data: ${popupData?.length || 0} crops (with duplicates)`);
    console.log(`✅ Original data: ${originalData?.length || 0} crops`);
    
    // 🎯 REMOVE DUPLICATES FROM POPUP DATA
    const uniquePopupData = popupData.filter((popupCrop, index, self) => 
      index === self.findIndex(c => c.Crop_Name === popupCrop.Crop_Name)
    );
    
    console.log(`🎯 After deduplication: ${uniquePopupData.length} unique popup crops`);
    
    console.log('\n📋 Unique popup crops:');
    uniquePopupData.forEach((crop, index) => {
      console.log(`${index + 1}. ${crop.Crop_Name} - Investment: ₹${crop.Investment_Per_Acre}`);
    });
    
    // 🎯 MERGE DATA FROM BOTH TABLES
    const mergedCrops = uniquePopupData.map((popupCrop) => {
      const originalCrop = originalData.find(orig => 
        orig['Crop Name'] === popupCrop['Crop_Name']
      );
      
      if (originalCrop) {
        console.log(`🌱 Merged: ${popupCrop['Crop_Name']}`);
        return {
          ...popupCrop,
          ...originalCrop
        };
      } else {
        console.log(`⚠️ No match found for ${popupCrop['Crop_Name']}`);
        return popupCrop;
      }
    });
    
    console.log(`\n🎯 Final merged crops: ${mergedCrops.length}`);
    mergedCrops.forEach((crop, index) => {
      console.log(`${index + 1}. ${crop.Crop_Name || crop['Crop Name']} - District: ${crop['Suitable Telangana District']}`);
    });
    
    console.log('\n✅ SUCCESS: Ready for frontend display!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDeduplication();

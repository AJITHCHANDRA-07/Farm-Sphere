const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testUpdatedGetCrops() {
  try {
    console.log('🔍 TESTING UPDATED getCropsByCategory FUNCTION');
    console.log('==========================================');
    
    const category = 'medium';
    const popupTableName = 'M_T_C_PopUp1';
    const originalTableName = 'Medium_Term_Crops';
    
    const medicinalCrops = [
      'Pippali', 'Mandukaparni', 'Amalaki', 'Kaunch', 'Jeevanti', 
      'Jatamansi', 'Guduchi', 'Shatavari', 'Brahmi', 'Vacha', 'Bhringraj', 'Arjuna'
    ];
    
    console.log('🎯 Medicinal crops to filter:', medicinalCrops);
    
    // 🎯 FETCH FROM POPUP TABLE (filtered)
    const { data: popupData, error: popupError } = await supabase
      .from(popupTableName)
      .select('*')
      .in('Crop_Name', medicinalCrops);
    
    // 🎯 FETCH FROM ORIGINAL TABLE (filtered)
    const { data: originalData, error: originalError } = await supabase
      .from(originalTableName)
      .select('*')
      .eq('Suitable Telangana District', 'Rangareddy')
      .in('Crop Name', medicinalCrops);
    
    if (popupError || originalError) {
      console.error('❌ Error:', popupError || originalError);
      return;
    }
    
    console.log(`✅ Popup data: ${popupData?.length || 0} medicinal crops`);
    console.log(`✅ Original data: ${originalData?.length || 0} Rangareddy medicinal crops`);
    
    console.log('\n📋 Popup crops found:');
    popupData?.forEach((crop, index) => {
      console.log(`${index + 1}. ${crop.Crop_Name} - Investment: ₹${crop.Investment_Per_Acre}`);
    });
    
    console.log('\n📋 Original crops found:');
    originalData?.forEach((crop, index) => {
      console.log(`${index + 1}. ${crop['Crop Name']} - District: ${crop['Suitable Telangana District']}`);
    });
    
    // 🎯 MERGE DATA FROM BOTH TABLES
    if (popupData && originalData && popupData.length > 0 && originalData.length > 0) {
      const mergedCrops = popupData.map((popupCrop) => {
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
        console.log(`${index + 1}. ${crop.Crop_Name || crop['Crop Name']}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testUpdatedGetCrops();

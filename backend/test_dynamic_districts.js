// Test dynamic district crop loading
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Simulate the updated getCropsByCategory function
async function getCropsByCategory(category, district) {
  try {
    const targetDistrict = district || 'Rangareddy';
    console.log(`🔍 Fetching ${category}-term crops for district: ${targetDistrict}`);
    
    const popupTableName = category === 'short' ? 'S_T_C_PopUp1' : 
                        category === 'medium' ? 'M_T_C_PopUp1' : 'L_T_C_PopUp1';
    
    const originalTableName = category === 'short' ? 'Short_Term_Crops' : 
                          category === 'medium' ? 'Medium_Term_Crops' : 'Long_Term_Crops';
    
    console.log(`🔍 Fetching from: ${popupTableName} + ${originalTableName}`);
    
    // 🎯 FETCH FROM POPUP TABLE
    let popupQuery = supabase.from(popupTableName).select('*');
    
    if (category === 'medium') {
      const medicinalCrops = [
        'Pippali', 'Mandukaparni', 'Amalaki', 'Kaunch', 'Jeevanti', 
        'Jatamansi', 'Guduchi', 'Shatavari', 'Brahmi', 'Vacha', 'Bhringraj', 'Arjuna'
      ];
      
      popupQuery = popupQuery.in('Crop_Name', medicinalCrops);
    }
    
    const { data: popupData, error: popupError } = await popupQuery;
    
    // 🎯 FETCH FROM ORIGINAL TABLE WITH DYNAMIC DISTRICT
    let originalQuery = supabase.from(originalTableName).select('*');
    
    if (category === 'medium') {
      const medicinalCrops = [
        'Pippali', 'Mandukaparni', 'Amalaki', 'Kaunch', 'Jeevanti', 
        'Jatamansi', 'Guduchi', 'Shatavari', 'Brahmi', 'Vacha', 'Bhringraj', 'Arjuna'
      ];
      
      originalQuery = originalQuery
        .eq('Suitable Telangana District', targetDistrict)
        .in('Crop Name', medicinalCrops);
    } else if (category === 'short') {
      originalQuery = originalQuery
        .eq('Suitable Telangana District', targetDistrict);
    } else if (category === 'long') {
      originalQuery = originalQuery
        .eq('Suitable Telangana District', targetDistrict);
    }
    
    const { data: originalData, error: originalError } = await originalQuery;
    
    if (popupError || originalError) {
      console.error(`Error fetching ${category} crops:`, popupError || originalError);
      return [];
    }
    
    console.log(`🌱 Popup data: ${popupData?.length || 0} crops`);
    console.log(`🌱 Original data: ${originalData?.length || 0} crops`);
    
    if (popupData && originalData && popupData.length > 0 && originalData.length > 0) {
      // 🎯 FOR LONG TERM: FILTER POPUP DATA TO MATCH DISTRICT ORIGINAL CROPS
      let filteredPopupData = popupData;
      if (category === 'long') {
        const districtCropNames = originalData.map(orig => orig['Crop Name']);
        filteredPopupData = popupData.filter(popupCrop => 
          districtCropNames.includes(popupCrop.Crop_Name)
        );
        console.log(`🎯 Filtered popup data for long-term: ${filteredPopupData.length} crops match ${targetDistrict}`);
      }
      
      // 🎯 REMOVE DUPLICATES
      const uniquePopupData = filteredPopupData.filter((popupCrop, index, self) => 
        index === self.findIndex(c => c.Crop_Name === popupCrop.Crop_Name)
      );
      
      // 🎯 MERGE DATA
      const mergedCrops = uniquePopupData.map((popupCrop, index) => {
        const originalCrop = originalData.find(orig => 
          orig['Crop Name'] === popupCrop['Crop Name'] || 
          orig['Crop Name'] === popupCrop['Crop_Name']
        );
        
        if (originalCrop) {
          console.log(`🌱 Merged: ${popupCrop['Crop Name'] || popupCrop['Crop_Name']}`);
          return { ...popupCrop, ...originalCrop };
        } else {
          console.log(`⚠️ No match found for ${popupCrop['Crop Name'] || popupCrop['Crop_Name']}`);
          return popupCrop;
        }
      });
      
      // 🎯 FOR SHORT TERM AND LONG TERM: ADD ORIGINAL CROPS WITHOUT POPUP DATA
      if (category === 'short' || category === 'long') {
        const originalCropNames = uniquePopupData.map(p => p.Crop_Name);
        const originalCropsWithoutPopup = originalData.filter(orig => 
          !originalCropNames.includes(orig['Crop Name'])
        );
        
        const originalCropsMapped = originalCropsWithoutPopup.map(originalCrop => {
          console.log(`🌱 Adding original-only crop: ${originalCrop['Crop Name']}`);
          return originalCrop;
        });
        
        const allCrops = [...mergedCrops, ...originalCropsMapped];
        console.log(`🎯 Final ${category}-term crops for ${targetDistrict}: ${allCrops.length}`);
        return allCrops;
      }
      
      console.log(`🎯 Final merged crops: ${mergedCrops.length}`);
      return mergedCrops;
    }
    
    console.log(`📝 No database data found for ${category}-term crops in ${targetDistrict}`);
    return [];
    
  } catch (error) {
    console.error(`Error in getCropsByCategory for ${category}:`, error);
    return [];
  }
}

async function testDynamicDistricts() {
  try {
    console.log('🔍 TESTING DYNAMIC DISTRICT CROP LOADING');
    console.log('=======================================');
    
    // Test different districts
    const districts = ['Rangareddy', 'Hyderabad', 'Warangal', 'Medak'];
    
    for (const district of districts) {
      console.log(`\n📋 TESTING DISTRICT: ${district}`);
      console.log('='.repeat(40));
      
      // Test short-term crops
      const shortCrops = await getCropsByCategory('short', district);
      console.log(`🌱 Short-term crops: ${shortCrops.length}`);
      shortCrops.forEach((crop, index) => {
        console.log(`   ${index + 1}. ${crop['Crop Name']} - ${crop['Crop Type']}`);
      });
      
      // Test medium-term crops
      const mediumCrops = await getCropsByCategory('medium', district);
      console.log(`🌱 Medium-term crops: ${mediumCrops.length}`);
      mediumCrops.forEach((crop, index) => {
        console.log(`   ${index + 1}. ${crop['Crop Name']} - ${crop['Crop Type']}`);
      });
      
      // Test long-term crops
      const longCrops = await getCropsByCategory('long', district);
      console.log(`🌱 Long-term crops: ${longCrops.length}`);
      longCrops.forEach((crop, index) => {
        console.log(`   ${index + 1}. ${crop['Crop Name']} - ${crop['Crop Type']}`);
      });
      
      console.log(`📊 ${district} Summary: Short=${shortCrops.length}, Medium=${mediumCrops.length}, Long=${longCrops.length}`);
    }
    
    console.log('\n✅ DYNAMIC DISTRICT LOADING TEST COMPLETE!');
    console.log('🎯 Each district now shows its specific crops from the database');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDynamicDistricts();

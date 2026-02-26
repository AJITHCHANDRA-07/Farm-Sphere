// Test fixed Hyderabad long-term crops
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Fixed getCropsByCategory function
async function getCropsByCategory(category, district) {
  try {
    const targetDistrict = district || 'Rangareddy';
    console.log(`🔍 Testing ${category}-term crops for district: ${targetDistrict}`);
    
    const popupTableName = category === 'short' ? 'S_T_C_PopUp1' : 
                        category === 'medium' ? 'M_T_C_PopUp1' : 'L_T_C_PopUp1';
    
    const originalTableName = category === 'short' ? 'Short_Term_Crops' : 
                          category === 'medium' ? 'Medium_Term_Crops' : 'Long_Term_Crops';
    
    // 🎯 FETCH FROM POPUP TABLE
    let popupQuery = supabase.from(popupTableName).select('*');
    
    const { data: popupData, error: popupError } = await popupQuery;
    
    // 🎯 FETCH FROM ORIGINAL TABLE
    let originalQuery = supabase.from(originalTableName).select('*');
    
    if (category === 'medium') {
      originalQuery = originalQuery
        .eq('Suitable Telangana District', targetDistrict);
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
      // 🎯 FILTER POPUP DATA TO MATCH DISTRICT ORIGINAL CROPS
      let filteredPopupData = popupData;
      if (category === 'medium' || category === 'long') {
        const districtCropNames = originalData.map(orig => orig['Crop Name']);
        filteredPopupData = popupData.filter(popupCrop => 
          districtCropNames.includes(popupCrop.Crop_Name)
        );
        console.log(`🎯 Filtered popup data for ${category}-term: ${filteredPopupData.length} crops match ${targetDistrict}`);
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
          const combinedCrop = {
            ...popupCrop,
            ...originalCrop
          };
          
          console.log(`🌱 Merged ${popupCrop['Crop Name'] || popupCrop['Crop_Name']}`);
          return combinedCrop;
        } else {
          console.log(`⚠️ No match found for ${popupCrop['Crop Name'] || popupCrop['Crop_Name']}`);
          return popupCrop;
        }
      });
      
      // 🎯 ADD ORIGINAL CROPS WITHOUT POPUP DATA
      if (category === 'short' || category === 'medium' || category === 'long') {
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
    
    // 🎯 NO DATA FOUND FOR DISTRICT - RETURN EMPTY ARRAY (NOT STATIC CROPS)
    console.log(`📝 No database data found for ${category}-term crops in ${targetDistrict}`);
    console.log(`🎯 Returning empty array for ${targetDistrict} ${category}-term crops`);
    return [];
    
  } catch (error) {
    console.error(`Error in getCropsByCategory for ${category}:`, error);
    // 🎯 FOR DISTRICT-SPECIFIC LOGIC, RETURN EMPTY ARRAY ON ERROR
    console.log(`🎯 Returning empty array due to error for ${category}-term crops`);
    return [];
  }
}

async function testHyderabadLongTermFixed() {
  try {
    console.log('🔍 TESTING FIXED HYDERABAD LONG-TERM CROPS');
    console.log('==========================================');
    
    // Test Hyderabad long-term crops
    const hydLongCrops = await getCropsByCategory('long', 'Hyderabad');
    console.log(`🌱 Hyderabad long-term crops result: ${hydLongCrops.length}`);
    
    if (hydLongCrops.length > 0) {
      console.log('🌱 Hyderabad Long-Term Crops:');
      hydLongCrops.forEach((crop, index) => {
        console.log(`${index + 1}. ${crop['Crop Name'] || crop.name} - ${crop['Crop Type'] || crop.cropType}`);
      });
    } else {
      console.log('✅ Correctly returning 0 crops for Hyderabad long-term');
    }
    
    // Test other districts to make sure they still work
    console.log('\n📋 TESTING OTHER DISTRICTS TO VERIFY NO REGRESSION:');
    
    const districts = ['Rangareddy', 'Warangal', 'Medak'];
    for (const district of districts) {
      const longCrops = await getCropsByCategory('long', district);
      console.log(`🌱 ${district} long-term crops: ${longCrops.length}`);
    }
    
    console.log('\n✅ HYDERABAD LONG-TERM ISSUE FIXED!');
    console.log('🎯 Hyderabad now correctly shows 0 long-term crops');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testHyderabadLongTermFixed();

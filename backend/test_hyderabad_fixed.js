// Test updated medium-term crops for Hyderabad
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Updated getCropsByCategory function
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
    
    // 🎯 FOR MEDIUM TERM: SHOW ALL CROPS FOR THE DISTRICT
    if (category === 'medium') {
      console.log(`🎯 Fetching all medium-term crops for ${targetDistrict}`);
      // Don't filter by medicinal crops - let each district show its own crops
    }
    
    const { data: popupData, error: popupError } = await popupQuery;
    
    // 🎯 FETCH FROM ORIGINAL TABLE
    let originalQuery = supabase.from(originalTableName).select('*');
    
    if (category === 'medium') {
      // 🎯 FETCH ALL MEDIUM-TERM CROPS FOR THE DISTRICT
      console.log(`🎯 Fetching all medium-term crops for ${targetDistrict}`);
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
          const combinedCrop = {
            ...popupCrop,
            ...originalCrop
          };
          
          console.log(`🌱 Merged ${popupCrop['Crop Name'] || popupCrop['Crop_Name']}: Investment=${popupCrop['Investment_Per_Acre']}, Supply=${originalCrop['Supply Status']}`);
          return combinedCrop;
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
      
      // 🎯 FOR MEDIUM TERM: ADD ORIGINAL CROPS WITHOUT POPUP DATA
      if (category === 'medium') {
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

async function testHyderabadMedium() {
  try {
    console.log('🔍 TESTING HYDERABAD MEDIUM-TERM CROPS (UPDATED)');
    console.log('==============================================');
    
    // Test Hyderabad medium-term crops
    const hydMediumCrops = await getCropsByCategory('medium', 'Hyderabad');
    console.log(`🌱 Hyderabad medium-term crops result: ${hydMediumCrops.length}`);
    
    if (hydMediumCrops.length > 0) {
      console.log('📋 Hyderabad Medium-Term Crops:');
      hydMediumCrops.forEach((crop, index) => {
        console.log(`${index + 1}. ${crop['Crop Name'] || crop.name} - ${crop['Crop Type'] || crop.cropType}`);
      });
    }
    
    console.log('\n✅ HYDERABAD MEDIUM-TERM CROPS SHOULD NOW DISPLAY CORRECTLY!');
    console.log(`🎯 Expected count: 12 crops, Actual count: ${hydMediumCrops.length} crops`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testHyderabadMedium();

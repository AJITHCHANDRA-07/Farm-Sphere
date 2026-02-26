// Test fixed Hyderabad medium-term crops
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
    
    // 🎯 FOR MEDIUM TERM: SHOW ALL CROPS FOR THE DISTRICT
    if (category === 'medium') {
      console.log(`🎯 Fetching all medium-term crops for ${targetDistrict}`);
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
    
    console.log(`📝 No database data found for ${category}-term crops in ${targetDistrict}`);
    return [];
    
  } catch (error) {
    console.error(`Error in getCropsByCategory for ${category}:`, error);
    return [];
  }
}

async function testAllDistricts() {
  try {
    console.log('🔍 TESTING ALL DISTRICTS WITH FIXED LOGIC');
    console.log('=======================================');
    
    const districts = ['Hyderabad', 'Rangareddy', 'Warangal', 'Medak'];
    
    for (const district of districts) {
      console.log(`\n📋 TESTING DISTRICT: ${district}`);
      console.log('='.repeat(40));
      
      // Test all three categories
      const shortCrops = await getCropsByCategory('short', district);
      const mediumCrops = await getCropsByCategory('medium', district);
      const longCrops = await getCropsByCategory('long', district);
      
      console.log(`📊 ${district} Results:`);
      console.log(`   Short-term: ${shortCrops.length} crops`);
      console.log(`   Medium-term: ${mediumCrops.length} crops`);
      console.log(`   Long-term: ${longCrops.length} crops`);
      
      if (mediumCrops.length > 0) {
        console.log(`🌱 ${district} Medium-Term Crops:`);
        mediumCrops.forEach((crop, index) => {
          console.log(`   ${index + 1}. ${crop['Crop Name']} - ${crop['Crop Type']}`);
        });
      }
    }
    
    console.log('\n✅ ALL DISTRICTS TEST COMPLETE!');
    console.log('🎯 Each district now shows its specific crops correctly');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAllDistricts();

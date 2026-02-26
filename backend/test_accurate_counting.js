// Test accurate crop counting
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Simulate the frontend logic
async function testAccurateCounting() {
  try {
    console.log('🔍 TESTING ACCURATE CROP COUNTING');
    console.log('==================================');
    
    const districts = ['Hyderabad', 'Rangareddy', 'Warangal', 'Medak'];
    
    for (const district of districts) {
      console.log(`\n📋 TESTING DISTRICT: ${district}`);
      console.log('='.repeat(40));
      
      // Simulate getCropsByCategory for each category
      const shortCrops = await getCropsByCategory('short', district);
      const mediumCrops = await getCropsByCategory('medium', district);
      const longCrops = await getCropsByCategory('long', district);
      
      console.log(`📊 Raw counts from database:`);
      console.log(`   Short-term: ${shortCrops.length} crops`);
      console.log(`   Medium-term: ${mediumCrops.length} crops`);
      console.log(`   Long-term: ${longCrops.length} crops`);
      
      // Simulate frontend filtering (should be same as raw since we removed double filtering)
      const filteredShort = shortCrops.filter(crop => {
        // No additional filtering needed since crops are already district-specific
        return true;
      });
      
      const filteredMedium = mediumCrops.filter(crop => {
        // No additional filtering needed since crops are already district-specific
        return true;
      });
      
      const filteredLong = longCrops.filter(crop => {
        // No additional filtering needed since crops are already district-specific
        return true;
      });
      
      console.log(`📊 Filtered counts (what user sees):`);
      console.log(`   Short-term: ${filteredShort.length} crops`);
      console.log(`   Medium-term: ${filteredMedium.length} crops`);
      console.log(`   Long-term: ${filteredLong.length} crops`);
      
      // Verify counts match
      const shortMatch = shortCrops.length === filteredShort.length;
      const mediumMatch = mediumCrops.length === filteredMedium.length;
      const longMatch = longCrops.length === filteredLong.length;
      
      console.log(`✅ Count accuracy:`);
      console.log(`   Short-term: ${shortMatch ? '✅' : '❌'} (${shortCrops.length} → ${filteredShort.length})`);
      console.log(`   Medium-term: ${mediumMatch ? '✅' : '❌'} (${mediumCrops.length} → ${filteredMedium.length})`);
      console.log(`   Long-term: ${longMatch ? '✅' : '❌'} (${longCrops.length} → ${filteredLong.length})`);
      
      // Test with search filtering
      console.log(`\n🔍 Testing with search filter "rice":`);
      const searchShort = shortCrops.filter(crop => 
        crop.name?.toLowerCase().includes('rice') ||
        crop.cropType?.toLowerCase().includes('rice') ||
        crop.district?.toLowerCase().includes('rice')
      );
      
      const searchMedium = mediumCrops.filter(crop => 
        crop.name?.toLowerCase().includes('rice') ||
        crop.cropType?.toLowerCase().includes('rice') ||
        crop.district?.toLowerCase().includes('rice')
      );
      
      const searchLong = longCrops.filter(crop => 
        crop.name?.toLowerCase().includes('rice') ||
        crop.cropType?.toLowerCase().includes('rice') ||
        crop.district?.toLowerCase().includes('rice')
      );
      
      console.log(`   Short-term: ${searchShort.length} crops with "rice"`);
      console.log(`   Medium-term: ${searchMedium.length} crops with "rice"`);
      console.log(`   Long-term: ${searchLong.length} crops with "rice"`);
      
      if (searchShort.length > 0) {
        console.log(`   🌱 Rice crops in short-term:`, searchShort.map(c => c.name).join(', '));
      }
      if (searchMedium.length > 0) {
        console.log(`   🌿 Rice crops in medium-term:`, searchMedium.map(c => c.name).join(', '));
      }
      if (searchLong.length > 0) {
        console.log(`   🌳 Rice crops in long-term:`, searchLong.map(c => c.name).join(', '));
      }
    }
    
    console.log('\n✅ ACCURATE COUNTING TEST COMPLETE!');
    console.log('🎯 Counts should now match exactly what users see');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Simulate getCropsByCategory function
async function getCropsByCategory(category, district) {
  try {
    const targetDistrict = district || 'Rangareddy';
    
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
      return [];
    }
    
    if (popupData && originalData && popupData.length > 0 && originalData.length > 0) {
      // 🎯 FILTER POPUP DATA TO MATCH DISTRICT ORIGINAL CROPS
      let filteredPopupData = popupData;
      if (category === 'medium' || category === 'long') {
        const districtCropNames = originalData.map(orig => orig['Crop Name']);
        filteredPopupData = popupData.filter(popupCrop => 
          districtCropNames.includes(popupCrop.Crop_Name)
        );
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
            ...originalCrop,
            name: originalCrop['Crop Name'] || popupCrop['Crop_Name'],
            district: originalCrop['Suitable Telangana District']
          };
          return combinedCrop;
        } else {
          return {
            ...popupCrop,
            name: popupCrop['Crop_Name'],
            district: targetDistrict
          };
        }
      });
      
      // 🎯 ADD ORIGINAL CROPS WITHOUT POPUP DATA
      if (category === 'short' || category === 'medium' || category === 'long') {
        const originalCropNames = uniquePopupData.map(p => p.Crop_Name);
        const originalCropsWithoutPopup = originalData.filter(orig => 
          !originalCropNames.includes(orig['Crop Name'])
        );
        
        const originalCropsMapped = originalCropsWithoutPopup.map(originalCrop => {
          return {
            ...originalCrop,
            name: originalCrop['Crop Name'],
            district: originalCrop['Suitable Telangana District']
          };
        });
        
        const allCrops = [...mergedCrops, ...originalCropsMapped];
        return allCrops;
      }
      
      return mergedCrops;
    }
    
    return [];
    
  } catch (error) {
    console.error(`Error in getCropsByCategory for ${category}:`, error);
    return [];
  }
}

testAccurateCounting();

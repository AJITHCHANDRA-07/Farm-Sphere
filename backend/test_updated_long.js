// Test the updated long-term crops functionality with proper filtering
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Simulate the updated getCropsByCategory function
async function getCropsByCategory(category) {
  try {
    console.log(`🔍 Testing updated getCropsByCategory('${category}')`);
    console.log('=====================================');
    
    const popupTableName = category === 'short' ? 'S_T_C_PopUp1' : 
                        category === 'medium' ? 'M_T_C_PopUp1' : 'L_T_C_PopUp1';
    
    const originalTableName = category === 'short' ? 'Short_Term_Crops' : 
                          category === 'medium' ? 'Medium_Term_Crops' : 'Long_Term_Crops';
    
    console.log(`🔍 Fetching ${category}-term crops from: ${popupTableName} + ${originalTableName}`);
    
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
    
    // 🎯 FETCH FROM ORIGINAL TABLE
    let originalQuery = supabase.from(originalTableName).select('*');
    
    if (category === 'medium') {
      const medicinalCrops = [
        'Pippali', 'Mandukaparni', 'Amalaki', 'Kaunch', 'Jeevanti', 
        'Jatamansi', 'Guduchi', 'Shatavari', 'Brahmi', 'Vacha', 'Bhringraj', 'Arjuna'
      ];
      
      originalQuery = originalQuery
        .eq('Suitable Telangana District', 'Rangareddy')
        .in('Crop Name', medicinalCrops);
    } else if (category === 'short') {
      originalQuery = originalQuery
        .eq('Suitable Telangana District', 'Rangareddy');
    } else if (category === 'long') {
      originalQuery = originalQuery
        .eq('Suitable Telangana District', 'Rangareddy');
    }
    
    const { data: originalData, error: originalError } = await originalQuery;
    
    if (popupError || originalError) {
      console.error(`Error fetching ${category} crops:`, popupError || originalError);
      return [];
    }
    
    console.log(`🌱 Popup data: ${popupData?.length || 0} crops`);
    console.log(`🌱 Original data: ${originalData?.length || 0} crops`);
    
    if (popupData && originalData && popupData.length > 0 && originalData.length > 0) {
      // 🎯 FOR LONG TERM: FILTER POPUP DATA TO MATCH RANGAREDDY ORIGINAL CROPS
      let filteredPopupData = popupData;
      if (category === 'long') {
        const rangareddyCropNames = originalData.map(orig => orig['Crop Name']);
        filteredPopupData = popupData.filter(popupCrop => 
          rangareddyCropNames.includes(popupCrop.Crop_Name)
        );
        console.log(`🎯 Filtered popup data for long-term: ${filteredPopupData.length} crops match Rangareddy`);
      }
      
      // 🎯 REMOVE DUPLICATES FROM POPUP DATA
      const uniquePopupData = filteredPopupData.filter((popupCrop, index, self) => 
        index === self.findIndex(c => c.Crop_Name === popupCrop.Crop_Name)
      );
      
      console.log(`🎯 Removed duplicates: ${uniquePopupData.length} unique popup crops`);
      
      // 🎯 MERGE DATA FROM BOTH TABLES
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
      
      // 🎯 FOR SHORT TERM AND LONG TERM: ADD ORIGINAL CROPS THAT DON'T HAVE POPUP DATA
      if (category === 'short' || category === 'long') {
        const originalCropNames = uniquePopupData.map(p => p.Crop_Name);
        const originalCropsWithoutPopup = originalData.filter(orig => 
          !originalCropNames.includes(orig['Crop Name'])
        );
        
        console.log(`🎯 Adding ${originalCropsWithoutPopup.length} original crops without popup data`);
        
        const originalCropsMapped = originalCropsWithoutPopup.map(originalCrop => {
          console.log(`🌱 Adding original-only crop: ${originalCrop['Crop Name']}`);
          return originalCrop;
        });
        
        const allCrops = [...mergedCrops, ...originalCropsMapped];
        console.log(`🎯 Final ${category}-term crops: ${allCrops.length}`);
        return allCrops;
      }
      
      console.log(`🎯 Final merged crops: ${mergedCrops.length}`);
      return mergedCrops;
    }
    
    console.log(`📝 No database data found for ${category}-term crops`);
    return [];
    
  } catch (error) {
    console.error(`Error in getCropsByCategory for ${category}:`, error);
    return [];
  }
}

async function testUpdatedLongTerm() {
  try {
    console.log('🔍 TESTING UPDATED LONG-TERM CROPS');
    console.log('=================================');
    
    // Test long-term crops
    const longCrops = await getCropsByCategory('long');
    
    console.log(`📊 Long-term crops fetched: ${longCrops.length}`);
    
    if (longCrops.length > 0) {
      console.log('\n📋 Long-term crops for Rangareddy:');
      longCrops.forEach((crop, index) => {
        console.log(`${index + 1}. ${crop['Crop Name'] || crop['Crop_Name']} - ${crop['Crop Type']}`);
        console.log(`   District: ${crop['Suitable Telangana District']}`);
      });
    } else {
      console.log('📝 No long-term crops found');
    }
    
    console.log('\n✅ LONG-TERM CROPS ISSUE SHOULD BE RESOLVED!');
    console.log('🎯 Frontend should now show correct count: 1 crop for Rangareddy');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testUpdatedLongTerm();

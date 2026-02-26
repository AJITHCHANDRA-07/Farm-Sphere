// Debug Hyderabad long-term crop issue
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function debugHyderabadLongTerm() {
  try {
    console.log('🔍 DEBUGGING HYDERABAD LONG-TERM CROP ISSUE');
    console.log('==========================================');
    
    // 1. Check Long_Term_Crops table for Hyderabad
    console.log('\n📋 STEP 1: CHECKING Long_Term_Crops TABLE FOR HYDERABAD');
    const { data: hydLongData, error: hydLongError } = await supabase
      .from('Long_Term_Crops')
      .select('*')
      .eq('Suitable Telangana District', 'Hyderabad');
    
    if (hydLongError) {
      console.error('❌ Error:', hydLongError.message);
      return;
    }
    
    console.log(`✅ Found ${hydLongData?.length || 0} long-term crops for Hyderabad in database`);
    if (hydLongData && hydLongData.length > 0) {
      console.log('🌱 Hyderabad Long-Term Crops in database:');
      hydLongData.forEach((crop, index) => {
        console.log(`${index + 1}. ${crop['Crop Name']} - ${crop['Crop Type']}`);
      });
    } else {
      console.log('📝 No long-term crops found for Hyderabad in database');
    }
    
    // 2. Check L_T_C_PopUp1 table
    console.log('\n📋 STEP 2: CHECKING L_T_C_PopUp1 TABLE');
    const { data: popupData, error: popupError } = await supabase
      .from('L_T_C_PopUp1')
      .select('*')
      .limit(10); // Just check first 10 to see structure
    
    if (popupError) {
      console.error('❌ Popup error:', popupError.message);
    } else {
      console.log(`✅ Found ${popupData?.length || 0} total crops in L_T_C_PopUp1 table`);
      if (popupData && popupData.length > 0) {
        console.log('📋 Sample popup crops:');
        popupData.forEach((crop, index) => {
          console.log(`${index + 1}. ${crop.Crop_Name} - District: ${crop['Suitable Telangana District'] || 'Not specified'}`);
        });
      }
    }
    
    // 3. Simulate the complete getCropsByCategory logic for Hyderabad long-term
    console.log('\n📋 STEP 3: SIMULATING getCropsByCategory FOR HYDERABAD LONG-TERM');
    
    const category = 'long';
    const district = 'Hyderabad';
    
    const popupTableName = 'L_T_C_PopUp1';
    const originalTableName = 'Long_Term_Crops';
    
    // Fetch from popup table
    console.log(`🔍 Fetching from ${popupTableName}...`);
    const { data: popupDataFull, error: popupErrorFull } = await supabase
      .from(popupTableName)
      .select('*');
    
    // Fetch from original table
    console.log(`🔍 Fetching from ${originalTableName} for Hyderabad...`);
    const { data: originalDataFull, error: originalErrorFull } = await supabase
      .from(originalTableName)
      .select('*')
      .eq('Suitable Telangana District', district);
    
    if (popupErrorFull || originalErrorFull) {
      console.error('❌ Error:', popupErrorFull || originalErrorFull);
      return;
    }
    
    console.log(`🌱 Popup data: ${popupDataFull?.length || 0} crops`);
    console.log(`🌱 Original data: ${originalDataFull?.length || 0} crops`);
    
    // 4. Check the filtering logic
    if (popupDataFull && originalDataFull && popupDataFull.length > 0 && originalDataFull.length > 0) {
      console.log('\n📋 STEP 4: CHECKING FILTERING LOGIC');
      
      // Filter popup data to match district original crops
      const districtCropNames = originalDataFull.map(orig => orig['Crop Name']);
      console.log(`🎯 District crop names: ${districtCropNames.join(', ')}`);
      
      const filteredPopupData = popupDataFull.filter(popupCrop => 
        districtCropNames.includes(popupCrop.Crop_Name)
      );
      
      console.log(`🎯 Filtered popup data: ${filteredPopupData.length} crops match Hyderabad`);
      
      if (filteredPopupData.length > 0) {
        console.log('🌱 Matched popup crops:');
        filteredPopupData.forEach((crop, index) => {
          console.log(`${index + 1}. ${crop.Crop_Name}`);
        });
      }
      
      // Remove duplicates
      const uniquePopupData = filteredPopupData.filter((popupCrop, index, self) => 
        index === self.findIndex(c => c.Crop_Name === popupCrop.Crop_Name)
      );
      
      console.log(`🎯 After removing duplicates: ${uniquePopupData.length} unique popup crops`);
      
      // Merge data
      const mergedCrops = uniquePopupData.map((popupCrop, index) => {
        const originalCrop = originalDataFull.find(orig => 
          orig['Crop Name'] === popupCrop['Crop Name'] || 
          orig['Crop Name'] === popupCrop['Crop_Name']
        );
        
        if (originalCrop) {
          console.log(`🌱 Merged: ${popupCrop['Crop Name']}`);
          return { ...popupCrop, ...originalCrop };
        } else {
          console.log(`⚠️ No match found for ${popupCrop['Crop Name']}`);
          return popupCrop;
        }
      });
      
      // Add original crops without popup data
      const originalCropNames = uniquePopupData.map(p => p.Crop_Name);
      const originalCropsWithoutPopup = originalDataFull.filter(orig => 
        !originalCropNames.includes(orig['Crop Name'])
      );
      
      console.log(`🎯 Original crops without popup data: ${originalCropsWithoutPopup.length}`);
      
      const allCrops = [...mergedCrops, ...originalCropsWithoutPopup];
      console.log(`🎯 Final result: ${allCrops.length} crops for Hyderabad long-term`);
      
      if (allCrops.length > 0) {
        console.log('🌱 Final crops list:');
        allCrops.forEach((crop, index) => {
          console.log(`${index + 1}. ${crop['Crop Name'] || crop.name} - Source: ${crop['Crop Name'] ? 'Popup+Original' : 'Original Only'}`);
        });
      }
      
    } else {
      console.log('📝 No data to process - should return 0 crops');
    }
    
    // 5. Check if there's any fallback logic
    console.log('\n📋 STEP 5: CHECKING FALLBACK LOGIC');
    console.log('If no database data found, function should return static longTermCrops');
    console.log('This might be the source of the extra crop!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugHyderabadLongTerm();

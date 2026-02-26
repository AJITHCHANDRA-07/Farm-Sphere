// Test the actual getCropsByCategory function
const path = require('path');

// Mock the frontend environment
process.env.NODE_ENV = 'development';

// Import the function
const cropDataPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'cropData.ts');

// Since we can't directly import TypeScript, let's simulate the function
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testGetCropsByCategory() {
  try {
    console.log('🔍 TESTING getCropsByCategory FUNCTION');
    console.log('=====================================');
    
    const category = 'medium';
    const popupTableName = 'M_T_C_PopUp1';
    const originalTableName = 'Medium_Term_Crops';
    
    console.log(`📋 Fetching ${category}-term crops from: ${popupTableName} + ${originalTableName}`);
    
    // 🎯 FETCH FROM POPUP TABLE
    const { data: popupData, error: popupError } = await supabase
      .from(popupTableName)
      .select('*');
    
    // 🎯 FETCH FROM ORIGINAL TABLE
    const { data: originalData, error: originalError } = await supabase
      .from(originalTableName)
      .select('*');
    
    if (popupError || originalError) {
      console.error(`❌ Error fetching ${category} crops:`, popupError || originalError);
      return [];
    }
    
    console.log(`✅ Popup data: ${popupData?.length || 0} crops`);
    console.log(`✅ Original data: ${originalData?.length || 0} crops`);
    
    if (!popupData || !originalData || popupData.length === 0 || originalData.length === 0) {
      console.log('❌ No data found in tables');
      return [];
    }
    
    // 🎯 MERGE DATA FROM BOTH TABLES
    const mergedCrops = popupData.map((popupCrop, index) => {
      const originalCrop = originalData.find(orig => 
        orig['Crop Name'] === popupCrop['Crop Name'] || 
        orig['Crop Name'] === popupCrop['Crop_Name']
      );
      
      if (originalCrop) {
        // 🎯 COMBINE BOTH DATA SOURCES
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
    
    console.log(`📊 Total merged crops: ${mergedCrops.length}`);
    
    // Filter for Rangareddy medicinal crops
    const medicinalCrops = [
      'Pippali', 'Mandukaparni', 'Amalaki', 'Kaunch', 'Jeevanti', 
      'Jatamansi', 'Guduchi', 'Shatavari', 'Brahmi', 'Vacha', 'Bhringraj', 'Arjuna'
    ];
    
    const rangareddyCrops = mergedCrops.filter(crop => {
      const isMedicinal = medicinalCrops.includes(crop['Crop Name'] || crop['Crop_Name']);
      const isRangareddy = crop['Suitable Telangana District'] === 'Rangareddy';
      
      if (isMedicinal && isRangareddy) {
        console.log(`✅ ${crop['Crop Name'] || crop['Crop_Name']} - Rangareddy medicinal crop`);
      }
      
      return isMedicinal && isRangareddy;
    });
    
    console.log(`🎯 Rangareddy medicinal crops: ${rangareddyCrops.length}`);
    rangareddyCrops.forEach(crop => {
      console.log(`  - ${crop['Crop Name'] || crop['Crop_Name']}`);
    });
    
    return rangareddyCrops;
    
  } catch (error) {
    console.error('❌ Error in getCropsByCategory:', error);
    return [];
  }
}

testGetCropsByCategory();

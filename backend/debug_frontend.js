// Debug the frontend data flow exactly as it happens
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Simulate the exact getCropsByCategory function
async function getCropsByCategory(category) {
  try {
    console.log(`🔍 Simulating getCropsByCategory('${category}')`);
    console.log('=====================================');
    
    // 🎯 GET DATA FROM BOTH TABLES FOR COMPLETE CROP INFORMATION
    const popupTableName = category === 'short' ? 'S_T_C_PopUp1' : 
                        category === 'medium' ? 'M_T_C_PopUp1' : 'L_T_C_PopUp1';
    
    const originalTableName = category === 'short' ? 'Short_Term_Crops' : 
                          category === 'medium' ? 'Medium_Term_Crops' : 'Long_Term_Crops';
    
    console.log(`🔍 Fetching ${category}-term crops from BOTH tables: ${popupTableName} + ${originalTableName}`);
    
    // 🎯 FETCH FROM POPUP TABLE
    let popupQuery = supabase.from(popupTableName).select('*');
    
    // If medium term, filter for medicinal crops
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
      
      console.log('🎯 Filtering for Rangareddy medicinal crops:', medicinalCrops);
      originalQuery = originalQuery
        .eq('Suitable Telangana District', 'Rangareddy')
        .in('Crop Name', medicinalCrops);
    } else if (category === 'short') {
      console.log('🎯 Filtering for Rangareddy short-term crops');
      originalQuery = originalQuery
        .eq('Suitable Telangana District', 'Rangareddy');
    } else if (category === 'long') {
      console.log('🎯 Filtering for Rangareddy long-term crops');
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
      // 🎯 REMOVE DUPLICATES FROM POPUP DATA
      const uniquePopupData = popupData.filter((popupCrop, index, self) => 
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
    
    // Fallback to static data if no database data
    console.log(`📝 No database data found for ${category}-term crops`);
    return [];
    
  } catch (error) {
    console.error(`Error in getCropsByCategory for ${category}:`, error);
    return [];
  }
}

async function debugFrontendFlow() {
  try {
    console.log('🔍 DEBUGGING FRONTEND DATA FLOW');
    console.log('===============================');
    
    // Simulate user location
    const userLocation = { district: "Rangareddy" };
    console.log(`📍 User location: ${userLocation.district}`);
    
    // Test all categories
    const categories = ['short', 'medium', 'long'];
    
    for (const category of categories) {
      console.log(`\n🔄 Testing ${category}-term crops...`);
      const crops = await getCropsByCategory(category);
      
      console.log(`📊 Raw ${category}-term crops fetched: ${crops.length}`);
      
      // Simulate frontend filtering
      const filteredCrops = crops.filter(crop => {
        const cropDistrict = crop.district?.toLowerCase().trim();
        const userDistrict = userLocation.district.toLowerCase().trim();
        
        const matchesDistrict = cropDistrict === userDistrict || 
                                  cropDistrict === 'rangareddy' && userDistrict === 'ranga reddy' ||
                                  cropDistrict === 'ranga reddy' && userDistrict === 'rangareddy';
        
        return matchesDistrict;
      });
      
      console.log(`📊 After district filtering: ${filteredCrops.length} crops for ${userLocation.district}`);
      
      // Show crop names
      if (filteredCrops.length > 0) {
        console.log(`📋 ${category}-term crops for Rangareddy:`);
        filteredCrops.forEach((crop, index) => {
          console.log(`${index + 1}. ${crop['Crop Name'] || crop['Crop_Name']}`);
        });
      } else {
        console.log(`📝 No ${category}-term crops found for Rangareddy`);
      }
    }
    
    console.log('\n✅ DEBUG COMPLETE');
    console.log('🎯 Check if these counts match what you see in the frontend');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugFrontendFlow();

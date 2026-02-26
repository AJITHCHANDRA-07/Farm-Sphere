// Check Hyderabad medium-term crops issue
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkHyderabadCrops() {
  try {
    console.log('🔍 CHECKING HYDERABAD MEDIUM-TERM CROPS ISSUE');
    console.log('==========================================');
    
    // Check Medium_Term_Crops for Hyderabad
    const { data: hydMediumData, error: hydError } = await supabase
      .from('Medium_Term_Crops')
      .select('*')
      .eq('Suitable Telangana District', 'Hyderabad');
    
    if (hydError) {
      console.error('❌ Error:', hydError.message);
      return;
    }
    
    console.log(`✅ Found ${hydMediumData?.length || 0} medium-term crops for Hyderabad`);
    
    if (hydMediumData && hydMediumData.length > 0) {
      console.log('📋 Hyderabad Medium-Term Crops:');
      hydMediumData.forEach((crop, index) => {
        console.log(`${index + 1}. ${crop['Crop Name']} - ${crop['Crop Type']}`);
      });
    }
    
    // Check if these are medicinal crops
    const medicinalCrops = [
      'Pippali', 'Mandukaparni', 'Amalaki', 'Kaunch', 'Jeevanti', 
      'Jatamansi', 'Guduchi', 'Shatavari', 'Brahmi', 'Vacha', 'Bhringraj', 'Arjuna'
    ];
    
    const hydMedicinalCrops = hydMediumData?.filter(crop => 
      medicinalCrops.includes(crop['Crop Name'])
    );
    
    console.log(`🌿 Hyderabad medicinal crops: ${hydMedicinalCrops?.length || 0}`);
    if (hydMedicinalCrops && hydMedicinalCrops.length > 0) {
      console.log('📋 Hyderabad Medicinal Crops:');
      hydMedicinalCrops.forEach((crop, index) => {
        console.log(`${index + 1}. ${crop['Crop Name']} - ${crop['Crop Type']}`);
      });
    }
    
    // Check popup table for these crops
    console.log('\n🔍 CHECKING M_T_C_PopUp1 FOR HYDERABAD CROPS');
    const { data: popupData, error: popupError } = await supabase
      .from('M_T_C_PopUp1')
      .select('*')
      .in('Crop_Name', hydMedicinalCrops.map(c => c['Crop Name']));
    
    if (popupError) {
      console.error('❌ Popup error:', popupError.message);
    } else {
      console.log(`✅ Found ${popupData?.length || 0} popup entries for Hyderabad medicinal crops`);
      popupData?.forEach((crop, index) => {
        console.log(`${index + 1}. ${crop.Crop_Name} - Investment: ₹${crop.Investment_Per_Acre}`);
      });
    }
    
    // Test the complete flow for Hyderabad
    console.log('\n🔄 TESTING COMPLETE FLOW FOR HYDERABAD');
    
    // Simulate getCropsByCategory for Hyderabad medium-term
    const testMediumCrops = await getCropsByCategory('medium', 'Hyderabad');
    console.log(`🌱 Test result: ${testMediumCrops.length} medium-term crops for Hyderabad`);
    testMediumCrops.forEach((crop, index) => {
      console.log(`${index + 1}. ${crop.name || crop['Crop Name']} - District: ${crop.district || crop['Suitable Telangana District']}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Simulate getCropsByCategory function
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
      // 🎯 REMOVE DUPLICATES FROM POPUP DATA
      const uniquePopupData = popupData.filter((popupCrop, index, self) => 
        index === self.findIndex(c => c.Crop_Name === popupCrop.Crop_Name)
      );
      
      // 🎯 MERGE DATA FROM BOTH TABLES
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

checkHyderabadCrops();

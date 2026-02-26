import { supabase } from '../supabaseClient';

// 🌱 TEST CURRENT IMPLEMENTATION - CHECKING FOR "NOT SPECIFIED" ISSUE
const testCurrentImplementation = async () => {
  console.log('🔍 TESTING CURRENT CROP DATA IMPLEMENTATION');
  console.log('=================================================');
  
  try {
    // Test Short Term Crops
    console.log('\n📊 TESTING Short Term Crops from Original Table:');
    console.log('─'.repeat(50));
    const { data: shortData, error: shortError } = await supabase
      .from('Short_Term_Crops')
      .select('*')
      .limit(3);
    
    if (shortError) {
      console.log('❌ Error:', shortError.message);
    } else if (shortData && shortData.length > 0) {
      console.log(`✅ Found ${shortData.length} short-term crops`);
      shortData.forEach((crop, i) => {
        console.log(`\n🌱 Short Term Crop ${i + 1}: ${crop['Crop Name']}`);
        console.log(`  📊 Supply Status: "${crop['Supply Status']}"`);
        console.log(`  📈 Demand Status: "${crop['Demand Status']}"`);
        console.log(`  ⚠️ Risk Factors: "${crop['Risk Factors']}"`);
        console.log(`  ⏰ Crop Duration: "${crop['Crop Duration']}"`);
        console.log(`  🌱 Primary Soil: "${crop['Primary Soil Type Required']}"`);
        console.log(`  💧 Water Requirement: "${crop['Water Requirement']}"`);
        console.log(`  🌡️ Climate: "${crop['Climate Suitability']}"`);
        console.log(`  🚿 Irrigation: "${crop['Irrigation Compatibility']}"`);
        console.log(`  📏 Land Area: "${crop['Land Area Suitability']}"`);
        console.log(`  🛡️ Mitigation: "${crop['Mitigation Strategies']}"`);
        console.log(`  🏞️ Crop Type: "${crop['Crop Type']}"`);
        console.log(`  📍 District: "${crop['Suitable Telangana District']}"`);
      });
    }
    
    // Test Medium Term Crops
    console.log('\n📊 TESTING Medium Term Crops from Original Table:');
    console.log('─'.repeat(50));
    const { data: mediumData, error: mediumError } = await supabase
      .from('Medium_Term_Crops')
      .select('*')
      .limit(3);
    
    if (mediumError) {
      console.log('❌ Error:', mediumError.message);
    } else if (mediumData && mediumData.length > 0) {
      console.log(`✅ Found ${mediumData.length} medium-term crops`);
      mediumData.forEach((crop, i) => {
        console.log(`\n🌿 Medium Term Crop ${i + 1}: ${crop['Crop Name']}`);
        console.log(`  📊 Supply Status: "${crop['Supply Status']}"`);
        console.log(`  📈 Demand Status: "${crop['Demand Status']}"`);
        console.log(`  ⚠️ Risk Factors: "${crop['Risk Factors']}"`);
        console.log(`  ⏰ Crop Duration: "${crop['Crop Duration']}"`);
        console.log(`  🌱 Primary Soil: "${crop['Primary Soil Type Required']}"`);
        console.log(`  💧 Water Requirement: "${crop['Water Requirement']}"`);
        console.log(`  🌡️ Climate: "${crop['Climate Suitability']}"`);
        console.log(`  🚿 Irrigation: "${crop['Irrigation Compatibility']}"`);
        console.log(`  📏 Land Area: "${crop['Land Area Suitability']}"`);
        console.log(`  🛡️ Mitigation: "${crop['Mitigation Strategies']}"`);
        console.log(`  🏞️ Crop Type: "${crop['Crop Type']}"`);
        console.log(`  📍 District: "${crop['Suitable Telangana District']}"`);
      });
    }
    
    // Test Long Term Crops
    console.log('\n📊 TESTING Long Term Crops from Original Table:');
    console.log('─'.repeat(50));
    const { data: longData, error: longError } = await supabase
      .from('Long_Term_Crops')
      .select('*')
      .limit(3);
    
    if (longError) {
      console.log('❌ Error:', longError.message);
    } else if (longData && longData.length > 0) {
      console.log(`✅ Found ${longData.length} long-term crops`);
      longData.forEach((crop, i) => {
        console.log(`\n🌳 Long Term Crop ${i + 1}: ${crop['Crop Name']}`);
        console.log(`  📊 Supply Status: "${crop['Supply Status']}"`);
        console.log(`  📈 Demand Status: "${crop['Demand Status']}"`);
        console.log(`  ⚠️ Risk Factors: "${crop['Risk Factors']}"`);
        console.log(`  ⏰ Crop Duration: "${crop['Crop Duration']}"`);
        console.log(`  🌱 Primary Soil: "${crop['Primary Soil Type Required']}"`);
        console.log(`  💧 Water Requirement: "${crop['Water Requirement']}"`);
        console.log(`  🌡️ Climate: "${crop['Climate Suitability']}"`);
        console.log(`  🚿 Irrigation: "${crop['Irrigation Compatibility']}"`);
        console.log(`  📏 Land Area: "${crop['Land Area Suitability']}"`);
        console.log(`  🛡️ Mitigation: "${crop['Mitigation Strategies']}"`);
        console.log(`  🏞️ Crop Type: "${crop['Crop Type']}"`);
        console.log(`  📍 District: "${crop['Suitable Telangana District']}"`);
      });
    }
    
    console.log('\n🎯 CURRENT IMPLEMENTATION TEST SUMMARY');
    console.log('─'.repeat(50));
    console.log('✅ Check complete - See real crop data above');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run the test
testCurrentImplementation();

export { testCurrentImplementation };

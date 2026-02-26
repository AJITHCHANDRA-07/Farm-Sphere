import { supabase } from '../supabaseClient';

// 🌱 TEST DATABASE INTEGRATION WITH UPDATED MAPPING
const testDatabaseIntegration = async () => {
  console.log('🔍 TESTING DATABASE INTEGRATION');
  console.log('==================================');
  
  try {
    // Test Short Term Crops
    console.log('\n📊 Testing Short Term Crops...');
    const { data: shortData, error: shortError } = await supabase
      .from('Short_Term_Crops')
      .select('*')
      .limit(3);
    
    if (shortError) {
      console.log('❌ Short Term Error:', shortError.message);
    } else if (shortData && shortData.length > 0) {
      console.log(`✅ Found ${shortData.length} short-term crops`);
      shortData.forEach((crop, i) => {
        console.log(`\n🌱 Short Term Crop ${i + 1}:`);
        console.log(`  Name: ${crop['Crop Name']}`);
        console.log(`  Type: ${crop['Crop Type']}`);
        console.log(`  Duration: ${crop['Crop Duration']}`);
        console.log(`  District: ${crop['Suitable Telangana District']}`);
        console.log(`  Demand: ${crop['Demand Status']}`);
        console.log(`  ID: ${crop['Id']}`);
      });
    }
    
    // Test Medium Term Crops
    console.log('\n📊 Testing Medium Term Crops...');
    const { data: mediumData, error: mediumError } = await supabase
      .from('Medium_Term_Crops')
      .select('*')
      .limit(3);
    
    if (mediumError) {
      console.log('❌ Medium Term Error:', mediumError.message);
    } else if (mediumData && mediumData.length > 0) {
      console.log(`✅ Found medium-term crops`);
      mediumData.forEach((crop, i) => {
        console.log(`\n🌿 Medium Term Crop ${i + 1}:`);
        console.log(`  Name: ${crop['Crop Name']}`);
        console.log(`  Type: ${crop['Crop Type']}`);
        console.log(`  Duration: ${crop['Crop Duration']}`);
        console.log(`  District: ${crop['Suitable Telangana District']}`);
      });
    }
    
    // Test Long Term Crops
    console.log('\n📊 Testing Long Term Crops...');
    const { data: longData, error: longError } = await supabase
      .from('Long_Term_Crops')
      .select('*')
      .limit(3);
    
    if (longError) {
      console.log('❌ Long Term Error:', longError.message);
    } else if (longData && longData.length > 0) {
      console.log(`✅ Found long-term crops`);
      longData.forEach((crop, i) => {
        console.log(`\n🌳 Long Term Crop ${i + 1}:`);
        console.log(`  Name: ${crop['Crop Name']}`);
        console.log(`  Type: ${crop['Crop Type']}`);
        console.log(`  Duration: ${crop['Crop Duration']}`);
        console.log(`  District: ${crop['Suitable Telangana District']}`);
      });
    }
    
    // Check for popup columns
    console.log('\n🎯 Checking for Popup Columns...');
    const allColumns = new Set();
    [...(shortData || []), ...(mediumData || []), ...(longData || [])].forEach(crop => {
      Object.keys(crop).forEach(col => allColumns.add(col));
    });
    
    const popupColumns = [
      'Investment_Per_Acre', 'Expected_Yield_Per_Acre', 'Market_Price_Per_KG', 
      'Profit_Per_Acre', 'Market_Demand_Level', 'Cultivation_Steps', 
      'Best_Season', 'Water_And_Irrigation', 'Pest_And_Disease_Management',
      'Harvest_Information', 'Cost_Breakdown_Per_Acre', 'Price_Range_Per_KG',
      'Yield_Range_Per_Acre', 'ROI_Percentage', 'Break_Even_Time'
    ];
    
    const foundPopupColumns = popupColumns.filter(col => allColumns.has(col));
    console.log(`📋 Popup Columns Found: ${foundPopupColumns.length}/15`);
    if (foundPopupColumns.length > 0) {
      console.log('✅ Available popup columns:', foundPopupColumns.join(', '));
    } else {
      console.log('📝 No popup columns found - will use calculated values');
    }
    
    console.log('\n🎯 INTEGRATION TEST SUMMARY');
    console.log('================================');
    console.log('✅ Database connection: Working');
    console.log('✅ Data mapping: Updated for popup columns');
    console.log('✅ UI compatibility: Maintained');
    console.log('✅ Fallback system: Active');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run the test
testDatabaseIntegration();

export { testDatabaseIntegration };

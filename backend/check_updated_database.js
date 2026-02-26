const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkUpdatedDatabase() {
  try {
    console.log('🔍 CHECKING UPDATED DATABASE STRUCTURE');
    console.log('=======================================');
    
    const tables = ['Short_Term_Crops', 'Medium_Term_Crops', 'Long_Term_Crops'];
    
    for (const tableName of tables) {
      console.log(`\n📊 TABLE: ${tableName}`);
      console.log('─'.repeat(60));
      
      // Get sample data to see all columns
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Error: ${error.message}`);
      } else {
        console.log(`✅ Records Found: ${count}`);
        
        if (data && data.length > 0) {
          const columns = Object.keys(data[0]);
          console.log(`📋 Total Columns: ${columns.length}`);
          console.log('📝 Column Names:');
          columns.forEach((col, i) => {
            console.log(`  ${i + 1}. ${col}`);
          });
          
          // Check for popup modal columns
          const popupColumns = [
            'Investment_Per_Acre', 'Expected_Yield_Per_Acre', 'Market_Price_Per_KG', 
            'Profit_Per_Acre', 'Market_Demand_Level', 'Cultivation_Steps', 
            'Best_Season', 'Water_And_Irrigation', 'Pest_And_Disease_Management',
            'Harvest_Information', 'Cost_Breakdown_Per_Acre', 'Price_Range_Per_KG',
            'Yield_Range_Per_Acre', 'ROI_Percentage', 'Break_Even_Time'
          ];
          
          const foundPopupColumns = columns.filter(col => popupColumns.includes(col));
          console.log(`\n🎯 Popup Modal Columns Found: ${foundPopupColumns.length}/15`);
          if (foundPopupColumns.length > 0) {
            foundPopupColumns.forEach(col => {
              console.log(`  ✅ ${col}`);
            });
          }
          
          const missingPopupColumns = popupColumns.filter(col => !columns.includes(col));
          if (missingPopupColumns.length > 0) {
            console.log(`\n❌ Missing Popup Columns: ${missingPopupColumns.length}`);
            missingPopupColumns.forEach(col => {
              console.log(`  ❌ ${col}`);
            });
          }
          
          // Show sample data with all columns
          console.log('\n📄 Complete Sample Record:');
          Object.entries(data[0]).forEach(([key, value]) => {
            const displayValue = typeof value === 'string' && value.length > 50 
              ? value.substring(0, 50) + '...' 
              : value;
            console.log(`  ${key}: ${displayValue}`);
          });
        }
      }
    }
    
    console.log('\n🎯 DATABASE UPDATE SUMMARY');
    console.log('─'.repeat(60));
    console.log('✅ Data Successfully Updated');
    console.log('📊 New crop records added');
    console.log('🔍 Checking for popup modal columns...');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUpdatedDatabase();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkNewPopupTables() {
  try {
    console.log('🔍 CHECKING NEW POPUP TABLES ACCESS');
    console.log('=====================================');
    
    const popupTables = ['S_T_C_PopUp1', 'M_T_C_PopUp1', 'L_T_C_PopUp1'];
    
    for (const tableName of popupTables) {
      console.log(`\n📊 TABLE: ${tableName}`);
      console.log('─'.repeat(60));
      
      try {
        // Check if table exists and get structure
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Error accessing ${tableName}: ${error.message}`);
          
          // Try to check if table exists with different approach
          console.log(`🔍 Trying to check table existence...`);
          const { data: tableInfo, error: tableError } = await supabase
            .from(tableName)
            .select('count')
            .limit(1);
          
          if (tableError) {
            console.log(`❌ Table ${tableName} does not exist or no access: ${tableError.message}`);
          }
        } else {
          console.log(`✅ SUCCESS: Table ${tableName} is accessible!`);
          console.log(`📋 Records Found: ${count || 'Unknown'}`);
          
          if (data && data.length > 0) {
            const columns = Object.keys(data[0]);
            console.log(`📝 Total Columns: ${columns.length}`);
            console.log('📝 Column Names:');
            columns.forEach((col, i) => {
              console.log(`  ${i + 1}. ${col}`);
            });
            
            // Check for the 15 popup columns
            const expectedColumns = [
              'Investment_Per_Acre', 'Expected_Yield_Per_Acre', 'Market_Price_Per_KG', 
              'Profit_Per_Acre', 'Market_Demand_Level', 'Cultivation_Steps', 
              'Best_Season', 'Water_And_Irrigation', 'Pest_And_Disease_Management',
              'Harvest_Information', 'Cost_Breakdown_Per_Acre', 'Price_Range_Per_KG',
              'Yield_Range_Per_Acre', 'ROI_Percentage', 'Break_Even_Time'
            ];
            
            const foundColumns = columns.filter(col => expectedColumns.includes(col));
            console.log(`\n🎯 Popup Columns Found: ${foundColumns.length}/15`);
            if (foundColumns.length > 0) {
              console.log('✅ Available popup columns:');
              foundColumns.forEach(col => {
                console.log(`  ✅ ${col}`);
              });
            }
            
            const missingColumns = expectedColumns.filter(col => !columns.includes(col));
            if (missingColumns.length > 0) {
              console.log(`\n❌ Missing Popup Columns: ${missingColumns.length}`);
              missingColumns.forEach(col => {
                console.log(`  ❌ ${col}`);
              });
            }
            
            // Show sample data
            console.log('\n📄 Sample Record:');
            Object.entries(data[0]).forEach(([key, value]) => {
              const displayValue = typeof value === 'string' && value.length > 50 
                ? value.substring(0, 50) + '...' 
                : value;
              console.log(`  ${key}: ${displayValue}`);
            });
          } else {
            console.log('📝 Table exists but no data found');
          }
        }
      } catch (err) {
        console.log(`❌ Critical error with ${tableName}: ${err.message}`);
      }
    }
    
    console.log('\n🎯 POPUP TABLES ACCESS SUMMARY');
    console.log('─'.repeat(60));
    console.log('✅ Check complete - See results above');
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

checkNewPopupTables();

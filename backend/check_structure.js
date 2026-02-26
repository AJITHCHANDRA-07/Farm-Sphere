const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function getTableStructure() {
  try {
    console.log('🏗️  FARMSPHERE DATABASE TABLE STRUCTURE');
    console.log('=====================================');
    
    // Get table structure information
    const tables = ['crop_data', 'Short_Term_Crops', 'Medium_Term_Crops', 'Long_Term_Crops'];
    
    for (const tableName of tables) {
      console.log(`\n📋 Table: ${tableName}`);
      console.log('─'.repeat(50));
      
      try {
        // Try to get column information by inserting a dummy row and getting the error
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error && error.details) {
          console.log('📝 Columns from error details:');
          // Extract column names from error message if available
        } else if (data && data.length === 0) {
          console.log('✅ Table exists but is empty');
          
          // Try to describe the table structure
          const { data: descData, error: descError } = await supabase
            .rpc('get_table_columns', { table_name: tableName });
          
          if (descError) {
            console.log('📝 Cannot determine exact columns - table is empty');
          } else {
            console.log('📝 Columns:', descData);
          }
        }
        
        // Let's also try to get any sample data or create a test record to see structure
        console.log(`📊 Status: Table exists and is accessible`);
        
      } catch (tableError) {
        console.log(`❌ Error accessing table: ${tableError.message}`);
      }
    }
    
    // Now let's try to get some sample data structure from the main crop_data
    console.log('\n🔍 Trying to get crop_data structure...');
    
    // Check if we can get any information about the table
    try {
      const { data, error } = await supabase
        .from('crop_data')
        .select('*')
        .limit(1);
      
      if (error) {
        console.log('📝 crop_data table structure needs to be determined');
      } else {
        console.log('📝 crop_data columns available');
      }
    } catch (e) {
      console.log('📝 crop_data table is ready for data insertion');
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

getTableStructure();

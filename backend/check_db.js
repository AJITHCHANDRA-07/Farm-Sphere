const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function getCropData() {
  try {
    console.log('🌾 FARMSPHERE CROP DATA FROM SUPABASE');
    console.log('=====================================');
    
    // First, let's see what tables we can access
    const tables = ['crop_data', 'Short_Term_Crops', 'Medium_Term_Crops', 'Long_Term_Crops'];
    
    for (const tableName of tables) {
      console.log(`\n📊 Checking table: ${tableName}`);
      
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact' })
          .limit(3);
        
        if (error) {
          console.log(`❌ Error: ${error.message}`);
        } else {
          console.log(`✅ Table exists with ${count} records`);
          if (data && data.length > 0) {
            console.log(`📋 Columns: ${Object.keys(data[0]).join(', ')}`);
            console.log('📄 Sample record:');
            console.log(JSON.stringify(data[0], null, 2));
          }
        }
      } catch (tableError) {
        console.log(`❌ Table error: ${tableError.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

getCropData();

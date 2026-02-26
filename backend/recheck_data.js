const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkDataAgain() {
  try {
    console.log('🔍 RECHECKING ALL TABLES FOR DATA');
    console.log('===================================');
    
    const tables = ['crop_data', 'Short_Term_Crops', 'Medium_Term_Crops', 'Long_Term_Crops'];
    
    for (const tableName of tables) {
      console.log(`\n📊 Checking ${tableName}...`);
      
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: false });
        
        if (error) {
          console.log(`❌ Error: ${error.message}`);
        } else {
          console.log(`✅ Table: ${tableName}`);
          console.log(`📋 Total Records: ${count}`);
          
          if (data && data.length > 0) {
            console.log('📄 DATA FOUND!');
            data.forEach((record, i) => {
              console.log(`  Record ${i+1}:`, JSON.stringify(record, null, 2));
            });
          } else {
            console.log('📝 No data found');
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

checkDataAgain();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function comprehensiveCheck() {
  console.log('🔍 COMPREHENSIVE DATABASE CHECK');
  console.log('==============================');
  
  // Check all possible table names that might contain crop data
  const possibleTables = [
    'crop_data',
    'crops', 
    'Crop_Data',
    'CROP_DATA',
    'cropdata',
    'short_term_crops',
    'Short_Term_Crops',
    'medium_term_crops', 
    'Medium_Term_Crops',
    'long_term_crops',
    'Long_Term_Crops'
  ];
  
  for (const tableName of possibleTables) {
    console.log(`\n📊 Checking '${tableName}'...`);
    
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(1);
      
      if (error) {
        console.log(`  ❌ Table '${tableName}' not accessible: ${error.message}`);
      } else {
        console.log(`  ✅ Table '${tableName}' found with ${count} records`);
        if (count > 0) {
          console.log(`  📋 Columns: ${Object.keys(data[0]).join(', ')}`);
          console.log(`  📄 Sample: ${JSON.stringify(data[0])}`);
        }
      }
    } catch (e) {
      console.log(`  ❌ Error checking '${tableName}': ${e.message}`);
    }
  }
}

comprehensiveCheck();

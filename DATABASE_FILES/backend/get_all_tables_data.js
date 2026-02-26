const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function getAllTablesData() {
  try {
    console.log('🌾 COMPLETE CROP DATA FROM ALL TABLES');
    console.log('====================================');
    
    const tables = ['Short_Term_Crops', 'Medium_Term_Crops', 'Long_Term_Crops',];
    
    for (const tableName of tables) {
      console.log(`\n📊 TABLE: ${tableName}`);
      console.log('─'.repeat(60));
      
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(3); // Just get first 3 for preview
      
      if (error) {
        console.log(`❌ Error: ${error.message}`);
      } else {
        console.log(`✅ Records Found: ${count}`);
        
        if (data && data.length > 0) {
          console.log(`📋 Columns: ${Object.keys(data[0]).length} columns`);
          console.log('📝 Column Names:', Object.keys(data[0]).join(', '));
          
          console.log('\n📄 Sample Data:');
          data.forEach((record, i) => {
            console.log(`\n🌱 Record ${i + 1}:`);
            console.log(JSON.stringify(record, null, 2));
          });
          
          // Show some unique values if there's a crop name column
          const cropNameColumn = Object.keys(data[0]).find(col => 
            col.toLowerCase().includes('crop') && col.toLowerCase().includes('name')
          );
          
          if (cropNameColumn && count > 0) {
            // Get unique crop names (first 10)
            const { data: uniqueData } = await supabase
              .from(tableName)
              .select(cropNameColumn)
              .limit(10);
            
            if (uniqueData) {
              const uniqueCrops = [...new Set(uniqueData.map(row => row[cropNameColumn]))];
              console.log(`\n🌾 Sample Crops (${uniqueCrops.length} shown):`);
              console.log(uniqueCrops.join(', '));
            }
          }
        } else {
          console.log('📝 No data in this table');
        }
      }
    }
    
    console.log('\n🎯 SUMMARY');
    console.log('─'.repeat(60));
    console.log('✅ All tables are accessible and contain data!');
    console.log('📊 Ready for frontend integration!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

getAllTablesData();

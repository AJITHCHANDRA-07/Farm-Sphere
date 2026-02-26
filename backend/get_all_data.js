const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function getAllData() {
  try {
    console.log('🌾 GETTING COMPLETE CROP DATA FROM SUPABASE');
    console.log('==========================================');
    
    // Get all data from crop_data table
    console.log('\n📊 CROP_DATA TABLE:');
    console.log('─'.repeat(50));
    
    const { data: cropData, error: cropError } = await supabase
      .from('crop_data')
      .select('*')
      .limit(10); // Get first 10 records
    
    if (cropError) {
      console.log('❌ Error:', cropError.message);
    } else {
      console.log(`✅ Found ${cropData.length} records (showing first 10)`);
      console.log('📋 Columns:', Object.keys(cropData[0] || {}));
      
      cropData.forEach((crop, index) => {
        console.log(`\n🌱 Record ${index + 1}:`);
        console.log(JSON.stringify(crop, null, 2));
      });
    }
    
    // Get total count
    const { count, error: countError } = await supabase
      .from('crop_data')
      .select('*', { count: 'exact', head: true });
    
    if (!countError) {
      console.log(`\n📊 TOTAL RECORDS IN crop_data: ${count}`);
    }
    
    // Check other tables
    console.log('\n📊 CHECKING OTHER TABLES:');
    console.log('─'.repeat(50));
    
    const tables = ['Short_Term_Crops', 'Medium_Term_Crops', 'Long_Term_Crops'];
    
    for (const tableName of tables) {
      console.log(`\n🔍 Checking ${tableName}...`);
      
      const { data, error, count: tableCount } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(5);
      
      if (error) {
        console.log(`❌ Error: ${error.message}`);
      } else {
        console.log(`✅ ${tableName}: ${tableCount} records`);
        if (data && data.length > 0) {
          console.log('📋 Columns:', Object.keys(data[0]));
          console.log('📄 Sample:', data[0]);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

getAllData();

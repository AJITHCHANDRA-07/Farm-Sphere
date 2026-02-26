const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkExactQuery() {
  try {
    console.log('🔍 EXACT QUERY CHECK - CROP_DATA');
    console.log('===============================');
    
    // Use the exact same query that found data
    const { data, error, count } = await supabase
      .from('crop_data')
      .select('*')
      .limit(10);
    
    console.log('📊 Query Results:');
    console.log('Error:', error);
    console.log('Data length:', data ? data.length : 'null');
    console.log('Count:', count);
    
    if (data && data.length > 0) {
      console.log('\n📄 DATA FOUND!');
      console.log('📋 Columns:', Object.keys(data[0]));
      
      data.forEach((record, i) => {
        console.log(`\n🌱 Record ${i+1}:`);
        Object.entries(record).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      });
    } else {
      console.log('📝 No data found with this query');
    }
    
    // Try without limit
    console.log('\n🔍 Trying without limit...');
    const { data: allData, error: allError } = await supabase
      .from('crop_data')
      .select('*');
    
    console.log('All data length:', allData ? allData.length : 'null');
    console.log('All data error:', allError);
    
    if (allData && allData.length > 0) {
      console.log('📄 First record from all data:', allData[0]);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkExactQuery();

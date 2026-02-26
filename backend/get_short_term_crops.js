const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function getShortTermCropsData() {
  try {
    console.log('🌱 ACCESSING SHORT_TERM_CROPS DATA');
    console.log('===================================');
    
    // Get all data from Short_Term_Crops
    const { data, error, count } = await supabase
      .from('Short_Term_Crops')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.log('❌ Error:', error.message);
      console.log('Error details:', error);
      return;
    }
    
    console.log('✅ Successfully connected to Short_Term_Crops');
    console.log('📊 Total Records:', count);
    console.log('📋 Data Retrieved:', data ? data.length : 0);
    
    if (data && data.length > 0) {
      console.log('\n📄 COLUMNS FOUND:');
      console.log('─'.repeat(50));
      const columns = Object.keys(data[0]);
      columns.forEach((col, i) => {
        console.log(`${i + 1}. ${col}`);
      });
      
      console.log('\n📄 SAMPLE RECORDS:');
      console.log('─'.repeat(50));
      
      // Show first 5 records
      const sampleSize = Math.min(5, data.length);
      for (let i = 0; i < sampleSize; i++) {
        console.log(`\n🌱 Record ${i + 1}:`);
        console.log(JSON.stringify(data[i], null, 2));
        console.log('─'.repeat(30));
      }
      
      if (data.length > 5) {
        console.log(`\n... and ${data.length - 5} more records`);
      }
      
      // Show some statistics
      console.log('\n📊 DATA STATISTICS:');
      console.log('─'.repeat(50));
      console.log(`Total Records: ${count}`);
      
      // If there's a crop name column, show unique crops
      const cropNameColumn = columns.find(col => 
        col.toLowerCase().includes('crop') || col.toLowerCase().includes('name')
      );
      
      if (cropNameColumn) {
        const uniqueCrops = [...new Set(data.map(row => row[cropNameColumn]))];
        console.log(`Unique Crops: ${uniqueCrops.length}`);
        console.log('Sample crops:', uniqueCrops.slice(0, 10).join(', '));
      }
      
    } else {
      console.log('📝 No data found in Short_Term_Crops table');
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

getShortTermCropsData();

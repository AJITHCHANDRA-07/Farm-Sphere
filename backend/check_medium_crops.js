const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkMediumTermCrops() {
  try {
    console.log('🔍 CHECKING MEDIUM_TERM_CROPS TABLE');
    console.log('===================================');
    console.log('URL: https://vrqthuouyxmkgycmmjzt.supabase.co/Medium_Term_Crops');
    
    // Get all data from Medium_Term_Crops table
    const { data, error, count } = await supabase
      .from('Medium_Term_Crops')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.log('❌ Error accessing Medium_Term_Crops:', error.message);
      console.log('Error details:', error);
    } else {
      console.log('✅ Successfully accessed Medium_Term_Crops table');
      console.log('📊 Total Records:', count);
      
      if (data && data.length > 0) {
        console.log('📋 Table Columns:', Object.keys(data[0]));
        console.log('');
        console.log('📄 DATA CONTENTS:');
        console.log('─'.repeat(80));
        
        data.forEach((crop, index) => {
          console.log(`🌱 Record ${index + 1}:`);
          console.log(JSON.stringify(crop, null, 2));
          console.log('─'.repeat(40));
        });
      } else {
        console.log('📝 Table is empty - no records found');
        console.log('');
        console.log('💡 Ready for data insertion');
      }
    }
    
    // Also check table structure by trying to get column info
    console.log('\n🏗️  TABLE STRUCTURE ANALYSIS:');
    console.log('─'.repeat(40));
    
    // Try to get a sample record to see structure
    const { data: sampleData, error: sampleError } = await supabase
      .from('Medium_Term_Crops')
      .select('*')
      .limit(1);
    
    if (sampleError) {
      console.log('📝 Table structure analysis - Table exists but is empty');
    } else {
      console.log('✅ Table structure accessible');
      if (sampleData && sampleData.length > 0) {
        console.log('📋 Available columns:', Object.keys(sampleData[0]));
      }
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

checkMediumTermCrops();

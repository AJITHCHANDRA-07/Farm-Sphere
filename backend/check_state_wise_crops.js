const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://vrqthuouyxmkgycmmjzt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycXRodW91eXhta2d5Y21tanp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMTAxMywiZXhwIjoyMDg2MTk3MDEzfQ.XGqPi-F3wLim21IAqY9l_CjLwSoy_hCjAdsxXkJDtd4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStateWiseMajorCropsTable() {
  console.log('🔍 CHECKING State_Wise_Major_Crops TABLE...');
  
  try {
    // 1. Check if table exists and get structure
    console.log('\n📋 1. CHECKING TABLE STRUCTURE...');
    
    const { data: tableInfo, error: tableError } = await supabase
      .from('State_Wise_Major_Crops')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.log('❌ Table access error:', tableError);
      console.log('❌ Error details:', tableError.message);
      console.log('❌ Error code:', tableError.code);
      return false;
    }
    
    console.log('✅ Table accessible successfully!');
    console.log('📊 Sample data structure:');
    console.log(tableInfo);
    
    // 2. Get all data to see what's in the table
    console.log('\n📊 2. GETTING ALL DATA...');
    
    const { data: allData, error: dataError } = await supabase
      .from('State_Wise_Major_Crops')
      .select('*');
    
    if (dataError) {
      console.log('❌ Data fetch error:', dataError);
      return false;
    }
    
    console.log(`✅ Found ${allData.length} records in State_Wise_Major_Crops table`);
    
    if (allData.length > 0) {
      console.log('\n📋 COLUMN NAMES:');
      const columns = Object.keys(allData[0]);
      columns.forEach((col, index) => {
        console.log(`${index + 1}. ${col}`);
      });
      
      console.log('\n📊 SAMPLE DATA (First 3 records):');
      allData.slice(0, 3).forEach((record, index) => {
        console.log(`\n--- Record ${index + 1} ---`);
        Object.entries(record).forEach(([key, value]) => {
          console.log(`${key}: ${value}`);
        });
      });
    } else {
      console.log('⚠️ Table exists but has no data');
    }
    
    // 3. Test specific query for states page
    console.log('\n🎯 3. TESTING STATES PAGE QUERY...');
    
    const { data: statesData, error: statesError } = await supabase
      .from('State_Wise_Major_Crops')
      .select('state_name, major_crop_1, major_crop_2, major_crop_3, total_turnover, demand_status')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (statesError) {
      console.log('❌ States query error:', statesError);
      return false;
    }
    
    console.log(`✅ States page query successful: ${statesData.length} active states`);
    
    return true;
    
  } catch (error) {
    console.log('❌ Unexpected error:', error);
    return false;
  }
}

// Run the check
checkStateWiseMajorCropsTable()
  .then(success => {
    if (success) {
      console.log('\n🎉 SUCCESS: State_Wise_Major_Crops table is accessible and ready!');
      console.log('✅ You can proceed with states page development');
    } else {
      console.log('\n❌ FAILURE: Cannot access State_Wise_Major_Crops table');
      console.log('🔧 Please check table name, permissions, or data');
    }
  })
  .catch(error => {
    console.log('💥 Script failed:', error);
  });

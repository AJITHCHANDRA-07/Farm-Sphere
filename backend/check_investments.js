const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://vrqthuouyxmkgycmmjzt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycXRodW91eXhta2d5Y21tanp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMTAxMywiZXhwIjoyMDg2MTk3MDEzfQ.XGqPi-F3wLim21IAqY9l_CjLwSoy_hCjAdsxXkJDtd4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInvestmentsTable() {
  console.log('🔍 Checking Investments table access...');
  
  try {
    // Check if table exists and get data
    const { data, error, count } = await supabase
      .from('Investments')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('❌ Error accessing Investments table:', error);
      return;
    }
    
    console.log('✅ Successfully accessed Investments table!');
    console.log(`📊 Total records: ${count || 'Unknown'}`);
    console.log('📋 Sample data:');
    console.log(JSON.stringify(data, null, 2));
    
    // Get table structure
    if (data && data.length > 0) {
      console.log('\n🏗️ Table Structure:');
      console.log('Columns:', Object.keys(data[0]));
      
      console.log('\n📝 First record details:');
      Object.entries(data[0]).forEach(([key, value]) => {
        console.log(`  ${key}: ${value} (${typeof value})`);
      });
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

checkInvestmentsTable();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkTables() {
  try {
    console.log('🔍 Checking available tables...');
    
    // Get all tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('Error getting tables:', tablesError);
    } else {
      console.log('📋 Available tables:');
      tables.forEach(table => {
        console.log('  -', table.table_name);
      });
    }
    
    // Check for crop-related tables
    const cropTables = tables?.filter(t => 
      t.table_name.toLowerCase().includes('crop') || 
      t.table_name.toLowerCase().includes('term')
    ) || [];
    
    if (cropTables.length > 0) {
      console.log('\n🌾 Crop-related tables found:');
      cropTables.forEach(table => {
        console.log('  -', table.table_name);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTables();

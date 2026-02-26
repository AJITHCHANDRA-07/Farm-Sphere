const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testExploreSchemes() {
  console.log('🔍 Testing Explore_Schemes table access...\n');

  try {
    // 1. Check if table exists and count rows
    console.log('📊 Checking table existence and row count...');
    const { count, error: countError } = await supabase
      .from('Explore_Schemes')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log('❌ Table access error:', countError.message);
      console.log('💡 Table may not exist. Let me check available tables...\n');
      
      // List all tables
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (tablesError) {
        console.log('❌ Cannot list tables:', tablesError.message);
      } else {
        console.log('📋 Available tables in your database:');
        tables?.forEach(table => {
          console.log(`   - ${table.table_name}`);
        });
      }
      return;
    }
    
    console.log(`✅ Table exists! Total rows: ${count}\n`);

    // 2. Get all data if table has rows
    if (count > 0) {
      console.log('📄 Fetching all data from Explore_Schemes...');
      const { data, error } = await supabase
        .from('Explore_Schemes')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) {
        console.log('❌ Error fetching data:', error.message);
        return;
      }
      
      console.log(`✅ Found ${data.length} rows:\n`);
      data.forEach((row, index) => {
        console.log(`📝 Row ${index + 1}:`);
        console.log(`   ID: ${row.id}`);
        console.log(`   Scheme Name: ${row.scheme_name || 'N/A'}`);
        console.log(`   Objective Category: ${row.objective_category || 'N/A'}`);
        console.log(`   Sub Category: ${row.sub_category || 'N/A'}`);
        console.log(`   Is Active: ${row.is_active || 'N/A'}`);
        console.log(`   Priority: ${row.priority_level || 'N/A'}`);
        console.log('---');
      });
    } else {
      console.log('📝 Table is empty. No data to display.');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the test
testExploreSchemes();

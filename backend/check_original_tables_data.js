const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkOriginalTablesData() {
  try {
    console.log('🔍 CHECKING ORIGINAL TABLES FOR REAL CROP DATA');
    console.log('================================================');
    
    const originalTables = ['Short_Term_Crops', 'Medium_Term_Crops', 'Long_Term_Crops'];
    
    for (const tableName of originalTables) {
      console.log(`\n📊 TABLE: ${tableName}`);
      console.log('─'.repeat(60));
      
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*')
          .limit(5);
        
        if (error) {
          console.log(`❌ Error accessing ${tableName}: ${error.message}`);
        } else if (data && data.length > 0) {
          console.log(`✅ SUCCESS: Table ${tableName} has real data!`);
          console.log(`📋 Records Found: ${count || 'Unknown'}`);
          
          console.log('\n📄 REAL CROP DATA:');
          data.forEach((crop, i) => {
            console.log(`\n🌱 ${tableName} Crop ${i + 1}: ${crop['Crop Name']}`);
            console.log(`  📊 Supply Status: ${crop['Supply Status']}`);
            console.log(`  📈 Demand Status: ${crop['Demand Status']}`);
            console.log(`  ⚠️ Risk Factors: ${crop['Risk Factors']}`);
            console.log(`  ⏰ Crop Duration: ${crop['Crop Duration']}`);
            console.log(`  🌱 Primary Soil: ${crop['Primary Soil Type Required']}`);
            console.log(`  💧 Water Requirement: ${crop['Water Requirement']}`);
            console.log(`  🌡️ Climate: ${crop['Climate Suitability']}`);
            console.log(`  🚿 Irrigation: ${crop['Irrigation Compatibility']}`);
            console.log(`  📏 Land Area: ${crop['Land Area Suitability']}`);
            console.log(`  🛡️ Mitigation: ${crop['Mitigation Strategies']}`);
            console.log(`  🏞️ Crop Type: ${crop['Crop Type']}`);
            console.log(`  📍 District: ${crop['Suitable Telangana District']}`);
          });
        } else {
          console.log('📝 Table exists but no data found');
        }
      } catch (err) {
        console.log(`❌ Critical error with ${tableName}: ${err.message}`);
      }
    }
    
    console.log('\n🎯 ORIGINAL TABLES DATA SUMMARY');
    console.log('─'.repeat(60));
    console.log('✅ Check complete - See real crop data above');
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

checkOriginalTablesData();

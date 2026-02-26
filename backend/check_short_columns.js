const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkShortTermColumns() {
  try {
    console.log('🔍 CHECKING SHORT_TERM_CROPS TABLE COLUMNS');
    console.log('=======================================');
    
    // Get one record to see all columns
    const { data, error } = await supabase
      .from('Short_Term_Crops')
      .select('*')
      .eq('Suitable Telangana District', 'Rangareddy')
      .limit(1);
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    if (data && data.length > 0) {
      const crop = data[0];
      console.log('📋 Available columns in Short_Term_Crops:');
      console.log(Object.keys(crop));
      
      console.log('\n📋 Sample crop data:');
      Object.entries(crop).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });
    }
    
    // Check if there are any financial columns
    console.log('\n🔍 CHECKING FOR FINANCIAL COLUMNS');
    console.log('===================================');
    
    const { data: allData } = await supabase
      .from('Short_Term_Crops')
      .select('*')
      .eq('Suitable Telangana District', 'Rangareddy');
    
    if (allData) {
      console.log('📋 Looking for investment, yield, price, profit columns...');
      
      // Check common financial column names
      const financialColumns = [
        'Investment', 'Investment_Per_Acre', 'Investment Cost',
        'Yield', 'Expected_Yield', 'Expected_Yield_Per_Acre', 'Yield_Per_Acre',
        'Price', 'Market_Price', 'Market_Price_Per_KG', 'Price_Per_KG',
        'Profit', 'Profit_Per_Acre', 'Expected_Profit', 'Return'
      ];
      
      financialColumns.forEach(col => {
        const hasColumn = allData.some(crop => crop[col] !== undefined && crop[col] !== null);
        if (hasColumn) {
          console.log(`✅ Found column: ${col}`);
          allData.forEach(crop => {
            if (crop[col] !== undefined && crop[col] !== null) {
              console.log(`   ${crop['Crop Name']}: ${crop[col]}`);
            }
          });
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkShortTermColumns();

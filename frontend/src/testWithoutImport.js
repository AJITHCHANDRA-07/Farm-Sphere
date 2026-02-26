// 🌱 TEST WITHOUT IMPORT - CHECKING DATABASE CONNECTION
const testWithoutImport = async () => {
  console.log('🔍 TESTING WITHOUT IMPORT - CHECKING DATABASE CONNECTION');
  console.log('==================================================');
  
  try {
    // Test with hardcoded credentials
    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseUrl = 'https://vrqthuouyxmkgycmmjzt.supabase.co'
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycXRodW91eXhta2d5Y21tanp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjEwMTMsImV4cCI6MjA4NjE5NzAxM30.QyYs3TRH6pnHJ6qStkXIA6T29TDpsGl-8Pd1NXkkEtY'
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('✅ Supabase client created successfully');
    
    // Test Short Term Crops
    console.log('\n📊 Testing Short_Term_Crops:');
    const { data: shortData, error: shortError } = await supabase
      .from('Short_Term_Crops')
      .select('Crop Name, Supply Status, Demand Status, Risk Factors, Crop Duration')
      .limit(3);
    
    if (shortError) {
      console.log('❌ Error:', shortError.message);
    } else if (shortData && shortData.length > 0) {
      console.log(`✅ Found ${shortData.length} short-term crops`);
      shortData.forEach((crop, i) => {
        console.log(`\n🌱 Crop ${i + 1}: ${crop['Crop Name']}`);
        console.log(`  📊 Supply Status: "${crop['Supply Status']}"`);
        console.log(`  📈 Demand Status: "${crop['Demand Status']}"`);
        console.log(`  ⚠️ Risk Factors: "${crop['Risk Factors']}"`);
        console.log(`  ⏰ Crop Duration: "${crop['Crop Duration']}"`);
        
        // Check if data is actually "Not specified" or has real values
        const hasRealSupplyStatus = crop['Supply Status'] && crop['Supply Status'] !== 'Not specified';
        const hasRealDemandStatus = crop['Demand Status'] && crop['Demand Status'] !== 'Not specified';
        const hasRealRiskFactors = crop['Risk Factors'] && crop['Risk Factors'] !== 'Not specified';
        const hasRealDuration = crop['Crop Duration'] && crop['Crop Duration'] !== 'Not specified';
        
        console.log(`  ✅ Real Data Check: Supply=${hasRealSupplyStatus}, Demand=${hasRealDemandStatus}, Risk=${hasRealRiskFactors}, Duration=${hasRealDuration}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run the test
testWithoutImport();

export { testWithoutImport };

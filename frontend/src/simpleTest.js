// 🌱 SIMPLE TEST - CHECKING FOR "NOT SPECIFIED" ISSUE
import { supabase } from './supabaseClient';

const simpleTest = async () => {
  console.log('🔍 SIMPLE TEST - CHECKING ORIGINAL TABLES DATA');
  console.log('==================================================');
  
  try {
    // Test Short Term Crops
    console.log('\n📊 Testing Short_Term_Crops:');
    const { data: shortData, error: shortError } = await supabase
      .from('Short_Term_Crops')
      .select('Crop Name, Supply Status, Demand Status, Risk Factors, Crop Duration')
      .limit(5);
    
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
simpleTest();

export { simpleTest };

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vrqthuouyxmkgycmmjzt.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycXRodW91eXhta2d5Y21tanp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMTAxMywiZXhwIjoyMDg2MTk3MDEzfQ.XGqPi-F3wLim21IAqY9l_CjLwSoy_hCjAdsxXkJDtd4';

const supabase = createClient(supabaseUrl, serviceRoleKey);

const simpleUpload = async () => {
  try {
    console.log('Starting simple upload...');
    
    // Basic crop data
    const testCrop = {
      name: "Asparagus",
      category: "short",
      subcategory: "Vegetable", 
      duration: 105,
      profit_per_acre: 250000,
      investment_cost: 80000,
      expected_yield: 2500,
      market_price: 100,
      water_needs: "Medium",
      demand_level: "Very High",
      description: "Premium vegetable with high market demand and import dependency. Ideal for Telangana's red loam soils with proper irrigation.",
      climate: "Warm days, cool nights; 15-30°C",
      soil_type: "Sandy Loam, Deep Red Loam"
    };
    
    console.log('Inserting crop:', testCrop.name);
    
    const { data, error } = await supabase
      .from('crops')
      .insert(testCrop)
      .select();
    
    if (error) {
      console.error('Insert error:', error);
    } else {
      console.log('Insert success:', data);
    }
    
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

simpleUpload();

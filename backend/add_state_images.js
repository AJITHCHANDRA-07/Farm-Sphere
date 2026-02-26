const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://vrqthuouyxmkgycmmjzt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycXRodW91eXhta2d5Y21tanp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMTAxMywiZXhwIjoyMDg2MTk3MDEzfQ.XGqPi-F3wLim21IAqY9l_CjLwSoy_hCjAdsxXkJDtd4';

const supabase = createClient(supabaseUrl, supabaseKey);

// State images mapping (you can add actual image URLs later)
const stateImages = {
  "Andhra Pradesh": "/images/states/charminar.jpg",
  "Arunachal Pradesh": "/images/states/itafort.jpg", 
  "Assam": "/images/states/kamakhya.jpg",
  "Bihar": "/images/states/nalanda.jpg",
  "Chhattisgarh": "/images/states/raipur.jpg",
  "Goa": "/images/states/panaji.jpg",
  "Gujarat": "/images/states/gandhinagar.jpg",
  "Haryana": "/images/states/chandigarh.jpg",
  "Himachal Pradesh": "/images/states/shimla.jpg",
  "Jharkhand": "/images/states/ranchi.jpg",
  "Karnataka": "/images/states/bengaluru.jpg",
  "Kerala": "/images/states/thiruvananthapuram.jpg",
  "Madhya Pradesh": "/images/states/bhopal.jpg",
  "Maharashtra": "/images/states/mumbai.jpg",
  "Manipur": "/images/states/imphal.jpg",
  "Meghalaya": "/images/states/shillong.jpg",
  "Mizoram": "/images/states/aizawl.jpg",
  "Nagaland": "/images/states/kohima.jpg",
  "Odisha": "/images/states/bhubaneswar.jpg",
  "Punjab": "/images/states/chandigarh.jpg",
  "Rajasthan": "/images/states/jaipur.jpg",
  "Sikkim": "/images/states/gangtok.jpg",
  "Tamil Nadu": "/images/states/chennai.jpg",
  "Telangana": "/images/states/hyderabad.jpg",
  "Tripura": "/images/states/agartala.jpg",
  "Uttar Pradesh": "/images/states/lucknow.jpg",
  "Uttarakhand": "/images/states/dehradun.jpg",
  "West Bengal": "/images/states/kolkata.jpg"
};

async function addStateImages() {
  console.log('🖼️ ADDING STATE IMAGES TO DATABASE...');
  
  try {
    // Get all existing states
    const { data: existingStates, error: fetchError } = await supabase
      .from('State_Wise_Major_Crops')
      .select('id, state_name');
    
    if (fetchError) {
      console.log('❌ Error fetching existing states:', fetchError);
      return;
    }
    
    console.log(`✅ Found ${existingStates.length} states to update`);
    
    // Update each state with image URL
    for (const state of existingStates) {
      const imageUrl = stateImages[state.state_name] || '/images/states/default.jpg';
      
      const { data, error } = await supabase
        .from('State_Wise_Major_Crops')
        .update({ state_image: imageUrl })
        .eq('id', state.id);
      
      if (error) {
        console.log(`❌ Error updating ${state.state_name}:`, error);
      } else {
        console.log(`✅ Updated ${state.state_name} with image: ${imageUrl}`);
      }
    }
    
    console.log('🎉 STATE IMAGES UPDATE COMPLETED!');
    console.log('\n📋 STATE IMAGES MAPPING:');
    Object.entries(stateImages).forEach(([state, image]) => {
      console.log(`${state}: ${image}`);
    });
    
  } catch (error) {
    console.log('❌ Unexpected error:', error);
  }
}

// Run the update
addStateImages();

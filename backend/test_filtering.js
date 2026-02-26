// Test the frontend filtering logic
const userLocation = { district: "Rangareddy" };

// Simulate crops fetched from database
const databaseCrops = [
  { name: "Amalaki", district: "Rangareddy" },
  { name: "Arjuna", district: "Rangareddy" },
  { name: "Bhringraj", district: "Rangareddy" },
  { name: "Brahmi", district: "Rangareddy" },
  { name: "Guduchi", district: "Rangareddy" },
  { name: "Jatamansi", district: "Rangareddy" },
  { name: "Jeevanti", district: "Rangareddy" },
  { name: "Kaunch", district: "Rangareddy" },
  { name: "Mandukaparni", district: "Rangareddy" },
  { name: "Pippali", district: "Rangareddy" },
  { name: "Shatavari", district: "Rangareddy" },
  { name: "Vacha", district: "Rangareddy" }
];

console.log('🔍 TESTING FRONTEND FILTERING LOGIC');
console.log('===================================');
console.log(`User location: ${userLocation.district}`);
console.log(`Database crops count: ${databaseCrops.length}`);

// Simulate the filtering logic from frontend
const filteredCrops = databaseCrops.filter(crop => {
  const cropDistrict = crop.district?.toLowerCase().trim();
  const userDistrict = userLocation.district.toLowerCase().trim();
  
  // 🎯 HANDLE BOTH DISTRICT NAME VARIATIONS
  const matchesDistrict = cropDistrict === userDistrict || 
                            cropDistrict === 'rangareddy' && userDistrict === 'ranga reddy' ||
                            cropDistrict === 'ranga reddy' && userDistrict === 'rangareddy';
  
  console.log(`${crop.name}: "${cropDistrict}" vs "${userDistrict}" => ${matchesDistrict ? '✅ MATCH' : '❌ NO MATCH'}`);
  
  return matchesDistrict;
});

console.log(`\n📊 Filtered crops count: ${filteredCrops.length}`);
console.log('Filtered crops:', filteredCrops.map(c => c.name));

// Test with different district values
console.log('\n🔍 TESTING DIFFERENT DISTRICT VALUES');
console.log('=====================================');

const testCases = [
  "Rangareddy",
  "rangareddy", 
  "RANGAREDDY",
  "ranga reddy",
  "Ranga Reddy"
];

testCases.forEach(testDistrict => {
  const testUserLocation = { district: testDistrict };
  const testFiltered = databaseCrops.filter(crop => {
    const cropDistrict = crop.district?.toLowerCase().trim();
    const userDistrict = testUserLocation.district.toLowerCase().trim();
    
    const matchesDistrict = cropDistrict === userDistrict || 
                              cropDistrict === 'rangareddy' && userDistrict === 'ranga reddy' ||
                              cropDistrict === 'ranga reddy' && userDistrict === 'rangareddy';
    
    return matchesDistrict;
  });
  
  console.log(`User district: "${testDistrict}" => ${testFiltered.length} crops`);
});

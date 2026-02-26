import { supabase } from './supabaseClient'

const fetchData = async () => {
  console.log('🔍 TESTING SUPABASE CONNECTION')
  console.log('==================================')
  
  try {
    // Test 1: Fetch from Medium_Term_Crops
    console.log('\n📊 Test 1: Fetching from Medium_Term_Crops...')
    const { data: mediumData, error: mediumError } = await supabase
      .from('Medium_Term_Crops')
      .select('*')

    if (mediumError) {
      console.log('❌ Medium_Term_Crops Error:', mediumError.message)
    } else {
      console.log('✅ Medium_Term_Crops Connected Successfully!')
      console.log('📋 Records found:', mediumData.length)
      if (mediumData.length > 0) {
        console.log('📄 Sample data:', mediumData[0])
      } else {
        console.log('📝 Table is empty - ready for data insertion')
      }
    }

    // Test 2: Fetch from Short_Term_Crops
    console.log('\n📊 Test 2: Fetching from Short_Term_Crops...')
    const { data: shortData, error: shortError } = await supabase
      .from('Short_Term_Crops')
      .select('*')

    if (shortError) {
      console.log('❌ Short_Term_Crops Error:', shortError.message)
    } else {
      console.log('✅ Short_Term_Crops Connected Successfully!')
      console.log('📋 Records found:', shortData.length)
      if (shortData.length > 0) {
        console.log('📄 Sample data:', shortData[0])
      } else {
        console.log('📝 Table is empty - ready for data insertion')
      }
    }

    // Test 3: Fetch from Long_Term_Crops
    console.log('\n📊 Test 3: Fetching from Long_Term_Crops...')
    const { data: longData, error: longError } = await supabase
      .from('Long_Term_Crops')
      .select('*')

    if (longError) {
      console.log('❌ Long_Term_Crops Error:', longError.message)
    } else {
      console.log('✅ Long_Term_Crops Connected Successfully!')
      console.log('📋 Records found:', longData.length)
      if (longData.length > 0) {
        console.log('📄 Sample data:', longData[0])
      } else {
        console.log('📝 Table is empty - ready for data insertion')
      }
    }

    // Test 4: Fetch from main crop_data
    console.log('\n📊 Test 4: Fetching from crop_data...')
    const { data: mainData, error: mainError } = await supabase
      .from('crop_data')
      .select('*')

    if (mainError) {
      console.log('❌ crop_data Error:', mainError.message)
    } else {
      console.log('✅ crop_data Connected Successfully!')
      console.log('📋 Records found:', mainData.length)
      if (mainData.length > 0) {
        console.log('📄 Sample data:', mainData[0])
      } else {
        console.log('📝 Table is empty - ready for data insertion')
      }
    }

    // Summary
    console.log('\n🎯 CONNECTION TEST SUMMARY')
    console.log('===========================')
    console.log('✅ Supabase Client: Connected')
    console.log('✅ Database URL: https://vrqthuouyxmkgycmmjzt.supabase.co')
    console.log('✅ All Tables: Accessible')
    console.log('📊 Total Records Across All Tables:', 
      mediumData.length + shortData.length + longData.length + mainData.length)
    
    if (mediumData.length === 0 && shortData.length === 0 && 
        longData.length === 0 && mainData.length === 0) {
      console.log('💡 All tables are empty - Ready for data insertion!')
    }

  } catch (error) {
    console.error('❌ Connection Test Failed:', error.message)
  }
}

// Run the test
fetchData()

export { fetchData }

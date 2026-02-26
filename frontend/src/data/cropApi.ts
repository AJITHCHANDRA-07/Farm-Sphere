import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const supabaseUrl = 'https://vrqthuouyxmkgycmmjzt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycXRodW91eXhta2d5Y21tanp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMTAxMywiZXhwIjoyMDg2MTk3MDEzfQ.XGqPi-F3wLim21IAqY9l_CjLwSoy_hCjAdsxXkJDtd4'; // Use service role key for full access
const supabase = createClient(supabaseUrl, supabaseKey);

// API Configuration (fallback)
const API_BASE_URL = 'http://localhost:3001/api';

// Fetch crops by category from Supabase
export const fetchCropsByCategory = async (category: 'short' | 'medium' | 'long', userDistrict?: string) => {
  try {
    console.log(`🔄 Fetching ${category}-term crops from Supabase...`);
    console.log(`📍 User district: ${userDistrict || 'Not provided'}`);
    
    if (!userDistrict) {
      console.log('❌ No district provided');
      return [];
    }
    
    if (userDistrict === 'Not Supported') {
      console.log('❌ District not supported:', userDistrict);
      return [];
    }
    
    // Optimized query: Only fetch crops for the specific district
    let query = supabase
      .from('crop_data')
      .select('*');
    
    // Filter by district first for performance
    query = query.or(`Suitable Telangana Districts.ilike.%${userDistrict}%,Suitable Telangana Districts.ilike.%${userDistrict}`);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('❌ Supabase error:', error);
      return [];
    }
    
    console.log(`📊 Crops found for ${userDistrict}: ${data?.length || 0}`);
    
    // Convert raw data to expected format and filter by duration
    let processedCrops = (data || []).map((crop: any, index: number) => {
      // Parse duration - handle various formats
      let cropDuration = 0;
      const cropDurationStr = crop['Crop Duration (Days)'];
      
      if (cropDurationStr) {
        // Handle month patterns like "Aug-25", "May-20", "04-Oct"
        if (cropDurationStr.includes('-') && (cropDurationStr.includes('Jan') || cropDurationStr.includes('Feb') || cropDurationStr.includes('Mar') || cropDurationStr.includes('Apr') || cropDurationStr.includes('May') || cropDurationStr.includes('Jun') || cropDurationStr.includes('Jul') || cropDurationStr.includes('Aug') || cropDurationStr.includes('Sep') || cropDurationStr.includes('Oct') || cropDurationStr.includes('Nov') || cropDurationStr.includes('Dec'))) {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const parts = cropDurationStr.split('-');
          
          if (parts.length === 2) {
            // Handle patterns like "Aug-25" (month-day)
            const monthPart = parts.find(part => months.includes(part));
            const dayPart = parts.find(part => !isNaN(parseInt(part)));
            
            if (monthPart && dayPart) {
              const monthIndex = months.indexOf(monthPart);
              if (monthIndex !== -1) {
                cropDuration = (monthIndex * 30) + parseInt(dayPart);
              }
            }
            // Handle patterns like "04-Oct" (day-month)
            else if (parts[0].match(/^\d+$/) && months.includes(parts[1])) {
              const day = parseInt(parts[0]);
              const monthIndex = months.indexOf(parts[1]);
              if (monthIndex !== -1) {
                cropDuration = (monthIndex * 30) + day;
              }
            }
          }
        }
        // Handle day ranges like "90-120"
        else if (cropDurationStr.includes('-') && !isNaN(parseInt(cropDurationStr.split('-')[0]))) {
          const parts = cropDurationStr.split('-');
          // Take average of range for better categorization
          const start = parseInt(parts[0]) || 0;
          const end = parseInt(parts[1]) || parseInt(parts[0]) || 0;
          cropDuration = Math.floor((start + end) / 2);
        }
        // Handle single day values
        else if (!isNaN(parseInt(cropDurationStr))) {
          cropDuration = parseInt(cropDurationStr) || 0;
        }
      }
      
      // Simplified district-wise distribution based on user location
      // Just check if crop is suitable for the user's district and categorize by duration
      const suitableDistricts = crop['Suitable Telangana Districts'] || '';
      const districts = suitableDistricts.split(',').map(d => d.trim());
      
      // Duration parsing already handled above in cropDuration variable
      
      // Categorize based on actual duration
      let cropCategory: 'short' | 'medium' | 'long' = 'short';
      
      if (cropDuration <= 120) cropCategory = 'short';
      else if (cropDuration <= 365) cropCategory = 'medium';
      else cropCategory = 'long';
      
      return {
        id: index + 1,
        name: crop['Crop Name'],
        category: cropCategory,
        subcategory: crop['Crop Type'],
        duration: cropDuration,
        profit_per_acre: Math.floor(Math.random() * 200000) + 100000, // Mock data
        investment_cost: Math.floor(Math.random() * 80000) + 40000, // Mock data
        expected_yield: Math.floor(Math.random() * 3000) + 1500, // Mock data
        market_price: Math.floor(Math.random() * 80) + 40, // Mock data
        water_needs: crop['Water Requirement'],
        demand_level: crop['Demand Status'],
        image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=400`, // Mock image
        description: `${crop['Crop Name']} - ${crop['Crop Type']} with ${crop['Demand Status']} demand`,
        climate: crop['Climate Suitability'],
        soil_type: crop['Primary Soil Type Required'],
        suitable_districts: crop['Suitable Telangana Districts'],
        risk_factors: crop['Risk Factors'],
        mitigation_strategies: crop['Mitigation Strategies']
      };
    });
    
    console.log(`📋 Processed ${processedCrops.length} crops`);
    
    // Filter by category (district filtering already done in database query)
    const finalCrops = processedCrops.filter(crop => crop.category === category);
    console.log(`📊 ${category}-term crops for ${userDistrict}: ${finalCrops.length}`);
    
    // Sort by profit
    finalCrops.sort((a, b) => b.profit_per_acre - a.profit_per_acre);
    
    console.log(`✅ Returning ${finalCrops.length} ${category}-term crops for ${userDistrict}`);
    return finalCrops;
    
  } catch (error) {
    console.error('❌ Failed to fetch crops from Supabase:', error);
    return [];
  }
};

// Fetch all crops
export const fetchAllCrops = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crops`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch all crops:', error);
    return [];
  }
};

// Fetch crops by district
export const fetchCropsByDistrict = async (district: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crops/district/${district}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch crops by district:', error);
    return [];
  }
};

// NEW: Fetch high import dependency crops
export const fetchHighImportDependencyCrops = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crops/high-import-dependency`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch high import dependency crops:', error);
    return [];
  }
};

// NEW: Fetch high supply gap crops
export const fetchHighSupplyGapCrops = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crops/high-supply-gap`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch high supply gap crops:', error);
    return [];
  }
};

// NEW: Fetch crops with government schemes
export const fetchCropsWithSchemes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crops/with-schemes`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch crops with schemes:', error);
    return [];
  }
};

// NEW: Search crops
export const searchCrops = async (query: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crops/search/${query}`);
    return response.data;
  } catch (error) {
    console.error('Failed to search crops:', error);
    return [];
  }
};

// NEW: Fetch crop statistics
export const fetchCropStatistics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/crops/stats`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch crop statistics:', error);
    return null;
  }
};

// Fallback to static data if API fails
export const getCropsByCategory = async (category: 'short' | 'medium' | 'long', userDistrict?: string) => {
  try {
    // Try Supabase first
    const supabaseData = await fetchCropsByCategory(category, userDistrict);
    if (supabaseData.length > 0) return supabaseData;
    
    // Fallback to static data
    console.log('Using static fallback data');
    const cropDataModule = await import('./cropData');
    
    switch (category) {
      case 'short': return cropDataModule.shortTermCrops;
      case 'medium': return cropDataModule.mediumTermCrops;
      case 'long': return cropDataModule.longTermCrops;
      default: return cropDataModule.shortTermCrops;
    }
  } catch (error) {
    console.error('Error in getCropsByCategory:', error);
    return [];
  }
};

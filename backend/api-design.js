// =====================================================
// SCALABLE AGRICULTURAL PORTAL REST API DESIGN
// =====================================================
// Express.js API endpoints for the normalized database structure

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const app = express();

// Supabase configuration
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// =====================================================
// DISTRICT ENDPOINTS
// =====================================================

// GET /api/districts - Get all districts with basic info
app.get('/api/districts', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('districts')
      .select('*')
      .order('name');
    
    if (error) throw error;
    res.json({
      success: true,
      data: data,
      count: data?.length || 0
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/districts/:id - Get detailed district overview
app.get('/api/districts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get comprehensive district data
    const { data: district, error: districtError } = await supabase
      .from('districts')
      .select('*')
      .eq('district_id', id)
      .single();
    
    if (districtError) throw districtError;
    
    // Get district overview
    const { data: overview, error: overviewError } = await supabase
      .from('district_overview')
      .select('*')
      .eq('district_id', id)
      .single();
    
    // Get available crops in district
    const { data: crops, error: cropsError } = await supabase
      .from('cultivation_guides')
      .select(`
        crop_varieties(crop_id, name, category, duration_days),
        roi_calculator(profit_per_acre, roi_percentage, investment_cost)
      `)
      .eq('district_id', id);
    
    if (overviewError || cropsError) throw (overviewError || cropsError);
    
    res.json({
      success: true,
      data: {
        ...district,
        overview,
        available_crops: crops?.length || 0,
        crops: crops?.map(c => ({
          ...c.crop_varieties,
          roi: c.roi_calculator
        })) || []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/districts/:id/performance - Get district performance metrics
app.get('/api/districts/:id/performance', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('district_performance_summary')
      .select('*')
      .eq('district_id', id)
      .single();
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// CROP ENDPOINTS
// =====================================================

// GET /api/crops - Get all crops with pagination and filtering
app.get('/api/crops', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      duration_min, 
      duration_max,
      search 
    } = req.query;
    
    let query = supabase
      .from('crop_varieties')
      .select(`
        *,
        crop_overview(description, market_demand, supply_gap)
      `);
    
    // Apply filters
    if (category) query = query.eq('category', category);
    if (duration_min) query = query.gte('duration_days', duration_min);
    if (duration_max) query = query.lte('duration_days', duration_max);
    if (search) query = query.ilike('name', `%${search}%`);
    
    const { data, error, count } = await query
      .order('name')
      .range((page - 1) * limit, page * limit - 1);
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/crops/:id - Get comprehensive crop information
app.get('/api/crops/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get basic crop info
    const { data: crop, error: cropError } = await supabase
      .from('crop_varieties')
      .select('*')
      .eq('crop_id', id)
      .single();
    
    if (cropError) throw cropError;
    
    // Get crop overview
    const { data: overview, error: overviewError } = await supabase
      .from('crop_overview')
      .select('*')
      .eq('crop_id', id)
      .single();
    
    // Get availability across districts
    const { data: availability, error: availabilityError } = await supabase
      .from('cultivation_guides')
      .select(`
        district_id,
        districts(name, state, climate_zone),
        planting_season,
        harvest_season,
        roi_calculator(profit_per_acre, roi_percentage)
      `)
      .eq('crop_id', id);
    
    if (overviewError || availabilityError) throw (overviewError || availabilityError);
    
    res.json({
      success: true,
      data: {
        ...crop,
        overview,
        available_in: availability?.length || 0,
        districts: availability?.map(a => ({
          district_id: a.district_id,
          district: a.districts,
          planting_season: a.planting_season,
          harvest_season: a.harvest_season,
          roi: a.roi_calculator
        })) || []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/crops/search - Advanced crop search
app.get('/api/crops/search', async (req, res) => {
  try {
    const { 
      q, 
      category, 
      water_needs, 
      profit_min,
      profit_max,
      district_id 
    } = req.query;
    
    let query = supabase
      .from('crop_comprehensive_view')
      .select('*');
    
    if (q) {
      query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
    }
    if (category) query = query.eq('category', category);
    if (water_needs) query = query.ilike('water_needs', `%${water_needs}%`);
    if (profit_min) query = query.gte('profit_per_acre', profit_min);
    if (profit_max) query = query.lte('profit_per_acre', profit_max);
    if (district_id) query = query.eq('district_id', district_id);
    
    const { data, error } = await query
      .order('profit_per_acre', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data,
      count: data?.length || 0
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// ROI AND FINANCIAL ENDPOINTS
// =====================================================

// GET /api/roi/district/:districtId - Get ROI analysis for district
app.get('/api/roi/district/:districtId', async (req, res) => {
  try {
    const { districtId } = req.params;
    const { limit = 10 } = req.query;
    
    const { data, error } = await supabase
      .from('roi_calculator')
      .select(`
        *,
        crop_varieties(name, category, duration_days),
        districts(name, state)
      `)
      .eq('district_id', districtId)
      .order('profit_per_acre', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data,
      count: data?.length || 0
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/roi/crop/:cropId - Get ROI comparison across districts
app.get('/api/roi/crop/:cropId', async (req, res) => {
  try {
    const { cropId } = req.params;
    
    const { data, error } = await supabase
      .from('roi_calculator')
      .select(`
        *,
        districts(name, state, climate_zone),
        cultivation_guides(planting_season, harvest_season)
      `)
      .eq('crop_id', cropId)
      .order('profit_per_acre', { ascending: false });
    
    if (error) throw error;
    
    // Calculate statistics
    const profits = data?.map(d => d.profit_per_acre) || [];
    const stats = {
      avg_profit: profits.reduce((a, b) => a + b, 0) / profits.length,
      max_profit: Math.max(...profits),
      min_profit: Math.min(...profits),
      total_districts: data?.length || 0
    };
    
    res.json({
      success: true,
      data: data,
      statistics: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/roi/opportunities - Get high ROI opportunities
app.get('/api/roi/opportunities', async (req, res) => {
  try {
    const { 
      min_roi = 200, 
      category, 
      district_id,
      limit = 20 
    } = req.query;
    
    let query = supabase
      .from('roi_calculator')
      .select(`
        *,
        crop_varieties(name, category, duration_days),
        districts(name, state),
        crop_overview(market_demand, supply_gap)
      `)
      .gte('roi_percentage', min_roi);
    
    if (category) query = query.eq('crop_varieties.category', category);
    if (district_id) query = query.eq('district_id', district_id);
    
    const { data, error } = await query
      .order('roi_percentage', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data,
      count: data?.length || 0,
      filters: { min_roi, category, district_id }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// CULTIVATION GUIDE ENDPOINTS
// =====================================================

// GET /api/cultivation/district/:districtId/crop/:cropId
app.get('/api/cultivation/district/:districtId/crop/:cropId', async (req, res) => {
  try {
    const { districtId, cropId } = req.params;
    
    const { data, error } = await supabase
      .from('cultivation_guides')
      .select(`
        *,
        crop_varieties(name, scientific_name, category),
        districts(name, state, climate_zone, soil_type)
      `)
      .eq('district_id', districtId)
      .eq('crop_id', cropId)
      .single();
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/cultivation/seasonal/:districtId - Get seasonal planting guide
app.get('/api/cultivation/seasonal/:districtId', async (req, res) => {
  try {
    const { districtId } = req.params;
    const { season } = req.query;
    
    let query = supabase
      .from('cultivation_guides')
      .select(`
        *,
        crop_varieties(name, category, duration_days),
        roi_calculator(profit_per_acre, roi_percentage)
      `)
      .eq('district_id', districtId);
    
    if (season) {
      query = query.or(`planting_season.ilike.%${season}%,harvest_season.ilike.%${season}%`);
    }
    
    const { data, error } = await query
      .order('roi_calculator.profit_per_acre', { ascending: false });
    
    if (error) throw error;
    
    // Group by planting season
    const grouped = data?.reduce((acc, item) => {
      const season = item.planting_season || 'Unknown';
      if (!acc[season]) acc[season] = [];
      acc[season].push(item);
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: grouped,
      count: data?.length || 0
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// MARKET ANALYSIS ENDPOINTS
// =====================================================

// GET /api/market/demand - Get market demand analysis
app.get('/api/market/demand', async (req, res) => {
  try {
    const { district_id, demand_level = 'High' } = req.query;
    
    let query = supabase
      .from('crop_overview')
      .select(`
        *,
        crop_varieties(name, category),
        cultivation_guides!inner(district_id)
      `)
      .eq('market_demand', demand_level);
    
    if (district_id) {
      query = query.eq('cultivation_guides.district_id', district_id);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data,
      count: data?.length || 0,
      demand_level
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/market/supply-gap - Get supply gap opportunities
app.get('/api/market/supply-gap', async (req, res) => {
  try {
    const { min_gap = 1000 } = req.query;
    
    const { data, error } = await supabase
      .from('crop_overview')
      .select(`
        *,
        crop_varieties(name, category, duration_days),
        roi_calculator(profit_per_acre)
      `)
      .gt('supply_gap', min_gap)
      .order('supply_gap', { ascending: false });
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data,
      count: data?.length || 0
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// ANALYTICS DASHBOARD ENDPOINTS
// =====================================================

// GET /api/analytics/overview - Get system-wide analytics
app.get('/api/analytics/overview', async (req, res) => {
  try {
    // Get district summary
    const { data: districts, error: districtsError } = await supabase
      .from('district_performance_summary')
      .select('*');
    
    // Get category performance
    const { data: categories, error: categoriesError } = await supabase
      .rpc('get_category_performance');
    
    // Get top performing crops
    const { data: topCrops, error: cropsError } = await supabase
      .from('roi_calculator')
      .select(`
        profit_per_acre,
        roi_percentage,
        crop_varieties(name, category),
        districts(name)
      `)
      .order('profit_per_acre', { ascending: false })
      .limit(10);
    
    if (districtsError || categoriesError || cropsError) {
      throw (districtsError || categoriesError || cropsError);
    }
    
    res.json({
      success: true,
      data: {
        districts: districts || [],
        categories: categories || [],
        top_crops: topCrops || [],
        summary: {
          total_districts: districts?.length || 0,
          avg_roi_per_district: districts?.reduce((sum, d) => sum + (d.avg_roi_percentage || 0), 0) / (districts?.length || 1),
          total_crop_varieties: new Set(topCrops?.map(c => c.crop_varieties.name))?.size || 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// EXAMPLE JSON RESPONSE STRUCTURES
// =====================================================

/*
Example Response for /api/districts/1:

{
  "success": true,
  "data": {
    "district_id": 1,
    "name": "Khammam",
    "state": "Telangana",
    "climate_zone": "Tropical",
    "soil_type": "Red Sandy Loam",
    "avg_rainfall": 1200,
    "overview": {
      "total_crops": 45,
      "major_crops": ["Paddy", "Cotton", "Maize", "Chili", "Turmeric"],
      "agriculture_gdp": 450000000,
      "farmer_count": 2250,
      "avg_farm_size": 2.5,
      "irrigation_coverage": 75.0
    },
    "available_crops": 45,
    "crops": [
      {
        "crop_id": 1,
        "name": "Paddy",
        "category": "short",
        "duration_days": 120,
        "roi": {
          "profit_per_acre": 250000,
          "roi_percentage": 350,
          "investment_cost": 70000
        }
      }
    ]
  }
}

Example Response for /api/crops/search?q=paddy:

{
  "success": true,
  "data": [
    {
      "crop_id": 1,
      "name": "Paddy",
      "category": "short",
      "duration_days": 120,
      "profit_per_acre": 250000,
      "roi_percentage": 350,
      "district_name": "Khammam",
      "planting_season": "Kharif",
      "harvest_season": "Rabi",
      "market_demand": "High"
    }
  ],
  "count": 1
}
*/

module.exports = app;

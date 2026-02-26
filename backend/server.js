const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase configuration with SERVICE ROLE KEY for full access
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // Use service role key for full access
);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/crops', async (req, res) => {
  try {
    console.log('🔍 Fetching all crops from crop_data table...');
    
    const { data, error } = await supabase
      .from('crop_data')
      .select('*');
    
    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    
    console.log(`📊 Found ${data?.length || 0} crops`);
    res.json(data || []);
  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get crops by import dependency
app.get('/api/crops/high-import-dependency', async (req, res) => {
  try {
    console.log('🔍 Fetching high import dependency crops...');
    const { data, error } = await supabase
      .from('crops')
      .select('*')
      .order('profit_per_acre', { ascending: false })
      .limit(10);
    
    console.log(`📊 Found ${data?.length || 0} high import dependency crops`);
    
    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    res.json(data || []);
  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get crops by supply gap
app.get('/api/crops/high-supply-gap', async (req, res) => {
  try {
    console.log('🔍 Fetching high supply gap crops...');
    const { data, error } = await supabase
      .from('crops')
      .select('*')
      .order('profit_per_acre', { ascending: false })
      .limit(10);
    
    console.log(`📊 Found ${data?.length || 0} high supply gap crops`);
    
    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    res.json(data || []);
  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get crops with government schemes
app.get('/api/crops/with-schemes', async (req, res) => {
  try {
    console.log('🔍 Fetching crops with government schemes...');
    const { data, error } = await supabase
      .from('crops')
      .select('*')
      .not('government_schemes', 'is', null)
      .order('profit_per_acre', { ascending: false });
    
    console.log(`📊 Found ${data?.length || 0} crops with government schemes`);
    
    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    res.json(data || []);
  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Search crops by name
app.get('/api/crops/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    console.log(`🔍 Searching crops: ${query}...`);
    
    const { data, error } = await supabase
      .from('crop_data')
      .select('*')
      .ilike('Crop Name', `%${query}%`)
      .limit(20);
    
    if (error) throw error;
    
    console.log(`📊 Found ${data?.length || 0} crops matching "${query}"`);
    res.json(data || []);
  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get comprehensive statistics
app.get('/api/crops/stats', async (req, res) => {
  try {
    console.log('📊 Fetching crop statistics...');
    
    const { data: allCrops, error } = await supabase
      .from('crop_data')
      .select('Crop Name, Crop Type, Demand Status, Supply Status');
    
    if (error) throw error;
    
    const stats = {
      total_crops: allCrops?.length || 0,
      crop_types: {},
      demand_status: {},
      supply_status: {}
    };
    
    allCrops?.forEach(crop => {
      // Count by crop type
      const type = crop['Crop Type'] || 'Unknown';
      stats.crop_types[type] = (stats.crop_types[type] || 0) + 1;
      
      // Count by demand status
      const demand = crop['Demand Status'] || 'Unknown';
      stats.demand_status[demand] = (stats.demand_status[demand] || 0) + 1;
      
      // Count by supply status
      const supply = crop['Supply Status'] || 'Unknown';
      stats.supply_status[supply] = (stats.supply_status[supply] || 0) + 1;
    });
    
    console.log('📊 Statistics calculated:', stats);
    res.json(stats);
  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/crops/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`🔍 Fetching ${category} crops...`);
    
    const { data, error } = await supabase
      .from('crop_data')
      .select('*')
      .ilike('Crop Type', `%${category}%`);
    
    if (error) throw error;
    
    console.log(`📊 Found ${data?.length || 0} ${category} crops`);
    res.json(data || []);
  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/crops/district/:district', async (req, res) => {
  try {
    const { district } = req.params;
    console.log(`🔍 Fetching crops for district: ${district}...`);
    
    const { data, error } = await supabase
      .from('crop_data')
      .select('*')
      .ilike('Suitable Telangana Districts', `%${district}%`);
    
    if (error) throw error;
    
    console.log(`📊 Found ${data?.length || 0} crops in ${district}`);
    res.json(data || []);
  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/crops', async (req, res) => {
  try {
    console.log('➕ Adding new crop:', req.body.name);
    
    const { data, error } = await supabase
      .from('crop_data')
      .insert([req.body])
      .select();
    
    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    
    console.log('✅ Crop added successfully:', data[0].name);
    res.json(data[0]);
  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get all government schemes
app.get('/api/explore-schemes', async (req, res) => {
  try {
    console.log('🔍 Fetching all schemes from Explore_Schemes table...');
    
    const { data, error } = await supabase
      .from('Explore_Schemes')
      .select('*')
      .order('Id', { ascending: false });
    
    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    
    // Transform data to match frontend interface
    const transformedData = (data || []).map(scheme => ({
      id: scheme.Id,
      slug: scheme.Slug || scheme['Scheme Name']?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: scheme['Scheme Name'] || scheme.name,
      type: scheme.Type || scheme.type,
      governingMinistry: scheme['Governing Ministry/Department'] || scheme.governingMinistry,
      helpdeskNumber: scheme.Helpdesk || scheme.helpdeskNumber,
      objective: scheme.Objective || scheme.objective,
      benefits: scheme.Benefits || scheme.benefits,
      maxAmount: scheme['Max Amount/Subsidy'] || scheme.maxAmount,
      interestRate: scheme['Interest Rate'] || scheme.interestRate,
      targetBeneficiary: scheme['Target Beneficiary'] || scheme.targetBeneficiary,
      collateral: scheme.Collateral || scheme.collateral,
      statusTracking: scheme['Status Tracking'] || scheme.statusTracking,
      applicationProcess: scheme['Application Process'] || scheme.applicationProcess,
      documentsRequired: scheme['Documents Required'] || scheme.documentsRequired,
      creditScore: scheme['Credit Score'] || scheme.creditScore,
      officialApplyLink: scheme['Official Apply Link'] || scheme.officialApplyLink,
      image: scheme.Image || scheme.image,
      priorityLevel: scheme['Priority Level'] || scheme.priorityLevel,
      isActive: scheme['Is Active'] !== false // Default to true if not specified
    }));
    
    console.log(`📊 Found ${transformedData?.length || 0} active schemes`);
    res.json(transformedData);
  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get schemes by objective category
app.get('/api/explore-schemes/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`🔍 Fetching schemes for category: ${category}...`);
    
    const { data, error } = await supabase
      .from('Explore_schemes')
      .select('*')
      .eq('objective_category', category)
      .eq('is_active', true)
      .order('priority_level', { ascending: false });
    
    if (error) throw error;
    
    console.log(`📊 Found ${data?.length || 0} schemes for ${category}`);
    res.json(data || []);
  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get schemes by sub-category
app.get('/api/explore-schemes/subcategory/:subcategory', async (req, res) => {
  try {
    const { subcategory } = req.params;
    console.log(`🔍 Fetching schemes for sub-category: ${subcategory}...`);
    
    const { data, error } = await supabase
      .from('Explore_schemes')
      .select('*')
      .eq('sub_category', subcategory)
      .eq('is_active', true)
      .order('priority_level', { ascending: false });
    
    if (error) throw error;
    
    console.log(`📊 Found ${data?.length || 0} schemes for ${subcategory}`);
    res.json(data || []);
  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Search schemes by name
app.get('/api/explore-schemes/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    console.log(`🔍 Searching schemes: ${query}...`);
    
    const { data, error } = await supabase
      .from('Explore_schemes')
      .select('*')
      .ilike('scheme_name', `%${query}%`)
      .eq('is_active', true)
      .order('priority_level', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    
    console.log(`📊 Found ${data?.length || 0} schemes matching "${query}"`);
    res.json(data || []);
  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Count rows in Explore_schemes table
app.get('/api/explore-schemes/count', async (req, res) => {
  try {
    console.log('🔍 Counting rows in Explore_schemes table...');
    
    const { count, error } = await supabase
      .from('Explore_schemes')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    
    console.log(`📊 Total rows in Explore_schemes: ${count || 0}`);
    res.json({ 
      table: 'Explore_schemes',
      total_rows: count || 0,
      message: count === 0 ? 'Table is empty or does not exist' : 'Table has data'
    });
  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.status(500).json({ 
      error: error.message,
      table: 'Explore_schemes',
      total_rows: 0,
      message: 'Table may not exist or connection error'
    });
  }
});

// Get scheme details by ID
app.get('/api/explore-schemes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Fetching scheme details for ID: ${id}...`);
    
    const { data, error } = await supabase
      .from('Explore_Schemes')
      .select('*')
      .eq('Id', id)
      .single();
    
    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Scheme not found' });
    }
    
    // Transform data to match frontend interface
    const transformedScheme = {
      id: data.Id,
      slug: data.Slug || data['Scheme Name']?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: data['Scheme Name'] || data.name,
      type: data.Type || data.type,
      governingMinistry: data['Governing Ministry/Department'] || data.governingMinistry,
      helpdeskNumber: data.Helpdesk || data.helpdeskNumber,
      objective: data.Objective || data.objective,
      benefits: data.Benefits || data.benefits,
      maxAmount: data['Max Amount/Subsidy'] || data.maxAmount,
      interestRate: data['Interest Rate'] || data.interestRate,
      targetBeneficiary: data['Target Beneficiary'] || data.targetBeneficiary,
      collateral: data.Collateral || data.collateral,
      statusTracking: data['Status Tracking'] || data.statusTracking,
      applicationProcess: data['Application Process'] || data.applicationProcess,
      documentsRequired: data['Documents Required'] || data.documentsRequired,
      creditScore: data['Credit Score'] || data.creditScore,
      officialApplyLink: data['Official Apply Link'] || data.officialApplyLink,
      image: data.Image || data.image,
      priorityLevel: data['Priority Level'] || data.priorityLevel,
      isActive: data['Is Active'] !== false // Default to true if not specified
    };
    
    console.log(`✅ Found scheme: ${transformedScheme.name}`);
    res.json(transformedScheme);
  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Send query email for scheme help
app.post('/api/send-scheme-query', async (req, res) => {
  try {
    const { name, email, phone, schemeName, message } = req.body;
    
    console.log('📧 Sending scheme query email...');
    console.log(`From: ${name} (${email})`);
    console.log(`Scheme: ${schemeName}`);
    console.log(`Message: ${message}`);
    
    // For now, just log the email data (in production, you'd use nodemailer or similar)
    const emailContent = `
      New Scheme Query from FarmSphere
      
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Scheme: ${schemeName}
      
      Message:
      ${message}
      
      Sent: ${new Date().toISOString()}
    `;
    
    console.log('📧 Email content prepared:');
    console.log(emailContent);
    
    // TODO: Implement actual email sending with nodemailer
    // For now, we'll just return success
    res.json({ 
      success: true, 
      message: 'Query sent successfully! We will get back to you soon.' 
    });
    
  } catch (error) {
    console.error('❌ Error sending query:', error.message);
    res.status(500).json({ 
      error: 'Failed to send query. Please try again.' 
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🌱 FarmSphere API is running!',
    endpoints: {
      health: '/health',
      crops: '/api/crops',
      search: '/api/crops/search/:query',
      category: '/api/crops/category/:category',
      district: '/api/crops/district/:district',
      stats: '/api/crops/stats',
      schemes: '/api/explore-schemes',
      schemes_by_category: '/api/explore-schemes/category/:category',
      schemes_by_subcategory: '/api/explore-schemes/subcategory/:subcategory',
      search_schemes: '/api/explore-schemes/search/:query',
      scheme_details: '/api/explore-schemes/:id',
      schemes_count: '/api/explore-schemes/count'
    },
    status: '✅ Server is ready'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'FarmSphere API is running',
    database: 'Supabase connected'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 FarmSphere API running on http://localhost:${PORT}`);
  console.log(`🌱 Connected to Supabase: ${process.env.SUPABASE_URL}`);
  console.log('📊 Try: curl http://localhost:3001/api/explore-schemes');
  console.log('🏛️ Explore Schemes endpoint is ready!');
});

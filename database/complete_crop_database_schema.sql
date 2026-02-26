-- 🌱 FARMSPHERE COMPLETE CROP DATABASE BLUEPRINT
-- Database Schema for Explore Crops Feature

-- ========================================
-- 📋 TABLE 1: CROP MASTER TABLE
-- ========================================
CREATE TABLE crop_master (
    id INT PRIMARY KEY AUTO_INCREMENT,
    crop_name VARCHAR(255) NOT NULL,
    scientific_name VARCHAR(255),
    category ENUM('short', 'medium', 'long') NOT NULL,
    duration_days INT NOT NULL,
    duration_display VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    profit_per_acre DECIMAL(12,2) NOT NULL,
    investment_cost DECIMAL(12,2) NOT NULL,
    expected_yield DECIMAL(10,2) NOT NULL,
    market_price DECIMAL(8,2) NOT NULL,
    water_needs VARCHAR(255) NOT NULL,
    demand_level ENUM('Very High', 'High', 'Medium', 'Low') NOT NULL,
    image_url VARCHAR(500),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================
-- 🗺️ TABLE 2: DISTRICT CROP MAPPING
-- ========================================
CREATE TABLE district_crop_mapping (
    id INT PRIMARY KEY AUTO_INCREMENT,
    crop_id INT NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    match_percentage DECIMAL(5,2) NOT NULL,
    priority_level ENUM('High', 'Medium', 'Low') NOT NULL,
    soil_compatibility DECIMAL(5,2),
    climate_compatibility DECIMAL(5,2),
    water_compatibility DECIMAL(5,2),
    infrastructure_score DECIMAL(5,2),
    market_access_score DECIMAL(5,2),
    cultivation_feasibility TEXT,
    recommended_area_acres INT DEFAULT 0,
    FOREIGN KEY (crop_id) REFERENCES crop_master(id) ON DELETE CASCADE,
    INDEX idx_crop_district (crop_id, district_name),
    INDEX idx_district_match (district_name, match_percentage)
);

-- ========================================
-- 🌾 TABLE 3: CULTIVATION GUIDE
-- ========================================
CREATE TABLE cultivation_guide (
    id INT PRIMARY KEY AUTO_INCREMENT,
    crop_id INT NOT NULL,
    soil_types TEXT NOT NULL, -- JSON array of soil types
    climate_min_temp DECIMAL(5,2),
    climate_max_temp DECIMAL(5,2),
    climate_rainfall_min DECIMAL(8,2),
    climate_rainfall_max DECIMAL(8,2),
    climate_season VARCHAR(100),
    climate_notes TEXT,
    irrigation_method VARCHAR(255),
    fertilizer_guideline TEXT,
    planting_season VARCHAR(255),
    harvest_timeline TEXT, -- JSON array of timeline stages
    pest_management TEXT, -- JSON array of pests and treatments
    cultivation_steps TEXT, -- JSON array of step-by-step process
    storage_requirements TEXT,
    transportation_needs TEXT,
    FOREIGN KEY (crop_id) REFERENCES crop_master(id) ON DELETE CASCADE
);

-- ========================================
-- 💰 TABLE 4: ROI CALCULATOR
-- ========================================
CREATE TABLE roi_calculator (
    id INT PRIMARY KEY AUTO_INCREMENT,
    crop_id INT NOT NULL,
    land_area_acre DECIMAL(8,2) DEFAULT 1.00,
    investment_seeds DECIMAL(10,2),
    investment_fertilizers DECIMAL(10,2),
    investment_irrigation DECIMAL(10,2),
    investment_labor DECIMAL(10,2),
    investment_equipment DECIMAL(10,2),
    investment_other DECIMAL(10,2),
    total_investment DECIMAL(12,2),
    expected_yield_per_acre DECIMAL(10,2),
    price_per_unit DECIMAL(8,2),
    unit_type VARCHAR(50), -- kg, quintal, ton, etc.
    total_revenue DECIMAL(12,2),
    gross_profit DECIMAL(12,2),
    net_profit DECIMAL(12,2),
    roi_percentage DECIMAL(5,2),
    best_markets TEXT, -- JSON array of target markets
    price_fluctuation TEXT,
    demand_period VARCHAR(255),
    export_potential TEXT,
    competition_level ENUM('Low', 'Medium', 'High'),
    storage_life_days INT,
    FOREIGN KEY (crop_id) REFERENCES crop_master(id) ON DELETE CASCADE
);

-- ========================================
-- ⚠️ TABLE 5: RISK ASSESSMENT
-- ========================================
CREATE TABLE risk_assessment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    crop_id INT NOT NULL,
    climate_risk TEXT,
    market_risk TEXT,
    production_risk TEXT,
    disease_risk TEXT,
    mitigation_strategies TEXT, -- JSON array of strategies
    risk_level ENUM('Low', 'Medium', 'High') NOT NULL,
    insurance_recommended BOOLEAN DEFAULT FALSE,
    crop_insurance_available BOOLEAN DEFAULT FALSE,
    government_schemes TEXT, -- JSON array of applicable schemes
    FOREIGN KEY (crop_id) REFERENCES crop_master(id) ON DELETE CASCADE
);

-- ========================================
-- 📊 TABLE 6: CROP STAGES GROWTH
-- ========================================
CREATE TABLE crop_growth_stages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    crop_id INT NOT NULL,
    stage_name VARCHAR(100) NOT NULL,
    days_from_start INT NOT NULL,
    stage_description TEXT,
    activities_required TEXT, -- JSON array of activities
    expected_outcome TEXT,
    duration_days INT,
    FOREIGN KEY (crop_id) REFERENCES crop_master(id) ON DELETE CASCADE,
    INDEX idx_crop_stage_order (crop_id, days_from_start)
);

-- ========================================
-- 🏪 TABLE 7: MARKET INFORMATION
-- ========================================
CREATE TABLE market_information (
    id INT PRIMARY KEY AUTO_INCREMENT,
    crop_id INT NOT NULL,
    market_name VARCHAR(255) NOT NULL,
    district VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Telangana',
    avg_market_price DECIMAL(8,2),
    price_trend ENUM('Increasing', 'Stable', 'Decreasing'),
    peak_demand_months TEXT, -- JSON array of months
    supply_chain_info TEXT,
    storage_facilities BOOLEAN DEFAULT FALSE,
    processing_units BOOLEAN DEFAULT FALSE,
    export_potential BOOLEAN DEFAULT FALSE,
    major_buyers TEXT, -- JSON array of buyer types
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (crop_id) REFERENCES crop_master(id) ON DELETE CASCADE
);

-- ========================================
-- 🖼️ TABLE 8: CROP IMAGES GALLERY
-- ========================================
CREATE TABLE crop_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    crop_id INT NOT NULL,
    image_type ENUM('main', 'growth_stage', 'harvest', 'disease', 'infrastructure') NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_caption TEXT,
    stage_name VARCHAR(100), -- For growth stage images
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (crop_id) REFERENCES crop_master(id) ON DELETE CASCADE,
    INDEX idx_crop_image_type (crop_id, image_type, display_order)
);

-- ========================================
-- 📋 TABLE 9: CROP VARIETIES
-- ========================================
CREATE TABLE crop_varieties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    crop_id INT NOT NULL,
    variety_name VARCHAR(255) NOT NULL,
    variety_code VARCHAR(100),
    characteristics TEXT,
    yield_potential DECIMAL(10,2),
    disease_resistance TEXT, -- JSON array of diseases
    climate_suitability TEXT,
    market_preference TEXT,
    seed_source VARCHAR(255),
    seed_cost DECIMAL(8,2),
    recommended_for VARCHAR(255), -- Specific districts or regions
    is_popular BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (crop_id) REFERENCES crop_master(id) ON DELETE CASCADE,
    INDEX idx_crop_variety (crop_id, is_popular)
);

-- ========================================
-- 🏛️ TABLE 10: GOVERNMENT SCHEMES
-- ========================================
CREATE TABLE government_schemes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    crop_id INT NOT NULL,
    scheme_name VARCHAR(255) NOT NULL,
    scheme_type ENUM('subsidy', 'insurance', 'loan', 'training', 'infrastructure') NOT NULL,
    description TEXT,
    eligibility_criteria TEXT,
    benefits TEXT, -- JSON array of benefits
    application_process TEXT,
    contact_info TEXT,
    website_url VARCHAR(500),
    max_subsidy_amount DECIMAL(10,2),
    applicable_districts TEXT, -- JSON array of districts
    is_active BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (crop_id) REFERENCES crop_master(id) ON DELETE CASCADE
);

-- ========================================
-- 📈 VIEWS FOR EASY DATA RETRIEVAL
-- ========================================

-- View for Crop Overview (Main List)
CREATE VIEW crop_overview_view AS
SELECT 
    cm.id,
    cm.crop_name,
    cm.category,
    cm.duration_days,
    cm.duration_display,
    cm.description,
    cm.profit_per_acre,
    cm.water_needs,
    cm.demand_level,
    cm.image_url,
    GROUP_CONCAT(DISTINCT dcm.district_name ORDER BY dcm.match_percentage DESC SEPARATOR ', ') as suitable_districts,
    MAX(dcm.match_percentage) as highest_match_percentage
FROM crop_master cm
LEFT JOIN district_crop_mapping dcm ON cm.id = dcm.crop_id
WHERE cm.status = 'active'
GROUP BY cm.id;

-- View for Complete Crop Details (Popup)
CREATE VIEW crop_complete_details_view AS
SELECT 
    cm.*,
    dcm.district_name,
    dcm.match_percentage,
    dcm.priority_level,
    cg.soil_types,
    cg.climate_min_temp,
    cg.climate_max_temp,
    cg.climate_season,
    cg.irrigation_method,
    cg.fertilizer_guideline,
    rc.total_investment,
    rc.net_profit,
    rc.roi_percentage,
    rc.best_markets,
    ra.climate_risk,
    ra.mitigation_strategies,
    mi.avg_market_price,
    mi.price_trend
FROM crop_master cm
LEFT JOIN district_crop_mapping dcm ON cm.id = dcm.crop_id
LEFT JOIN cultivation_guide cg ON cm.id = cg.crop_id
LEFT JOIN roi_calculator rc ON cm.id = rc.crop_id
LEFT JOIN risk_assessment ra ON cm.id = ra.crop_id
LEFT JOIN market_information mi ON cm.id = mi.crop_id
WHERE cm.status = 'active';

-- ========================================
-- 📝 SAMPLE INSERT QUERIES
-- ========================================

-- Sample Crop Master Entry
INSERT INTO crop_master (
    crop_name, scientific_name, category, duration_days, duration_display,
    description, profit_per_acre, investment_cost, expected_yield,
    market_price, water_needs, demand_level, image_url
) VALUES (
    'Dragon Fruit',
    'Hylocereus undatus',
    'short',
    90,
    '90 days',
    'Exotic fruit with high market value and increasing demand.',
    320000.00,
    80000.00,
    8000.00,
    40.00,
    'Low to moderate',
    'Very High',
    '/images/dragon-fruit.jpg'
);

-- Sample District Mapping
INSERT INTO district_crop_mapping (
    crop_id, district_name, match_percentage, priority_level,
    soil_compatibility, climate_compatibility, water_compatibility,
    infrastructure_score, market_access_score, cultivation_feasibility
) VALUES 
(1, 'Bhadradri Kothagudem', 95.00, 'High', 90.00, 95.00, 85.00, 80.00, 90.00, 'Excellent match with hot climate and high rainfall'),
(1, 'Khammam', 90.00, 'High', 85.00, 90.00, 90.00, 85.00, 85.00, 'Very suitable with good drainage'),
(1, 'Adilabad', 88.00, 'High', 90.00, 85.00, 80.00, 75.00, 80.00, 'Good match with red loamy soil');

-- Sample Cultivation Guide
INSERT INTO cultivation_guide (
    crop_id, soil_types, climate_min_temp, climate_max_temp,
    climate_rainfall_min, climate_rainfall_max, climate_season,
    irrigation_method, fertilizer_guideline, planting_season,
    harvest_timeline, pest_management, cultivation_steps
) VALUES (
    1,
    '["Red Loamy", "Sandy Loam", "Well-drained"]',
    20.00,
    35.00,
    800.00,
    1500.00,
    'Kharif',
    'Drip irrigation recommended',
    'NPK 20:20:20 + organic matter',
    'June-July',
    '["Planting: 0-15 days", "Growth: 16-60 days", "Flowering: 61-75 days", "Fruiting: 76-90 days"]',
    '["Fruit flies - organic traps", "Root rot - well-drained soil", "Mealybugs - neem oil"]',
    '["Land preparation", "Planting material selection", "Planting", "Irrigation setup", "Fertilizer application", "Pest monitoring", "Harvesting"]'
);

-- Sample ROI Calculator
INSERT INTO roi_calculator (
    crop_id, land_area_acre, investment_seeds, investment_fertilizers,
    investment_irrigation, investment_labor, investment_equipment,
    investment_other, total_investment, expected_yield_per_acre,
    price_per_unit, unit_type, total_revenue, gross_profit,
    net_profit, roi_percentage, best_markets, price_fluctuation,
    demand_period, export_potential, competition_level, storage_life_days
) VALUES (
    1,
    1.00,
    25000.00,
    15000.00,
    20000.00,
    15000.00,
    3000.00,
    2000.00,
    80000.00,
    8000.00,
    40.00,
    'kg',
    320000.00,
    240000.00,
    240000.00,
    300.00,
    '["Urban markets", "Export", "Processing units"]',
    'High during winter months',
    'November to February',
    'High potential for international markets',
    'Medium',
    7
);

-- ========================================
-- 🔍 INDEXES FOR PERFORMANCE
-- ========================================

-- Performance indexes
CREATE INDEX idx_crop_category_duration ON crop_master(category, duration_days);
CREATE INDEX idx_crop_profit_demand ON crop_master(profit_per_acre DESC, demand_level);
CREATE INDEX idx_district_priority ON district_crop_mapping(district_name, priority_level, match_percentage DESC);
CREATE INDEX idx_roi_performance ON roi_calculator(roi_percentage DESC, net_profit DESC);
CREATE INDEX idx_market_price_trend ON market_information(avg_market_price, price_trend);

-- ========================================
-- 📊 DATA COLLECTION TEMPLATES
-- ========================================

-- Template for collecting crop data
/*
CROP DATA COLLECTION TEMPLATE:

1. BASIC INFO:
   - Crop Name: 
   - Scientific Name: 
   - Category: short/medium/long
   - Duration (days): 
   - Duration Display: 
   - Description: 
   - Profit per Acre: 
   - Investment Cost: 
   - Expected Yield: 
   - Market Price: 
   - Water Needs: 
   - Demand Level: 
   - Image URL: 

2. DISTRICT MAPPING:
   For each suitable district:
   - District Name: 
   - Match %: 
   - Priority Level: 
   - Soil Compatibility %: 
   - Climate Compatibility %: 
   - Water Compatibility %: 
   - Infrastructure Score: 
   - Market Access Score: 
   - Cultivation Feasibility Notes: 

3. CULTIVATION GUIDE:
   - Soil Types: 
   - Climate Min Temp: 
   - Climate Max Temp: 
   - Rainfall Min: 
   - Rainfall Max: 
   - Season: 
   - Irrigation Method: 
   - Fertilizer Guideline: 
   - Planting Season: 
   - Harvest Timeline: 
   - Pest Management: 
   - Cultivation Steps: 

4. ROI CALCULATOR:
   - Seeds Cost: 
   - Fertilizers Cost: 
   - Irrigation Cost: 
   - Labor Cost: 
   - Equipment Cost: 
   - Other Costs: 
   - Expected Yield: 
   - Price per Unit: 
   - Unit Type: 
   - Best Markets: 
   - Price Fluctuation: 
   - Demand Period: 
   - Export Potential: 
   - Competition Level: 
   - Storage Life: 

5. RISK ASSESSMENT:
   - Climate Risk: 
   - Market Risk: 
   - Production Risk: 
   - Disease Risk: 
   - Mitigation Strategies: 
   - Risk Level: 
   - Insurance Recommended: 
   - Government Schemes: 
*/

-- ========================================
-- 🚀 API ENDPOINTS NEEDED
-- ========================================

/*
Required API Endpoints for Frontend:

1. GET /api/crops - Get all crops with basic info (for main list)
2. GET /api/crops/:id - Get complete crop details (for popup)
3. GET /api/crops/district/:district - Get crops suitable for specific district
4. GET /api/crops/category/:category - Get crops by category (short/medium/long)
5. GET /api/crops/search/:query - Search crops by name
6. GET /api/districts - Get all districts with crop counts
7. GET /api/crops/:id/images - Get all images for a crop
8. GET /api/crops/:id/varieties - Get all varieties for a crop
9. GET /api/crops/:id/schemes - Get government schemes for a crop
10. GET /api/market/prices/:cropId - Get market prices for crop
*/

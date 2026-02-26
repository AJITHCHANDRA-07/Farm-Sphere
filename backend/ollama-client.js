const axios = require('axios');

class OllamaClient {
  constructor(baseURL = 'http://localhost:11434') {
    this.baseURL = baseURL;
  }

  async generateCropData(prompt, model = 'llama3.1') {
    try {
      const response = await axios.post(`${this.baseURL}/api/generate`, {
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 4000
        }
      });

      return response.data.response;
    } catch (error) {
      console.error('❌ Ollama API Error:', error.message);
      throw error;
    }
  }

  async generateCropDataset(category, count = 50) {
    const prompt = `
Generate ${count} realistic, detailed crop datasets for ${category} duration crops suitable for Indian agriculture, specifically Telangana region.

For each crop, provide comprehensive data in this exact JSON structure:

{
  "name": "Crop Name",
  "scientific_name": "Scientific name",
  "category": "${category}",
  "duration": 90,
  "profit_per_acre": 150000,
  "investment_cost": 50000,
  "expected_yield": 2500,
  "market_price": 60,
  "water_needs": "Moderate",
  "demand_level": "High",
  "image": "https://example.com/crop.jpg",
  "description": "Detailed description of the crop...",
  "climate": "Tropical, semi-arid",
  "soil_type": "Red sandy loam",
  "import_data": {
    "import_dependency_percentage": 25.5,
    "annual_import_volume": 15000,
    "import_value_usd": 45000000,
    "major_importing_countries": ["USA", "Brazil", "Argentina"],
    "import_trend": "increasing",
    "tariff_rate": 10.5
  },
  "supply_gap": {
    "annual_demand": 50000,
    "domestic_production": 35000,
    "supply_gap_volume": 15000,
    "gap_percentage": 30.0,
    "critical_season": "Kharif",
    "gap_trend": "widening"
  },
  "export_potential": {
    "export_readiness_score": 75,
    "potential_markets": ["UAE", "Singapore", "Malaysia"],
    "export_value_potential": 25000000,
    "processing_requirements": "Cold storage, quality grading",
    "quality_standards": "APEDA, ISO 22000",
    "competitive_advantage": "Organic certification available"
  },
  "government_schemes": [
    {
      "scheme_name": "National Food Security Mission",
      "scheme_type": "Subsidy",
      "benefit_amount": 15000,
      "eligibility_criteria": "Small farmers with <2 hectares",
      "application_process": "Online portal with document verification",
      "implementing_agency": "Agriculture Department",
      "success_rate": 85
    }
  ],
  "district_suitability": [
    {
      "district_name": "Karimnagar",
      "state": "Telangana",
      "suitability_score": 85,
      "recommended_season": "Kharif",
      "soil_suitability": "Red sandy loam",
      "water_availability": "Moderate",
      "climate_compatibility": "High",
      "local_market_access": 75
    }
  ]
}

Requirements:
1. All crops must be realistic and suitable for Telangana climate
2. Profit margins should be realistic (₹50,000 - ₹500,000 per acre)
3. Import dependency should vary from 5% to 60%
4. Supply gaps should range from 10% to 50%
5. Include at least 3-5 Telangana districts for each crop
6. Government schemes should be realistic and current
7. Export potential should align with Indian agricultural export capabilities

Return the data as a JSON array of ${count} crop objects. Ensure all numeric values are realistic and consistent.
`;

    try {
      const response = await this.generateCropData(prompt);
      // Extract JSON from the response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (error) {
      console.error('❌ Error generating crop dataset:', error.message);
      throw error;
    }
  }

  async generateAllCategories() {
    const categories = ['short', 'medium', 'long'];
    const allCrops = [];

    for (const category of categories) {
      console.log(`🌱 Generating ${category} duration crops...`);
      const count = category === 'short' ? 100 : category === 'medium' ? 150 : 200;
      
      try {
        const crops = await this.generateCropDataset(category, count);
        allCrops.push(...crops);
        console.log(`✅ Generated ${crops.length} ${category} duration crops`);
      } catch (error) {
        console.error(`❌ Failed to generate ${category} crops:`, error.message);
      }
    }

    return allCrops;
  }

  async validateCropData(crops) {
    const validatedCrops = [];
    let invalidCount = 0;

    for (const crop of crops) {
      try {
        // Validate required fields
        if (!crop.name || !crop.category || !crop.profit_per_acre) {
          invalidCount++;
          continue;
        }

        // Validate numeric ranges
        if (crop.profit_per_acre < 10000 || crop.profit_per_acre > 1000000) {
          invalidCount++;
          continue;
        }

        // Validate import data
        if (crop.import_data && crop.import_data.import_dependency_percentage > 100) {
          crop.import_data.import_dependency_percentage = Math.min(crop.import_data.import_dependency_percentage, 100);
        }

        // Validate supply gap
        if (crop.supply_gap && crop.supply_gap.gap_percentage > 100) {
          crop.supply_gap.gap_percentage = Math.min(crop.supply_gap.gap_percentage, 100);
        }

        validatedCrops.push(crop);
      } catch (error) {
        console.error(`❌ Validation error for crop ${crop.name}:`, error.message);
        invalidCount++;
      }
    }

    console.log(`✅ Validated ${validatedCrops.length} crops, ${invalidCount} invalid crops removed`);
    return validatedCrops;
  }
}

module.exports = OllamaClient;

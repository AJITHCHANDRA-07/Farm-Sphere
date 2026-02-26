import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Filter, MapPin, Droplets, Sun, AlertTriangle } from 'lucide-react';

interface CropData {
  "Crop Name": string;
  "Crop Type": string;
  "Crop Duration (Days)": string;
  "Supply Status": string;
  "Demand Status": string;
  "Import Dependency (Yes/No)": string;
  "Primary Soil Type Required": string;
  "Water Requirement": string;
  "Climate Suitability": string;
  "Irrigation Compatibility": string;
  "Suitable Telangana Districts": string;
  "Land Area Suitability": string;
  "Risk Factors": string;
  "Mitigation Strategies": string;
}

const CropsDisplay: React.FC = () => {
  const [crops, setCrops] = useState<CropData[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<CropData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  useEffect(() => {
    fetchCrops();
  }, []);

  useEffect(() => {
    filterCrops();
  }, [crops, searchTerm, selectedType, selectedDistrict]);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/crops');
      const data = await response.json();
      setCrops(data);
      setFilteredCrops(data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCrops = () => {
    let filtered = crops;

    if (searchTerm) {
      filtered = filtered.filter(crop =>
        crop['Crop Name'].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(crop =>
        crop['Crop Type'].toLowerCase().includes(selectedType.toLowerCase())
      );
    }

    if (selectedDistrict) {
      filtered = filtered.filter(crop =>
        crop['Suitable Telangana Districts'].toLowerCase().includes(selectedDistrict.toLowerCase())
      );
    }

    setFilteredCrops(filtered);
  };

  const getDemandBadgeColor = (demand: string) => {
    switch (demand?.toLowerCase()) {
      case 'very high': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSupplyBadgeColor = (supply: string) => {
    switch (supply?.toLowerCase()) {
      case 'very low': return 'bg-red-500';
      case 'low': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-green-500';
      case 'very high': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  const cropTypes = [...new Set(crops.map(crop => crop['Crop Type']))];
  const districts = [...new Set(crops.map(crop => crop['Suitable Telangana Districts']).flat())];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading crops data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🌱 FarmSphere Crops Database</h1>
          <p className="text-gray-600">Comprehensive agricultural data for Telangana region</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{crops.length}</div>
              <div className="text-sm text-gray-600">Total Crops</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{cropTypes.length}</div>
              <div className="text-sm text-gray-600">Crop Types</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {crops.filter(c => c['Import Dependency (Yes/No)'] === 'Yes').length}
              </div>
              <div className="text-sm text-gray-600">Import Dependent</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{filteredCrops.length}</div>
              <div className="text-sm text-gray-600">Filtered Results</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search crops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Types</option>
                {cropTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              <Button onClick={() => { setSearchTerm(''); setSelectedType(''); setSelectedDistrict(''); }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Crops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{crop['Crop Name']}</CardTitle>
                  <div className="flex gap-1">
                    <Badge className={getDemandBadgeColor(crop['Demand Status'])}>
                      {crop['Demand Status']}
                    </Badge>
                    <Badge className={getSupplyBadgeColor(crop['Supply Status'])}>
                      {crop['Supply Status']}
                    </Badge>
                  </div>
                </div>
                <CardDescription>{crop['Crop Type']}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Districts:</span>
                    <span>{crop['Suitable Telangana Districts']}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Droplets className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Water:</span>
                    <span>{crop['Water Requirement']}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Sun className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Climate:</span>
                    <span>{crop['Climate Suitability']}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Duration:</span>
                    <span>{crop['Crop Duration (Days)']} days</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Soil:</span>
                    <span>{crop['Primary Soil Type Required']}</span>
                  </div>
                  
                  {crop['Import Dependency (Yes/No)'] === 'Yes' && (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      Import Dependent
                    </Badge>
                  )}

                  {crop['Risk Factors'] && (
                    <div className="mt-3 p-2 bg-red-50 rounded text-sm">
                      <div className="flex items-center gap-1 text-red-700 font-medium mb-1">
                        <AlertTriangle className="h-3 w-3" />
                        Risk Factors:
                      </div>
                      <div className="text-red-600">{crop['Risk Factors']}</div>
                    </div>
                  )}

                  {crop['Mitigation Strategies'] && (
                    <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                      <div className="font-medium text-green-700 mb-1">Mitigation:</div>
                      <div className="text-green-600">{crop['Mitigation Strategies']}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCrops.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No crops found matching your criteria.</div>
            <Button onClick={() => { setSearchTerm(''); setSelectedType(''); setSelectedDistrict(''); }} className="mt-4">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropsDisplay;

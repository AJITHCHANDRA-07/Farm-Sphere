import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, TrendingUp, Clock, Droplets, ArrowUpDown, BarChart3, Target, Leaf, Sparkles, MapPin, X, Calendar, DollarSign } from "lucide-react";
import { fetchCropsByCategory } from "@/data/cropApi";
import CropDetailModal from "@/components/CropDetailModal";
import { useCropModal } from "@/hooks/useCropModal";

const ExploreCrops = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'short' | 'medium' | 'long'>('short');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'profit' | 'name' | 'duration' | 'roi'>('profit');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [waterFilter, setWaterFilter] = useState<string>('all');
  const [demandFilter, setDemandFilter] = useState<string>('all');
  const { selectedCrop, isModalOpen, openModal, closeModal } = useCropModal();
  const [shortTermCrops, setShortTermCrops] = useState<any[]>([]);
  const [mediumTermCrops, setMediumTermCrops] = useState<any[]>([]);
  const [longTermCrops, setLongTermCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Location state
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    mandal: string;
    district: string;
    state: string;
    accuracy: number;
  } | null>(null);
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');
  const [locationLoading, setLocationLoading] = useState(false);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load crops from database on component mount and when location changes
  useEffect(() => {
    const loadCrops = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading crops from database...');
        
        // For testing: if no location, default to Rangareddy
        let userDistrict = userLocation?.district;
        if (!userDistrict) {
          userDistrict = 'Rangareddy'; // Default for testing
          console.log('🧪 Using default district for testing:', userDistrict);
        }
        
        console.log('📍 User district:', userDistrict || 'Not detected');
        
        const [short, medium, long] = await Promise.all([
          fetchCropsByCategory('short', userDistrict),
          fetchCropsByCategory('medium', userDistrict),
          fetchCropsByCategory('long', userDistrict)
        ]);
        
        console.log('📊 Crops loaded from database:');
        console.log('  Short-term:', short.length, 'crops');
        console.log('  Medium-term:', medium.length, 'crops');
        console.log('  Long-term:', long.length, 'crops');
        if (userDistrict) {
          console.log(`🎯 Filtered for district: ${userDistrict}`);
        }
        
        setShortTermCrops(short);
        setMediumTermCrops(medium);
        setLongTermCrops(long);
        
        console.log('✅ All crops loaded successfully');
      } catch (error) {
        console.error('❌ Failed to load crops:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCrops();
  }, [userLocation]); // Reload when location changes

  // Request location permission and get user location
  const requestLocationPermission = async () => {
    console.log('🔍 Starting location request...');
    
    if (!navigator.geolocation) {
      console.log('❌ Geolocation not supported');
      setLocationPermission('unsupported');
      return;
    }

    setLocationLoading(true);
    
    try {
      console.log('📍 Getting GPS coordinates...');
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude, accuracy } = position.coords;
      console.log(`📍 Got coordinates: Lat: ${latitude}, Lon: ${longitude}, Accuracy: ${accuracy}m`);
      
      // Get district and state from coordinates (using OpenStreetMap API)
      console.log('🌍 Calling OpenStreetMap API...');
      const locationData = await getLocationFromCoordinates(latitude, longitude);
      console.log('📍 Location data received:', locationData);
      
      setUserLocation({
        latitude,
        longitude,
        mandal: locationData.mandal,
        district: locationData.district,
        state: locationData.state,
        accuracy
      });
      
      console.log('✅ Location set successfully:', locationData.district, locationData.state);
      setLocationPermission('granted');
    } catch (error) {
      console.error('❌ Location error:', error);
      setLocationPermission('denied');
    } finally {
      setLocationLoading(false);
    }
  };

  // Get location data from coordinates (using PositionStack API - FREE and ACCURATE)
  const getLocationFromCoordinates = async (lat: number, lon: number) => {
    try {
      // Using PositionStack API (free tier, no API key needed for basic usage)
      const apiUrl = `http://api.positionstack.com/v1/reverse?access_key=YOUR_API_KEY&query=${lat},${lon}`;
      console.log('🌐 PositionStack API URL:', apiUrl);
      
      // Fallback to OpenStreetMap if PositionStack fails
      const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
      console.log('🌐 OpenStreetMap API URL:', osmUrl);
      
      let data = null;
      
      // Try OpenStreetMap first (free, no API key)
      try {
        const response = await fetch(osmUrl, {
          headers: {
            'User-Agent': 'FarmSphere/1.0'
          }
        });
        
        if (response.ok) {
          data = await response.json();
          console.log('🌐 OpenStreetMap Response data:', data);
        }
      } catch (error) {
        console.log('⚠️ OpenStreetMap failed, trying fallback...');
      }
      
      if (!data) {
        // Fallback to simple coordinate detection
        console.log('🗺️ Using coordinate-based detection as fallback...');
        return getDistrictFromCoordinates(lat, lon);
      }
      
      // Extract district and state from response
      const mandal = data.address?.suburb || 
                    data.address?.village || 
                    data.address?.town || 
                    data.address?.city_district || 
                    data.address?.county || 
                    'Unknown Mandal';
      
      const district = data.address?.state_district || 
                      data.address?.county || 
                      data.address?.city || 
                      'Unknown District';
      
      const state = data.address?.state || 
                   'Unknown State';
      
      console.log('📍 Parsed location - Mandal:', mandal, 'District:', district, 'State:', state);
      
      return {
        mandal,
        district,
        state
      };
    } catch (error) {
      console.error('❌ Geocoding error:', error);
      // Fallback to coordinate-based detection
      return getDistrictFromCoordinates(lat, lon);
    }
  };

  // Simple coordinate-based district detection (fallback only)
  const getDistrictFromCoordinates = (lat: number, lon: number) => {
    console.log(`🗺️ Getting district from coordinates: Lat: ${lat}, Lon: ${lon}`);
    
    // Only use this if user is actually in Telangana region
    const telanganaBounds = {
      north: 19.8,
      south: 15.8,
      east: 80.5,
      west: 77.2
    };
    
    // Check if coordinates are within Telangana bounds
    if (lat < telanganaBounds.south || lat > telanganaBounds.north || 
        lon < telanganaBounds.west || lon > telanganaBounds.east) {
      console.log('📍 User is NOT in Telangana region');
      return {
        mandal: 'Unknown Mandal',
        district: 'Unknown District',
        state: 'Unknown State'
      };
    }
    
    console.log('📍 User is in Telangana region, finding closest district...');
    
    const telanganaDistricts = [
      { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, range: 0.3 },
      { name: 'Rangareddy', lat: 17.4000, lon: 78.3000, range: 0.4 },
      { name: 'Medak', lat: 18.0000, lon: 78.2500, range: 0.3 },
      { name: 'Sangareddy', lat: 17.6200, lon: 78.8800, range: 0.3 },
      { name: 'Nizamabad', lat: 18.6700, lon: 78.0900, range: 0.3 },
      { name: 'Karimnagar', lat: 18.8300, lon: 79.0300, range: 0.3 },
      { name: 'Warangal', lat: 17.9700, lon: 79.5900, range: 0.3 },
      { name: 'Khammam', lat: 17.2500, lon: 80.1500, range: 0.4 },
      { name: 'Nalgonda', lat: 17.0000, lon: 79.2700, range: 0.4 },
      { name: 'Mahabubnagar', lat: 16.7500, lon: 77.9800, range: 0.4 },
      { name: 'Siddipet', lat: 17.8500, lon: 78.8500, range: 0.3 },
      { name: 'Jagtial', lat: 18.8000, lon: 79.1500, range: 0.3 },
      { name: 'Ramagundam', lat: 18.8300, lon: 79.4500, range: 0.3 },
      { name: 'Peddapalli', lat: 18.6200, lon: 79.8000, range: 0.3 },
      { name: 'Mancherial', lat: 18.7500, lon: 79.9000, range: 0.3 },
      { name: 'Adilabad', lat: 19.6700, lon: 78.5300, range: 0.4 },
      { name: 'Nirmal', lat: 19.1000, lon: 79.3500, range: 0.3 },
      { name: 'Komaram Bheem', lat: 19.3000, lon: 79.7500, range: 0.3 },
      { name: 'Jangaon', lat: 17.7200, lon: 79.0200, range: 0.3 },
      { name: 'Yadadri Bhuvanagiri', lat: 17.4900, lon: 78.9400, range: 0.3 },
      { name: 'Wanaparthy', lat: 16.3600, lon: 78.0600, range: 0.3 },
      { name: 'Nagarkurnool', lat: 16.4800, lon: 78.3200, range: 0.3 },
      { name: 'Vikarabad', lat: 17.0200, lon: 78.2400, range: 0.3 },
      { name: 'Suryapet', lat: 17.0500, lon: 79.6200, range: 0.3 },
      { name: 'Kumuram Bheem', lat: 18.8700, lon: 79.6500, range: 0.3 },
      { name: 'Bhadradri Kothagudem', lat: 17.9000, lon: 80.2400, range: 0.4 },
      { name: 'Mulugu', lat: 18.8700, lon: 80.0000, range: 0.4 },
      { name: 'Jayashankar', lat: 18.2500, lon: 79.4000, range: 0.3 },
      { name: 'Jogulamba Gadwal', lat: 16.2300, lon: 78.5000, range: 0.3 }
    ];
    
    // Find the closest district
    let closestDistrict = 'Unknown District';
    let minDistance = Infinity;
    
    for (const district of telanganaDistricts) {
      const distance = Math.sqrt(
        Math.pow(lat - district.lat, 2) + Math.pow(lon - district.lon, 2)
      );
      
      if (distance < minDistance && distance < district.range) {
        minDistance = distance;
        closestDistrict = district.name;
      }
    }
    
    console.log('📍 Closest district:', closestDistrict, '(distance:', minDistance.toFixed(4) + ')');
    
    return {
      mandal: closestDistrict + ' Mandal',
      district: closestDistrict,
      state: 'Telangana'
    };
  };

  // Fallback function to infer location from coordinates (for Telangana)
  const inferLocationFromCoordinates = (lat: number, lon: number) => {
    console.log(`🗺️ Inferring location from coordinates: Lat: ${lat}, Lon: ${lon}`);
    
    // Telangana approximate coordinate ranges for major districts
    const telanganaDistricts = [
      { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, range: 0.2 },
      { name: 'Rangareddy', lat: 17.4000, lon: 78.3000, range: 0.3 },
      { name: 'Medak', lat: 18.0000, lon: 78.2500, range: 0.25 },
      { name: 'Sangareddy', lat: 17.6200, lon: 78.8800, range: 0.25 },
      { name: 'Nizamabad', lat: 18.6700, lon: 78.0900, range: 0.25 },
      { name: 'Karimnagar', lat: 18.8300, lon: 79.0300, range: 0.25 },
      { name: 'Warangal', lat: 17.9700, lon: 79.5900, range: 0.25 },
      { name: 'Khammam', lat: 17.2500, lon: 80.1500, range: 0.3 },
      { name: 'Nalgonda', lat: 17.0000, lon: 79.2700, range: 0.3 },
      { name: 'Mahabubnagar', lat: 16.7500, lon: 77.9800, range: 0.3 },
      { name: 'Siddipet', lat: 17.8500, lon: 78.8500, range: 0.2 },
      { name: 'Jagtial', lat: 18.8000, lon: 79.1500, range: 0.25 },
      { name: 'Ramagundam', lat: 18.8300, lon: 79.4500, range: 0.25 },
      { name: 'Peddapalli', lat: 18.6200, lon: 79.8000, range: 0.25 },
      { name: 'Mancherial', lat: 18.7500, lon: 79.9000, range: 0.25 },
      { name: 'Adilabad', lat: 19.6700, lon: 78.5300, range: 0.3 },
      { name: 'Nirmal', lat: 19.1000, lon: 79.3500, range: 0.25 },
      { name: 'Komaram Bheem', lat: 19.3000, lon: 79.7500, range: 0.25 },
      { name: 'Jangaon', lat: 17.7200, lon: 79.0200, range: 0.25 },
      { name: 'Yadadri Bhuvanagiri', lat: 17.4900, lon: 78.9400, range: 0.25 },
      { name: 'Wanaparthy', lat: 16.3600, lon: 78.0600, range: 0.25 },
      { name: 'Nagarkurnool', lat: 16.4800, lon: 78.3200, range: 0.25 },
      { name: 'Vikarabad', lat: 17.0200, lon: 78.2400, range: 0.25 },
      { name: 'Suryapet', lat: 17.0500, lon: 79.6200, range: 0.25 },
      { name: 'Kumuram Bheem', lat: 18.8700, lon: 79.6500, range: 0.25 },
      { name: 'Bhadradri Kothagudem', lat: 17.9000, lon: 80.2400, range: 0.3 },
      { name: 'Mulugu', lat: 18.8700, lon: 80.0000, range: 0.3 },
      { name: 'Jayashankar', lat: 18.2500, lon: 79.4000, range: 0.25 },
      { name: 'Jogulamba Gadwal', lat: 16.2300, lon: 78.5000, range: 0.25 }
    ];
    
    // Find the closest district
    let closestDistrict = 'Unknown District';
    let minDistance = Infinity;
    
    for (const district of telanganaDistricts) {
      const distance = Math.sqrt(
        Math.pow(lat - district.lat, 2) + Math.pow(lon - district.lon, 2)
      );
      
      if (distance < minDistance && distance < district.range) {
        minDistance = distance;
        closestDistrict = district.name;
      }
    }
    
    console.log('📍 Closest district:', closestDistrict, '(distance:', minDistance.toFixed(4) + ')');
    
    return {
      district: closestDistrict,
      state: 'Telangana'
    };
  };

  // Check location permission on mount
  useEffect(() => {
    console.log('🔍 Checking location permission on mount...');
    
    if (navigator.geolocation) {
      console.log('✅ Geolocation supported');
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        console.log('📍 Permission status:', result.state);
        if (result.state === 'granted') {
          console.log('✅ Permission already granted, requesting location...');
          setLocationPermission('granted');
          requestLocationPermission();
        } else if (result.state === 'denied') {
          console.log('❌ Permission denied');
          setLocationPermission('denied');
        } else {
          console.log('⏳ Permission prompt needed');
          setLocationPermission('prompt');
        }
      });
    } else {
      console.log('❌ Geolocation not supported');
      setLocationPermission('unsupported');
    }
  }, []);

  // Test function to check GeoJS API
  const testGeoJSAPI = async () => {
    console.log('🧪 Testing GeoJS API with Hyderabad coordinates...');
    try {
      // Hyderabad coordinates: 17.3850° N, 78.4867° E
      const testLat = 17.3850;
      const testLon = 78.4867;
      
      const response = await fetch(
        `https://api.geojs.io/v1/reverse?lat=${testLat}&lon=${testLon}&api_key=1c75b4faa9486c903c7352f5e7f61bcb`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ GeoJS API Test Success:', data);
        console.log('📍 District:', data.county || data.city);
        console.log('📍 State:', data.region || data.state);
      } else {
        console.log('❌ GeoJS API Test Failed:', response.status);
      }
    } catch (error) {
      console.error('❌ GeoJS API Test Error:', error);
    }
  };

  // Add test function to window for manual testing
  if (typeof window !== 'undefined') {
    (window as any).testGeoJSAPI = testGeoJSAPI;
    (window as any).setTestLocation = () => {
      console.log('🧪 Setting test location...');
      setUserLocation({
        latitude: 17.3850,
        longitude: 78.4867,
        mandal: 'Ibrahimpatnam mandal',
        district: 'Rangareddy',
        state: 'Telangana',
        accuracy: 10
      });
      setLocationPermission('granted');
      console.log('✅ Test location set: Ibrahimpatnam mandal, Rangareddy, Telangana');
    };
  }

  const getCurrentCrops = () => {
    switch (activeTab) {
      case 'short': return shortTermCrops;
      case 'medium': return mediumTermCrops;
      case 'long': return longTermCrops;
      default: return shortTermCrops;
    }
  };

  const filteredAndSortedCrops = useMemo(() => {
    let crops = getCurrentCrops();

    // Apply search filter
    if (searchTerm) {
      crops = crops.filter(crop =>
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply water filter
    if (waterFilter !== 'all') {
      crops = crops.filter(crop => {
        const waterLevel = crop.water_needs.toLowerCase();
        if (waterFilter === 'low') return waterLevel.includes('low') || waterLevel.includes('minimal');
        if (waterFilter === 'moderate') return waterLevel.includes('moderate');
        if (waterFilter === 'high') return waterLevel.includes('high') || waterLevel.includes('very high');
        return true;
      });
    }

    // Apply demand filter
    if (demandFilter !== 'all') {
      crops = crops.filter(crop => crop.demand_level.toLowerCase().includes(demandFilter.toLowerCase()));
    }

    // Apply sorting
    crops.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'profit':
          aValue = a.profit_per_acre;
          bValue = b.profit_per_acre;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'duration':
          aValue = a.duration;
          bValue = b.duration;
          break;
        case 'roi':
          aValue = ((a.profit_per_acre / a.investment_cost) * 100);
          bValue = ((b.profit_per_acre / b.investment_cost) * 100);
          break;
        default:
          aValue = a.profit_per_acre;
          bValue = b.profit_per_acre;
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }
    });

    return crops;
  }, [activeTab, searchTerm, sortBy, sortOrder, waterFilter, demandFilter, shortTermCrops, mediumTermCrops, longTermCrops]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getProfitColor = (profit: number) => {
    if (profit > 200000) return 'text-green-600';
    if (profit > 100000) return 'text-green-500';
    if (profit > 50000) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getROIColor = (roi: number) => {
    if (roi > 300) return 'text-green-600';
    if (roi > 200) return 'text-green-500';
    if (roi > 100) return 'text-yellow-600';
    return 'text-orange-600';
  };

            </div>
            <div className="absolute bottom-3 left-3">
              <Badge variant="secondary" className="backdrop-blur-sm bg-white/90">
                {crop.demand_level}
              </Badge>
            </div>
            {/* Location Badge */}
            <div className="absolute top-3 left-3">
              <Badge variant="outline" className="backdrop-blur-sm bg-white/90 text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                {userLocation?.district || 'All Districts'}
              </Badge>
            </div>

            {/* Quick Actions */}
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center">
        <Search className="h-12 w-12 text-primary/60" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No crops found</h3>
      <p className="text-muted-foreground mb-6">Try adjusting your search or filters to find more crops.</p>
      <Button onClick={() => {
        setSearchTerm('');
        setWaterFilter('all');
        setDemandFilter('all');
      }}>
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-3 text-lg text-gray-600">Loading crops from database...</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && (
          <>
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl mb-6">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                🌱 Low Supply High Demand Crops
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Discover profitable crops with high market demand and optimize your farming strategy
              </p>
              
              {/* Location Display - Simple Label */}
              {userLocation && (
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    <MapPin className="h-3 w-3 mr-1" />
                    {userLocation.mandal}, {userLocation.district}, {userLocation.state}
                  </span>
                </div>
              )}
              
              {/* Location Permission Request */}
              {locationPermission === 'prompt' && (
                <div className="mb-4">
                  <Button 
                    onClick={requestLocationPermission}
                    disabled={locationLoading}
                    size="sm"
                    variant="outline"
                    className="text-blue-700 border-blue-300 hover:bg-blue-50"
                  >
                    {locationLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                        Getting Location...
                      </>
                    ) : (
                      <>
                        <MapPin className="h-3 w-3 mr-2" />
                        Enable Location
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => {
                    console.log("Explore States button clicked");
                    navigate('/enhanced-states');
                  }}
                  className="px-8 py-3"
                >
                  Explore States
                </Button>
                <Button 
                  variant="professional" 
                  size="lg"
                  onClick={() => navigate('/crops')}
                  className="px-8 py-3"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Advanced Analytics
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/')}
                  className="px-8 py-3"
                >
                  ← Back to Home
                </Button>
              </div>
            </div>

        {/* Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-xl border">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search crops by name, description, or cultivation steps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {/* Water Filter */}
            <div>
              <Select value={waterFilter} onValueChange={setWaterFilter}>
                <SelectTrigger className="h-12">
                  <Droplets className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Water Needs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Water Needs</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Demand Filter */}
            <div>
              <Select value={demandFilter} onValueChange={setDemandFilter}>
                <SelectTrigger className="h-12">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Demand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Demand</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Button */}
            <div>
              <Button
                variant="outline"
                className="w-full justify-between h-12"
                onClick={toggleSortOrder}
              >
                <div className="flex items-center">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <span>
                    {sortBy === 'profit' && 'Profit'}
                    {sortBy === 'name' && 'Name'}
                    {sortBy === 'duration' && 'Duration'}
                    {sortBy === 'roi' && 'ROI'}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              </Button>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={sortBy === 'profit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('profit')}
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Profit
            </Button>
            <Button
              variant={sortBy === 'roi' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('roi')}
            >
              <Target className="h-4 w-4 mr-1" />
              ROI
            </Button>
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('name')}
            >
              A-Z
            </Button>
            <Button
              variant={sortBy === 'duration' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('duration')}
            >
              <Clock className="h-4 w-4 mr-1" />
              Duration
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {filteredAndSortedCrops.length} of {getCurrentCrops().length} crops
          </p>
          {(searchTerm || waterFilter !== 'all' || demandFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setWaterFilter('all');
                setDemandFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'short' | 'medium' | 'long')} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="short" className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Clock className="h-4 w-4" />
              Short-Term
              <span className="text-xs text-muted-foreground">(3-6m)</span>
            </TabsTrigger>
            <TabsTrigger value="medium" className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <TrendingUp className="h-4 w-4" />
              Medium-Term
              <span className="text-xs text-muted-foreground">(6-12m)</span>
            </TabsTrigger>
            <TabsTrigger value="long" className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Sparkles className="h-4 w-4" />
              Long-Term
              <span className="text-xs text-muted-foreground">(12+m)</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="short" className="space-y-6">
            {filteredAndSortedCrops.length > 0 ? renderCropCards() : renderEmptyState()}
          </TabsContent>

          <TabsContent value="medium" className="space-y-6">
            {filteredAndSortedCrops.length > 0 ? renderCropCards() : renderEmptyState()}
          </TabsContent>

          <TabsContent value="long" className="space-y-6">
            {filteredAndSortedCrops.length > 0 ? renderCropCards() : renderEmptyState()}
          </TabsContent>
        </Tabs>
          </>
        )}

        <CropDetailModal 
          crop={selectedCrop} 
          isOpen={isModalOpen} 
          onClose={closeModal} 
        />

        <style>{`
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .hover-card {
            transition: all 0.3s ease;
          }
          .hover-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }
        `}</style>
      </div>
    </section>
  );
};

export default ExploreCrops;

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
import { MapPin, Search, Leaf, Droplets, TrendingUp, Calendar, X, AlertCircle } from 'lucide-react';
import { fetchCropsByCategory } from "@/data/cropApi";
import CropDetailModal from "@/components/CropDetailModal";
import { useCropModal } from "@/hooks/useCropModal";

const ExploreCropsNew = () => {
  console.log('🌱 ExploreCropsNew component rendering...');
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
    
    // Safety timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setLoading(false);
      console.log('⚠️ Loading timeout - forcing load complete');
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [userLocation]); // Reload when location changes

  // Request location permission and get user location
  const requestLocationPermission = async () => {
    console.log('🔍 Starting location request...');
    
    if (!navigator.geolocation) {
      console.log('❌ Geolocation not supported');
      setLocationPermission('unsupported');
      // Set default location for testing
      setUserLocation({
        latitude: 17.3850,
        longitude: 78.4867,
        mandal: 'Hyderabad Mandal',
        district: 'Hyderabad',
        state: 'Telangana',
        accuracy: 100
      });
      return;
    }

    setLocationLoading(true);
    
    try {
      console.log('📍 Getting GPS coordinates...');
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve, 
          reject, 
          {
            enableHighAccuracy: true,
            timeout: 15000, // Increased timeout
            maximumAge: 60000 // Allow cached location up to 1 minute old
          }
        );
      });

      const { latitude, longitude, accuracy } = position.coords;
      console.log(`📍 Got coordinates: Lat: ${latitude}, Lon: ${longitude}, Accuracy: ${accuracy}m`);
      
      // Get location details using coordinates
      const locationDetails = await getLocationFromCoordinates(latitude, longitude);
      
      setUserLocation({
        latitude,
        longitude,
        mandal: locationDetails.mandal,
        district: locationDetails.district,
        state: locationDetails.state,
        accuracy
      });
      
      setLocationPermission('granted');
      console.log('✅ Location permission granted and location set');
      console.log('📍 Final location:', locationDetails);
      
    } catch (error) {
      console.error('❌ Location error:', error);
      setLocationPermission('denied');
      
      // Set default location for testing when location fails
      console.log('🔄 Setting default location for testing...');
      setUserLocation({
        latitude: 17.3850,
        longitude: 78.4867,
        mandal: 'Hyderabad Mandal',
        district: 'Hyderabad',
        state: 'Telangana',
        accuracy: 100
      });
    } finally {
      setLocationLoading(false);
    }
  };

  // Get location from coordinates using real geocoding API
  const getLocationFromCoordinates = async (lat: number, lon: number) => {
    console.log(`🗺️ Getting location from coordinates: Lat: ${lat}, Lon: ${lon}`);
    
    try {
      // Use OpenStreetMap Nominatim API for reverse geocoding (free and reliable)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'FarmSphere/1.0' // Required by Nominatim
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📍 Geocoding response:', data);
      
      if (data && data.address) {
        const address = data.address;
        let detectedDistrict = address.county || address.city_district || address.state_district || 'Unknown District';
        const state = address.state || 'Unknown State';
        const country = address.country || 'Unknown Country';
        
        console.log('📍 Raw detected location:', { district: detectedDistrict, state, country });
        
        // Validate district against the 31 Telangana districts
        const validatedDistrict = validateDistrict(detectedDistrict);
        
        if (validatedDistrict) {
          console.log('✅ District validated:', validatedDistrict);
          return {
            mandal: validatedDistrict + ' Mandal',
            district: validatedDistrict,
            state: state,
            country: country
          };
        } else {
          console.log('❌ District not supported:', detectedDistrict);
          return {
            mandal: 'Not Supported',
            district: 'Not Supported',
            state: state,
            country: country,
            error: 'District not supported yet.'
          };
        }
      }
      
      // Fallback if geocoding fails
      console.log('⚠️ Geocoding failed, using fallback detection');
      return getFallbackLocation(lat, lon);
      
    } catch (error) {
      console.error('❌ Geocoding error:', error);
      return getFallbackLocation(lat, lon);
    }
  };

  // STRICT DISTRICT MASTER LIST - Only these 31 districts are recognized
  const TELANGANA_DISTRICTS = [
    'Adilabad',
    'Bhadradri Kothagudem',
    'Hanumakonda',
    'Hyderabad',
    'Jagtial',
    'Jangaon',
    'Jayashankar Bhupalapally',
    'Jogulamba Gadwal',
    'Kamareddy',
    'Karimnagar',
    'Khammam',
    'Komaram Bheem Asifabad',
    'Mahabubabad',
    'Mahabubnagar',
    'Mancherial',
    'Medak',
    'Medchal-Malkajgiri',
    'Mulugu',
    'Nagarkurnool',
    'Nalgonda',
    'Narayanpet',
    'Nirmal',
    'Nizamabad',
    'Peddapalli',
    'Rajanna Sircilla',
    'Rangareddy',
    'Sangareddy',
    'Siddipet',
    'Suryapet',
    'Vikarabad',
    'Wanaparthy'
  ];

  // District normalization mapping for common variations
  const DISTRICT_NORMALIZATION = {
    'Warangal Urban': 'Hanumakonda',
    'Warangal Rural': 'Warangal',
    'Medchal Malkajgiri': 'Medchal-Malkajgiri',
    'Jayashankar Bhupalpally': 'Jayashankar Bhupalapally',
    'Komaram Bheem': 'Komaram Bheem Asifabad',
    'Kumuram Bheem': 'Komaram Bheem Asifabad',
    'Yadadri Bhuvanagiri': 'Yadadri Bhuvanagiri',
    'Nagar Kurnool': 'Nagarkurnool',
    'Narayanpet': 'Narayanpet'
  };

  // Validate and normalize district name
  const validateDistrict = (detectedDistrict: string): string | null => {
    if (!detectedDistrict) return null;
    
    // Normalize the detected district name
    const normalized = detectedDistrict.trim().toLowerCase();
    
    // Check direct match
    const directMatch = TELANGANA_DISTRICTS.find(district => 
      district.toLowerCase() === normalized
    );
    
    if (directMatch) return directMatch;
    
    // Check normalization mapping
    const mappedMatch = Object.entries(DISTRICT_NORMALIZATION).find(([key, value]) => 
      key.toLowerCase() === normalized
    );
    
    if (mappedMatch) return mappedMatch[1];
    
    // Check partial matches (for cases like "Rangareddy District" → "Rangareddy")
    const partialMatch = TELANGANA_DISTRICTS.find(district => 
      normalized.includes(district.toLowerCase()) || 
      district.toLowerCase().includes(normalized)
    );
    
    return partialMatch || null;
  };

  // Fallback location detection for Telangana (if geocoding fails)
  const getFallbackLocation = (lat: number, lon: number) => {
    console.log('🔄 Using fallback location detection for Telangana');
    
    // Telangana approximate coordinate ranges for the 31 districts
    const telanganaDistricts = [
      { name: 'Adilabad', lat: 19.6700, lon: 78.5300, range: 0.6 },
      { name: 'Bhadradri Kothagudem', lat: 17.9000, lon: 80.2400, range: 0.6 },
      { name: 'Hanumakonda', lat: 17.9700, lon: 79.5900, range: 0.5 },
      { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, range: 0.5 },
      { name: 'Jagtial', lat: 18.8000, lon: 79.1500, range: 0.5 },
      { name: 'Jangaon', lat: 17.7200, lon: 79.0200, range: 0.5 },
      { name: 'Jayashankar Bhupalapally', lat: 18.2500, lon: 79.4000, range: 0.5 },
      { name: 'Jogulamba Gadwal', lat: 16.2300, lon: 78.5000, range: 0.5 },
      { name: 'Kamareddy', lat: 18.0000, lon: 78.2500, range: 0.5 },
      { name: 'Karimnagar', lat: 18.8300, lon: 79.0300, range: 0.5 },
      { name: 'Khammam', lat: 17.2500, lon: 80.1500, range: 0.6 },
      { name: 'Komaram Bheem Asifabad', lat: 19.3000, lon: 79.7500, range: 0.5 },
      { name: 'Mahabubabad', lat: 17.4900, lon: 78.9400, range: 0.5 },
      { name: 'Mahabubnagar', lat: 16.7500, lon: 77.9800, range: 0.6 },
      { name: 'Mancherial', lat: 18.7500, lon: 79.9000, range: 0.5 },
      { name: 'Medak', lat: 18.0000, lon: 78.2500, range: 0.5 },
      { name: 'Medchal-Malkajgiri', lat: 17.3850, lon: 78.4867, range: 0.5 },
      { name: 'Mulugu', lat: 18.8700, lon: 80.0000, range: 0.6 },
      { name: 'Nagarkurnool', lat: 16.4800, lon: 78.3200, range: 0.5 },
      { name: 'Nalgonda', lat: 17.0000, lon: 79.2700, range: 0.6 },
      { name: 'Narayanpet', lat: 16.2300, lon: 78.5000, range: 0.5 },
      { name: 'Nirmal', lat: 19.1000, lon: 79.3500, range: 0.5 },
      { name: 'Nizamabad', lat: 18.6700, lon: 78.0900, range: 0.5 },
      { name: 'Peddapalli', lat: 18.6200, lon: 79.8000, range: 0.5 },
      { name: 'Rajanna Sircilla', lat: 18.8000, lon: 79.1500, range: 0.5 },
      { name: 'Rangareddy', lat: 17.4000, lon: 78.3000, range: 0.8 },
      { name: 'Sangareddy', lat: 17.6200, lon: 78.8800, range: 0.5 },
      { name: 'Siddipet', lat: 17.8500, lon: 78.8500, range: 0.4 },
      { name: 'Suryapet', lat: 17.0500, lon: 79.6200, range: 0.5 },
      { name: 'Vikarabad', lat: 17.0200, lon: 78.2400, range: 0.5 },
      { name: 'Wanaparthy', lat: 16.3600, lon: 78.0600, range: 0.5 }
    ];
    
    // Find the closest district with larger range for better detection
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
    
    console.log('📍 Fallback district detected:', closestDistrict, '(distance:', minDistance.toFixed(4) + ')');
    
    // Validate the fallback district
    const validatedDistrict = validateDistrict(closestDistrict);
    
    if (validatedDistrict) {
      console.log('✅ Fallback district validated:', validatedDistrict);
      return {
        mandal: validatedDistrict + ' Mandal',
        district: validatedDistrict,
        state: 'Telangana',
        country: 'India'
      };
    } else {
      console.log('❌ Fallback district not supported:', closestDistrict);
      return {
        mandal: 'Not Supported',
        district: 'Not Supported',
        state: 'Telangana',
        country: 'India',
        error: 'District not supported yet.'
      };
    }
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

  // Add test functions to window for manual testing
  if (typeof window !== 'undefined') {
    (window as any).setTestLocation = (district: string = 'Rangareddy') => {
      console.log('🧪 Setting test location for:', district);
      
      const testLocations = {
        'Rangareddy': {
          latitude: 17.4000,
          longitude: 78.3000,
          mandal: 'Ibrahimpatnam Mandal',
          district: 'Rangareddy',
          state: 'Telangana',
          accuracy: 10
        },
        'Hyderabad': {
          latitude: 17.3850,
          longitude: 78.4867,
          mandal: 'Hyderabad Mandal',
          district: 'Hyderabad',
          state: 'Telangana',
          accuracy: 10
        },
        'Hanumakonda': {
          latitude: 17.9700,
          longitude: 79.5900,
          mandal: 'Hanumakonda Mandal',
          district: 'Hanumakonda',
          state: 'Telangana',
          accuracy: 10
        },
        'Khammam': {
          latitude: 17.2500,
          longitude: 80.1500,
          mandal: 'Khammam Mandal',
          district: 'Khammam',
          state: 'Telangana',
          accuracy: 10
        },
        'Nalgonda': {
          latitude: 17.0000,
          longitude: 79.2700,
          mandal: 'Nalgonda Mandal',
          district: 'Nalgonda',
          state: 'Telangana',
          accuracy: 10
        },
        'NotSupported': {
          latitude: 28.6139,
          longitude: 77.2090,
          mandal: 'Not Supported',
          district: 'Not Supported',
          state: 'Delhi',
          accuracy: 10
        }
      };
      
      const location = testLocations[district as keyof typeof testLocations] || testLocations['Rangareddy'];
      
      setUserLocation(location);
      setLocationPermission('granted');
      console.log('✅ Test location set:', location);
    };
    
    (window as any).testRealLocation = async () => {
      console.log('🧪 Testing real location detection...');
      await requestLocationPermission();
    };
    
    (window as any).testNonTelanganaLocation = () => {
      console.log('🧪 Testing non-Telangana location...');
      setUserLocation({
        latitude: 28.6139,
        longitude: 77.2090,
        mandal: 'Not Supported',
        district: 'Not Supported',
        state: 'Delhi',
        accuracy: 10,
        error: 'District not supported yet.'
      });
      setLocationPermission('granted');
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

  const renderCropCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAndSortedCrops.map((crop) => (
        <Card 
          key={crop.id} 
          className="cursor-pointer hover-card group transition-all duration-300 hover:shadow-xl border-border/50"
          onClick={() => openModal(crop)}
        >
          <CardContent className="p-6">
            <div className="relative mb-4 overflow-hidden rounded-lg">
              <img 
                src={crop.image} 
                alt={crop.name}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-primary/90 backdrop-blur-sm text-white">
                  {crop.duration} days
                </Badge>
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
            </div>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
              {crop.name}
            </h3>
            
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {crop.description}
            </p>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <TrendingUp className="h-4 w-4 mx-auto mb-1 text-green-600" />
                <span className="text-xs text-muted-foreground">Profit</span>
                <p className="font-semibold text-green-600 text-sm">
                  ₹{(crop.profit_per_acre / 100000).toFixed(1)}L
                </p>
              </div>
              
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <Droplets className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                <span className="text-xs text-muted-foreground">Water</span>
                <p className="font-semibold text-sm truncate" title={crop.water_needs}>
                  {crop.water_needs?.split(' ')[0] || 'Moderate'}
                </p>
              </div>
              
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <Clock className="h-4 w-4 mx-auto mb-1 text-orange-600" />
                <span className="text-xs text-muted-foreground">Duration</span>
                <p className="font-semibold text-sm text-orange-600">
                  {crop.duration}d
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Investment: ₹{(crop.investment_cost / 1000).toFixed(0)}K</span>
                <span>Yield: {crop.expected_yield.toLocaleString()}</span>
              </div>
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
            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
                <h4 className="font-bold text-yellow-800">🐛 Debug Info:</h4>
                <p className="text-yellow-700">
                  District: {userLocation?.district || 'Not detected'}<br/>
                  Short Crops: {shortTermCrops.length}<br/>
                  Medium Crops: {mediumTermCrops.length}<br/>
                  Long Crops: {longTermCrops.length}<br/>
                  Location Permission: {locationPermission}
                </p>
              </div>
            )}
            
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl mb-6">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                🌱 Location-Based Crop Explorer
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Discover profitable crops tailored to your location in {userLocation?.district || 'Telangana'}
              </p>
              
              {/* Location Display */}
              {userLocation && (
                <div className="mb-6">
                  {userLocation.district === 'Not Supported' ? (
                    <div className="space-y-4">
                      <span className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        District not supported yet
                      </span>
                      <div className="text-center max-w-2xl mx-auto">
                        <p className="text-red-600 mb-4">
                          {userLocation.error || 'District not supported yet.'}
                        </p>
                        <p className="text-muted-foreground text-sm mb-4">
                          FarmSphere currently supports 31 districts in Telangana. Your location is outside the supported region.
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          <Button 
                            onClick={() => {
                              const testDistricts = ['Rangareddy', 'Hyderabad', 'Hanumakonda', 'Khammam', 'Nalgonda'];
                              const randomDistrict = testDistricts[Math.floor(Math.random() * testDistricts.length)];
                              (window as any).setTestLocation(randomDistrict);
                            }}
                            size="sm"
                            variant="outline"
                          >
                            Try Random Telangana District
                          </Button>
                          <Button 
                            onClick={requestLocationPermission}
                            size="sm"
                            variant="outline"
                          >
                            Retry Location Detection
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      <MapPin className="h-4 w-4 mr-2" />
                      📍 Detected District: {userLocation.district}
                    </span>
                  )}
                </div>
              )}
              
              {/* Location Permission Request */}
              {locationPermission === 'prompt' && (
                <div className="mb-6">
                  <Button 
                    onClick={requestLocationPermission}
                    disabled={locationLoading}
                    size="lg"
                    variant="outline"
                    className="text-blue-700 border-blue-300 hover:bg-blue-50"
                  >
                    {locationLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Getting Location...
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 mr-2" />
                        Enable Location for Better Results
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate('/crops')}
                  className="px-8 py-3"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View All Crops
                </Button>
                <Button 
                  variant="default" 
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
                  variant={sortBy === 'name' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('name')}
                >
                  Name
                </Button>
                <Button
                  variant={sortBy === 'duration' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('duration')}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Duration
                </Button>
                <Button
                  variant={sortBy === 'roi' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('roi')}
                >
                  ROI
                </Button>
              </div>
            </div>

            {/* Crop Categories Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'short' | 'medium' | 'long')} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="short" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Short-term ({shortTermCrops.length})
                </TabsTrigger>
                <TabsTrigger value="medium" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Medium-term ({mediumTermCrops.length})
                </TabsTrigger>
                <TabsTrigger value="long" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Long-term ({longTermCrops.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="short" className="mt-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-foreground mb-2">🌱 Short-term Crops</h2>
                  <p className="text-muted-foreground">
                    Quick returns (&le;120 days) - Perfect for rapid turnover and immediate cash flow
                    {userLocation && ` in ${userLocation.district} district`}
                  </p>
                </div>
                {filteredAndSortedCrops.length > 0 ? renderCropCards() : renderEmptyState()}
              </TabsContent>

              <TabsContent value="medium" className="mt-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-foreground mb-2">🌿 Medium-term Crops</h2>
                  <p className="text-muted-foreground">
                    Balanced investment (121-365 days) - Good returns with moderate time commitment
                    {userLocation && ` in ${userLocation.district} district`}
                  </p>
                </div>
                {filteredAndSortedCrops.length > 0 ? renderCropCards() : renderEmptyState()}
              </TabsContent>

              <TabsContent value="long" className="mt-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-foreground mb-2">🌳 Long-term Crops</h2>
                  <p className="text-muted-foreground">
                    High-value crops (&gt;365 days) - Long-term investment with premium returns
                    {userLocation && ` in ${userLocation.district} district`}
                  </p>
                </div>
                {filteredAndSortedCrops.length > 0 ? renderCropCards() : renderEmptyState()}
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Crop Detail Modal */}
        <CropDetailModal 
          crop={selectedCrop} 
          isOpen={isModalOpen} 
          onClose={closeModal} 
        />
      </div>
    </section>
  );
};

export default ExploreCropsNew;

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, TrendingUp, Clock, Droplets, ArrowUpDown, MapPin, AlertCircle, Loader2 } from "lucide-react";
import CropDetailModal from "@/components/CropDetailModal";
import { Crop, getCropsByCategory, getCropsByCategorySync } from "@/data/cropData";

// 🔹 STRICT DISTRICT COUNT MAPPING SYSTEM
const DISTRICT_CROP_LIMITS: Record<string, { short_term: number; medium_term: number; long_term: number }> = {
  "Adilabad": { short_term: 45, medium_term: 52, long_term: 68 },
  "Bhadradri Kothagudem": { short_term: 48, medium_term: 55, long_term: 71 },
  "Hanumakonda": { short_term: 51, medium_term: 58, long_term: 74 },
  "Hyderabad": { short_term: 42, medium_term: 48, long_term: 63 },
  "Jagtial": { short_term: 46, medium_term: 53, long_term: 69 },
  "Jangaon": { short_term: 44, medium_term: 50, long_term: 66 },
  "Jayashankar Bhupalpally": { short_term: 47, medium_term: 54, long_term: 70 },
  "Jogulamba Gadwal": { short_term: 43, medium_term: 49, long_term: 65 },
  "Kamareddy": { short_term: 49, medium_term: 56, long_term: 72 },
  "Karimnagar": { short_term: 50, medium_term: 57, long_term: 73 },
  "Khammam": { short_term: 52, medium_term: 59, long_term: 75 },
  "Kumuram Bheem": { short_term: 45, medium_term: 51, long_term: 67 },
  "Mahabubabad": { short_term: 46, medium_term: 52, long_term: 68 },
  "Mahabubnagar": { short_term: 48, medium_term: 54, long_term: 70 },
  "Mancherial": { short_term: 47, medium_term: 53, long_term: 69 },
  "Medak": { short_term: 44, medium_term: 50, long_term: 66 },
  "Medchal Malkajgiri": { short_term: 53, medium_term: 60, long_term: 76 },
  "Mulugu": { short_term: 43, medium_term: 49, long_term: 65 },
  "Nagarkurnool": { short_term: 46, medium_term: 52, long_term: 68 },
  "Nalgonda": { short_term: 51, medium_term: 61, long_term: 75 },
  "Narayanpet": { short_term: 42, medium_term: 47, long_term: 63 },
  "Nirmal": { short_term: 44, medium_term: 50, long_term: 66 },
  "Nizamabad": { short_term: 49, medium_term: 56, long_term: 72 },
  "Peddapalli": { short_term: 47, medium_term: 53, long_term: 69 },
  "Rajanna Sircilla": { short_term: 45, medium_term: 51, long_term: 67 },
  "Rangareddy": { short_term: 62, medium_term: 69, long_term: 92 },
  "Sangareddy": { short_term: 50, medium_term: 57, long_term: 73 },
  "Siddipet": { short_term: 48, medium_term: 54, long_term: 70 },
  "Suryapet": { short_term: 49, medium_term: 55, long_term: 71 },
  "Vikarabad": { short_term: 46, medium_term: 52, long_term: 68 },
  "Wanaparthy": { short_term: 43, medium_term: 49, long_term: 65 },
  "Warangal": { short_term: 51, medium_term: 58, long_term: 74 },
  "Yadadri Bhuvanagiri": { short_term: 47, medium_term: 53, long_term: 69 }
};

const ExploreCropsUltraProFinal = () => {
  const [activeTab, setActiveTab] = useState<'short' | 'medium' | 'long'>('short');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'profit' | 'name' | 'duration'>('profit');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [waterFilter, setWaterFilter] = useState<string>('all');
  const [demandFilter, setDemandFilter] = useState<string>('all');
  const [userLocation, setUserLocation] = useState<{ district: string; state: string; error?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [shortTermCrops, setShortTermCrops] = useState<Crop[]>([]);
  const [mediumTermCrops, setMediumTermCrops] = useState<Crop[]>([]);
  const [longTermCrops, setLongTermCrops] = useState<Crop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 🎯 GLOBAL VARIABLE FOR LOCATION WATCHING
  const [locationWatchId, setLocationWatchId] = useState<number | null>(null);

  const openModal = (crop: Crop) => {
    setSelectedCrop(crop);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCrop(null);
  };

  // 🔹 DYNAMIC REAL-TIME LOCATION DETECTION (GPS-FIRST WITH DEBUGGING)
  useEffect(() => {
    // 🎯 SCROLL TO TOP WHEN PAGE LOADS
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    
    console.log('🔄 Initializing GPS-first location system...');
    console.log('🌐 Server URL:', window.location.href);
    console.log('📍 GPS Support:', navigator.geolocation ? 'Available' : 'Not Available');
    
    // 🎯 VERCEL GPS PERMISSION REQUEST
    if (window.location.hostname.includes('vercel.app') || window.location.hostname.includes('localhost')) {
      console.log('🌐 Production/Locally detected - requesting GPS permission...');
      
      // Request GPS permission immediately
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('🎯 GPS Permission Granted - Location:', position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.log('❌ GPS Permission Denied:', error.message);
            console.log('🌐 User will need to manually allow GPS for accurate location');
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }
    }
    
    const initializeDynamicLocation = async () => {
      try {
        // 1️⃣ CHECK FOR SAVED DISTRICT FIRST
        const savedDistrict = localStorage.getItem('userDistrict');
        const savedCoordinates = localStorage.getItem('userCoordinates');
        
        console.log('💾 Saved district found:', savedDistrict);
        console.log('💾 Saved coordinates found:', savedCoordinates);
        
        if (savedDistrict && savedCoordinates) {
          console.log('📍 Using saved location:', savedDistrict);
          setUserLocation({
            district: savedDistrict,
            state: 'Telangana'
          });
          localStorage.setItem('userDistrict', savedDistrict);
        } else if (navigator.geolocation) {
          console.log('🌐 GPS available - starting persistent GPS detection...');
          
          // 🎯 PERSISTENT GPS: Try multiple times to get location
          // 🚫 NO IMMEDIATE FALLBACK - Keep trying GPS
          
          let gpsAttempts = 0;
          const maxGpsAttempts = 3;
          
          const tryGpsLocation = async () => {
            gpsAttempts++;
            console.log(`📍 GPS Attempt ${gpsAttempts}/${maxGpsAttempts}`);
            
            // 🎯 WATCH FOR LOCATION CHANGES (PERSISTENT MODE)
            const watchId = navigator.geolocation.watchPosition(
              (position) => {
                console.log('📍 GPS SUCCESS - Location detected:', position.coords.latitude, position.coords.longitude);
                console.log('📍 GPS Accuracy:', position.coords.accuracy, 'meters');
                console.log('📍 GPS Timestamp:', new Date(position.timestamp).toISOString());
                
                // 🎯 CONVERT GPS COORDINATES TO DISTRICT
                getDistrictFromCoordinates(position.coords.latitude, position.coords.longitude)
                  .then(newDistrict => {
                    if (newDistrict) {
                      console.log('🔄 GPS MAPPED - District detected:', newDistrict);
                      console.log('🔄 GPS vs Saved:', newDistrict, 'vs', savedDistrict);
                      
                      setUserLocation({
                        district: newDistrict,
                        state: 'Telangana'
                      });
                      
                      localStorage.setItem('userDistrict', newDistrict);
                      localStorage.setItem('userCoordinates', `${position.coords.latitude},${position.coords.longitude}`);
                      localStorage.setItem('locationMethod', 'GPS');
                      localStorage.setItem('locationTimestamp', new Date().toISOString());
                      
                      console.log('✅ GPS-based location saved:', newDistrict);
                      console.log('🕒 Location saved at:', new Date().toISOString());
                    } else {
                      console.log('❌ GPS coordinates could not be mapped to district');
                      console.log('📍 GPS Coordinates:', position.coords.latitude, position.coords.longitude);
                      
                      // 🚀 RETRY GPS IF MAPPING FAILED
                      if (gpsAttempts < maxGpsAttempts) {
                        console.log(`🔄 Retrying GPS in 2 seconds...`);
                        setTimeout(tryGpsLocation, 2000);
                      } else {
                        console.log('🌐 GPS attempts exhausted, trying IP-based location...');
                        getLocationFromIP();
                      }
                    }
                  })
                  .catch(error => {
                    console.log('❌ GPS district mapping failed:', error);
                    console.log('📍 GPS Coordinates that failed:', position.coords.latitude, position.coords.longitude);
                    
                    // 🚀 RETRY GPS IF MAPPING FAILED
                    if (gpsAttempts < maxGpsAttempts) {
                      console.log(`🔄 Retrying GPS in 2 seconds...`);
                      setTimeout(tryGpsLocation, 2000);
                    } else {
                      console.log('🌐 GPS attempts exhausted, trying IP-based location...');
                      getLocationFromIP();
                    }
                  });
              },
              (error) => {
                console.log('❌ GPS ACCESS DENIED - Error:', error.message);
                console.log('❌ GPS Error Code:', error.code);
                console.log(`🔄 GPS Attempt ${gpsAttempts} failed`);
                
                // 🚀 RETRY GPS IF ACCESS DENIED
                if (gpsAttempts < maxGpsAttempts) {
                  console.log(`🔄 Retrying GPS in 3 seconds...`);
                  setTimeout(tryGpsLocation, 3000);
                } else {
                  console.log('🌐 GPS attempts exhausted, trying IP-based location...');
                  getLocationFromIP();
                }
              },
              {
                enableHighAccuracy: true, // 🎯 MAXIMUM GPS ACCURACY
                timeout: 15000, // ⏰ Give GPS 15 seconds per attempt
                maximumAge: 0 // 🔄 Always use fresh GPS data
              }
            );
            
            return watchId;
          };
          
          // Start first GPS attempt
          return tryGpsLocation();
        } else {
          console.log('❌ GPS NOT SUPPORTED - Using IP-based location');
          getLocationFromIP();
        }
        
      } catch (error) {
        console.error('❌ Dynamic location system failed:', error);
        console.log('🌐 Using fallback location due to system error');
        await fallbackToDefaultLocation();
      }
    };
    
    initializeDynamicLocation();
    
  }, []); // Empty dependency array for initial load
    
  // 🔄 LOAD CROPS AFTER LOCATION IS SET (DYNAMIC DISTRICT SUPPORT)
  const loadCropsFromDatabase = async () => {
      try {
        console.log('🔄 Starting database fetch for crops...');
        const currentDistrict = userLocation?.district || 'Rangareddy';
        console.log('📍 Fetching crops for district:', currentDistrict);
        
        const mediumCrops = await getCropsByCategory('medium', currentDistrict);
        console.log('📊 Medium crops fetched:', mediumCrops.length, mediumCrops.map(c => `${c.name} (${c.district})`));
        
        const shortCrops = await getCropsByCategory('short', currentDistrict);
        const longCrops = await getCropsByCategory('long', currentDistrict);

        console.log('📊 Setting crops from database:', {
          district: currentDistrict,
          short: shortCrops.length,
          medium: mediumCrops.length,
          long: longCrops.length
        });
        
        setShortTermCrops(shortCrops);
        setMediumTermCrops(mediumCrops);
        setLongTermCrops(longCrops);
        setLoading(false);
        
        console.log('✅ Crops loaded successfully from database:', {
          district: currentDistrict,
          short: shortCrops.length,
          medium: mediumCrops.length,
          long: longCrops.length
        });
      } catch (error) {
        console.error('❌ Error loading crops from database:', error);
        
        // Fallback to static data
        const shortCrops = getCropsByCategorySync('short');
        const mediumCrops = getCropsByCategorySync('medium');
        const longCrops = getCropsByCategorySync('long');
        
        setShortTermCrops(shortCrops);
        setMediumTermCrops(mediumCrops);
        setLongTermCrops(longCrops);
        setLoading(false);
        
        console.log('📊 Fallback to static crops:', {
          short: shortCrops.length,
          medium: mediumCrops.length,
          long: longCrops.length
        });
      }
    };

    
  // 🔄 LOAD CROPS WHEN LOCATION CHANGES
  useEffect(() => {
    if (userLocation?.district) {
      console.log('🔄 Loading crops for district:', userLocation.district);
      // 🎯 SCROLL TO TOP WHEN LOCATION CHANGES
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      loadCropsFromDatabase();
    }
  }, [userLocation?.district]);

  // 🎯 HELPER FUNCTION: GET LOCATION METHOD FOR VERCEL
  const getLocationMethod = () => {
    const hostname = window.location.hostname;
    if (hostname.includes('vercel.app')) {
      return 'VERCEL-PRODUCTION';
    } else if (hostname.includes('localhost')) {
      return 'LOCAL-DEVELOPMENT';
    } else if (hostname.includes('192.168')) {
      return 'NETWORK-DEVELOPMENT';
    } else {
      return 'UNKNOWN';
    }
  };

  // 🎯 HELPER FUNCTION: GET CURRENT DEVICE LOCATION (GPS-FIRST FOR ACCURACY)
  const getCurrentDeviceLocation = async () => {
    if (navigator.geolocation) {
      console.log('📍 Getting device GPS location (priority mode)...');
      
      // 🎯 GPS-FIRST STRATEGY: Prioritize GPS accuracy over IP fallback
      let locationResolved = false;
      
      // Set a timeout to fallback to IP location if GPS takes too long
      const fallbackTimeout = setTimeout(async () => {
        if (!locationResolved) {
          console.log('⏰ GPS taking too long, switching to IP-based location...');
          locationResolved = true;
          await getLocationFromIP();
        }
      }, 5000); // Increased to 5 seconds to give GPS more chance
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (!locationResolved) {
            clearTimeout(fallbackTimeout);
            locationResolved = true;
            
            console.log('📍 Accurate GPS location detected:', position.coords.latitude, position.coords.longitude);
            
            try {
              // 🎯 CONVERT COORDINATES TO DISTRICT
              const district = await getDistrictFromCoordinates(position.coords.latitude, position.coords.longitude);
              
              if (district) {
                setUserLocation({
                  district: district,
                  state: 'Telangana'
                });
                
                localStorage.setItem('userDistrict', district);
                localStorage.setItem('userCoordinates', `${position.coords.latitude},${position.coords.longitude}`);
                
                console.log('✅ Accurate GPS-based location set:', district);
              } else {
                console.log('❌ GPS coordinates could not be mapped to district, using IP fallback...');
                await getLocationFromIP();
              }
            } catch (error) {
              console.log('❌ GPS district mapping failed, using IP fallback:', error);
              await getLocationFromIP();
            }
          }
        },
        async (error) => {
          if (!locationResolved) {
            clearTimeout(fallbackTimeout);
            locationResolved = true;
            console.log('❌ GPS access denied, trying IP-based location...');
            await getLocationFromIP();
          }
        },
        {
          enableHighAccuracy: true, // 🎯 ENABLE HIGH ACCURACY FOR GPS PRIORITY
          timeout: 5000, // Give GPS 5 seconds to respond
          maximumAge: 300000 // Use 5 minutes cache for GPS
        }
      );
    } else {
      console.log('❌ Geolocation not supported, trying IP-based location...');
      await getLocationFromIP();
    }
  };

  // 🎯 HELPER FUNCTION: GET LOCATION FROM IP (DEBUG MODE)
  const getLocationFromIP = async () => {
    try {
      console.log('🌐 Starting IP-based location detection...');
      console.log('🌐 This is FALLBACK method - GPS should be used first!');
      
      // 🚀 FAST IP LOCATION WITH TIMEOUT
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('https://ipapi.co/json/', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const data = await response.json();
      
      console.log('🌐 IP-based location data received:', data);
      console.log('🌐 IP Address:', data.ip);
      console.log('🌐 City detected:', data.city);
      console.log('🌐 Region detected:', data.region);
      
      // 🎯 MAP CITY TO TELANGANA DISTRICT
      const district = mapCityToTelanganaDistrict(data.city);
      
      console.log('🌐 IP-based district mapping:', data.city, '→', district);
      console.log('🌐 Location method being set to: IP-BASED');
      
      setUserLocation({
        district: district,
        state: 'Telangana'
      });
      
      localStorage.setItem('userDistrict', district);
      localStorage.setItem('userCity', data.city);
      localStorage.setItem('locationMethod', 'IP');
      localStorage.setItem('locationTimestamp', new Date().toISOString());
      
      console.log('✅ IP-based location set:', district);
      console.log('🕒 IP Location saved at:', new Date().toISOString());
      console.log('⚠️ WARNING: IP-based location may not be accurate!');
      
    } catch (error) {
      console.error('❌ IP location failed, using immediate fallback:', error);
      console.log('🌐 Location method being set to: DEFAULT FALLBACK');
      await fallbackToDefaultLocation();
    }
  };

  // 🎯 HELPER FUNCTION:// 4️⃣ FALLBACK TO DEFAULT DISTRICT
  const fallbackToDefaultLocation = async () => {
    console.log('🔄 Using fallback location...');
    
    const fallbackDistrict = 'Hyderabad';
    setUserLocation({
      district: fallbackDistrict,
      state: 'Telangana'
    });
    
    localStorage.setItem('userDistrict', fallbackDistrict);
    console.log('✅ Fallback location set:', fallbackDistrict);
  };

  // 🎯 HELPER FUNCTION: CONVERT COORDINATES TO DISTRICT
  const getDistrictFromCoordinates = async (lat, lon) => {
    // 🎯 TELANGANA DISTRICT BOUNDARIES (APPROXIMATE)
    const telanganaDistricts = {
      'Hyderabad': { lat: [17.38, 17.45], lon: [78.40, 78.55] },
      'Rangareddy': { lat: [17.30, 17.40], lon: [78.40, 78.60] },
      'Medchal': { lat: [17.45, 17.55], lon: [78.45, 78.65] },
      'Sangareddy': { lat: [17.55, 17.65], lon: [78.25, 78.40] },
      'Warangal': { lat: [17.95, 18.15], lon: [79.45, 79.75] },
      'Nizamabad': { lat: [18.65, 18.75], lon: [78.10, 78.25] },
      'Karimnagar': { lat: [18.40, 18.50], lon: [78.95, 79.15] },
      'Khammam': { lat: [17.20, 17.30], lon: [80.15, 80.35] },
      // Add more districts as needed
    };
    
    // 🎯 FIND CLOSEST DISTRICT
    let closestDistrict = 'Hyderabad'; // default
    let minDistance = Infinity;
    
    for (const [district, bounds] of Object.entries(telanganaDistricts)) {
      const districtLat = (bounds.lat[0] + bounds.lat[1]) / 2;
      const districtLon = (bounds.lon[0] + bounds.lon[1]) / 2;
      
      const distance = Math.sqrt(
        Math.pow(lat - districtLat, 2) + Math.pow(lon - districtLon, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestDistrict = district;
      }
    }
    
    console.log(`🎯 Coordinates ${lat},${lon} mapped to district: ${closestDistrict}`);
    return closestDistrict;
  };

  // 🎯 HELPER FUNCTION: MAP CITY TO TELANGANA DISTRICT
  const mapCityToTelanganaDistrict = (city) => {
    const cityToDistrictMap = {
      'Hyderabad': 'Hyderabad',
      'Secunderabad': 'Hyderabad',
      'Rangareddy': 'Rangareddy',
      'Sangareddy': 'Sangareddy',
      'Warangal': 'Warangal',
      'Nizamabad': 'Nizamabad',
      'Karimnagar': 'Karimnagar',
      'Khammam': 'Khammam',
      'Medchal': 'Medchal',
      'Hanamkonda': 'Hanamkonda',
      'Nalgonda': 'Nalgonda',
      'Mahabubnagar': 'Mahabubnagar',
      'Adilabad': 'Adilabad',
      // Add more mappings as needed
    };
    
    const district = cityToDistrictMap[city] || 'Hyderabad';
    console.log(`🎯 City ${city} mapped to district: ${district}`);
    return district;
  };

  // 🔹 GET FILTERED CROP COUNTS (ACCURATE COUNTS)
  const getFilteredCropCount = () => {
    return filteredAndSortedCrops.length;
  };

  // 🔹 GET CURRENT CROPS
  const getCurrentCrops = () => {
    switch (activeTab) {
      case 'short': return shortTermCrops;
      case 'medium': return mediumTermCrops;
      case 'long': return longTermCrops;
      default: return shortTermCrops;
    }
  };

  // 🔹 FILTER AND SORT CROPS (NO DISTRICT FILTERING NEEDED - ALREADY DONE IN getCropsByCategory)
  const filteredAndSortedCrops = useMemo(() => {
    let crops = getCurrentCrops();

    // 🎯 NOTE: District filtering is now done in getCropsByCategory function
    // No need to filter again here since crops are already district-specific
    console.log(`📊 Using pre-filtered crops: ${crops.length} crops for ${userLocation?.district || 'default'}`);

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      crops = crops.filter(crop =>
        crop.name.toLowerCase().includes(searchLower) ||
        crop.cropType.toLowerCase().includes(searchLower) ||
        crop.district.toLowerCase().includes(searchLower)
      );
      console.log(`🔍 Search filtering result: ${crops.length} crops for "${searchTerm}"`);
    }

    if (waterFilter && waterFilter !== 'all') {
      crops = crops.filter(crop => crop.waterNeeds?.toLowerCase() === waterFilter.toLowerCase());
    }

    if (demandFilter && demandFilter !== 'all') {
      crops = crops.filter(crop => crop.demand?.toLowerCase() === demandFilter.toLowerCase());
    }

    // Sort crops
    crops.sort((a, b) => {
      let comparison = 0;
      let aValue, bValue;
      
      switch (sortBy) {
        case 'profit':
          aValue = a.profitPerAcre || 0;
          bValue = b.profitPerAcre || 0;
          break;
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'duration':
          aValue = a.durationDays || 0;
          bValue = b.durationDays || 0;
          break;
        default:
          aValue = a.profitPerAcre || 0;
          bValue = b.profitPerAcre || 0;
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

    return crops;
  }, [activeTab, searchTerm, sortBy, sortOrder, waterFilter, demandFilter, shortTermCrops, mediumTermCrops, longTermCrops, userLocation]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <section className="section-container bg-gradient-to-br from-background to-muted/30 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* 🔹 HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            🌱 District-Based Crop Explorer
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover profitable farming opportunities tailored to your location with real-time district detection and precise crop recommendations.
          </p>
        </div>

        {/* 🔹 LOCATION STATUS - CENTERED */}
        <div className="mb-8 flex justify-center">
          {userLocation?.district ? (
            <div className="flex flex-col items-center p-6 bg-green-50 border border-green-200 rounded-lg max-w-md">
              <div className="flex items-center mb-2">
                <MapPin className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-green-800 text-center">📍 District: {userLocation.district}</h3>
                  <p className="text-green-600 text-sm text-center">Showing crops specifically for your region</p>
                </div>
              </div>
              
              {/* 🌐 VERCEL DISTRICT SELECTOR */}
              {getLocationMethod() === 'VERCEL-PRODUCTION' && (
                <Select value={userLocation.district} onValueChange={(value) => {
                  console.log('🎯 VERCEL MANUAL DISTRICT SELECTED:', value);
                  setUserLocation({
                    district: value,
                    state: 'Telangana'
                  });
                  localStorage.setItem('userDistrict', value);
                  localStorage.setItem('locationMethod', 'MANUAL-VERCEL');
                  localStorage.setItem('locationTimestamp', new Date().toISOString());
                  console.log('✅ Vercel manual district set:', value);
                }}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="Rangareddy">Rangareddy</SelectItem>
                    <SelectItem value="Warangal">Warangal</SelectItem>
                    <SelectItem value="Medchal">Medchal</SelectItem>
                    <SelectItem value="Nizamabad">Nizamabad</SelectItem>
                    <SelectItem value="Karimnagar">Karimnagar</SelectItem>
                    <SelectItem value="Khammam">Khammam</SelectItem>
                    <SelectItem value="Sangareddy">Sangareddy</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center p-6 bg-blue-50 border border-blue-200 rounded-lg max-w-md">
              <MapPin className="h-6 w-6 text-blue-600 mr-3 mb-2" />
              <div>
                <h3 className="font-semibold text-blue-800 text-center">📍 Setting up your location...</h3>
                <p className="text-blue-600 text-sm text-center">Loading district information</p>
              </div>
            </div>
          )}
        </div>

        {/* 🔹 DISTRICT SUMMARY */}
        {userLocation?.district && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold text-green-800">🌱 Short-Term</h3>
                <p className="text-2xl font-bold text-green-600">{activeTab === 'short' ? getFilteredCropCount() : shortTermCrops.length}</p>
                <p className="text-sm text-green-600">crops available</p>
                <p className="text-xs text-muted-foreground">45-120 days</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold text-blue-800">🌿 Medium-Term</h3>
                <p className="text-2xl font-bold text-blue-600">{activeTab === 'medium' ? getFilteredCropCount() : mediumTermCrops.length}</p>
                <p className="text-sm text-blue-600">crops available</p>
                <p className="text-xs text-muted-foreground">120-365 days</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold text-purple-800">🌳 Long-Term</h3>
                <p className="text-2xl font-bold text-purple-600">{activeTab === 'long' ? getFilteredCropCount() : longTermCrops.length}</p>
                <p className="text-sm text-purple-600">crops available</p>
                <p className="text-xs text-muted-foreground">365+ days</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 🔹 FILTERS */}
        {userLocation?.district && (
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search crops by name or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={waterFilter} onValueChange={setWaterFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Water Needs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Water Needs</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profit">Yield Estimate</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" onClick={toggleSortOrder} className="w-10 h-10">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* 🔹 CROPS DISPLAY */}
        {userLocation?.district && (
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="short" className="flex items-center gap-2">
                🌱 Short-Term
                <Badge variant="secondary">{activeTab === 'short' ? getFilteredCropCount() : shortTermCrops.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="medium" className="flex items-center gap-2">
                🌿 Medium-Term
                <Badge variant="secondary">{activeTab === 'medium' ? getFilteredCropCount() : mediumTermCrops.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="long" className="flex items-center gap-2">
                🌳 Long-Term
                <Badge variant="secondary">{activeTab === 'long' ? getFilteredCropCount() : longTermCrops.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="short" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-green-800 mb-2">🌱 Short-Term Crops</h2>
                <p className="text-muted-foreground">Quick returns (45-120 days)</p>
                <p className="text-sm text-green-600 mt-2">Showing {getFilteredCropCount()} crops</p>
              </div>
              {filteredAndSortedCrops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedCrops.map((crop) => (
                    <Card 
                      key={crop.id} 
                      className="cursor-pointer hover-card group transition-all duration-300 hover:shadow-xl border-border/50"
                      onClick={() => openModal(crop)}
                    >
                      <CardContent className="p-6">
                        <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
                          <img 
                            src={crop.image} 
                            alt={crop.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                {crop.name}
                              </h3>
                              <p className="text-sm font-bold text-green-600 mt-1 bg-green-50 px-2 py-1 rounded-md inline-block">
                                📍 {crop.district || 'Telangana'}
                              </p>
                            </div>
                            <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                              {crop.duration}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {crop.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              💰 ₹{(crop.profitPerAcre/1000).toFixed(0)}K/acre
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              💧 {crop.waterNeeds}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              📈 {crop.demand}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold">No crops found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="medium" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-blue-800 mb-2">🌿 Medium-Term Crops</h2>
                <p className="text-muted-foreground">Balanced returns (120-365 days)</p>
                <p className="text-sm text-blue-600 mt-2">Showing {getFilteredCropCount()} crops</p>
              </div>
              {filteredAndSortedCrops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedCrops.map((crop) => (
                    <Card 
                      key={crop.id} 
                      className="cursor-pointer hover-card group transition-all duration-300 hover:shadow-xl border-border/50"
                      onClick={() => openModal(crop)}
                    >
                      <CardContent className="p-6">
                        <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
                          <img 
                            src={crop.image} 
                            alt={crop.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                {crop.name}
                              </h3>
                              <p className="text-sm font-bold text-green-600 mt-1 bg-green-50 px-2 py-1 rounded-md inline-block">
                                📍 {crop.district || 'Telangana'}
                              </p>
                            </div>
                            <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                              {crop.duration}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {crop.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              💰 ₹{(crop.profitPerAcre/1000).toFixed(0)}K/acre
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              💧 {crop.waterNeeds}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              📈 {crop.demand}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold">No crops found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="long" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-purple-800 mb-2">🌳 Long-Term Crops</h2>
                <p className="text-muted-foreground">High-value crops (365+ days)</p>
                <p className="text-sm text-purple-600 mt-2">Showing {getFilteredCropCount()} crops</p>
              </div>
              {filteredAndSortedCrops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedCrops.map((crop) => (
                    <Card 
                      key={crop.id} 
                      className="cursor-pointer hover-card group transition-all duration-300 hover:shadow-xl border-border/50"
                      onClick={() => openModal(crop)}
                    >
                      <CardContent className="p-6">
                        <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
                          <img 
                            src={crop.image} 
                            alt={crop.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                {crop.name}
                              </h3>
                              <p className="text-sm font-bold text-green-600 mt-1 bg-green-50 px-2 py-1 rounded-md inline-block">
                                📍 {crop.district || 'Telangana'}
                              </p>
                            </div>
                            <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                              {crop.duration}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {crop.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              💰 ₹{(crop.profitPerAcre/1000).toFixed(0)}K/acre
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              💧 {crop.waterNeeds}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              📈 {crop.demand}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold">No crops found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* 🔹 CROP DETAIL MODAL - EXACT UI FROM CROPS PAGE */}
        {selectedCrop && (
          <CropDetailModal
            crop={selectedCrop}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        )}
      </div>
    </section>
  );
};

export default ExploreCropsUltraProFinal;

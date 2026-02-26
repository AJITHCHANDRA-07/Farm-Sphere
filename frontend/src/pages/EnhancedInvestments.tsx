import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, TrendingUp, DollarSign, Building, ArrowUpDown, ArrowLeft } from "lucide-react";

interface InvestmentUnit {
  id: string;
  name: string;
  icon: string;
  investment: string;
  subsidy: string;
  roi: string;
  payback: string;
  profit: string;
  description: string;
  category: string;
  riskLevel: string;
  marketDemand: string;
  applyLink: string;
}

const investmentUnits: InvestmentUnit[] = [
  {
    id: "food-processing",
    name: "Food Processing",
    icon: "/images/investments/food-processing.jpg",
    investment: "₹25-50 Lakhs",
    subsidy: "35% Govt Support",
    roi: "25-30% annually",
    payback: "3-4 years",
    profit: "₹8-15 Lakhs/year",
    description: "Modern food processing facilities with cold chain integration",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "High",
    applyLink: "https://www.mofpi.gov.in/"
  },
  {
    id: "cold-storage",
    name: "Cold Storage",
    icon: "/images/investments/cold-storage.jpg",
    investment: "₹40-80 Lakhs",
    subsidy: "40% Govt Support",
    roi: "20-25% annually",
    payback: "4-5 years",
    profit: "₹10-20 Lakhs/year",
    description: "Temperature-controlled storage for fruits and vegetables",
    category: "Storage",
    riskLevel: "Low",
    marketDemand: "Very High",
    applyLink: "https://agrimachinery.nic.in/"
  },
  {
    id: "dairy",
    name: "Dairy Processing",
    icon: "/images/investments/dairy-processing.jpg",
    investment: "₹30-60 Lakhs",
    subsidy: "50% Govt Support",
    roi: "22-28% annually",
    payback: "3-4 years",
    profit: "₹8-18 Lakhs/year",
    description: "Milk processing and dairy product manufacturing units",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "High",
    applyLink: "https://dahdf.nic.in/"
  },
  {
    id: "oilseed",
    name: "Oilseed Processing",
    icon: "/images/investments/oilseed-processing.jpg",
    investment: "₹20-40 Lakhs",
    subsidy: "30% Govt Support",
    roi: "18-24% annually",
    payback: "4-5 years",
    profit: "₹6-12 Lakhs/year",
    description: "Oil extraction and refining facilities",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "Medium",
    applyLink: "https://dacnet.nic.in/"
  },
  {
    id: "fisheries",
    name: "Fisheries",
    icon: "/images/investments/fisheries.jpg",
    investment: "₹15-35 Lakhs",
    subsidy: "45% Govt Support",
    roi: "20-26% annually",
    payback: "3-4 years",
    profit: "₹5-12 Lakhs/year",
    description: "Aquaculture and fish processing facilities",
    category: "Production",
    riskLevel: "High",
    marketDemand: "High",
    applyLink: "https://dahdf.nic.in/fisheries"
  },
  {
    id: "organic",
    name: "Organic Farming",
    icon: "/images/investments/organic-farming.jpg",
    investment: "₹10-25 Lakhs",
    subsidy: "25% Govt Support",
    roi: "30-40% annually",
    payback: "2-3 years",
    profit: "₹8-15 Lakhs/year",
    description: "Certified organic farming and processing operations",
    category: "Production",
    riskLevel: "Low",
    marketDemand: "Growing",
    applyLink: "https://pgsindia-nop.gov.in/"
  },
  {
    id: "grain-storage",
    name: "Grain Storage",
    icon: "/images/investments/grain-storage.jpg",
    investment: "₹35-70 Lakhs",
    subsidy: "33% Govt Support",
    roi: "15-20% annually",
    payback: "5-6 years",
    profit: "₹8-16 Lakhs/year",
    description: "Modern grain storage and warehousing facilities",
    category: "Storage",
    riskLevel: "Low",
    marketDemand: "High",
    applyLink: "https://www.fci.gov.in/"
  },
  {
    id: "pack-house",
    name: "Pack House",
    icon: "/images/investments/pack-house.jpg",
    investment: "₹45-90 Lakhs",
    subsidy: "35% Govt Support",
    roi: "18-22% annually",
    payback: "4-5 years",
    profit: "₹12-25 Lakhs/year",
    description: "Pre-cooling and packaging facilities for horticulture produce",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "Very High",
    applyLink: "https://midh.gov.in/"
  },
  {
    id: "mushroom",
    name: "Mushroom Cultivation",
    icon: "/images/investments/mushroom.jpg",
    investment: "₹12-30 Lakhs",
    subsidy: "40% Govt Support",
    roi: "25-35% annually",
    payback: "2-3 years",
    profit: "₹6-18 Lakhs/year",
    description: "Controlled environment mushroom farming",
    category: "Production",
    riskLevel: "Medium",
    marketDemand: "High",
    applyLink: "https://nrcm.in/"
  },
  {
    id: "floriculture",
    name: "Floriculture",
    icon: "/images/investments/floriculture.jpg",
    investment: "₹20-45 Lakhs",
    subsidy: "30% Govt Support",
    roi: "20-30% annually",
    payback: "3-4 years",
    profit: "₹8-20 Lakhs/year",
    description: "Flower cultivation and greenhouse production",
    category: "Production",
    riskLevel: "Medium",
    marketDemand: "High",
    applyLink: "https://nhb.gov.in/"
  },
  {
    id: "spices",
    name: "Spices Processing",
    icon: "/images/investments/spices.jpg",
    investment: "₹25-50 Lakhs",
    subsidy: "35% Govt Support",
    roi: "22-28% annually",
    payback: "3-4 years",
    profit: "₹10-22 Lakhs/year",
    description: "Spice cleaning, grading and packaging units",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "Very High",
    applyLink: "https://spicesboard.gov.in/"
  },
  {
    id: "honey",
    name: "Honey Processing",
    icon: "/images/investments/honey.jpg",
    investment: "₹8-20 Lakhs",
    subsidy: "40% Govt Support",
    roi: "30-40% annually",
    payback: "2-3 years",
    profit: "₹4-12 Lakhs/year",
    description: "Honey extraction, processing and packaging",
    category: "Processing",
    riskLevel: "Low",
    marketDemand: "Growing",
    applyLink: "https://nbb.gov.in/"
  },
  {
    id: "poultry",
    name: "Poultry Farming",
    icon: "/images/investments/poultry.jpg",
    investment: "₹15-40 Lakhs",
    subsidy: "35% Govt Support",
    roi: "20-25% annually",
    payback: "3-4 years",
    profit: "₹6-18 Lakhs/year",
    description: "Modern poultry farming and egg production",
    category: "Production",
    riskLevel: "Medium",
    marketDemand: "Very High",
    applyLink: "https://dahdf.nic.in/poultry"
  },
  {
    id: "meat",
    name: "Meat Processing",
    icon: "/images/investments/meat-processing.jpg",
    investment: "₹30-60 Lakhs",
    subsidy: "35% Govt Support",
    roi: "18-24% annually",
    payback: "4-5 years",
    profit: "₹8-20 Lakhs/year",
    description: "Halal meat processing and packaging units",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "High",
    applyLink: "https://dahdf.nic.in/meat"
  },
  {
    id: "solar",
    name: "Solar Pumping",
    icon: "/images/investments/solar-pump.jpg",
    investment: "₹5-15 Lakhs",
    subsidy: "50% Govt Support",
    roi: "15-20% annually",
    payback: "5-6 years",
    profit: "₹2-8 Lakhs/year",
    description: "Solar-powered agricultural pump systems",
    category: "Infrastructure",
    riskLevel: "Low",
    marketDemand: "Very High",
    applyLink: "https://mnre.gov.in/solar-pumps"
  },
  {
    id: "biogas",
    name: "Biogas Plant",
    icon: "/images/investments/biogas.jpg",
    investment: "₹10-25 Lakhs",
    subsidy: "40% Govt Support",
    roi: "20-25% annually",
    payback: "4-5 years",
    profit: "₹4-12 Lakhs/year",
    description: "Biogas production from agricultural waste",
    category: "Infrastructure",
    riskLevel: "Medium",
    marketDemand: "Growing",
    applyLink: "https://mnre.gov.in/biogas"
  },
  {
    id: "vermicompost",
    name: "Vermicompost",
    icon: "/images/investments/vermicompost.jpg",
    investment: "₹5-15 Lakhs",
    subsidy: "50% Govt Support",
    roi: "25-35% annually",
    payback: "2-3 years",
    profit: "₹3-10 Lakhs/year",
    description: "Organic fertilizer production using earthworms",
    category: "Processing",
    riskLevel: "Low",
    marketDemand: "High",
    applyLink: "https://ncof.org.in/"
  },
  {
    id: "tissue-culture",
    name: "Tissue Culture",
    icon: "/images/investments/tissue-culture.jpg",
    investment: "₹20-50 Lakhs",
    subsidy: "35% Govt Support",
    roi: "22-30% annually",
    payback: "3-4 years",
    profit: "₹8-20 Lakhs/year",
    description: "Plant tissue culture laboratory and production",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "High",
    applyLink: "https://nhb.gov.in/tissue-culture"
  },
  {
    id: "greenhouse",
    name: "Greenhouse Farming",
    icon: "/images/investments/greenhouse.jpg",
    investment: "₹25-60 Lakhs",
    subsidy: "40% Govt Support",
    roi: "20-28% annually",
    payback: "4-5 years",
    profit: "₹10-25 Lakhs/year",
    description: "Protected cultivation under controlled environment",
    category: "Production",
    riskLevel: "Medium",
    marketDemand: "Very High",
    applyLink: "https://nhb.gov.in/greenhouse"
  },
  {
    id: "micro-irrigation",
    name: "Micro Irrigation",
    icon: "/images/investments/micro-irrigation.jpg",
    investment: "₹8-20 Lakhs",
    subsidy: "55% Govt Support",
    roi: "15-20% annually",
    payback: "5-6 years",
    profit: "₹3-10 Lakhs/year",
    description: "Drip and sprinkler irrigation systems",
    category: "Infrastructure",
    riskLevel: "Low",
    marketDemand: "Very High",
    applyLink: "https://pmksy.gov.in/micro-irrigation"
  },
  {
    id: "farm-machinery",
    name: "Farm Machinery",
    icon: "/images/investments/farm-machinery.jpg",
    investment: "₹15-40 Lakhs",
    subsidy: "40% Govt Support",
    roi: "18-25% annually",
    payback: "4-5 years",
    profit: "₹6-18 Lakhs/year",
    description: "Custom hiring center for farm machinery",
    category: "Service",
    riskLevel: "Medium",
    marketDemand: "High",
    applyLink: "https://agrimachinery.nic.in/"
  },
  {
    id: "seed-processing",
    name: "Seed Processing",
    icon: "/images/investments/seed-processing.jpg",
    investment: "₹30-70 Lakhs",
    subsidy: "35% Govt Support",
    roi: "20-25% annually",
    payback: "4-5 years",
    profit: "₹10-25 Lakhs/year",
    description: "Seed cleaning, grading and treatment facilities",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "Very High",
    applyLink: "https://seednet.gov.in/"
  },
  {
    id: "fertilizer",
    name: "Fertilizer Retail",
    icon: "/images/investments/fertilizer.jpg",
    investment: "₹10-30 Lakhs",
    subsidy: "25% Govt Support",
    roi: "15-20% annually",
    payback: "5-6 years",
    profit: "₹4-12 Lakhs/year",
    description: "Fertilizer and agro-input retail outlet",
    category: "Service",
    riskLevel: "Medium",
    marketDemand: "High",
    applyLink: "https://fertilizer.gov.in/"
  },
  {
    id: "agri-clinic",
    name: "Agri Clinic",
    icon: "/images/investments/agri-clinic.jpg",
    investment: "₹8-20 Lakhs",
    subsidy: "36% Govt Support",
    roi: "20-30% annually",
    payback: "3-4 years",
    profit: "₹4-12 Lakhs/year",
    description: "Agricultural input and advisory services center",
    category: "Service",
    riskLevel: "Low",
    marketDemand: "Growing",
    applyLink: "https://agriclinic.in/"
  },
  {
    id: "warehouse",
    name: "Warehouse",
    icon: "/images/investments/warehouse.jpg",
    investment: "₹40-80 Lakhs",
    subsidy: "33% Govt Support",
    roi: "12-18% annually",
    payback: "6-7 years",
    profit: "₹8-20 Lakhs/year",
    description: "Agricultural commodity storage and warehousing",
    category: "Storage",
    riskLevel: "Low",
    marketDemand: "High",
    applyLink: "https://wdra.gov.in/"
  },
  {
    id: "logistics",
    name: "Agri Logistics",
    icon: "/images/investments/logistics.jpg",
    investment: "₹25-50 Lakhs",
    subsidy: "30% Govt Support",
    roi: "15-22% annually",
    payback: "4-5 years",
    profit: "₹6-16 Lakhs/year",
    description: "Agricultural produce transportation and logistics",
    category: "Service",
    riskLevel: "Medium",
    marketDemand: "High",
    applyLink: "https://www.enam.gov.in/"
  },
  {
    id: "tea-processing",
    name: "Tea Processing",
    icon: "/images/investments/tea-processing.jpg",
    investment: "₹35-70 Lakhs",
    subsidy: "35% Govt Support",
    roi: "18-24% annually",
    payback: "4-5 years",
    profit: "₹10-22 Lakhs/year",
    description: "Tea leaf processing and packaging unit",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "High",
    applyLink: "https://teaboard.gov.in/"
  },
  {
    id: "coffee-processing",
    name: "Coffee Processing",
    icon: "/images/investments/coffee-processing.jpg",
    investment: "₹30-60 Lakhs",
    subsidy: "35% Govt Support",
    roi: "20-26% annually",
    payback: "4-5 years",
    profit: "₹8-20 Lakhs/year",
    description: "Coffee bean processing and roasting unit",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "Growing",
    applyLink: "https://coffeeboard.gov.in/"
  },
  {
    id: "rubber",
    name: "Rubber Processing",
    icon: "/images/investments/rubber-processing.jpg",
    investment: "₹25-50 Lakhs",
    subsidy: "30% Govt Support",
    roi: "16-22% annually",
    payback: "5-6 years",
    profit: "₹6-16 Lakhs/year",
    description: "Rubber sheet and product manufacturing",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "Medium",
    applyLink: "https://rubberboard.org.in/"
  },
  {
    id: "cashew",
    name: "Cashew Processing",
    icon: "/images/investments/cashew-processing.jpg",
    investment: "₹20-45 Lakhs",
    subsidy: "35% Govt Support",
    roi: "22-28% annually",
    payback: "3-4 years",
    profit: "₹8-18 Lakhs/year",
    description: "Cashew nut processing and value addition",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "High",
    applyLink: "https://cashewboard.gov.in/"
  },
  {
    id: "coconut",
    name: "Coconut Processing",
    icon: "/images/investments/coconut-processing.jpg",
    investment: "₹15-35 Lakhs",
    subsidy: "35% Govt Support",
    roi: "20-26% annually",
    payback: "4-5 years",
    profit: "₹6-15 Lakhs/year",
    description: "Coconut oil and copra processing unit",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "High",
    applyLink: "https://cocoboard.gov.in/"
  },
  {
    id: "cotton-ginning",
    name: "Cotton Ginning",
    icon: "/images/investments/cotton-ginning.jpg",
    investment: "₹40-80 Lakhs",
    subsidy: "35% Govt Support",
    roi: "15-20% annually",
    payback: "5-6 years",
    profit: "₹10-20 Lakhs/year",
    description: "Cotton ginning and pressing facility",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "High",
    applyLink: "https://cottonboard.gov.in/"
  },
  {
    id: "jute-processing",
    name: "Jute Processing",
    icon: "/images/investments/jute-processing.jpg",
    investment: "₹25-50 Lakhs",
    subsidy: "35% Govt Support",
    roi: "18-24% annually",
    payback: "4-5 years",
    profit: "₹8-18 Lakhs/year",
    description: "Jute mill and diversified jute products",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "Medium",
    applyLink: "https://juteboard.gov.in/"
  },
  {
    id: "sugarcane-crushing",
    name: "Sugarcane Crushing",
    icon: "/images/investments/sugarcane-crushing.jpg",
    investment: "₹50-100 Lakhs",
    subsidy: "30% Govt Support",
    roi: "12-18% annually",
    payback: "6-7 years",
    profit: "₹15-30 Lakhs/year",
    description: "Sugarcane crushing and jaggery production",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "High",
    applyLink: "https://sugarcane.gov.in/"
  },
  {
    id: "palm-oil",
    name: "Palm Oil Processing",
    icon: "/images/investments/palm-oil.jpg",
    investment: "₹30-60 Lakhs",
    subsidy: "35% Govt Support",
    roi: "20-26% annually",
    payback: "4-5 years",
    profit: "₹8-20 Lakhs/year",
    description: "Palm oil extraction and refining unit",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "Very High",
    applyLink: "https://dmer.gov.in/"
  },
  {
    id: "aqua-feed",
    name: "Aquaculture Feed",
    icon: "/images/investments/aqua-feed.jpg",
    investment: "₹20-45 Lakhs",
    subsidy: "35% Govt Support",
    roi: "18-24% annually",
    payback: "4-5 years",
    profit: "₹6-16 Lakhs/year",
    description: "Fish and shrimp feed manufacturing unit",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "High",
    applyLink: "https://dahdf.nic.in/aquaculture"
  },
  {
    id: "cattle-feed",
    name: "Cattle Feed",
    icon: "/images/investments/cattle-feed.jpg",
    investment: "₹15-35 Lakhs",
    subsidy: "35% Govt Support",
    roi: "16-22% annually",
    payback: "4-5 years",
    profit: "₹5-14 Lakhs/year",
    description: "Cattle and livestock feed manufacturing",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "High",
    applyLink: "https://dahdf.nic.in/feed"
  },
  {
    id: "solar-drying",
    name: "Solar Drying",
    icon: "/images/investments/solar-drying.jpg",
    investment: "₹12-30 Lakhs",
    subsidy: "40% Govt Support",
    roi: "20-28% annually",
    payback: "3-4 years",
    profit: "₹4-12 Lakhs/year",
    description: "Solar-based agricultural produce drying",
    category: "Infrastructure",
    riskLevel: "Low",
    marketDemand: "Growing",
    applyLink: "https://mnre.gov.in/solar-drying"
  },
  {
    id: "wind-pump",
    name: "Wind Pumping",
    icon: "/images/investments/wind-pump.jpg",
    investment: "₹8-20 Lakhs",
    subsidy: "45% Govt Support",
    roi: "12-18% annually",
    payback: "5-6 years",
    profit: "₹3-10 Lakhs/year",
    description: "Wind-powered water pumping systems",
    category: "Infrastructure",
    riskLevel: "Medium",
    marketDemand: "Growing",
    applyLink: "https://mnre.gov.in/wind-pumps"
  },
  {
    id: "bamboo",
    name: "Bamboo Processing",
    icon: "/images/investments/bamboo.jpg",
    investment: "₹18-40 Lakhs",
    subsidy: "35% Govt Support",
    roi: "18-24% annually",
    payback: "4-5 years",
    profit: "₹6-16 Lakhs/year",
    description: "Bamboo furniture and handicraft production",
    category: "Processing",
    riskLevel: "Medium",
    marketDemand: "Growing",
    applyLink: "https://nbm.gov.in/"
  },
  {
    id: "medicinal-plants",
    name: "Medicinal Plants",
    icon: "/images/investments/medicinal-plants.jpg",
    investment: "₹15-35 Lakhs",
    subsidy: "40% Govt Support",
    roi: "22-30% annually",
    payback: "3-4 years",
    profit: "₹6-18 Lakhs/year",
    description: "Cultivation and processing of medicinal herbs",
    category: "Production",
    riskLevel: "Medium",
    marketDemand: "Very High",
    applyLink: "https://nmpb.gov.in/"
  },
  {
    id: "aromatic-plants",
    name: "Aromatic Plants",
    icon: "/images/investments/aromatic-plants.jpg",
    investment: "₹12-30 Lakhs",
    subsidy: "35% Govt Support",
    roi: "20-28% annually",
    payback: "3-4 years",
    profit: "₹5-15 Lakhs/year",
    description: "Cultivation and distillation of aromatic crops",
    category: "Production",
    riskLevel: "Medium",
    marketDemand: "Growing",
    applyLink: "https://csir.res.in/"
  },
  {
    id: "sericulture",
    name: "Sericulture",
    icon: "/images/investments/sericulture.jpg",
    investment: "₹20-45 Lakhs",
    subsidy: "35% Govt Support",
    roi: "18-25% annually",
    payback: "4-5 years",
    profit: "₹6-18 Lakhs/year",
    description: "Silk rearing and silk processing unit",
    category: "Production",
    riskLevel: "Medium",
    marketDemand: "High",
    applyLink: "https://csb.gov.in/"
  },
  {
    id: "apiculture",
    name: "Apiculture",
    icon: "/images/investments/apiculture.jpg",
    investment: "₹8-20 Lakhs",
    subsidy: "40% Govt Support",
    roi: "25-35% annually",
    payback: "2-3 years",
    profit: "₹4-12 Lakhs/year",
    description: "Modern beekeeping and honey production",
    category: "Production",
    riskLevel: "Low",
    marketDemand: "Growing",
    applyLink: "https://nbb.gov.in/"
  }
];

const EnhancedInvestments = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [sortBy, setSortBy] = useState<'name' | 'roi' | 'investment'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [selectedInvestment, setSelectedInvestment] = useState<InvestmentUnit | null>(null);

  const filteredAndSortedInvestments = useMemo(() => {
    let investments = [...investmentUnits];
    console.log("Initial investments:", investments); // Log initial investments

    // Apply search filter
    if (searchTerm) {
      investments = investments.filter(investment =>
        investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investment.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      investments = investments.filter(investment => investment.category === categoryFilter);
    }

    // Apply risk filter
    if (riskFilter !== 'all') {
      investments = investments.filter(investment => investment.riskLevel === riskFilter);
    }

    // Apply sorting
    investments.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'roi':
          aValue = parseFloat(a.roi.split('-')[0]);
          bValue = parseFloat(b.roi.split('-')[0]);
          break;
        case 'investment':
          aValue = parseFloat(a.investment.split('-')[0].replace('₹', '').replace(' Lakhs', ''));
          bValue = parseFloat(b.investment.split('-')[0].replace('₹', '').replace(' Lakhs', ''));
          break;
        default:
          aValue = a.name;
          bValue = b.name;
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

    return investments;
  }, [searchTerm, sortBy, sortOrder, categoryFilter, riskFilter]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const renderInvestmentCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAndSortedInvestments.map((investment) => (
        <Card 
          key={investment.id}
          className="cursor-pointer hover-card group transition-all duration-300 hover:shadow-xl border-border/50"
          onClick={() => setSelectedInvestment(investment)}
        >
          <CardContent className="p-6">
            <div className="relative mb-4 overflow-hidden rounded-lg">
              <img 
                src={investment.icon} 
                alt={investment.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/images/investments/default-investment.jpg";
                }}
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-primary/90 backdrop-blur-sm text-white">
                  {investment.category}
                </Badge>
              </div>
              <div className="absolute bottom-3 left-3">
                <Badge 
                  variant="secondary" 
                  className={`backdrop-blur-sm bg-white/90 ${
                    investment.riskLevel === 'Low' ? 'text-green-600' :
                    investment.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}
                >
                  {investment.riskLevel} Risk
                </Badge>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
              {investment.name}
            </h3>
            
            <p className="text-muted-foreground text-sm mb-4">
              {investment.description}
            </p>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Investment:</span>
                <span className="font-semibold text-foreground">{investment.investment}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Govt. Subsidy:</span>
                <span className="font-semibold text-accent">{investment.subsidy}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Annual ROI:</span>
                <span className="font-semibold text-secondary">{investment.roi}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <DollarSign className="h-4 w-4 mx-auto mb-1 text-green-600" />
                <span className="text-xs text-muted-foreground">Payback</span>
                <p className="font-semibold text-green-600 text-sm">{investment.payback}</p>
              </div>
              
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <TrendingUp className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                <span className="text-xs text-muted-foreground">Profit</span>
                <p className="font-semibold text-sm">{investment.profit}</p>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4">
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
        <Search className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No investments found</h3>
      <p className="text-muted-foreground">Try adjusting your search or filters to find more investment opportunities.</p>
    </div>
  );

  const [investmentAmount, setInvestmentAmount] = useState('');
  const [calculatedROI, setCalculatedROI] = useState<number | null>(null);
  const [showROICalculator, setShowROICalculator] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);

  const calculateROI = () => {
    if (!selectedInvestment || !investmentAmount) return;
    
    const investment = parseFloat(investmentAmount.replace(/[^\d.]/g, ''));
    const roiPercentage = parseFloat(selectedInvestment.roi.split('-')[0]);
    const annualReturn = investment * (roiPercentage / 100);
    
    setCalculatedROI(annualReturn);
  };

  const renderInvestmentDetail = () => (
    <div className="glass-card p-6 animate-fade-in-scale max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{selectedInvestment?.icon}</span>
            <div>
              <h3 className="text-xl font-bold text-foreground">{selectedInvestment?.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedInvestment?.description}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setSelectedInvestment(null);
              setShowROICalculator(false);
              setCalculatedROI(null);
              setInvestmentAmount('');
            }}
            className="h-8 w-8 p-0"
          >
            ✕
          </Button>
        </div>

        {/* Investment Metrics - Compact Layout */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <DollarSign className="h-4 w-4 text-orange-400 mx-auto mb-1" />
            <div className="text-xs text-muted-foreground mb-1">Investment</div>
            <div className="text-sm font-bold text-foreground">{selectedInvestment?.investment}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <Building className="h-4 w-4 text-accent mx-auto mb-1" />
            <div className="text-xs text-muted-foreground mb-1">Subsidy</div>
            <div className="text-sm font-bold text-foreground">{selectedInvestment?.subsidy}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <TrendingUp className="h-4 w-4 text-secondary mx-auto mb-1" />
            <div className="text-xs text-muted-foreground mb-1">ROI</div>
            <div className="text-sm font-bold text-secondary">{selectedInvestment?.roi}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <span className="text-sm">⏱️</span>
            <div className="text-xs text-muted-foreground mb-1">Payback</div>
            <div className="text-sm font-bold text-foreground">{selectedInvestment?.payback}</div>
          </div>
        </div>

        {/* Annual Profit - Highlighted with different color */}
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-3 border border-green-400/30">
          <h4 className="text-sm font-semibold text-foreground mb-1">💰 Annual Profit</h4>
          <div className="text-lg font-bold text-green-600">{selectedInvestment?.profit}</div>
          <p className="text-xs text-muted-foreground mt-1">Expected yearly earnings after all expenses</p>
        </div>

        {/* Additional Details - Compact */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-foreground mb-1">Risk Level</h4>
            <div className={`text-sm font-bold ${
              selectedInvestment?.riskLevel === 'Low' ? 'text-green-600' :
              selectedInvestment?.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {selectedInvestment?.riskLevel}
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-foreground mb-1">Market Demand</h4>
            <div className="text-sm font-bold text-secondary">{selectedInvestment?.marketDemand}</div>
          </div>
        </div>

        {/* ROI Calculator */}
        {showROICalculator && (
          <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-200">
            <h4 className="text-sm font-semibold text-foreground mb-3">📊 ROI Calculator</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Investment Amount (₹)</label>
                <Input
                  type="text"
                  placeholder="Enter amount"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="text-sm"
                />
              </div>
              <Button onClick={calculateROI} size="sm" className="w-full">
                Calculate ROI
              </Button>
              {calculatedROI !== null && (
                <div className="text-center p-2 bg-green-100/50 rounded">
                  <p className="text-sm text-muted-foreground">Annual Return:</p>
                  <p className="text-lg font-bold text-green-700">₹{calculatedROI.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Information */}
        {showContactDetails && (
          <div className="bg-purple-50/50 rounded-lg p-4 border border-purple-200">
            <h4 className="text-sm font-semibold text-foreground mb-3">📞 Contact Support</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Toll Free:</span>
                <span className="font-semibold text-foreground">1800-123-4567</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mobile:</span>
                <span className="font-semibold text-foreground">+91-9876543210</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-semibold text-foreground">support@farmsphere.in</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Support Hours:</span>
                <span className="font-semibold text-foreground">24/7</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons - Compact */}
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs"
            onClick={() => setShowROICalculator(!showROICalculator)}
          >
            {showROICalculator ? 'Hide Calculator' : 'ROI Calculator'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs"
            onClick={() => window.open('/business-plan-template.pdf', '_blank')}
          >
            📄 Business Plan
          </Button>
          <Button 
            variant="professional" 
            size="sm" 
            className="flex-1 text-xs"
            onClick={() => setShowContactDetails(!showContactDetails)}
          >
            {showContactDetails ? 'Hide Contact' : '💬 Contact'}
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1 text-xs bg-green-600 hover:bg-green-700"
            onClick={() => window.open(selectedInvestment.applyLink, '_blank')}
          >
            🚀 Apply Now
          </Button>
        </div>
      </div>
    </div>
  );

  const handleBack = () => {
    navigate("/"); // Navigate back to home
    window.scrollTo(0, 0); // Ensure scroll position is reset
  };

  return (
    <section className="section-container bg-gradient-to-br from-background to-muted/30 min-h-screen">
      {/* Back Button */}
      <div className="px-4 pt-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
      <div>
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            🏭 Agro Production Units
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Strategic long-term investments in agricultural processing units with government support and guaranteed returns
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg border">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search investment opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Storage">Storage</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Risk Filter */}
            <div>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger>
                  <span className="text-sm">⚠️</span>
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="Low">Low Risk</SelectItem>
                  <SelectItem value="Medium">Medium Risk</SelectItem>
                  <SelectItem value="High">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Button */}
            <div>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={toggleSortOrder}
              >
                <div className="flex items-center">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <span>
                    {sortBy === 'name' && 'Name'}
                    {sortBy === 'roi' && 'ROI'}
                    {sortBy === 'investment' && 'Investment'}
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
              variant={sortBy === 'name' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('name')}
            >
              Sort by Name
            </Button>
            <Button
              variant={sortBy === 'roi' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('roi')}
            >
              Sort by ROI
            </Button>
            <Button
              variant={sortBy === 'investment' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('investment')}
            >
              Sort by Investment
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {filteredAndSortedInvestments.length} of {investmentUnits.length} investment opportunities
          </p>
          {(searchTerm || categoryFilter !== 'all' || riskFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setRiskFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Investments Grid */}
        <div className="space-y-6">
          {selectedInvestment ? renderInvestmentDetail() : (
            filteredAndSortedInvestments.length > 0 ? renderInvestmentCards() : renderEmptyState()
          )}
        </div>
      </div>

      <style>{`
        .hover-card {
          transition: all 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-4px);
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.3s ease-out;
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
};

export default EnhancedInvestments;

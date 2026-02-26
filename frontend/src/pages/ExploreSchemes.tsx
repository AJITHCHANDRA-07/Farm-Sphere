import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Building, Phone, Mail, Send, ArrowLeft, Loader2, ExternalLink, FileText, Users, DollarSign, Shield, Clock, CheckCircle, AlertCircle, Target, TrendingUp, Gift, FileCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/lib/translations';

interface SchemeData {
  id: number;
  slug: string;
  name: string;
  type: string;
  governingMinistry: string;
  helpdeskNumber: string;
  objective: string;
  benefits: string;
  maxAmount: string;
  interestRate: string;
  targetBeneficiary: string;
  collateral: string;
  statusTracking: string;
  applicationProcess: string;
  documentsRequired: string;
  creditScore: string;
  officialApplyLink: string;
  image: string;
  priorityLevel: number;
  isActive: boolean;
  sources?: string[]; // Optional sources field
}

interface QueryForm {
  name: string;
  email: string;
  phone: string;
  schemeName: string;
  message: string;
}

const ExploreSchemes: React.FC = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  
  // Add fallback for sources to prevent crashes
  const getSchemeWithFallbacks = (scheme: SchemeData) => ({
    ...scheme,
    sources: scheme.sources || []
  });
  
  const [schemes, setSchemes] = useState<SchemeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'ministry'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [ministryFilter, setMinistryFilter] = useState<string>('all');
  const [selectedScheme, setSelectedScheme] = useState<SchemeData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [queryForm, setQueryForm] = useState<QueryForm>({
    name: '',
    email: '',
    phone: '',
    schemeName: '',
    message: ''
  });
  const [isSubmittingQuery, setIsSubmittingQuery] = useState(false);
  const [querySubmitted, setQuerySubmitted] = useState(false);

  // Fetch schemes from API
  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching schemes from API...');
      const response = await fetch('http://192.168.0.3:3001/api/explore-schemes');
      console.log('📡 API Response status:', response.status);
      console.log('📡 API Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch schemes: ${response.status} ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      console.log('📡 Content-Type:', contentType);
      
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.log('📡 Received non-JSON response:', text.substring(0, 200));
        throw new Error('API returned non-JSON response. Check if backend is running correctly.');
      }
      
      const data = await response.json();
      console.log('📊 Received data:', data);
      console.log('📊 Number of schemes:', data.length);
      setSchemes(data);
    } catch (error) {
      console.error('❌ Error fetching schemes:', error);
      // Fallback to empty array if API fails
      setSchemes([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (scheme: SchemeData) => {
    setSelectedScheme(scheme);
    setIsModalOpen(true);
    setQueryForm(prev => ({ ...prev, schemeName: scheme.name }));
    setQuerySubmitted(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedScheme(null);
    setQueryForm({
      name: '',
      email: '',
      phone: '',
      schemeName: '',
      message: ''
    });
    setQuerySubmitted(false);
  };

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingQuery(true);
    
    try {
      const response = await fetch('http://192.168.0.3:3001/api/send-scheme-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queryForm),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit query');
      }
      
      setQuerySubmitted(true);
      // Reset form after successful submission
      setTimeout(() => {
        setQueryForm({
          name: '',
          email: '',
          phone: '',
          schemeName: selectedScheme?.name || '',
          message: ''
        });
        setQuerySubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting query:', error);
    } finally {
      setIsSubmittingQuery(false);
    }
  };

  const getTypeColor = (type: string) => {
    if (type.toLowerCase().includes('credit')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (type.toLowerCase().includes('subsidy')) return 'bg-green-100 text-green-800 border-green-200';
    // ... rest of your code remains the same ...
    if (type.toLowerCase().includes('insurance')) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeBadgeColor = (type: string) => {
    if (type.toLowerCase().includes('credit')) return 'bg-blue-600 hover:bg-blue-700';
    if (type.toLowerCase().includes('subsidy')) return 'bg-green-600 hover:bg-green-700';
    if (type.toLowerCase().includes('insurance')) return 'bg-purple-600 hover:bg-purple-700';
    return 'bg-gray-600 hover:bg-gray-700';
  };

  const filteredAndSortedSchemes = schemes
    .filter(scheme => {
      const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           scheme.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           scheme.governingMinistry.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || scheme.type.toLowerCase().includes(typeFilter);
      const matchesMinistry = ministryFilter === 'all' || scheme.governingMinistry.toLowerCase().includes(ministryFilter);
      return matchesSearch && matchesType && matchesMinistry;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'ministry':
          aValue = a.governingMinistry;
          bValue = b.governingMinistry;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">{t('common.loading')}</h2>
          <p className="text-gray-600 mt-2">Finding the best government schemes for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-black mb-4 tracking-wide">
              🏛️ Explore Government Schemes
            </h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              Comprehensive repository of government schemes, subsidies, and financial assistance programs for farmers and rural communities
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search schemes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="type">Sort by Type</option>
              <option value="ministry">Sort by Ministry</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="credit">Credit/Loans</option>
              <option value="subsidy">Subsidies</option>
              <option value="insurance">Insurance</option>
            </select>

            <select
              value={ministryFilter}
              onChange={(e) => setMinistryFilter(e.target.value)}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Ministries</option>
              <option value="agriculture">Agriculture</option>
              <option value="renewable">Renewable Energy</option>
              <option value="food">Food Processing</option>
              <option value="education">Education</option>
            </select>
          </div>
        </div>

        {/* Scheme Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedSchemes.map((scheme) => (
            <Card 
              key={scheme.slug} 
              className="cursor-pointer hover-card group transition-all duration-300 hover:shadow-xl border-border/50"
              onClick={() => openModal(scheme)}
            >
              <CardContent className="p-6">
                {/* Image Space - Placeholder for future */}
                <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                    <Building className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {scheme.name}
                      </h3>
                      {/* Green label for Governing Ministry/Department */}
                      <p className="text-sm font-bold text-green-600 mt-1 bg-green-50 px-2 py-1 rounded-md inline-block">
                        🏛️ {scheme.governingMinistry}
                      </p>
                    </div>
                    <Badge variant="default" className={getTypeBadgeColor(scheme.type)}>
                      {scheme.type}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      💰 {scheme.maxAmount || 'N/A'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      📞 {scheme.helpdeskNumber}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      🏦 Credit Score: {scheme.creditScore || 'N/A'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Scheme Detail Modal */}
        {selectedScheme && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Modal Header */}
                <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white p-6 rounded-t-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-black mb-2 tracking-wide">
                        {selectedScheme.name}
                      </h2>
                      <p className="text-lg opacity-90 font-medium">🏛️ Government Scheme</p>
                    </div>
                    <Button
                      onClick={closeModal}
                      variant="ghost"
                      className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
                    >
                      ✕
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="procedure">Procedure</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
                          <CardTitle className="text-lg flex items-center gap-2 text-purple-800">
                            <Building className="h-5 w-5 text-purple-600" />
                            Governing Ministry/Department
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="bg-gradient-to-br from-white to-purple-50 rounded-b-lg">
                          <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                            🏛️ {selectedScheme.governingMinistry || 'N/A'}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                          <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                            <Target className="h-5 w-5 text-blue-600" />
                            Objective
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="bg-gradient-to-br from-white to-blue-50 rounded-b-lg">
                          <p className="text-gray-800 leading-relaxed font-medium">
                            {selectedScheme.objective || 'N/A'}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Max Amount/Subsidy
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-bold text-purple-600">
                            💰 {selectedScheme.maxAmount || 'N/A'}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-lg">
                          <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                            <TrendingUp className="h-5 w-5 text-orange-600" />
                            Interest Rate
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="bg-gradient-to-br from-white to-orange-50 rounded-b-lg">
                          <p className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                            📈 {selectedScheme.interestRate || 'N/A'}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Target Beneficiary
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 leading-relaxed">
                            {selectedScheme.targetBeneficiary || 'N/A'}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Collateral
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 leading-relaxed">
                            {selectedScheme.collateral || 'N/A'}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Status Tracking
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 leading-relaxed">
                            {selectedScheme.statusTracking || 'N/A'}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="md:col-span-2">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Gift className="h-5 w-5" />
                            Benefits
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 leading-relaxed">
                            {selectedScheme.benefits || 'N/A'}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Procedure Tab */}
                  <TabsContent value="procedure" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Application Process
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Step-by-Step Process:</h4>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                              {selectedScheme.applicationProcess || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileCheck className="h-5 w-5" />
                          Documents Required
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {selectedScheme.documentsRequired || 'N/A'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Credit Score Requirement
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-bold text-blue-600">
                          📊 {selectedScheme.creditScore || 'N/A'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
                      <CardHeader>
                        <CardTitle className="text-green-800 flex items-center gap-2">
                          <ExternalLink className="h-5 w-5" />
                          Official Application
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-gray-700">
                            Apply directly through the official portal for faster processing and tracking.
                          </p>
                          
                          <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button 
                              onClick={() => window.open(selectedScheme.officialApplyLink, '_blank')}
                              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
                            >
                              🚀 APPLY NOW
                            </Button>
                            <Button 
                              onClick={() => window.open(selectedScheme.officialApplyLink, '_blank')}
                              variant="outline"
                              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-6 rounded-lg"
                            >
                              🌐 VISIT WEBSITE
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Contact Tab */}
                  <TabsContent value="contact" className="space-y-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-blue-800 flex items-center gap-2">
                          <ExternalLink className="h-5 w-5" />
                          Official Resources
                        </CardTitle>
                        <CardTitle className="text-blue-800">📞 Helpdesk Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-white rounded-lg border-2 border-blue-300">
                          <p className="text-2xl font-bold text-blue-600 mb-2">
                            {selectedScheme.helpdeskNumber}
                          </p>
                          <p className="text-sm text-gray-600">Toll-Free Helpline Number</p>
                        </div>
                        
                        <div className="p-4 bg-white rounded-lg border-2 border-green-300">
                          <p className="text-lg font-bold text-green-600 mb-2">
                            🏛️ {selectedScheme.governingMinistry}
                          </p>
                          <p className="text-sm text-gray-600">Governing Ministry/Department</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                      <CardHeader>
                        <CardTitle className="text-purple-800 flex items-center gap-2">
                          <Mail className="h-5 w-5" />
                          Send Query to Officials
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">
                          Have questions about this scheme? Send us your query and we'll forward it to the concerned officials.
                        </p>
                        
                        {!querySubmitted ? (
                          <form onSubmit={handleQuerySubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="name">Your Name *</Label>
                                <Input
                                  id="name"
                                  type="text"
                                  value={queryForm.name}
                                  onChange={(e) => setQueryForm(prev => ({ ...prev, name: e.target.value }))}
                                  placeholder="Enter your full name"
                                  required
                                  className="mt-1"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={queryForm.email}
                                  onChange={(e) => setQueryForm(prev => ({ ...prev, email: e.target.value }))}
                                  placeholder="your.email@example.com"
                                  required
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input
                                id="phone"
                                type="tel"
                                value={queryForm.phone}
                                onChange={(e) => setQueryForm(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="+91 98765 43210"
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="message">Your Query *</Label>
                              <Textarea
                                id="message"
                                value={queryForm.message}
                                onChange={(e) => setQueryForm(prev => ({ ...prev, message: e.target.value }))}
                                placeholder="Describe your query in detail..."
                                rows={4}
                                required
                                className="mt-1"
                              />
                            </div>
                            
                            <div className="flex justify-end">
                              <Button
                                type="submit"
                                disabled={isSubmittingQuery}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold"
                              >
                                {isSubmittingQuery ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Sending...
                                  </>
                                ) : (
                                  <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send Query
                                  </>
                                )}
                              </Button>
                            </div>
                          </form>
                        ) : (
                          <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-green-800 mb-2">
                              Query Submitted Successfully!
                            </h3>
                            <p className="text-gray-600">
                              Your query has been sent to laptap005@gmail.com. We'll get back to you soon.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                      <CardHeader>
                        <CardTitle className="text-purple-800">🌐 Official Resources</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {getSchemeWithFallbacks(selectedScheme).sources.map((source, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                              <span className="text-sm text-gray-700">{source}</span>
                              <Button 
                                onClick={() => window.open(source, '_blank')}
                                size="sm"
                                variant="outline"
                                className="text-purple-600 border-purple-600 hover:bg-purple-50"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        )}

        {filteredAndSortedSchemes.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-primary/60" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {schemes.length === 0 ? 'No schemes available' : 'No schemes found'}
            </h3>
            <p className="text-muted-foreground">
              {schemes.length === 0 
                ? 'Please check your database connection or contact support.'
                : 'Try adjusting your search to find more schemes.'
              }
            </p>
          </div>
        )}
      </div>

      <style>{`
        .hover-card {
          transition: all 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default ExploreSchemes;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const handleSendOtp = () => {
    if (mobileNumber.length === 10) {
      // Simulate OTP sending
      console.log('OTP sent to:', mobileNumber);
      setIsOtpSent(true);
      setShowOtpField(true);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      // Handle auth logic here
      const action = isLoginMode ? 'Login' : 'Signup';
      console.log(`${action} successful with mobile:`, mobileNumber, 'and OTP:', otp);
      setIsAuthOpen(false);
      setMobileNumber('');
      setOtp('');
      setShowOtpField(false);
      setIsOtpSent(false);
      setIsLoginMode(false);
    }
  };

  const handleGoogleAuth = () => {
    // Handle Google auth logic here
    const action = isLoginMode ? 'Login' : 'Signup';
    console.log(`Google ${action} clicked`);
    setIsAuthOpen(false);
    setIsLoginMode(false);
  };

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  ];

  return (
    <>
      <header className="bg-white shadow-lg border-b">
<div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-green-600">
                FarmSphere
              </Link>
            </div>

            {/* Navigation - Centered */}
            <nav className="hidden md:flex space-x-8 mx-auto ml-60">
              <Link to="/" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                About Us
              </Link>
              
              {/* Services Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <span className="mr-1">🌾</span>
                  Services
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Farming Advisory</DropdownMenuItem>
                  <DropdownMenuItem>Weather & Crop Updates</DropdownMenuItem>
                  <DropdownMenuItem>Market Prices</DropdownMenuItem>
                  <DropdownMenuItem>Subsidies & Government Schemes</DropdownMenuItem>
                  <DropdownMenuItem>Loans & Insurance Guidance</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/marketplace" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <span className="mr-1">🛒</span>
                Marketplace
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <span className="mr-1">📞</span>
                Contact
              </Link>
            </nav>

            {/* Right Side Tools */}
            <div className="flex items-center space-x-4">
              {/* Language, Weather, and Notification Group */}
              <div className="flex items-center space-x-4 mr-6">
                {/* Language Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-green-600">
                    <span className="mr-1">🌐</span>
                    <span className="text-sm">{selectedLanguage}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setSelectedLanguage(lang.name)}
                      >
                        {lang.native} ({lang.name})
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Weather Widget */}
                <div className="hidden lg:flex items-center text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-lg">
                  <span className="mr-1">🌦</span>
                  28°C • Sunny
                </div>

                {/* Notification Bell */}
                <button className="text-gray-700 hover:text-green-600 p-2 rounded-lg hover:bg-gray-100 relative">
                  <span className="text-lg">🔔</span>
                  <span className="absolute top-0 right-0 text-xs bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center">3</span>
                </button>
              </div>

              {/* Auth Button - Styled login/signup button */}
              <button 
                onClick={() => {
                  setIsAuthOpen(true);
                  setIsLoginMode(false);
                }}
                className="button-submit mr-8" 
                style={{
                  margin: '0',
                  backgroundColor: '#151717',
                  border: 'none',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderRadius: '10px',
                  height: '40px',
                  padding: '0 20px',
                  cursor: 'pointer'
                }}
              >
                Sign In
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-green-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link to="/" className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">
                  Home
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">
                  About Us
                </Link>
                <div className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">
                  🌾 Services
                </div>
                <Link to="/marketplace" className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">
                  🛒 Marketplace
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">
                  📞 Contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              {isLoginMode ? 'Login to FarmSphere' : 'Join FarmSphere'}
            </DialogTitle>
            <DialogDescription className="text-center">
              {isLoginMode ? 'Welcome back! Sign in to continue' : 'Make it simple with mobile number or Google'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Google Signup Button */}
            <Button 
              onClick={handleGoogleAuth}
              variant="outline" 
              className="w-full flex items-center justify-center gap-3"
              style={{
                backgroundColor: '#4285F4',
                color: 'white',
                border: 'none',
                height: '50px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M12 12.5c0-1.1.9-2 2-2h7c1.1 0 2 .9 2 2v7c0 1.1-.9 2-2 2h-7c-1.1 0-2-.9-2-2v-7z"/>
                <path fill="white" d="M16.5 12.5c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"/>
              </svg>
              {isLoginMode ? 'Login with Google' : 'Sign up with Google'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or {isLoginMode ? 'login' : 'sign up'} with mobile</span>
              </div>
            </div>

            {/* Mobile Signup Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="flex space-x-2">
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                    className="flex-1"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    disabled={isOtpSent}
                  />
                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={mobileNumber.length !== 10 || isOtpSent}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Send OTP
                  </Button>
                </div>
              </div>

              {showOtpField && (
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full"
                    pattern="[0-9]{6}"
                    maxLength={6}
                  />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                style={{
                  height: '50px',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
                disabled={showOtpField && otp.length !== 6}
              >
                {showOtpField ? (isLoginMode ? 'Login' : 'Sign up') : (isLoginMode ? 'Send OTP to Login' : 'Send OTP to Sign up')}
              </Button>
            </form>

            {/* Login option for existing users */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {isLoginMode ? "Don't have an account? " : 'Already have an account? '}
                <button 
                  onClick={() => {
                    setIsLoginMode(!isLoginMode);
                    console.log(`Switched to ${isLoginMode ? 'signup' : 'login'} mode`);
                  }}
                  className="text-green-600 hover:text-green-500 font-medium"
                >
                  {isLoginMode ? 'Sign up' : 'Login'}
                </button>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;

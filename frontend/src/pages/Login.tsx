import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login = () => {
  const handleGoogleLogin = () => {
    // Google login logic will be implemented here
    console.log('Google login clicked');
  };

  const handleMobileLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mobile login logic will be implemented here
    console.log('Mobile login submitted');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 flex items-center justify-center">
                <img 
                  src="https://www.nicepng.com/png/detail/892-8924282_iafere-logo-environment-and-agriculture-logo.png" 
                  alt="FarmSphere Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Welcome to FarmSphere</CardTitle>
            <CardDescription className="text-center">
              Simple login for farmers - just mobile number or Google
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Google Login Button */}
            <Button 
              onClick={handleGoogleLogin}
              variant="outline" 
              className="w-full mb-6"
              style={{
                backgroundColor: '#4285F4',
                color: 'white',
                border: 'none',
                height: '50px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign in with mobile</span>
              </div>
            </div>

            {/* Mobile Login Form */}
            <form onSubmit={handleMobileLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your 10-digit mobile number"
                  required
                  className="w-full"
                  pattern="[0-9]{10}"
                  maxLength={10}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                style={{
                  height: '50px',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                Sign in with Mobile
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-green-600 hover:text-green-500 font-medium">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;

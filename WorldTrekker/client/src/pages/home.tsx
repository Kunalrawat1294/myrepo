import React, { useState } from 'react';
import { Link } from 'wouter';
import { CountryWheel } from '../components/CountryWheel';
import { CountryDisplay } from '../components/CountryDisplay';
import { ReviewForm } from '../components/ReviewForm';
import { ReviewList } from '../components/ReviewList';
import { useCountryData } from '../hooks/useCountryData';
import { useAuth } from '../hooks/useAuth';
import { Country } from '../types/country';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertCircle, Globe, User, LogOut, Settings } from 'lucide-react';

export default function Home() {
  const { data: countries, isLoading, error } = useCountryData();
  const { user, isAuthenticated } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showReviews, setShowReviews] = useState(false);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowReviews(false);
  };

  const handleDiscoverAnother = () => {
    setSelectedCountry(null);
    setShowReviews(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewSubmitted = () => {
    setShowReviews(true);
  };

  const getInitials = (user: any) => {
    const first = user?.firstName?.[0] || "";
    const last = user?.lastName?.[0] || "";
    return (first + last).toUpperCase() || user?.username?.[0]?.toUpperCase() || "U";
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">Error Loading Countries</h1>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              We couldn't load the country data. Please check your internet connection and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="text-3xl text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Explore The World</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block text-sm text-gray-600">Discover. Learn. Explore.</span>
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profileImageUrl || ""} />
                        <AvatarFallback>{getInitials(user)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">
                          {user.firstName || user.lastName 
                            ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                            : user.username || "Explorer"}
                        </p>
                        {user.email && (
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href={`/profile/${user.id}`}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/api/logout'}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => window.location.href = '/api/login'}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Discover Your Next{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
              Adventure
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Spin the wheel and explore fascinating countries from around the globe. Learn about cultures, history, and hidden gems waiting to be discovered.
          </p>
        </section>

        {/* Country Wheel */}
        <CountryWheel
          countries={countries || []}
          onCountrySelect={handleCountrySelect}
          isLoading={isLoading}
        />

        {/* Country Display */}
        {selectedCountry && (
          <>
            <CountryDisplay
              country={selectedCountry}
              onDiscoverAnother={handleDiscoverAnother}
            />
            
            {/* Reviews Section */}
            <div className="mt-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <ReviewForm 
                  country={selectedCountry}
                  onReviewSubmitted={handleReviewSubmitted}
                />
                <ReviewList country={selectedCountry} />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="text-2xl text-blue-400" />
                <h3 className="text-xl font-semibold">Explore The World</h3>
              </div>
              <p className="text-gray-400">
                Discover amazing countries and cultures from around the globe through our interactive exploration tool.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Data Sources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="https://restcountries.com" className="hover:text-white transition-colors">
                    REST Countries API
                  </a>
                </li>
                <li>
                  <a href="https://en.wikipedia.org" className="hover:text-white transition-colors">
                    Wikipedia
                  </a>
                </li>
                <li>
                  <a href="https://unsplash.com" className="hover:text-white transition-colors">
                    Unsplash
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Random Country Discovery</li>
                <li>Cultural Information</li>
                <li>Beautiful Image Galleries</li>
                <li>User Reviews & Profiles</li>
                <li>Interactive Learning</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Explore The World. Educational purposes only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

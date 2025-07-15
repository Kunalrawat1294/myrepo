import React from 'react';
import { Country } from '../types/country';
import { useWikipediaSummary, useCountryImages } from '../hooks/useCountryData';
import { useAIDescriptions } from '../hooks/useAIDescriptions';
import { ImageGallery } from './ImageGallery';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart3, 
  BookOpen, 
  Star, 
  Landmark, 
  Utensils, 
  Palette, 
  Globe, 
  MapPin, 
  Coins, 
  Clock, 
  Phone,
  ExternalLink
} from 'lucide-react';

interface CountryDisplayProps {
  country: Country;
  onDiscoverAnother: () => void;
}

export const CountryDisplay: React.FC<CountryDisplayProps> = ({ 
  country, 
  onDiscoverAnother 
}) => {
  const { data: wikipediaSummary, isLoading: isWikipediaLoading, error: wikipediaError } = 
    useWikipediaSummary(country.name.common);
  
  const { data: aiDescriptions, isLoading: isAILoading, error: aiError } = 
    useAIDescriptions(country.name.common);
  
  const { data: landmarkImages, isLoading: isLandmarksLoading, error: landmarksError } = 
    useCountryImages(country.name.common, 'landmarks');
    
  const { data: foodImages, isLoading: isFoodLoading, error: foodError } = 
    useCountryImages(country.name.common, 'traditional food');
    
  const { data: cultureImages, isLoading: isCultureLoading, error: cultureError } = 
    useCountryImages(country.name.common, 'culture');

  const formatPopulation = (population: number) => {
    if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`;
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(1)}K`;
    }
    return population.toLocaleString();
  };

  const getLanguages = () => {
    if (!country.languages) return 'N/A';
    return Object.values(country.languages).join(', ');
  };

  const getCurrency = () => {
    if (!country.currencies) return 'N/A';
    const currency = Object.values(country.currencies)[0];
    return `${currency.name} (${currency.symbol})`;
  };

  const getCallingCode = () => {
    if (!country.idd.root || !country.idd.suffixes) return 'N/A';
    return `${country.idd.root}${country.idd.suffixes[0]}`;
  };

  const getTimezone = () => {
    return country.timezones[0] || 'N/A';
  };

  return (
    <section className="animate-fade-in">
      {/* Country Header */}
      <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
        <div className="relative h-64 sm:h-80 bg-gradient-to-r from-blue-600 to-emerald-600">
          <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white to-transparent"></div>
          
          <div className="relative h-full flex items-center justify-center text-center text-white p-8">
            <div>
              <div className="mb-4">
                <img 
                  src={country.flags.png} 
                  alt={`${country.name.common} flag`}
                  className="w-24 h-16 mx-auto rounded-lg shadow-lg object-cover"
                />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-2">
                {country.name.common}
              </h2>
              <p className="text-xl opacity-90">{country.region}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Country Data Card */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <BarChart3 className="text-blue-600 text-2xl mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Country Facts</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Capital</span>
                <span className="font-medium text-gray-900">
                  {country.capital?.[0] || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Population</span>
                <span className="font-medium text-gray-900">
                  {formatPopulation(country.population)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Languages</span>
                <span className="font-medium text-gray-900">
                  {getLanguages()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Subregion</span>
                <span className="font-medium text-gray-900">
                  {country.subregion || 'N/A'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <a 
                href={country.maps.googleMaps} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <MapPin className="mr-2 h-4 w-4" />
                View on Google Maps
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Wikipedia Summary Card */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="text-emerald-600 text-2xl mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">About This Country</h3>
            </div>
            
            {isWikipediaLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ) : wikipediaError ? (
              <p className="text-gray-500">Unable to load Wikipedia information</p>
            ) : (
              <div>
                <p className="text-gray-700 leading-relaxed">
                  {wikipediaSummary?.extract || 'No summary available'}
                </p>
                
                {wikipediaSummary?.content_urls.desktop.page && (
                  <div className="mt-4">
                    <a 
                      href={wikipediaSummary.content_urls.desktop.page}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Read more on Wikipedia →
                    </a>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats Card */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Star className="text-amber-500 text-2xl mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Highlights</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Coins className="text-blue-600 mr-2 h-4 w-4" />
                  <span className="font-medium text-gray-900">Currency</span>
                </div>
                <span className="text-gray-700">{getCurrency()}</span>
              </div>
              
              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Clock className="text-emerald-600 mr-2 h-4 w-4" />
                  <span className="font-medium text-gray-900">Timezone</span>
                </div>
                <span className="text-gray-700">{getTimezone()}</span>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Phone className="text-amber-600 mr-2 h-4 w-4" />
                  <span className="font-medium text-gray-900">Calling Code</span>
                </div>
                <span className="text-gray-700">{getCallingCode()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Image Galleries */}
      <div className="mt-12 space-y-8">
        <ImageGallery
          images={landmarkImages || []}
          isLoading={isLandmarksLoading}
          error={landmarksError}
          title="Famous Landmarks"
          icon={<Landmark className="text-blue-600 text-2xl mr-3" />}
          gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          description={aiDescriptions?.landmarks}
          isDescriptionLoading={isAILoading}
        />

        <ImageGallery
          images={foodImages || []}
          isLoading={isFoodLoading}
          error={foodError}
          title="Traditional Cuisine"
          icon={<Utensils className="text-emerald-600 text-2xl mr-3" />}
          gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          description={aiDescriptions?.cuisine}
          isDescriptionLoading={isAILoading}
        />

        <ImageGallery
          images={cultureImages || []}
          isLoading={isCultureLoading}
          error={cultureError}
          title="Cultural Highlights"
          icon={<Palette className="text-purple-600 text-2xl mr-3" />}
          gridCols="grid-cols-1 md:grid-cols-2"
          description={aiDescriptions?.culture}
          isDescriptionLoading={isAILoading}
        />
      </div>

      {/* Discover Another Country Button */}
      <div className="text-center mt-12">
        <Button 
          onClick={onDiscoverAnother}
          className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Globe className="mr-2 h-5 w-5" />
          Discover Another Country
        </Button>
      </div>
    </section>
  );
};

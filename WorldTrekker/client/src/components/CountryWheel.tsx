import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Dice1 } from 'lucide-react';
import { Country } from '../types/country';

interface CountryWheelProps {
  countries: Country[];
  onCountrySelect: (country: Country) => void;
  isLoading?: boolean;
}

export const CountryWheel: React.FC<CountryWheelProps> = ({ 
  countries, 
  onCountrySelect, 
  isLoading = false 
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const spinWheel = () => {
    if (isSpinning || countries.length === 0) return;

    setIsSpinning(true);
    
    // Select random country
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    
    // Calculate rotation (3-8 full rotations plus random angle)
    const spins = 3 + Math.random() * 5;
    const finalRotation = wheelRotation + (360 * spins) + (Math.random() * 360);
    setWheelRotation(finalRotation % 360);

    // Simulate spinning animation
    setTimeout(() => {
      setSelectedCountry(randomCountry);
      onCountrySelect(randomCountry);
      setIsSpinning(false);
    }, 3000);
  };

  const getCountryFlag = (country: Country) => {
    return country.flags.png || country.flags.svg;
  };

  const getCountryEmoji = (countryCode: string) => {
    // Simple emoji mapping for common countries
    const emojiMap: Record<string, string> = {
      'France': '🇫🇷',
      'Japan': '🇯🇵',
      'Brazil': '🇧🇷',
      'Italy': '🇮🇹',
      'Australia': '🇦🇺',
      'Canada': '🇨🇦',
      'Spain': '🇪🇸',
      'South Korea': '🇰🇷',
      'Germany': '🇩🇪',
      'United Kingdom': '🇬🇧',
      'United States': '🇺🇸',
      'China': '🇨🇳',
      'India': '🇮🇳',
      'Mexico': '🇲🇽',
      'Argentina': '🇦🇷',
    };
    return emojiMap[countryCode] || '🌍';
  };

  return (
    <section className="mb-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
        <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8">
          Country Explorer Wheel
        </h3>
        
        {/* Rolling Circle Container */}
        <div className="relative flex justify-center items-center mb-8">
          <div 
            className="w-80 h-80 rounded-full border-8 border-blue-600 bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center relative overflow-hidden transition-transform duration-3000 ease-out"
            style={{ 
              transform: `rotate(${wheelRotation}deg)`,
              transitionDuration: isSpinning ? '3s' : '0.3s'
            }}
          >
            {/* Wheel sections */}
            <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
              <div className="text-center">
                {isSpinning ? (
                  <>
                    <div className="text-6xl mb-2 animate-pulse">🌍</div>
                    <p className="text-lg font-semibold text-gray-700">Spinning...</p>
                  </>
                ) : selectedCountry ? (
                  <>
                    <img 
                      src={getCountryFlag(selectedCountry)} 
                      alt={`${selectedCountry.name.common} flag`}
                      className="w-16 h-12 mx-auto mb-2 rounded object-cover"
                    />
                    <p className="text-lg font-semibold text-gray-700">
                      {selectedCountry.name.common}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-2">🌍</div>
                    <p className="text-lg font-semibold text-gray-700">Click to Spin!</p>
                  </>
                )}
              </div>
            </div>
            
            {/* Wheel pointer */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500 z-10"></div>
          </div>
        </div>

        {/* Spin Button */}
        <div className="text-center">
          <Button 
            onClick={spinWheel}
            disabled={isSpinning || isLoading || countries.length === 0}
            className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {isSpinning ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Spinning...
              </>
            ) : (
              <>
                <Dice1 className="mr-2 h-5 w-5" />
                Spin the Wheel
              </>
            )}
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center mt-6">
            <div className="inline-flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-gray-600">Loading countries...</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

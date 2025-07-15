import { Country, WikipediaSummary, UnsplashImage } from '../types/country';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 
                           'your-unsplash-access-key';

export const apiService = {
  async fetchAllCountries(): Promise<Country[]> {
    try {
      // Use a more reliable endpoint
      const response = await fetch('https://restcountries.com/v3.1/independent?status=true');
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.warn('Failed to fetch independent countries, trying all countries...');
    }

    try {
      // Fallback to a working endpoint with basic data
      const response = await fetch('https://raw.githubusercontent.com/hjonathan/restcountries-json-data/master/res-countries.json');
      if (response.ok) {
        const data = await response.json();
        // Transform the data to match our interface
        return data.map((country: any) => ({
          name: { 
            common: country.name, 
            official: country.officialName || country.name 
          },
          flags: { 
            png: country.flag || `https://flagcdn.com/w320/${country.alpha2Code?.toLowerCase()}.png`,
            svg: country.flag || `https://flagcdn.com/w320/${country.alpha2Code?.toLowerCase()}.png`
          },
          capital: country.capital ? [country.capital] : [],
          region: country.region || '',
          subregion: country.subregion || '',
          population: country.population || 0,
          languages: country.languages ? Object.fromEntries(
            country.languages.map((lang: any, index: number) => [`lang${index}`, lang.name || lang])
          ) : undefined,
          currencies: country.currencies ? Object.fromEntries(
            country.currencies.map((curr: any) => [curr.code, { name: curr.name, symbol: curr.symbol }])
          ) : undefined,
          timezones: country.timezones || [],
          idd: { 
            root: country.callingCodes?.[0] ? `+${country.callingCodes[0]}` : '',
            suffixes: [] 
          },
          maps: { 
            googleMaps: `https://www.google.com/maps/search/${encodeURIComponent(country.name)}` 
          }
        }));
      }
    } catch (error) {
      console.warn('Fallback endpoint also failed');
    }
    
    // As a last resort, use a small set of sample countries to ensure the app works
    console.warn('Using fallback sample countries');
    return [
      {
        name: { common: 'Japan', official: 'Japan' },
        flags: { png: 'https://flagcdn.com/w320/jp.png', svg: 'https://flagcdn.com/w320/jp.png' },
        capital: ['Tokyo'],
        region: 'Asia',
        subregion: 'Eastern Asia',
        population: 125800000,
        languages: { ja: 'Japanese' },
        currencies: { JPY: { name: 'Japanese yen', symbol: '¥' } },
        timezones: ['UTC+09:00'],
        idd: { root: '+81', suffixes: [] },
        maps: { googleMaps: 'https://www.google.com/maps/search/Japan' }
      },
      {
        name: { common: 'France', official: 'French Republic' },
        flags: { png: 'https://flagcdn.com/w320/fr.png', svg: 'https://flagcdn.com/w320/fr.png' },
        capital: ['Paris'],
        region: 'Europe',
        subregion: 'Western Europe',
        population: 67400000,
        languages: { fr: 'French' },
        currencies: { EUR: { name: 'Euro', symbol: '€' } },
        timezones: ['UTC+01:00'],
        idd: { root: '+33', suffixes: [] },
        maps: { googleMaps: 'https://www.google.com/maps/search/France' }
      },
      {
        name: { common: 'Brazil', official: 'Federative Republic of Brazil' },
        flags: { png: 'https://flagcdn.com/w320/br.png', svg: 'https://flagcdn.com/w320/br.png' },
        capital: ['Brasília'],
        region: 'Americas',
        subregion: 'South America',
        population: 215300000,
        languages: { pt: 'Portuguese' },
        currencies: { BRL: { name: 'Brazilian real', symbol: 'R$' } },
        timezones: ['UTC-05:00'],
        idd: { root: '+55', suffixes: [] },
        maps: { googleMaps: 'https://www.google.com/maps/search/Brazil' }
      },
      {
        name: { common: 'Australia', official: 'Commonwealth of Australia' },
        flags: { png: 'https://flagcdn.com/w320/au.png', svg: 'https://flagcdn.com/w320/au.png' },
        capital: ['Canberra'],
        region: 'Oceania',
        subregion: 'Australia and New Zealand',
        population: 25687000,
        languages: { en: 'English' },
        currencies: { AUD: { name: 'Australian dollar', symbol: '$' } },
        timezones: ['UTC+10:00'],
        idd: { root: '+61', suffixes: [] },
        maps: { googleMaps: 'https://www.google.com/maps/search/Australia' }
      },
      {
        name: { common: 'Egypt', official: 'Arab Republic of Egypt' },
        flags: { png: 'https://flagcdn.com/w320/eg.png', svg: 'https://flagcdn.com/w320/eg.png' },
        capital: ['Cairo'],
        region: 'Africa',
        subregion: 'Northern Africa',
        population: 104000000,
        languages: { ar: 'Arabic' },
        currencies: { EGP: { name: 'Egyptian pound', symbol: '£' } },
        timezones: ['UTC+02:00'],
        idd: { root: '+20', suffixes: [] },
        maps: { googleMaps: 'https://www.google.com/maps/search/Egypt' }
      }
    ];
  },

  async fetchWikipediaSummary(countryName: string): Promise<WikipediaSummary> {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(countryName)}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch Wikipedia summary');
    }
    return response.json();
  },

  async fetchUnsplashImages(query: string, perPage: number = 3): Promise<UnsplashImage[]> {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch images from Unsplash');
    }
    const data = await response.json();
    return data.results;
  }
};

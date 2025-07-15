import { Globe, MapPin, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Explore The World</h1>
          </div>
          <Button onClick={() => window.location.href = '/api/login'}>
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Discover Amazing Countries Around the World
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Spin the wheel of discovery and explore random countries with detailed information, 
            stunning images, and AI-generated insights about landmarks, cuisine, and culture.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-4"
            onClick={() => window.location.href = '/api/login'}
          >
            Start Exploring
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Random Discovery</CardTitle>
              <CardDescription>
                Spin our interactive country wheel to discover new destinations you might never have considered
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Rich Information</CardTitle>
              <CardDescription>
                Learn about landmarks, traditional cuisine, and cultural highlights with AI-generated descriptions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Share Experiences</CardTitle>
              <CardDescription>
                Create your profile, leave reviews, and share your travel experiences with other explorers
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* What You'll Discover */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What You'll Discover
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Country Facts</h4>
              <p className="text-gray-600 text-sm">Population, capital, languages, and more</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Famous Landmarks</h4>
              <p className="text-gray-600 text-sm">Stunning images and detailed descriptions</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-semibold mb-2">Traditional Cuisine</h4>
              <p className="text-gray-600 text-sm">Discover authentic dishes and flavors</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Cultural Insights</h4>
              <p className="text-gray-600 text-sm">Learn about traditions and customs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of explorers discovering the world one country at a time
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-4"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Explore The World. Discover. Learn. Share.</p>
        </div>
      </footer>
    </div>
  );
}
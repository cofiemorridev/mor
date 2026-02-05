import { Leaf, Shield, Users, Target } from 'lucide-react';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary-800 mb-4">
          About Coconut Oil Ghana
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We are dedicated to providing the highest quality, 100% natural coconut oil 
          sourced directly from Ghana's finest coconut plantations.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold text-primary-800 mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Founded in 2023, Coconut Oil Ghana started with a simple mission: to bring 
              the purest, most natural coconut oil to households across Ghana and beyond.
            </p>
            <p>
              Our journey began in the heart of Ghana's coconut-growing regions, where 
              we discovered the incredible quality of locally-grown coconuts. We realized 
              that with proper extraction methods and quality control, we could produce 
              coconut oil that rivals the best in the world.
            </p>
            <p>
              Today, we work directly with local farmers, ensuring fair trade practices 
              while maintaining the highest standards of quality from farm to bottle.
            </p>
          </div>
        </div>
        <div className="bg-coconut-light rounded-xl p-8">
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
            <div className="w-full h-64 bg-gradient-to-br from-primary-100 to-coconut-cream flex items-center justify-center rounded-lg">
              <Leaf className="w-24 h-24 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-primary-800 text-center mb-12">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-primary-800 mb-3">Pure & Natural</h3>
            <p className="text-gray-600">
              No additives, preservatives, or artificial ingredients. Just 100% pure coconut oil.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-primary-800 mb-3">Quality Guaranteed</h3>
            <p className="text-gray-600">
              Every batch undergoes rigorous testing to ensure premium quality.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-primary-800 mb-3">Supporting Farmers</h3>
            <p className="text-gray-600">
              We work directly with local farmers, ensuring fair prices and sustainable practices.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-primary-800 mb-3">Customer Focus</h3>
            <p className="text-gray-600">
              Your satisfaction is our priority. We're here to support you every step of the way.
            </p>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-coconut-light rounded-xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-primary-800 text-center mb-8">
          Our Process
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-4">1</div>
            <h3 className="text-xl font-semibold text-primary-800 mb-3">Sourcing</h3>
            <p className="text-gray-700">
              We select only the finest coconuts from trusted local farms.
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-4">2</div>
            <h3 className="text-xl font-semibold text-primary-800 mb-3">Extraction</h3>
            <p className="text-gray-700">
              Cold-pressed extraction preserves all natural nutrients and flavor.
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-4">3</div>
            <h3 className="text-xl font-semibold text-primary-800 mb-3">Packaging</h3>
            <p className="text-gray-700">
              Hygienic, BPA-free packaging ensures freshness and quality.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="text-center bg-primary-800 text-white rounded-xl p-12">
        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
        <p className="text-xl max-w-3xl mx-auto">
          To provide every household with access to premium quality, natural coconut oil 
          while supporting sustainable farming practices and empowering local communities.
        </p>
      </div>
    </div>
  );
}

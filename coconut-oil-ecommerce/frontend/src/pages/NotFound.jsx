import { Link } from 'react-router-dom';
import { Home, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="max-w-md mx-auto">
        {/* 404 Display */}
        <div className="text-9xl font-bold text-primary-600 mb-4">
          404
        </div>
        
        <div className="w-24 h-24 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-primary-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h1>
        
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back to exploring our premium coconut oil products.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary flex items-center justify-center gap-2">
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <Link to="/products" className="btn-outline flex items-center justify-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Browse Products
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-gray-600 mb-4">Or try these pages:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Home', 'Products', 'About', 'Contact', 'Cart'].map((page) => (
              <Link
                key={page}
                to={page === 'Home' ? '/' : `/${page.toLowerCase()}`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                {page}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

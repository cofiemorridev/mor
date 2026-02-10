import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProductAnalytics } from '../../hooks/useAnalytics';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { handleAddToCart } = useProductAnalytics(product);

  const handleAddToCartClick = () => {
    addToCart(product);
    handleAddToCart(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-4xl">🥥</div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-green-600 mb-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description || 'Premium coconut oil'}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xl font-bold text-green-600">
              ₵{product.price?.toFixed(2) || '0.00'}
            </span>
            {product.comparePrice && (
              <span className="text-gray-400 line-through ml-2">
                ₵{product.comparePrice.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.volume || '500ml'}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCartClick}
          disabled={!product.inStock}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            product.inStock
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

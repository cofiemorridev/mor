import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

const ProductCard = ({ product }) => {
  const { useProductAnalytics } = useAnalytics();
  const { handleProductView, handleAddToCart } = useProductAnalytics(product);

  const handleViewClick = () => {
    handleProductView();
    // Navigate to product detail page
    window.location.href = `/products/${product.id}`;
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    handleAddToCart(1);
    // Add to cart logic here
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <div 
      className="product-card bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleViewClick}
    >
      <img 
        src={product.image || '/images/oil-bottle.png'} 
        alt={product.name}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="font-bold text-lg mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-2">{product.shortDescription}</p>
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-green-700">₵{product.price}</span>
        <button
          onClick={handleAddToCartClick}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

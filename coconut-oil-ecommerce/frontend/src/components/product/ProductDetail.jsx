import React, { useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

const ProductDetail = ({ product }) => {
  const { useProductAnalytics, trackEvent } = useAnalytics();
  const { handleProductView, handleAddToCart } = useProductAnalytics(product);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Track product view on component mount
  React.useEffect(() => {
    handleProductView();
    
    // Track engagement time
    const startTime = Date.now();
    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackEvent('product_engagement', 'engagement', product.name, timeSpent);
    };
  }, []);

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
    trackEvent('quantity_change', 'product', product.name, newQuantity);
  };

  const handleAddToCartClick = () => {
    handleAddToCart(quantity);
    trackEvent('add_to_cart_detail', 'ecommerce', product.name, quantity);
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
    trackEvent('product_image_click', 'engagement', \`\${product.name} - Image \${index + 1}\`);
  };

  const handleShare = () => {
    trackEvent('product_share', 'social', product.name);
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: \`Check out \${product.name}!\`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="product-detail max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            <img 
              src={product.images?.[selectedImage] || '/images/oil-bottle.png'} 
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={\`\${product.name} - View \${index + 1}\`}
                  className={\`w-20 h-20 object-cover rounded cursor-pointer border-2 \${selectedImage === index ? 'border-green-600' : 'border-transparent'}\`}
                  onClick={() => handleImageClick(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {'★'.repeat(Math.floor(product.rating || 4))}
              {'☆'.repeat(5 - Math.floor(product.rating || 4))}
            </div>
            <span className="ml-2 text-gray-600">({product.reviewCount || 0} reviews)</span>
          </div>

          <div className="mb-6">
            <div className="text-4xl font-bold text-green-700 mb-2">₵{product.price}</div>
            {product.comparePrice && (
              <div className="text-lg text-gray-500 line-through">₵{product.comparePrice}</div>
            )}
            <div className="text-sm text-gray-600 mt-1">{product.volume || '500ml'}</div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-l-lg flex items-center justify-center"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 h-10 text-center border-t border-b border-gray-300"
                min="1"
                max={product.stockQuantity || 10}
              />
              <button
                onClick={() => handleQuantityChange(1)}
                className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-r-lg flex items-center justify-center"
              >
                +
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {product.stockQuantity ? (
                <span className="text-green-600">{product.stockQuantity} in stock</span>
              ) : (
                <span className="text-red-600">Out of stock</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleAddToCartClick}
              disabled={!product.stockQuantity}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold disabled:bg-gray-400"
            >
              Add to Cart
            </button>
            <button
              onClick={handleShare}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg"
              title="Share product"
            >
              📤
            </button>
          </div>

          {/* Product Details Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <button className="px-4 py-2 font-medium text-gray-700 border-b-2 border-green-600">
                Description
              </button>
            </div>
            <div className="mt-4">
              {product.benefits && product.benefits.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Benefits:</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {product.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Ingredients:</h3>
                  <p className="text-gray-700">{product.ingredients.join(', ')}</p>
                </div>
              )}
              
              {product.usage && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">How to Use:</h3>
                  <p className="text-gray-700">{product.usage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

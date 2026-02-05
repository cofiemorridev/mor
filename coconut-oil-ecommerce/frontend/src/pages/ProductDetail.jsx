import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, Truck, Shield, Leaf } from 'lucide-react';
import { getProductById } from '../api/product.api';
import { useCart } from '../context/CartContext';
import Loader from '../components/common/Loader';
import Toast from '../components/common/Toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [toast, setToast] = useState(null);
  
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProductById(id);
      if (response.success) {
        setProduct(response.data);
      } else {
        navigate('/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = () => {
    if (!product || !product.inStock) {
      showToast('Product is out of stock', 'error');
      return;
    }

    addToCart(product, quantity);
    showToast(`${quantity} × ${product.name} added to cart!`, 'success');
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 10)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Loader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/products')}
          className="btn-primary"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6">
        <ol className="flex items-center space-x-2">
          <li>
            <a href="/" className="hover:text-primary-600">Home</a>
          </li>
          <li>/</li>
          <li>
            <a href="/products" className="hover:text-primary-600">Products</a>
          </li>
          <li>/</li>
          <li className="text-gray-800 font-medium">{product.name}</li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="lg:w-1/2">
          <div className="sticky top-6">
            {/* Main Image */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <img
                src={product.images?.[selectedImage] || '/images/oil-bottle.png'}
                alt={product.name}
                className="w-full h-96 object-contain"
              />
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? 'border-primary-500'
                        : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2">
          {/* Basic Info */}
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-semibold mb-3">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 text-lg mb-4">
              {product.shortDescription || product.description?.substring(0, 100)}
            </p>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-700">
                {product.rating} ({product.reviewCount || 0} reviews)
              </span>
            </div>

            {/* Volume */}
            <div className="mb-6">
              <span className="text-lg font-semibold text-gray-800">
                Size: {product.volume}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-6 p-4 bg-coconut-light rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-primary-800">
                  ₵{product.price.toFixed(2)}
                </div>
                {product.comparePrice && (
                  <div className="text-lg text-gray-500 line-through">
                    ₵{product.comparePrice.toFixed(2)}
                  </div>
                )}
              </div>
              
              {/* Stock Status */}
              <div className="text-right">
                {product.inStock ? (
                  <div className="text-green-600 font-semibold flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    In Stock
                    {product.stockQuantity && (
                      <span className="text-sm text-gray-600">
                        ({product.stockQuantity} available)
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-red-600 font-semibold">
                    Out of Stock
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-16 text-center text-lg font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  disabled={quantity >= (product.stockQuantity || 10)}
                >
                  +
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`btn-primary flex-1 h-12 text-lg font-semibold flex items-center justify-center gap-2 ${
                  !product.inStock ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
            
            {/* Quick Features */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-4 h-4" />
                Free shipping over ₵100
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                100% Quality Guarantee
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mb-8">
            <div className="border-b">
              <div className="flex space-x-8">
                {['description', 'benefits', 'ingredients', 'usage'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 px-1 font-medium transition-colors ${
                      activeTab === tab
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700">{product.description}</p>
                </div>
              )}
              
              {activeTab === 'benefits' && product.benefits && (
                <ul className="space-y-3">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Leaf className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              {activeTab === 'ingredients' && product.ingredients && (
                <div>
                  <p className="text-gray-700 mb-3">This product contains:</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {activeTab === 'usage' && product.usage && (
                <div className="prose max-w-none">
                  <p className="text-gray-700">{product.usage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Home, Package } from 'lucide-react';
import { getOrderById } from '../api/order.api';
import Loader from '../components/common/Loader';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const orderNumber = searchParams.get('order');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) {
        // If no order number, show generic success
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getOrderById(orderNumber);
        
        if (response.success) {
          setOrder(response.data);
        } else {
          setError('Order not found');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <Package className="w-12 h-12 text-red-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Order Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {error}. Please check your order number or contact support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary">
            <Home className="w-5 h-5 mr-2 inline-block" />
            Go Home
          </Link>
          <Link to="/products" className="btn-outline">
            <ShoppingBag className="w-5 h-5 mr-2 inline-block" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-xl text-gray-600">
            Thank you for your order. Your payment has been processed successfully.
          </p>
        </div>

        {/* Order Details */}
        <div className="card mb-8">
          <div className="bg-primary-50 -m-6 mb-6 p-6 rounded-t-xl">
            <h2 className="text-xl font-semibold text-primary-800 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Details
            </h2>
          </div>

          <div className="space-y-6">
            {/* Order Summary */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Order Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {order ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Order Number</p>
                        <p className="font-bold text-lg text-primary-800">
                          {order.orderNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="font-medium">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Status</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          order.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Order Status</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          order.orderStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount</span>
                        <span className="text-primary-800">₵{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-600">Demo order completed successfully!</p>
                    <p className="text-sm text-gray-500 mt-2">
                      In a real implementation, you would see your order details here.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* What's Next */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">What Happens Next?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Order Confirmation</p>
                    <p className="text-gray-600 text-sm">
                      You will receive an email and WhatsApp confirmation within a few minutes.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Processing & Shipping</p>
                    <p className="text-gray-600 text-sm">
                      We'll process your order within 24 hours and ship it to your address.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Delivery</p>
                    <p className="text-gray-600 text-sm">
                      Estimated delivery: 2-5 business days depending on your location.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Need Help?</h4>
              <p className="text-blue-700 text-sm">
                If you have any questions about your order, please contact our support team:
                <br />
                📞 <a href="tel:+233241234567" className="hover:underline">+233 24 123 4567</a>
                <br />
                📧 <a href="mailto:support@coconutoil.com" className="hover:underline">support@coconutoil.com</a>
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/products" className="btn-primary flex items-center justify-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
          <Link to="/" className="btn-outline flex items-center justify-center gap-2">
            <Home className="w-5 h-5" />
            Go to Homepage
          </Link>
        </div>

        {/* Order Tracking Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            We've sent order details to your email. Check your inbox (and spam folder).
          </p>
          <p className="mt-2">
            You can track your order using your order number: 
            <span className="font-mono font-medium text-primary-700 ml-2">
              {order?.orderNumber || 'CO-2024-0001'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

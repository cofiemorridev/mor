import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Shield, Truck, CreditCard, Smartphone, Building } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/order.api';
import { initializePayment, getPaymentChannels } from '../api/payment.api';
import Loader from '../components/common/Loader';
import Toast from '../components/common/Toast';
import PaystackButton, { PaymentStatus } from '../components/checkout/PaystackButton';

export default function Checkout() {
  const { 
    cart, 
    isLoading: cartLoading, 
    clearCart,
    subtotal,
    deliveryFee,
    total
  } = useCart();
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerInfo: {
      name: '',
      email: '',
      phone: '',
      whatsappNumber: ''
    },
    shippingAddress: {
      street: '',
      city: '',
      region: 'Greater Accra',
      zipCode: ''
    },
    paymentMethod: 'mobile_money',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [paymentChannels, setPaymentChannels] = useState([]);
  const [paymentInitialized, setPaymentInitialized] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (!cartLoading && cart.length === 0) {
      navigate('/cart');
    }
    fetchPaymentChannels();
  }, [cart, cartLoading, navigate]);

  const fetchPaymentChannels = async () => {
    try {
      const response = await getPaymentChannels();
      if (response.success) {
        setPaymentChannels(response.data);
      }
    } catch (error) {
      console.error('Error fetching payment channels:', error);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Customer Info validation
    if (!formData.customerInfo.name.trim()) {
      newErrors['customerInfo.name'] = 'Name is required';
    }
    
    if (!formData.customerInfo.email.trim()) {
      newErrors['customerInfo.email'] = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerInfo.email)) {
      newErrors['customerInfo.email'] = 'Invalid email format';
    }
    
    if (!formData.customerInfo.phone.trim()) {
      newErrors['customerInfo.phone'] = 'Phone number is required';
    } else if (!/^0[0-9]{9}$/.test(formData.customerInfo.phone)) {
      newErrors['customerInfo.phone'] = 'Invalid Ghana phone number (e.g., 0241234567)';
    }

    // Shipping Address validation
    if (!formData.shippingAddress.street.trim()) {
      newErrors['shippingAddress.street'] = 'Street address is required';
    }
    
    if (!formData.shippingAddress.city.trim()) {
      newErrors['shippingAddress.city'] = 'City is required';
    }

    // WhatsApp number is optional, but if provided, validate
    if (formData.customerInfo.whatsappNumber && !/^0[0-9]{9}$/.test(formData.customerInfo.whatsappNumber)) {
      newErrors['customerInfo.whatsappNumber'] = 'Invalid Ghana phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateOrder = async () => {
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return null;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        customerInfo: formData.customerInfo,
        shippingAddress: formData.shippingAddress,
        items: cart.map(item => ({
          product: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      // Create order via API
      const response = await createOrder(orderData);
      
      if (response.success) {
        setOrderCreated(true);
        setOrderDetails(response.data);
        showToast('Order created successfully!', 'success');
        return response.data;
      } else {
        showToast(response.message || 'Failed to create order', 'error');
        return null;
      }
    } catch (error) {
      console.error('Order creation error:', error);
      showToast('An error occurred. Please try again.', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleInitializePayment = async () => {
    if (!orderCreated || !orderDetails) {
      const order = await handleCreateOrder();
      if (!order) return;
    }

    setPaymentLoading(true);

    try {
      const paymentRequest = {
        orderId: orderDetails._id,
        orderNumber: orderDetails.orderNumber,
        customerEmail: formData.customerInfo.email,
        amount: total,
        metadata: {
          orderId: orderDetails._id,
          orderNumber: orderDetails.orderNumber,
          customerName: formData.customerInfo.name,
          customerPhone: formData.customerInfo.phone,
          items: cart.map(item => item.name).join(', ')
        },
        callbackUrl: `${window.location.origin}/payment/verify`
      };

      const response = await initializePayment(paymentRequest);
      
      if (response.success) {
        setPaymentInitialized(true);
        setPaymentData(response.data);
        showToast('Payment initialized! Redirecting to Paystack...', 'success');
        
        // Redirect to Paystack
        setTimeout(() => {
          window.location.href = response.data.authorization_url;
        }, 1500);
      } else {
        showToast(response.message || 'Failed to initialize payment', 'error');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleDirectPayment = async () => {
    if (!orderCreated || !orderDetails) {
      const order = await handleCreateOrder();
      if (!order) return;
    }

    // For demo purposes, simulate successful payment
    setPaymentLoading(true);
    
    setTimeout(() => {
      clearCart();
      navigate(`/payment/success?order=${orderDetails.orderNumber}`);
    }, 2000);
  };

  const regions = [
    'Greater Accra', 'Ashanti', 'Western', 'Central', 'Volta',
    'Eastern', 'Northern', 'Upper East', 'Upper West', 'Brong-Ahafo'
  ];

  const paymentMethods = [
    { 
      id: 'mobile_money', 
      label: 'Mobile Money', 
      icon: <Smartphone className="w-5 h-5" />,
      description: 'Pay with MTN, Vodafone, or AirtelTigo Mobile Money'
    },
    { 
      id: 'card', 
      label: 'Credit/Debit Card', 
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Pay with Visa, Mastercard, or Verve cards'
    },
    { 
      id: 'bank_transfer', 
      label: 'Bank Transfer', 
      icon: <Building className="w-5 h-5" />,
      description: 'Transfer directly from your bank account'
    }
  ];

  if (cartLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/cart')}
        className="btn-outline mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </button>

      <h1 className="text-3xl font-bold text-primary-800 mb-2">Checkout</h1>
      <p className="text-gray-600 mb-8">Complete your purchase in a few simple steps</p>

      {paymentInitialized && paymentData ? (
        // Payment Initialized View
        <div className="max-w-2xl mx-auto">
          <PaymentStatus 
            status="success"
            message="Payment initialized successfully! Redirecting to Paystack..."
            reference={paymentData.reference}
          />
          
          <div className="card mt-6">
            <h3 className="font-semibold text-gray-800 mb-4">Payment Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number</span>
                <span className="font-medium">{orderDetails?.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-bold text-primary-800">₵{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium capitalize">{formData.paymentMethod.replace('_', ' ')}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-gray-600 text-sm mb-4">
                If you are not redirected automatically, click the button below:
              </p>
              <a
                href={paymentData.authorization_url}
                className="btn-primary w-full py-3 text-lg font-semibold text-center"
              >
                Continue to Paystack Payment
              </a>
            </div>
          </div>
        </div>
      ) : (
        // Checkout Form View
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Form */}
          <div className="lg:w-2/3">
            {/* Customer Information */}
            <div className="card mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Customer Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Full Name *</label>
                  <input
                    type="text"
                    name="customerInfo.name"
                    value={formData.customerInfo.name}
                    onChange={handleChange}
                    className={`input-field ${errors['customerInfo.name'] ? 'border-red-500' : ''}`}
                    placeholder="John Doe"
                  />
                  {errors['customerInfo.name'] && (
                    <p className="text-red-500 text-sm mt-1">{errors['customerInfo.name']}</p>
                  )}
                </div>

                <div>
                  <label className="input-label">Email Address *</label>
                  <input
                    type="email"
                    name="customerInfo.email"
                    value={formData.customerInfo.email}
                    onChange={handleChange}
                    className={`input-field ${errors['customerInfo.email'] ? 'border-red-500' : ''}`}
                    placeholder="john@example.com"
                  />
                  {errors['customerInfo.email'] && (
                    <p className="text-red-500 text-sm mt-1">{errors['customerInfo.email']}</p>
                  )}
                </div>

                <div>
                  <label className="input-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="customerInfo.phone"
                    value={formData.customerInfo.phone}
                    onChange={handleChange}
                    className={`input-field ${errors['customerInfo.phone'] ? 'border-red-500' : ''}`}
                    placeholder="0241234567"
                  />
                  {errors['customerInfo.phone'] && (
                    <p className="text-red-500 text-sm mt-1">{errors['customerInfo.phone']}</p>
                  )}
                </div>

                <div>
                  <label className="input-label">WhatsApp Number (Optional)</label>
                  <input
                    type="tel"
                    name="customerInfo.whatsappNumber"
                    value={formData.customerInfo.whatsappNumber}
                    onChange={handleChange}
                    className={`input-field ${errors['customerInfo.whatsappNumber'] ? 'border-red-500' : ''}`}
                    placeholder="0241234567"
                  />
                  {errors['customerInfo.whatsappNumber'] && (
                    <p className="text-red-500 text-sm mt-1">{errors['customerInfo.whatsappNumber']}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Shipping Address
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="input-label">Street Address *</label>
                  <input
                    type="text"
                    name="shippingAddress.street"
                    value={formData.shippingAddress.street}
                    onChange={handleChange}
                    className={`input-field ${errors['shippingAddress.street'] ? 'border-red-500' : ''}`}
                    placeholder="123 Main Street"
                  />
                  {errors['shippingAddress.street'] && (
                    <p className="text-red-500 text-sm mt-1">{errors['shippingAddress.street']}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">City *</label>
                    <input
                      type="text"
                      name="shippingAddress.city"
                      value={formData.shippingAddress.city}
                      onChange={handleChange}
                      className={`input-field ${errors['shippingAddress.city'] ? 'border-red-500' : ''}`}
                      placeholder="Accra"
                    />
                    {errors['shippingAddress.city'] && (
                      <p className="text-red-500 text-sm mt-1">{errors['shippingAddress.city']}</p>
                    )}
                  </div>

                  <div>
                    <label className="input-label">Region *</label>
                    <select
                      name="shippingAddress.region"
                      value={formData.shippingAddress.region}
                      onChange={handleChange}
                      className="input-field"
                    >
                      {regions.map(region => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="input-label">ZIP Code (Optional)</label>
                    <input
                      type="text"
                      name="shippingAddress.zipCode"
                      value={formData.shippingAddress.zipCode}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="GA123"
                    />
                  </div>

                  <div>
                    <label className="input-label">Country</label>
                    <input
                      type="text"
                      value="Ghana"
                      className="input-field bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </h2>
              
              <div className="space-y-3">
                {paymentMethods.map(method => (
                  <label
                    key={method.id}
                    className={`flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      formData.paymentMethod === method.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={formData.paymentMethod === method.id}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3 mr-3 mt-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        formData.paymentMethod === method.id
                          ? 'bg-primary-100 text-primary-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {method.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{method.label}</div>
                      <div className="text-sm text-gray-600 mt-1">{method.description}</div>
                    </div>
                    {formData.paymentMethod === method.id && (
                      <div className="ml-auto text-primary-600 font-medium">
                        ✓ Selected
                      </div>
                    )}
                  </label>
                ))}
              </div>

              <div className="mt-6">
                <label className="input-label">Order Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="input-field min-h-[100px]"
                  placeholder="Any special instructions for your order..."
                  rows="4"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="card sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              
              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Items ({cart.length})</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} × ₵{item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="font-semibold text-gray-800">
                        ₵{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Totals */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₵{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">₵{deliveryFee.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-800">₵{total.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Prices include all applicable taxes
                  </p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-center gap-6 text-gray-500">
                  <div className="text-center">
                    <Shield className="w-6 h-6 mx-auto mb-1" />
                    <p className="text-xs">Secure Payment</p>
                  </div>
                  <div className="text-center">
                    <Truck className="w-6 h-6 mx-auto mb-1" />
                    <p className="text-xs">Fast Delivery</p>
                  </div>
                </div>
              </div>

              {/* Payment Buttons */}
              <div className="mt-6 space-y-3">
                {process.env.NODE_ENV === 'development' ? (
                  // Demo payment button for development
                  <button
                    onClick={handleDirectPayment}
                    disabled={paymentLoading}
                    className="btn-primary w-full py-3 text-lg font-semibold flex items-center justify-center gap-2"
                  >
                    {paymentLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing Demo Payment...
                      </>
                    ) : (
                      <>
                        Pay with Demo
                        <span className="ml-auto">₵{total.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                ) : (
                  // Real Paystack payment button for production
                  <button
                    onClick={handleInitializePayment}
                    disabled={paymentLoading}
                    className="btn-primary w-full py-3 text-lg font-semibold flex items-center justify-center gap-2"
                  >
                    {paymentLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Initializing Payment...
                      </>
                    ) : (
                      <>
                        Pay with {formData.paymentMethod === 'mobile_money' ? 'Mobile Money' : 
                                 formData.paymentMethod === 'card' ? 'Card' : 'Bank Transfer'}
                        <span className="ml-auto">₵{total.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                )}

                <p className="text-xs text-center text-gray-500">
                  {formData.paymentMethod === 'mobile_money' && 'You will be redirected to your mobile money app'}
                  {formData.paymentMethod === 'card' && 'Secure card payment powered by Paystack'}
                  {formData.paymentMethod === 'bank_transfer' && 'You will receive bank transfer details'}
                </p>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </form>
      )}

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

import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

const Checkout = () => {
  const { trackPageView, trackEvent, trackCheckoutStep, trackPurchase } = useAnalytics();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    paymentMethod: 'mobile_money'
  });

  useEffect(() => {
    trackPageView('/checkout');
    trackCheckoutStep('checkout_started', 1);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Track form field interaction
    trackEvent('checkout_field_interaction', 'form', field, 1);
  };

  const handleNextStep = () => {
    const currentStep = step;
    const nextStep = step + 1;
    
    // Validate current step
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        trackEvent('checkout_validation_error', 'error', 'missing_contact_info');
        alert('Please fill in all contact information');
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.address || !formData.city || !formData.region) {
        trackEvent('checkout_validation_error', 'error', 'missing_shipping_info');
        alert('Please fill in all shipping information');
        return;
      }
    }
    
    // Track step completion
    trackCheckoutStep(\`step_\${currentStep}_complete\`, currentStep);
    trackCheckoutStep(\`step_\${nextStep}_started\`, nextStep);
    
    setStep(nextStep);
  };

  const handlePrevStep = () => {
    const currentStep = step;
    const prevStep = step - 1;
    
    trackCheckoutStep(\`step_\${currentStep}_back\`, currentStep);
    setStep(prevStep);
  };

  const handlePlaceOrder = () => {
    // Mock order data
    const order = {
      orderNumber: \`ORD-\${Date.now()}\`,
      total: 75.50,
      items: 3,
      customer: formData.name,
      paymentMethod: formData.paymentMethod
    };
    
    // Track purchase
    trackPurchase(order);
    trackCheckoutStep('order_placed', 4);
    trackEvent('order_success', 'ecommerce', order.orderNumber, order.total);
    
    // Track payment method
    trackEvent('payment_method_selected', 'ecommerce', formData.paymentMethod, 1);
    
    // Show success message
    alert(\`Order placed successfully! Your order number is \${order.orderNumber}\`);
    
    // In a real app, this would redirect to payment gateway
    window.location.href = '/payment/success';
  };

  const steps = [
    { number: 1, title: 'Contact Info', icon: '📱' },
    { number: 2, title: 'Shipping', icon: '📦' },
    { number: 3, title: 'Payment', icon: '💳' },
    { number: 4, title: 'Confirmation', icon: '✅' },
  ];

  return (
    <div className="checkout-page max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
      
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((stepItem) => (
            <div key={stepItem.number} className="text-center flex-1">
              <div className={\`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-xl
                \${step >= stepItem.number ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}\`}>
                {stepItem.icon}
              </div>
              <div className="text-sm font-medium">
                Step {stepItem.number}
              </div>
              <div className="text-xs text-gray-500">{stepItem.title}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 h-1 bg-gray-200 relative">
          <div 
            className="absolute top-0 left-0 h-full bg-green-600 transition-all duration-300"
            style={{ width: \`\${((step - 1) / 3) * 100}%\` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Address *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Region *</label>
                  <select
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Region</option>
                    <option value="Greater Accra">Greater Accra</option>
                    <option value="Ashanti">Ashanti</option>
                    <option value="Western">Western</option>
                    <option value="Eastern">Eastern</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              {[
                { id: 'mobile_money', label: 'Mobile Money', icon: '📱', description: 'Pay with MTN, Vodafone, or AirtelTigo' },
                { id: 'card', label: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, or other cards' },
                { id: 'bank_transfer', label: 'Bank Transfer', icon: '🏦', description: 'Direct bank transfer' },
              ].map((method) => (
                <label
                  key={method.id}
                  className={\`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 \${formData.paymentMethod === method.id ? 'border-green-500 bg-green-50' : 'border-gray-300'}\`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={formData.paymentMethod === method.id}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{method.icon}</span>
                    <div>
                      <div className="font-semibold">{method.label}</div>
                      <div className="text-sm text-gray-600">{method.description}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Confirmation</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-2xl mr-3">✅</div>
                <div>
                  <div className="font-semibold text-green-800">Ready to complete your order!</div>
                  <div className="text-green-700">Review your information below</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Items (3)</span>
                  <span>₵65.50</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>₵10.00</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-green-700">₵75.50</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={handlePlaceOrder}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg"
              >
                Place Order & Pay
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          {step > 1 && (
            <button
              onClick={handlePrevStep}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              ← Back
            </button>
          )}
          
          {step < 4 ? (
            <button
              onClick={handleNextStep}
              className="ml-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              Continue →
            </button>
          ) : (
            <div className="ml-auto"></div>
          )}
        </div>
      </div>

      {/* Security Badges */}
      <div className="mt-8 flex justify-center gap-6 text-center">
        <div>
          <div className="text-2xl mb-1">🔒</div>
          <div className="text-xs text-gray-600">256-bit SSL Secure</div>
        </div>
        <div>
          <div className="text-2xl mb-1">🛡️</div>
          <div className="text-xs text-gray-600">Payment Protected</div>
        </div>
        <div>
          <div className="text-2xl mb-1">🏷️</div>
          <div className="text-xs text-gray-600">Best Price Guarantee</div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

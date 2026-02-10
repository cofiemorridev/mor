
import React, { useState } from 'react';import { useCart } from '../context/CartContext';
import { useCheckoutAnalytics } from '../hooks/useAnalytics';

const Checkout = () => {
  const { cartTotal, itemCount, clearCart } = useCart();
  const { handleCheckoutStep, handlePurchase } = useCheckoutAnalytics();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    handleCheckoutStep(step, 'next');
    setStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    handleCheckoutStep(step, 'back');
    setStep(prev => prev - 1);
  };

  const handleSubmitOrder = () => {
    const transactionId = 'TXN_' + Date.now();
    handlePurchase(transactionId, cartTotal);
    handleCheckoutStep(4, 'complete');
    
    // Clear cart and show success
    clearCart();
    alert('Order placed successfully! Thank you for your purchase.');
    window.location.href = '/';
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="text-xl font-bold mb-4">Shipping Information</h3>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="p-3 border rounded-lg"
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="p-3 border rounded-lg"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-xl font-bold mb-4">Payment Method</h3>
            <div className="space-y-3">
              {['card', 'mobile_money', 'cash_on_delivery'].map((method) => (
                <label key={method} className="flex items-center p-3 border rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <span className="capitalize">{method.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-xl font-bold mb-4">Order Review</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-bold mb-2">Order Summary</h4>
              <p>Items: {itemCount}</p>
              <p>Total: ₵{cartTotal.toFixed(2)}</p>
              <p className="mt-2">Shipping to: {formData.address}, {formData.city}</p>
              <p>Payment: {formData.paymentMethod.replace('_', ' ')}</p>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="terms" className="mr-2" required />
              <label htmlFor="terms">I agree to the terms and conditions</label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
      
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= stepNum ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}>
              {stepNum}
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium">
                {stepNum === 1 && 'Shipping'}
                {stepNum === 2 && 'Payment'}
                {stepNum === 3 && 'Review'}
              </div>
            </div>
            {stepNum < 3 && <div className="w-16 h-1 bg-gray-200 mx-2"></div>}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        {step > 1 && (
          <button
            onClick={handlePreviousStep}
            className="px-6 py-3 border rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
        )}
        
        {step < 3 ? (
          <button
            onClick={handleNextStep}
            className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmitOrder}
            className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Place Order
          </button>
        )}
      </div>
    </div>
  );
};

export default Checkout;

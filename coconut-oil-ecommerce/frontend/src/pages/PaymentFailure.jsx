import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, ShoppingBag, Home, RefreshCw, AlertCircle } from 'lucide-react';
import { verifyPayment } from '../api/payment.api';
import Loader from '../components/common/Loader';
import Toast from '../components/common/Toast';

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [retrying, setRetrying] = useState(false);

  const reference = searchParams.get('reference');
  const trxref = searchParams.get('trxref');
  const reason = searchParams.get('reason') || 'Payment was cancelled or failed.';

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      const paymentRef = reference || trxref;
      
      if (!paymentRef) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await verifyPayment(paymentRef);
        
        if (response.success) {
          setPaymentDetails(response.data.payment);
          
          if (response.verified) {
            // If payment is actually successful, redirect to success page
            navigate(`/payment/success?reference=${paymentRef}`);
          }
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        showToast('Failed to verify payment status', 'error');
      } finally {
        setLoading(false);
      }
    };

    verifyPaymentStatus();
  }, [reference, trxref, navigate]);

  const handleRetryPayment = () => {
    // In a real implementation, this would redirect back to the payment page
    // For now, redirect to checkout
    navigate('/checkout');
  };

  const handleContactSupport = () => {
    // You could open a chat widget, email client, or redirect to contact page
    window.location.href = 'mailto:support@coconutoil.com?subject=Payment%20Issue';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Error Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Payment Failed
          </h1>
          <p className="text-xl text-gray-600">
            {reason}
          </p>
        </div>

        {/* Payment Details */}
        {(reference || trxref || paymentDetails) && (
          <div className="card mb-8">
            <div className="bg-red-50 -m-6 mb-6 p-6 rounded-t-xl">
              <h2 className="text-xl font-semibold text-red-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Payment Details
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  {(reference || trxref) && (
                    <div>
                      <p className="text-sm text-gray-600">Reference</p>
                      <p className="font-mono font-medium">
                        {reference || trxref}
                      </p>
                    </div>
                  )}
                  
                  {paymentDetails && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-bold text-lg text-red-800">
                          ₵{paymentDetails.amount?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      
                      {paymentDetails.gateway_response && (
                        <div>
                          <p className="text-sm text-gray-600">Reason</p>
                          <p className="font-medium text-red-700">
                            {paymentDetails.gateway_response}
                          </p>
                        </div>
                      )}
                      
                      {paymentDetails.channel && (
                        <div>
                          <p className="text-sm text-gray-600">Payment Method</p>
                          <p className="font-medium">
                            {paymentDetails.channel === 'mobile_money' ? 'Mobile Money' :
                             paymentDetails.channel === 'card' ? 'Card' : 'Bank Transfer'}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Common Reasons */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Common Reasons for Failure</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Insufficient funds in your account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Incorrect card details or expired card</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Mobile money transaction timeout</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Network issues during payment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Payment was cancelled by you</span>
                  </li>
                </ul>
              </div>

              {/* What to Do Next */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">What to Do Next</h4>
                <ul className="space-y-2 text-blue-700">
                  <li>1. Check your account balance and try again</li>
                  <li>2. Ensure your card details are correct and up-to-date</li>
                  <li>3. Try a different payment method</li>
                  <li>4. Contact your bank or mobile money provider</li>
                  <li>5. Contact our support team for assistance</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRetryPayment}
            disabled={retrying}
            className="btn-primary flex items-center justify-center gap-2"
          >
            {retrying ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Try Again
              </>
            )}
          </button>
          
          <Link to="/" className="btn-outline flex items-center justify-center gap-2">
            <Home className="w-5 h-5" />
            Go to Homepage
          </Link>
          
          <button
            onClick={handleContactSupport}
            className="btn-outline border-red-200 text-red-700 hover:bg-red-50 flex items-center justify-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            Contact Support
          </button>
        </div>

        {/* Alternative Payment Methods */}
        <div className="mt-8 pt-8 border-t">
          <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
            Try a Different Payment Method
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-medium text-gray-800">Mobile Money</h4>
              <p className="text-sm text-gray-600 mt-1">
                MTN, Vodafone, AirtelTigo
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💳</span>
              </div>
              <h4 className="font-medium text-gray-800">Card Payment</h4>
              <p className="text-sm text-gray-600 mt-1">
                Visa, Mastercard, Verve
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏦</span>
              </div>
              <h4 className="font-medium text-gray-800">Bank Transfer</h4>
              <p className="text-sm text-gray-600 mt-1">
                Direct bank transfer
              </p>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            If you continue to experience issues, please contact our support team:
          </p>
          <p className="mt-2">
            📞 <a href="tel:+233241234567" className="text-primary-600 hover:underline">+233 24 123 4567</a>
            &nbsp;|&nbsp;
            📧 <a href="mailto:support@coconutoil.com" className="text-primary-600 hover:underline">support@coconutoil.com</a>
            &nbsp;|&nbsp;
            💬 <a href="https://wa.me/233241234567" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </p>
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

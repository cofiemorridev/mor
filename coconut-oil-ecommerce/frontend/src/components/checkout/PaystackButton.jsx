import { useState, useEffect } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { Loader, CheckCircle, XCircle } from 'lucide-react';

const PaystackButton = ({ 
  amount, 
  email, 
  reference, 
  metadata, 
  publicKey,
  onSuccess, 
  onClose,
  disabled = false,
  buttonText = 'Pay Now'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState({
    reference,
    email,
    amount: amount * 100, // Convert to kobo
    publicKey,
    metadata
  });

  useEffect(() => {
    setConfig({
      reference,
      email,
      amount: amount * 100,
      publicKey,
      metadata
    });
  }, [amount, email, reference, publicKey, metadata]);

  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    
    initializePayment({
      onSuccess: (response) => {
        console.log('Payment successful:', response);
        setIsLoading(false);
        if (onSuccess) onSuccess(response);
      },
      onClose: () => {
        console.log('Payment dialog closed');
        setIsLoading(false);
        if (onClose) onClose();
      }
    });
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || isLoading}
      className={`btn-primary w-full py-3 text-lg font-semibold flex items-center justify-center gap-2 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {isLoading ? (
        <>
          <Loader className="w-5 h-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <span>{buttonText}</span>
          <span className="ml-auto">₵{amount.toFixed(2)}</span>
        </>
      )}
    </button>
  );
};

// Alternative component for manual Paystack integration
export const ManualPaystackButton = ({ 
  authorizationUrl, 
  disabled = false,
  buttonText = 'Continue to Payment'
}) => {
  const handleClick = () => {
    if (authorizationUrl && !disabled) {
      window.location.href = authorizationUrl;
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!authorizationUrl || disabled}
      className={`btn-primary w-full py-3 text-lg font-semibold ${
        !authorizationUrl || disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {buttonText}
    </button>
  );
};

// Payment status display component
export const PaymentStatus = ({ status, message, reference }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-500" />,
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          borderColor: 'border-green-200'
        };
      case 'error':
        return {
          icon: <XCircle className="w-8 h-8 text-red-500" />,
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: <Loader className="w-8 h-8 text-blue-500 animate-spin" />,
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-xl p-6`}>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          {config.icon}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${config.textColor}`}>
            {message}
          </h3>
          {reference && (
            <p className="text-sm text-gray-600 mt-1">
              Reference: <span className="font-mono">{reference}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaystackButton;

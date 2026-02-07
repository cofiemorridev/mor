import { useState } from 'react';
import { 
  Save,
  Bell,
  Shield,
  CreditCard,
  Truck,
  Mail,
  Globe,
  Users,
  FileText
} from 'lucide-react';
import Toast from '../components/common/Toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      storeName: 'Coconut Oil Ghana',
      storeEmail: 'hello@coconutoil.com',
      storePhone: '+233241234567',
      currency: 'GHS',
      timezone: 'Africa/Accra'
    },
    payment: {
      paystackEnabled: true,
      mobileMoneyEnabled: true,
      cardPaymentsEnabled: true,
      bankTransferEnabled: true,
      testMode: true
    },
    shipping: {
      enabled: true,
      freeShippingThreshold: 100,
      deliveryFeeAccra: 15,
      deliveryFeeOther: 25,
      processingTime: '1-2 business days'
    },
    notifications: {
      newOrderEmail: true,
      newOrderWhatsApp: true,
      orderUpdateEmail: true,
      orderUpdateWhatsApp: true,
      paymentConfirmation: true,
      lowStockAlert: true
    }
  });
  const [toast, setToast] = useState(null);

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'legal', label: 'Legal', icon: FileText }
  ];

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    // In a real app, you would save settings to the backend
    showToast('Settings saved successfully!', 'success');
  };

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Store Name</label>
                  <input
                    type="text"
                    value={settings.general.storeName}
                    onChange={(e) => handleChange('general', 'storeName', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Store Email</label>
                  <input
                    type="email"
                    value={settings.general.storeEmail}
                    onChange={(e) => handleChange('general', 'storeEmail', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Store Phone</label>
                  <input
                    type="text"
                    value={settings.general.storePhone}
                    onChange={(e) => handleChange('general', 'storePhone', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Currency</label>
                  <select
                    value={settings.general.currency}
                    onChange={(e) => handleChange('general', 'currency', e.target.value)}
                    className="input-field"
                  >
                    <option value="GHS">Ghana Cedis (GHS)</option>
                    <option value="USD">US Dollar (USD)</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Timezone</label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => handleChange('general', 'timezone', e.target.value)}
                    className="input-field"
                  >
                    <option value="Africa/Accra">Africa/Accra (GMT)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Paystack Integration</p>
                    <p className="text-sm text-gray-600">Credit card and mobile money payments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.payment.paystackEnabled}
                      onChange={(e) => handleChange('payment', 'paystackEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Mobile Money</p>
                    <p className="text-sm text-gray-600">MTN, Vodafone, AirtelTigo</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.payment.mobileMoneyEnabled}
                      onChange={(e) => handleChange('payment', 'mobileMoneyEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Card Payments</p>
                    <p className="text-sm text-gray-600">Visa, Mastercard, Verve</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.payment.cardPaymentsEnabled}
                      onChange={(e) => handleChange('payment', 'cardPaymentsEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Test Mode</p>
                    <p className="text-sm text-gray-600">Use test payment environment</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.payment.testMode}
                      onChange={(e) => handleChange('payment', 'testMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'shipping':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Enable Shipping</p>
                    <p className="text-sm text-gray-600">Allow customers to select shipping</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.shipping.enabled}
                      onChange={(e) => handleChange('shipping', 'enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Free Shipping Threshold (GHS)</label>
                    <input
                      type="number"
                      value={settings.shipping.freeShippingThreshold}
                      onChange={(e) => handleChange('shipping', 'freeShippingThreshold', e.target.value)}
                      className="input-field"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="input-label">Processing Time</label>
                    <input
                      type="text"
                      value={settings.shipping.processingTime}
                      onChange={(e) => handleChange('shipping', 'processingTime', e.target.value)}
                      className="input-field"
                      placeholder="e.g., 1-2 business days"
                    />
                  </div>
                  <div>
                    <label className="input-label">Delivery Fee - Accra (GHS)</label>
                    <input
                      type="number"
                      value={settings.shipping.deliveryFeeAccra}
                      onChange={(e) => handleChange('shipping', 'deliveryFeeAccra', e.target.value)}
                      className="input-field"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="input-label">Delivery Fee - Other Regions (GHS)</label>
                    <input
                      type="number"
                      value={settings.shipping.deliveryFeeOther}
                      onChange={(e) => handleChange('shipping', 'deliveryFeeOther', e.target.value)}
                      className="input-field"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
              <div className="space-y-4">
                {[
                  { key: 'newOrderEmail', label: 'New Order Alert', description: 'Send email when new order is placed' },
                  { key: 'orderUpdateEmail', label: 'Order Status Updates', description: 'Send email when order status changes' },
                  { key: 'paymentConfirmation', label: 'Payment Confirmations', description: 'Send payment confirmation emails' },
                  { key: 'lowStockAlert', label: 'Low Stock Alerts', description: 'Send email when stock is low' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications[item.key]}
                        onChange={(e) => handleChange('notifications', item.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">WhatsApp Notifications</h3>
              <div className="space-y-4">
                {[
                  { key: 'newOrderWhatsApp', label: 'New Order Alert', description: 'Send WhatsApp when new order is placed' },
                  { key: 'orderUpdateWhatsApp', label: 'Order Status Updates', description: 'Send WhatsApp when order status changes' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications[item.key]}
                        onChange={(e) => handleChange('notifications', item.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {(() => {
                const Icon = tabs.find(t => t.id === activeTab)?.icon || Globe;
                return <Icon className="h-16 w-16 mx-auto" />;
              })()}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {tabs.find(t => t.id === activeTab)?.label} Settings
            </h3>
            <p className="text-gray-600">
              This section is under development. Check back soon!
            </p>
          </div>
        );
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Configure your store settings and preferences</p>
          </div>
          <button
            onClick={handleSave}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="h-5 w-5" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-primary-500 text-primary-600 bg-primary-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
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
};

export default Settings;

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag,
  DollarSign,
  Package,
  Download,
  Calendar,
  ChevronDown
} from 'lucide-react';
import Loader from '../components/common/Loader';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setMetrics(generateDemoMetrics());
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const generateDemoMetrics = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueData = months.map(() => Math.floor(Math.random() * 5000) + 1000);
    const ordersData = months.map(() => Math.floor(Math.random() * 100) + 20);
    const customersData = months.map(() => Math.floor(Math.random() * 50) + 10);
    
    return {
      overview: {
        revenue: 45231.50,
        orders: 1248,
        customers: 342,
        averageOrder: 156.42,
        conversionRate: 4.8,
        returningCustomers: 42
      },
      charts: {
        revenue: revenueData,
        orders: ordersData,
        customers: customersData,
        months
      },
      topProducts: [
        { name: 'Pure Coconut Oil (500ml)', sales: 342, revenue: 8550 },
        { name: 'Virgin Coconut Oil (500ml)', sales: 298, revenue: 10430 },
        { name: 'Organic Coconut Oil (1L)', sales: 187, revenue: 7480 },
        { name: 'Coconut Oil Bundle', sales: 156, revenue: 6240 },
        { name: 'Coconut Oil Gift Set', sales: 89, revenue: 4450 }
      ],
      trafficSources: [
        { source: 'Direct', visitors: 1240, percentage: 42 },
        { source: 'Google', visitors: 890, percentage: 30 },
        { source: 'Facebook', visitors: 450, percentage: 15 },
        { source: 'Instagram', visitors: 320, percentage: 11 },
        { source: 'Other', visitors: 100, percentage: 2 }
      ]
    };
  };

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      yellow: 'bg-yellow-50 text-yellow-600'
    };

    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    );
  };

  const ChartBar = ({ value, max, label, color = 'primary' }) => {
    const height = (value / max) * 100;
    const colorClasses = {
      primary: 'bg-primary-600',
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      purple: 'bg-purple-600'
    };

    return (
      <div className="flex flex-col items-center">
        <div className="relative h-32 w-8">
          <div className="absolute bottom-0 w-full bg-gray-200 rounded-t-lg h-full"></div>
          <div 
            className={`absolute bottom-0 w-full ${colorClasses[color]} rounded-t-lg transition-all duration-500`}
            style={{ height: `${height}%` }}
          ></div>
        </div>
        <span className="mt-2 text-xs text-gray-600">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{value}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Track your store performance and insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="quarter">Last 3 months</option>
                <option value="year">Last 12 months</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <button className="btn-outline flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`₵${metrics.overview.revenue.toFixed(2)}`}
          change={12.5}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={metrics.overview.orders}
          change={8.2}
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          title="Total Customers"
          value={metrics.overview.customers}
          change={5.7}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Avg. Order Value"
          value={`₵${metrics.overview.averageOrder.toFixed(2)}`}
          change={3.1}
          icon={Package}
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
              <p className="text-sm text-gray-600">Monthly revenue in Ghana Cedis</p>
            </div>
            <div className="text-sm text-green-600 font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12.5% from last month
            </div>
          </div>
          <div className="flex items-end justify-between h-48 mt-8">
            {metrics.charts.revenue.slice(-6).map((value, index) => (
              <ChartBar
                key={index}
                value={value}
                max={Math.max(...metrics.charts.revenue.slice(-6))}
                label={metrics.charts.months.slice(-6)[index]}
                color="primary"
              />
            ))}
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Orders Overview</h3>
              <p className="text-sm text-gray-600">Monthly order count</p>
            </div>
            <div className="text-sm text-green-600 font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +8.2% from last month
            </div>
          </div>
          <div className="flex items-end justify-between h-48 mt-8">
            {metrics.charts.orders.slice(-6).map((value, index) => (
              <ChartBar
                key={index}
                value={value}
                max={Math.max(...metrics.charts.orders.slice(-6))}
                label={metrics.charts.months.slice(-6)[index]}
                color="blue"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Top Products & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Products</h3>
          <div className="space-y-4">
            {metrics.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₵{product.revenue.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Traffic Sources</h3>
          <div className="space-y-4">
            {metrics.trafficSources.map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{source.source}</span>
                  <span className="text-sm text-gray-600">{source.visitors} visitors ({source.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Conversion Rate</h4>
            <span className="text-green-600 font-medium">+2.1%</span>
          </div>
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center">
              <div className="relative">
                <svg className="h-32 w-32" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="3"
                    strokeDasharray={`${metrics.overview.conversionRate * 10}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {metrics.overview.conversionRate}%
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Visitor to customer conversion</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Returning Customers</h4>
            <span className="text-green-600 font-medium">+5.3%</span>
          </div>
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center">
              <div className="relative">
                <svg className="h-32 w-32" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeDasharray={`${metrics.overview.returningCustomers}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {metrics.overview.returningCustomers}%
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Repeat purchase rate</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900">Recent Activity</h4>
          </div>
          <div className="space-y-3">
            {[
              { action: 'New order placed', user: 'Kwame Asante', time: '10 min ago' },
              { action: 'Product added', user: 'Admin', time: '1 hour ago' },
              { action: 'Customer registered', user: 'Ama Mensah', time: '2 hours ago' },
              { action: 'Payment received', user: 'System', time: '3 hours ago' },
              { action: 'Order shipped', user: 'Admin', time: '5 hours ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-primary-700">
                    {activity.user.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

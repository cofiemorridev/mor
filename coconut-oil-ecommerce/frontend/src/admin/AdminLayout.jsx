import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const { admin, logout } = useAdminAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${sidebarOpen ? 'lg:w-64' : 'lg:w-20'}`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link 
              to="/admin/dashboard" 
              className="flex items-center space-x-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                <span className="text-lg font-bold text-white">🥥</span>
              </div>
              {sidebarOpen && (
                <span className="text-lg font-bold text-gray-900">
                  Admin Panel
                </span>
              )}
            </Link>
            
            {/* Close button (mobile) */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {sidebarOpen && (
                    <>
                      <span className="ml-3">{item.name}</span>
                      {isActive && (
                        <ChevronRight className="ml-auto h-4 w-4 text-primary-500" />
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Admin Profile */}
          <div className="border-t p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="font-semibold text-white">
                  {admin?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              {sidebarOpen && (
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {admin?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {admin?.role === 'super-admin' ? 'Super Admin' : 'Admin'}
                  </p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className={`ml-2 text-gray-400 hover:text-gray-500 ${
                  !sidebarOpen ? 'mx-auto' : ''
                }`}
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex flex-1 flex-col lg:pl-${sidebarOpen ? '64' : '20'}`}>
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-4 text-gray-500 hover:text-gray-700 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden text-gray-500 hover:text-gray-700 lg:block"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Breadcrumb */}
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <div className="flex items-center">
                    <Link to="/admin/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                      Admin
                    </Link>
                  </div>
                </li>
                {navigation
                  .filter(item => location.pathname.startsWith(item.href))
                  .map((item, index) => (
                    <li key={item.name}>
                      <div className="flex items-center">
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span className={`ml-2 text-sm font-medium ${
                          index === 0 ? 'text-primary-600' : 'text-gray-700'
                        }`}>
                          {item.name}
                        </span>
                      </div>
                    </li>
                  ))}
              </ol>
            </nav>
          </div>

          {/* Notifications & Actions */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowLeft, LogOut, User } from 'lucide-react';
import { signOut } from '../lib/auth';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isHomePage = location.pathname === '/';

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-blue-600">
      {/* Top Navigation */}
      <header className="bg-white shadow">
        <div className="mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo in white background */}
              <div className="bg-white p-2 rounded-lg">
                <Logo className="h-10 w-auto" />
              </div>
              
              {!isHomePage && (
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center rounded-lg px-2 py-2 text-gray-600 hover:bg-gray-100"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="hidden md:inline ml-2">Back</span>
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* User Info */}
              {user && (
                <div className="flex items-center gap-2 px-3 py-2 text-gray-600">
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline font-medium">
                    {user.name}
                  </span>
                </div>
              )}

              {/* Dashboard button */}
              <Link
                to="/"
                className="flex items-center rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="hidden md:inline ml-2">Dashboard</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline ml-2">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-4 md:py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
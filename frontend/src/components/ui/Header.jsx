import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';


const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Orders', path: '/order-management', icon: 'ShoppingCart' },
    { label: 'Invoices', path: '/invoice-management', icon: 'FileText' },
    { label: 'Finances', path: '/financial-dashboard', icon: 'DollarSign' },
    { label: 'Profile', path: '/customer-profile', icon: 'User' },
    { label: 'Support', path: '/complaint-management', icon: 'MessageSquare' },
  ];

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('customerId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('isLoggedIn');

    // Show confirmation
    alert('You have been logged out successfully');

    // Redirect to login
    navigate('/login');
  };

  const isActivePath = (path) => {
    return location?.pathname === path || location?.pathname?.startsWith(path + '/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-card shadow-warm-md z-[100] transition-smooth">
        <div className="flex items-center justify-between h-16 px-4 lg:px-8">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-3 transition-smooth hover:opacity-80">
              <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center transition-smooth">
                <Icon name="Utensils" size={24} color="var(--color-primary)" />
              </div>
              <span className="font-heading font-semibold text-xl text-foreground hidden sm:block">
                Veeba Foods
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-md font-body font-medium text-sm
                    transition-smooth hover:bg-muted
                    ${isActivePath(item?.path)
                      ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                    }
                  `}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/notifications-center"
              className="relative p-2 rounded-md hover:bg-muted transition-smooth"
            >
              <Icon name="Bell" size={20} color="var(--color-muted-foreground)" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse-subtle"></span>
            </Link>

            {/* ADD LOGOUT BUTTON - Desktop */}
            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-smooth font-body font-medium text-sm"
              title="Logout"
            >
              <Icon name="LogOut" size={18} />
              <span>Logout</span>
            </button>

            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md hover:bg-muted transition-smooth"
              aria-label="Toggle mobile menu"
            >
              <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={24} color="var(--color-foreground)" />
            </button>
          </div>
        </div>
      </header>
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background z-[90] lg:hidden animate-fade-in"
          onClick={toggleMobileMenu}
        >
          <nav className="fixed top-16 left-0 right-0 bottom-0 bg-card overflow-y-auto animate-slide-in">
            <div className="p-4 space-y-2">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={toggleMobileMenu}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-md font-body font-medium
                    transition-smooth hover:bg-muted
                    ${isActivePath(item?.path)
                      ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                    }
                  `}
                >
                  <Icon name={item?.icon} size={20} />
                  <span>{item?.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
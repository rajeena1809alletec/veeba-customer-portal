import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location?.pathname?.split('/')?.filter((x) => x);

  const breadcrumbNameMap = {
    'dashboard': 'Dashboard',
    'order-management': 'Orders',
    'order-details': 'Order Details',
    'invoice-management': 'Invoices',
    'financial-dashboard': 'Finances',
    'customer-profile': 'Profile',
    'complaint-management': 'Support',
    'notifications-center': 'Notifications',
    'customer-registration': 'Registration',
  };

  if (pathnames?.length === 0 || location?.pathname === '/login') {
    return null;
  }

  return (
    <nav className="flex items-center gap-2 py-4 text-sm font-caption overflow-x-auto scrollbar-custom" aria-label="Breadcrumb">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-smooth"
      >
        <Icon name="Home" size={16} />
        <span className="hidden sm:inline">Home</span>
      </Link>
      {pathnames?.map((value, index) => {
        const to = `/${pathnames?.slice(0, index + 1)?.join('/')}`;
        const isLast = index === pathnames?.length - 1;
        const label = breadcrumbNameMap?.[value] || value?.replace(/-/g, ' ');

        return (
          <React.Fragment key={to}>
            <Icon name="ChevronRight" size={16} color="var(--color-muted-foreground)" />
            {isLast ? (
              <span className="text-foreground font-medium capitalize truncate max-w-[200px] sm:max-w-none">
                {label}
              </span>
            ) : (
              <Link
                to={to}
                className="text-muted-foreground hover:text-foreground transition-smooth capitalize truncate max-w-[150px] sm:max-w-none"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
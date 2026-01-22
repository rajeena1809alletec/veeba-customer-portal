import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import CustomerProfile from './pages/customer-profile';
import Login from './pages/login';
import NotificationsCenter from './pages/notifications-center';
import OrderManagement from './pages/order-management';
import CustomerRegistration from './pages/customer-registration';
import Dashboard from './pages/dashboard';
import InvoiceManagement from './pages/invoice-management';
import ComplaintManagement from './pages/complaint-management';
import FinancialDashboard from './pages/financial-dashboard';
import OrderDetails from './pages/order-details';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Login />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notifications-center" element={<NotificationsCenter />} />
        <Route path="/order-management" element={<OrderManagement />} />
        <Route path="/customer-registration" element={<CustomerRegistration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/invoice-management" element={<InvoiceManagement />} />
        <Route path="/complaint-management" element={<ComplaintManagement />} />
        <Route path="/financial-dashboard" element={<FinancialDashboard />} />
        <Route path="/order-details" element={<OrderDetails />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;

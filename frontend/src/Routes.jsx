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
import DispatchDetails from "pages/dispatch-details";

// ── Salesperson Pages ────────────────────────────────────────
import SPDashboard from './pages-salesperson/dashboard';
import SPCustomerProfile from './pages-salesperson/customer-profile';
import SPNotificationsCenter from './pages-salesperson/notifications-center';
import SPOrderManagement from './pages-salesperson/order-management';
import SPInvoiceManagement from './pages-salesperson/invoice-management';
import SPComplaintManagement from './pages-salesperson/complaint-management';
import SPFinancialDashboard from './pages-salesperson/financial-dashboard';
import SPOrderDetails from './pages-salesperson/order-details';
import SPDispatchDetails from './pages-salesperson/dispatch-details';
import SPCustomers from "pages-salesperson/customers";
import SPCustomerFinancialEntries from "pages-salesperson/customer-financial-entries";
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
          <Route path="/dispatch-details" element={<DispatchDetails />} />

          {/* ── Salesperson Routes ───────────────────────── */}
          <Route path="/sp-dashboard" element={<SPDashboard />} />
          <Route path="/sp-customer-profile" element={<SPCustomerProfile />} />
          <Route path="/sp-notifications-center" element={<SPNotificationsCenter />} />
          <Route path="/sp-order-management" element={<SPOrderManagement />} />
          <Route path="/sp-invoice-management" element={<SPInvoiceManagement />} />
          <Route path="/sp-complaint-management" element={<SPComplaintManagement />} />
          <Route path="/sp-financial-dashboard" element={<SPFinancialDashboard />} />
          <Route path="/sp-order-details" element={<SPOrderDetails />} />
          <Route path="/sp-dispatch-details" element={<SPDispatchDetails />} />
          <Route path="/sp-customers" element={<SPCustomers />} />
          <Route path="/sp-customer-financial-entries" element={<SPCustomerFinancialEntries />} />

          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;

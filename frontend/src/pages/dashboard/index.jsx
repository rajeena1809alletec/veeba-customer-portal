import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionsPanel from '../../components/ui/QuickActionsPanel';
import WelcomeBanner from './components/WelcomeBanner';
import MetricCard from './components/MetricCard';
import RecentActivitiesFeed from './components/RecentActivitiesFeed';
import UrgentNotificationsPanel from './components/UrgentNotificationsPanel';
import { getCustomerByCustomerId } from 'services/BusinessCentralAPI';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => { // CHANGED TO async
      try {
        // Get customerId from localStorage
        const customerId = localStorage.getItem('customerId');

        if (!customerId) {
          console.error('Customer ID not found');
          navigate('/login');
          return;
        }

        // Fetch customer data from BC API
        const result = await getCustomerByCustomerId(customerId);

        let customerName = 'Guest User';
        let companyName = 'N/A';
        let outstandingBalance = '₹0';

        if (result.success) {
          const customerData = result.data;
          console.log('Customer data fetched for dashboard:', customerData);

          // Use the name from API
          customerName = customerData.contactName || 'Guest User';
          companyName = customerData.name || 'N/A';
          const balanceLCY = customerData.balanceLCY || 0;
          outstandingBalance = `₹${balanceLCY.toLocaleString('en-IN')}`;
        } else {
          console.error('Failed to fetch customer data:', result.error);
        }

        setTimeout(() => {
          const mockData = {
            customer: {
              name: customerName, 
              companyName: companyName, 
              lastLogin: new Date(Date.now() - 7200000)?.toISOString(),
            },
            metrics: [
              {
                id: 1,
                title: "Outstanding Balance",
                value: outstandingBalance,
                subtitle: "As of 07/01/2026",
                icon: "DollarSign",
                iconColor: "var(--color-error)",
                bgColor: "bg-error/10",
                trend: "up",
                trendValue: "8.5% from last month",
                navigateTo: "/financial-dashboard",
              },
              {
                id: 2,
                title: "Credit Limit Utilization",
                value: "62.3%",
                subtitle: "₹12,45,680 of ₹20,00,000",
                icon: "TrendingUp",
                iconColor: "var(--color-warning)",
                bgColor: "bg-warning/10",
                trend: "up",
                trendValue: "5.2% increase",
                navigateTo: "/financial-dashboard",
              },
              {
                id: 3,
                title: "Pending Orders",
                value: "8",
                subtitle: "Total value: ₹3,45,200",
                icon: "ShoppingCart",
                iconColor: "var(--color-primary)",
                bgColor: "bg-primary/10",
                trend: "down",
                trendValue: "2 less than yesterday",
                navigateTo: "/order-management",
              },
              {
                id: 4,
                title: "Recent Invoices",
                value: "₹8,92,450",
                subtitle: "Last 30 days",
                icon: "FileText",
                iconColor: "var(--color-accent)",
                bgColor: "bg-accent/10",
                trend: "up",
                trendValue: "12% increase",
                navigateTo: "/invoice-management",
              },
            ],
            recentActivities: [
              {
                id: 1,
                type: "order",
                title: "Order #ORD-2026-00847 Confirmed",
                description: "Your order for Veeba Mayonnaise (50 cases) has been confirmed and is being processed",
                status: "processing",
                timestamp: new Date(Date.now() - 1800000)?.toISOString(),
                details: {
                  orderNumber: "ORD-2026-00847",
                  totalAmount: "₹1,24,500",
                  items: "3 products",
                  expectedDelivery: "10/01/2026",
                },
              },
              {
                id: 2,
                type: "dispatch",
                title: "Order #ORD-2026-00832 Dispatched",
                description: "Your order has been dispatched via Blue Dart. Expected delivery by 08/01/2026",
                status: "dispatched",
                timestamp: new Date(Date.now() - 3600000)?.toISOString(),
                details: {
                  orderNumber: "ORD-2026-00832",
                  trackingNumber: "BD123456789IN",
                  carrier: "Blue Dart",
                  dispatchDate: "07/01/2026",
                },
              },
              {
                id: 3,
                type: "payment",
                title: "Payment Received - ₹5,67,890",
                description: "Payment for Invoice #INV-2025-12-1234 has been successfully processed",
                status: "completed",
                timestamp: new Date(Date.now() - 7200000)?.toISOString(),
                details: {
                  invoiceNumber: "INV-2025-12-1234",
                  amount: "₹5,67,890",
                  paymentMode: "NEFT",
                  transactionId: "NEFT2026010712345",
                },
              },
              {
                id: 4,
                type: "invoice",
                title: "New Invoice Generated - INV-2026-01-0089",
                description: "Invoice for Order #ORD-2026-00821 is now available for download",
                status: "pending",
                timestamp: new Date(Date.now() - 10800000)?.toISOString(),
                details: {
                  invoiceNumber: "INV-2026-01-0089",
                  orderNumber: "ORD-2026-00821",
                  amount: "₹2,34,560",
                  dueDate: "21/01/2026",
                },
              },
              {
                id: 5,
                type: "notification",
                title: "New Scheme Announcement",
                description: "Special discount scheme on Veeba Sauces range - Valid till 31/01/2026",
                status: "completed",
                timestamp: new Date(Date.now() - 14400000)?.toISOString(),
                details: {
                  schemeCode: "SCH-JAN-2026",
                  discount: "15% off",
                  validTill: "31/01/2026",
                  applicableProducts: "All Veeba Sauces",
                },
              },
              {
                id: 6,
                type: "complaint",
                title: "Complaint #CMP-2026-00234 Resolved",
                description: "Your complaint regarding product shortage has been resolved with credit note issued",
                status: "completed",
                timestamp: new Date(Date.now() - 18000000)?.toISOString(),
                details: {
                  complaintNumber: "CMP-2026-00234",
                  resolution: "Credit Note Issued",
                  creditNoteNumber: "CN-2026-00156",
                  amount: "₹12,450",
                },
              },
              {
                id: 7,
                type: "order",
                title: "Order #ORD-2026-00821 Delivered",
                description: "Your order has been successfully delivered and signed by authorized person",
                status: "completed",
                timestamp: new Date(Date.now() - 86400000)?.toISOString(),
                details: {
                  orderNumber: "ORD-2026-00821",
                  deliveryDate: "06/01/2026",
                  receivedBy: "Ramesh Singh",
                  deliveryTime: "02:45 PM",
                },
              },
              {
                id: 8,
                type: "payment",
                title: "Payment Reminder - ₹3,45,670",
                description: "Invoice #INV-2025-12-1189 payment is due on 10/01/2026",
                status: "pending",
                timestamp: new Date(Date.now() - 172800000)?.toISOString(),
                details: {
                  invoiceNumber: "INV-2025-12-1189",
                  amount: "₹3,45,670",
                  dueDate: "10/01/2026",
                  daysRemaining: "3 days",
                },
              },
            ],
            urgentNotifications: [
              {
                id: 1,
                title: "Payment Due - Invoice #INV-2025-12-1189",
                message: "Payment of ₹3,45,670 is due on 10/01/2026. Please process payment to avoid late fees",
                priority: "high",
                dueDate: "2026-01-10",
                actionLabel: "View Invoice",
                actionPath: "/invoice-management",
              },
              {
                id: 2,
                title: "Credit Limit Alert",
                message: "You have utilized 62.3% of your credit limit. Consider clearing pending dues to maintain smooth operations",
                priority: "medium",
                actionLabel: "View Financial Dashboard",
                actionPath: "/financial-dashboard",
              },
              {
                id: 3,
                title: "New Scheme Available",
                message: "Special discount scheme on Veeba Sauces range - 15% off valid till 31/01/2026",
                priority: "low",
                dueDate: "2026-01-31",
                actionLabel: "View Details",
                actionPath: "/notifications-center",
              },
              {
                id: 4,
                title: "Order Confirmation Pending",
                message: "Order #ORD-2026-00847 requires your confirmation. Please review and confirm to proceed with processing",
                priority: "medium",
                actionLabel: "View Order",
                actionPath: "/order-management",
              },
            ],
          };

          setDashboardData(mockData);
          setLoading(false);
        }, 300); // Reduced timeout since we already have API delay

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background pt-16">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-caption text-muted-foreground">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Veeba Customer Portal</title>
        <meta name="description" content="View your account overview, recent activities, and key business metrics on Veeba Foods customer portal dashboard" />
      </Helmet>
      <Header />
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6">
          <Breadcrumb />

          <div className="space-y-6">
            <WelcomeBanner
              customerName={dashboardData?.customer?.name}
              lastLogin={dashboardData?.customer?.lastLogin}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {dashboardData?.metrics?.map((metric) => (
                <MetricCard key={metric?.id} {...metric} />
              ))}
            </div>

            <QuickActionsPanel />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentActivitiesFeed activities={dashboardData?.recentActivities} />
              </div>

              <div className="lg:col-span-1">
                <UrgentNotificationsPanel notifications={dashboardData?.urgentNotifications} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
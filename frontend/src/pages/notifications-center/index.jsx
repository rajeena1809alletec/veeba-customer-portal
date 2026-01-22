import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import NotificationCard from './components/NotificationCard';
import NotificationFilters from './components/NotificationFilters';
import NotificationStats from './components/NotificationStats';
import NotificationDetailModal from './components/NotificationDetailModal';
import NotificationPreferences from './components/NotificationPreferences';
import BulkActionsBar from './components/BulkActionsBar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const NotificationsCenter = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    priority: 'all',
    dateRange: 'all',
    searchQuery: '',
    customStartDate: '',
    customEndDate: ''
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    orderConfirmation: true,
    orderDispatch: true,
    orderDelivery: true,
    paymentDue: true,
    paymentReceived: true,
    invoiceGenerated: true,
    newSchemes: true,
    promotionalOffers: false,
    freeGoods: true,
    systemUpdates: true,
    announcements: true,
    rateRevisions: true
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      sender: 'Order Management System',
      subject: 'Order #ORD-2026-00145 Confirmed',
      preview: 'Your order for Veeba Mayonnaise (50 units) and Veeba Sandwich Spread (30 units) has been confirmed and is being processed.',
      fullContent: `Dear Valued Customer,\n\nYour order #ORD-2026-00145 has been successfully confirmed and is now being processed by our warehouse team.\n\nOrder Details:\n• Veeba Mayonnaise Eggless 250g - 50 units\n• Veeba Sandwich Spread 280g - 30 units\n• Total Amount: ₹45,750.00\n• Expected Dispatch: 08/01/2026\n• Estimated Delivery: 10/01/2026\n\nYou will receive another notification once your order is dispatched with tracking details.\n\nThank you for choosing Veeba Foods!`,
      timestamp: new Date('2026-01-07T04:30:00'),
      isRead: false,
      priority: 'high',
      attachments: [
        { name: 'Order_Confirmation_ORD-2026-00145.pdf', size: '245 KB' }
      ],
      actionLink: '/order-details/ORD-2026-00145',
      actionText: 'View Order Details'
    },
    {
      id: 2,
      type: 'payment',
      sender: 'Finance Department',
      subject: 'Payment Due Reminder - Invoice #INV-2025-12890',
      preview: 'This is a friendly reminder that payment for Invoice #INV-2025-12890 amounting to ₹1,25,450.00 is due on 10/01/2026.',
      fullContent: `Dear Customer,\n\nThis is a friendly reminder regarding the upcoming payment due date for Invoice #INV-2025-12890.\n\nInvoice Details:\n• Invoice Number: INV-2025-12890\n• Invoice Date: 25/12/2025\n• Amount: ₹1,25,450.00\n• Due Date: 10/01/2026\n• Days Remaining: 3 days\n\nTo avoid any late payment charges, please ensure timely payment through your preferred payment method.\n\nYou can make payment directly through the portal or contact our finance team for assistance.\n\nThank you for your prompt attention to this matter.`,
      timestamp: new Date('2026-01-07T03:15:00'),
      isRead: false,
      priority: 'high',
      attachments: [
        { name: 'Invoice_INV-2025-12890.pdf', size: '189 KB' }
      ],
      actionLink: '/invoice-management',
      actionText: 'Pay Now'
    },
    {
      id: 3,
      type: 'scheme',
      sender: 'Sales & Marketing Team',
      subject: 'New Year Special Scheme - Extra 10% Discount',
      preview: 'Celebrate the New Year with Veeba! Get an extra 10% discount on bulk orders of Mayonnaise and Sandwich Spreads.',
      fullContent: `Dear Valued Partner,\n\nWe are excited to announce our New Year Special Scheme exclusively for our B2B customers!\n\nScheme Details:\n• Extra 10% discount on all Mayonnaise variants\n• Extra 10% discount on all Sandwich Spread variants\n• Minimum order quantity: 100 units per SKU\n• Valid from: 07/01/2026 to 31/01/2026\n• Free goods: 1 unit free for every 20 units purchased\n\nAdditional Benefits:\n• Extended credit period of 45 days\n• Free delivery on orders above ₹50,000\n• Priority dispatch within 24 hours\n\nThis is a limited-time offer. Place your orders now to maximize your benefits!\n\nFor more details or to place an order, please contact your dedicated sales representative or use our online ordering system.`,
      timestamp: new Date('2026-01-07T02:00:00'),
      isRead: true,
      priority: 'medium',
      attachments: [
        { name: 'New_Year_Scheme_Details.pdf', size: '512 KB' },
        { name: 'Product_Catalog_2026.pdf', size: '2.1 MB' }
      ],
      actionLink: '/order-management',
      actionText: 'Place Order Now'
    },
    {
      id: 4,
      type: 'dispatch',
      sender: 'Logistics Department',
      subject: 'Order #ORD-2026-00132 Dispatched',
      preview: 'Your order has been dispatched and is on its way. Track your shipment using tracking number: VB2026010700132.',
      fullContent: `Dear Customer,\n\nGreat news! Your order #ORD-2026-00132 has been dispatched from our warehouse.\n\nDispatch Details:\n• Order Number: ORD-2026-00132\n• Dispatch Date: 07/01/2026\n• Tracking Number: VB2026010700132\n• Carrier: Blue Dart Express\n• Expected Delivery: 09/01/2026\n• Delivery Address: Shop No. 45, MG Road, Bangalore - 560001\n\nYou can track your shipment in real-time using the tracking number provided.\n\nDelivery Instructions:\n• Please ensure someone is available to receive the delivery\n• Valid ID proof will be required\n• Inspect the package for any damage before accepting\n\nIf you have any questions or concerns, please contact our customer support team.`,
      timestamp: new Date('2026-01-07T01:45:00'),
      isRead: false,
      priority: 'medium',
      attachments: [
        { name: 'Delivery_Challan_ORD-2026-00132.pdf', size: '156 KB' }
      ],
      actionLink: '/order-details/ORD-2026-00132',
      actionText: 'Track Shipment'
    },
    {
      id: 5,
      type: 'announcement',
      sender: 'Veeba Foods Management',
      subject: 'Rate Revision Notification - Effective 15/01/2026',
      preview: 'Important: Price revision for select products effective from 15th January 2026 due to increased raw material costs.',
      fullContent: `Dear Valued Business Partner,\n\nWe hope this message finds you well. We are writing to inform you about an upcoming price revision for select products in our portfolio.\n\nRevision Details:\n• Effective Date: 15/01/2026\n• Average Price Increase: 3-5%\n• Affected Categories: Mayonnaise, Sandwich Spreads, Pasta Sauces\n\nReason for Revision:\nDue to the significant increase in raw material costs, packaging materials, and logistics expenses, we are compelled to revise our prices to maintain the quality standards you expect from Veeba Foods.\n\nYour Benefits:\n• Orders placed before 14/01/2026 will be billed at current rates\n• Extended credit terms for bulk orders\n• Special loyalty discounts for long-term partners\n\nWe value your partnership and remain committed to providing you with the best quality products and services.\n\nFor detailed price lists and any clarifications, please contact your sales representative.\n\nThank you for your continued support and understanding.`,
      timestamp: new Date('2026-01-06T16:30:00'),
      isRead: true,
      priority: 'high',
      attachments: [
        { name: 'Revised_Price_List_Jan2026.pdf', size: '423 KB' }
      ],
      actionLink: null,
      actionText: null
    },
    {
      id: 6,
      type: 'invoice',
      sender: 'Billing Department',
      subject: 'Invoice Generated - INV-2026-00089',
      preview: 'New invoice INV-2026-00089 for ₹78,950.00 has been generated for your recent order.',
      fullContent: `Dear Customer,\n\nA new invoice has been generated for your order.\n\nInvoice Details:\n• Invoice Number: INV-2026-00089\n• Invoice Date: 06/01/2026\n• Order Reference: ORD-2026-00132\n• Total Amount: ₹78,950.00\n• GST (18%): ₹14,211.00\n• Grand Total: ₹93,161.00\n• Payment Terms: Net 30 Days\n• Due Date: 05/02/2026\n\nPayment Methods Available:\n• Online Payment through Portal\n• NEFT/RTGS Transfer\n• Cheque Payment\n\nPlease download the invoice from the attachment or access it through your account dashboard.\n\nFor any billing queries, please contact our finance team.`,
      timestamp: new Date('2026-01-06T14:20:00'),
      isRead: true,
      priority: 'medium',
      attachments: [
        { name: 'Invoice_INV-2026-00089.pdf', size: '198 KB' }
      ],
      actionLink: '/invoice-management',
      actionText: 'View Invoice'
    },
    {
      id: 7,
      type: 'system',
      sender: 'System Administrator',
      subject: 'Scheduled Maintenance - 08/01/2026',
      preview: 'The customer portal will undergo scheduled maintenance on 08/01/2026 from 02:00 AM to 04:00 AM IST.',
      fullContent: `Dear Users,\n\nWe would like to inform you about a scheduled system maintenance activity.\n\nMaintenance Details:\n• Date: 08/01/2026\n• Time: 02:00 AM - 04:00 AM IST\n• Duration: Approximately 2 hours\n• Services Affected: Customer Portal, Order Management, Payment Gateway\n\nPurpose:\n• System upgrades and performance improvements\n• Security patches and updates\n• Database optimization\n\nWhat to Expect:\n• The portal will be temporarily unavailable during this period\n• Any ongoing transactions will be saved and can be resumed after maintenance\n• Mobile app will also be affected\n\nWe recommend:\n• Complete any urgent transactions before 02:00 AM on 08/01/2026\n• Download any required documents in advance\n• Plan your orders accordingly\n\nWe apologize for any inconvenience this may cause and appreciate your patience and understanding.\n\nFor urgent matters during maintenance, please contact our 24/7 helpline: 1800-XXX-XXXX`,
      timestamp: new Date('2026-01-06T11:00:00'),
      isRead: false,
      priority: 'medium',
      attachments: [],
      actionLink: null,
      actionText: null
    },
    {
      id: 8,
      type: 'order',
      sender: 'Order Management System',
      subject: 'Order #ORD-2026-00128 Delivered Successfully',
      preview: 'Your order has been delivered successfully. Please confirm receipt and provide feedback.',
      fullContent: `Dear Customer,\n\nWe are pleased to inform you that your order #ORD-2026-00128 has been delivered successfully.\n\nDelivery Details:\n• Order Number: ORD-2026-00128\n• Delivery Date: 06/01/2026\n• Delivery Time: 03:45 PM\n• Received By: Mr. Rajesh Kumar\n• Delivery Location: Shop No. 45, MG Road, Bangalore - 560001\n\nNext Steps:\n• Please verify the delivered items against your order\n• Check for any damages or discrepancies\n• Report any issues within 24 hours for quick resolution\n• Provide your valuable feedback\n\nWe hope you are satisfied with our products and services. Your feedback helps us improve.\n\nThank you for choosing Veeba Foods!`,
      timestamp: new Date('2026-01-06T15:50:00'),
      isRead: true,
      priority: 'low',
      attachments: [
        { name: 'Delivery_Proof_ORD-2026-00128.pdf', size: '1.2 MB' }
      ],
      actionLink: '/complaint-management',
      actionText: 'Report Issue'
    }
  ]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      priority: 'all',
      dateRange: 'all',
      searchQuery: '',
      customStartDate: '',
      customEndDate: ''
    });
  };

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev?.map(notif =>
        notif?.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleArchive = (id) => {
    setNotifications(prev => prev?.filter(notif => notif?.id !== id));
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev?.filter(notif => notif?.id !== id));
  };

  const handleExpand = (id) => {
    const notification = notifications?.find(n => n?.id === id);
    setSelectedNotification(notification);
    if (!notification?.isRead) {
      handleMarkAsRead(id);
    }
  };

  const handlePreferenceChange = (key, value) => {
    setNotificationPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSavePreferences = () => {
    alert('Notification preferences saved successfully!');
  };

  const handleMarkAllRead = () => {
    setNotifications(prev =>
      prev?.map(notif =>
        selectedNotifications?.includes(notif?.id) ? { ...notif, isRead: true } : notif
      )
    );
    setSelectedNotifications([]);
  };

  const handleArchiveSelected = () => {
    setNotifications(prev =>
      prev?.filter(notif => !selectedNotifications?.includes(notif?.id))
    );
    setSelectedNotifications([]);
  };

  const handleDeleteSelected = () => {
    setNotifications(prev =>
      prev?.filter(notif => !selectedNotifications?.includes(notif?.id))
    );
    setSelectedNotifications([]);
  };

  const filteredNotifications = useMemo(() => {
    return notifications?.filter(notif => {
      if (filters?.type !== 'all' && notif?.type !== filters?.type) return false;
      if (filters?.status === 'unread' && notif?.isRead) return false;
      if (filters?.status === 'read' && !notif?.isRead) return false;
      if (filters?.priority !== 'all' && notif?.priority !== filters?.priority) return false;

      if (filters?.dateRange !== 'all') {
        const notifDate = new Date(notif.timestamp);
        const today = new Date();
        today?.setHours(0, 0, 0, 0);

        if (filters?.dateRange === 'today') {
          if (notifDate < today) return false;
        } else if (filters?.dateRange === 'week') {
          const weekAgo = new Date(today);
          weekAgo?.setDate(weekAgo?.getDate() - 7);
          if (notifDate < weekAgo) return false;
        } else if (filters?.dateRange === 'month') {
          const monthAgo = new Date(today);
          monthAgo?.setMonth(monthAgo?.getMonth() - 1);
          if (notifDate < monthAgo) return false;
        } else if (filters?.dateRange === 'custom') {
          if (filters?.customStartDate && filters?.customEndDate) {
            const startDate = new Date(filters.customStartDate);
            const endDate = new Date(filters.customEndDate);
            if (notifDate < startDate || notifDate > endDate) return false;
          }
        }
      }

      if (filters?.searchQuery) {
        const query = filters?.searchQuery?.toLowerCase();
        return (notif?.subject?.toLowerCase()?.includes(query) ||
        notif?.preview?.toLowerCase()?.includes(query) || notif?.sender?.toLowerCase()?.includes(query));
      }

      return true;
    });
  }, [notifications, filters]);

  const notificationCounts = useMemo(() => {
    return {
      all: notifications?.length,
      order: notifications?.filter(n => n?.type === 'order')?.length,
      payment: notifications?.filter(n => n?.type === 'payment')?.length,
      scheme: notifications?.filter(n => n?.type === 'scheme')?.length,
      announcement: notifications?.filter(n => n?.type === 'announcement')?.length,
      dispatch: notifications?.filter(n => n?.type === 'dispatch')?.length,
      invoice: notifications?.filter(n => n?.type === 'invoice')?.length,
      system: notifications?.filter(n => n?.type === 'system')?.length
    };
  }, [notifications]);

  const stats = useMemo(() => {
    return {
      total: notifications?.length,
      unread: notifications?.filter(n => !n?.isRead)?.length,
      highPriority: notifications?.filter(n => n?.priority === 'high')?.length,
      archived: 0
    };
  }, [notifications]);

  return (
    <>
      <Helmet>
        <title>Notifications Center - Veeba Customer Portal</title>
        <meta name="description" content="Manage all your notifications including order updates, payment reminders, and scheme announcements in one centralized location." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <Breadcrumb />

            <div className="mb-6 md:mb-8">
              <h1 className="font-heading font-semibold text-3xl md:text-4xl text-foreground mb-2">
                Notifications Center
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Stay updated with all your orders, payments, and announcements
              </p>
            </div>

            <div className="mb-6">
              <NotificationStats stats={stats} />
            </div>

            <div className="flex items-center gap-3 mb-6 overflow-x-auto scrollbar-custom pb-2">
              <button
                onClick={() => setActiveTab('notifications')}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-smooth
                  ${activeTab === 'notifications'
                    ? 'bg-primary text-primary-foreground' :'bg-card text-muted-foreground hover:bg-muted'
                  }
                `}
              >
                All Notifications
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-smooth
                  ${activeTab === 'preferences' ?'bg-primary text-primary-foreground' :'bg-card text-muted-foreground hover:bg-muted'
                  }
                `}
              >
                Preferences
              </button>
            </div>

            {activeTab === 'notifications' ? (
              <>
                <div className="mb-6">
                  <NotificationFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    notificationCounts={notificationCounts}
                  />
                </div>

                {filteredNotifications?.length > 0 ? (
                  <div className="space-y-4">
                    {filteredNotifications?.map(notification => (
                      <NotificationCard
                        key={notification?.id}
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                        onArchive={handleArchive}
                        onDelete={handleDelete}
                        onExpand={handleExpand}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-card rounded-xl border border-border p-12 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="Bell" size={32} color="var(--color-muted-foreground)" />
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                      No Notifications Found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {filters?.searchQuery || filters?.type !== 'all' || filters?.status !== 'all' ?'Try adjusting your filters to see more notifications' :'You\'re all caught up! No new notifications at the moment.'}
                    </p>
                    {(filters?.searchQuery || filters?.type !== 'all' || filters?.status !== 'all') && (
                      <Button
                        variant="outline"
                        iconName="X"
                        onClick={handleClearFilters}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <NotificationPreferences
                preferences={notificationPreferences}
                onPreferenceChange={handlePreferenceChange}
                onSave={handleSavePreferences}
              />
            )}
          </div>
        </main>

        {selectedNotification && (
          <NotificationDetailModal
            notification={selectedNotification}
            onClose={() => setSelectedNotification(null)}
            onMarkAsRead={handleMarkAsRead}
            onArchive={handleArchive}
          />
        )}

        <BulkActionsBar
          selectedCount={selectedNotifications?.length}
          onMarkAllRead={handleMarkAllRead}
          onArchiveSelected={handleArchiveSelected}
          onDeleteSelected={handleDeleteSelected}
          onClearSelection={() => setSelectedNotifications([])}
        />
      </div>
    </>
  );
};

export default NotificationsCenter;
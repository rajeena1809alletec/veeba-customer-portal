import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import OrderFilters from './components/OrderFilters';
import OrderSummaryPanel from './components/OrderSummaryPanel';
import OrderTable from './components/OrderTable';
import OrderMobileCard from './components/OrderMobileCard';
import BulkActionsBar from './components/BulkActionsBar';

const OrderManagement = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: 'all',
    startDate: '',
    endDate: ''
  });

  const [sortConfig, setSortConfig] = useState({
    field: 'orderDate',
    direction: 'desc'
  });

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showMobileView, setShowMobileView] = useState(window.innerWidth < 1024);

  React.useEffect(() => {
    const handleResize = () => {
      setShowMobileView(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mockOrders = [
    {
      id: 1,
      orderNumber: "ORD-2026-001234",
      orderDate: "05/01/2026",
      totalAmount: 245680.50,
      status: "open",
      deliveryDate: "12/01/2026",
      items: [
        {
          productName: "Veeba Mayonnaise - Eggless 1kg",
          quantity: 50,
          unit: "pcs",
          unitPrice: 285.50,
          total: 14275.00
        },
        {
          productName: "Veeba Thousand Island Dressing 1kg",
          quantity: 30,
          unit: "pcs",
          unitPrice: 320.00,
          total: 9600.00
        },
        {
          productName: "Veeba Mint Mayonnaise 1kg",
          quantity: 40,
          unit: "pcs",
          unitPrice: 295.00,
          total: 11800.00
        }
      ],
      trackingInfo: null
    },
    {
      id: 2,
      orderNumber: "ORD-2026-001198",
      orderDate: "03/01/2026",
      totalAmount: 189450.00,
      status: "dispatched",
      deliveryDate: "08/01/2026",
      items: [
        {
          productName: "Veeba Caesar Dressing 1kg",
          quantity: 60,
          unit: "pcs",
          unitPrice: 340.00,
          total: 20400.00
        },
        {
          productName: "Veeba Peri Peri Sauce 1kg",
          quantity: 45,
          unit: "pcs",
          unitPrice: 275.00,
          total: 12375.00
        }
      ],
      trackingInfo: {
        trackingId: "VB2026010300123",
        status: "In transit - Expected delivery on 08/01/2026"
      }
    },
    {
      id: 3,
      orderNumber: "ORD-2026-001156",
      orderDate: "28/12/2025",
      totalAmount: 567890.75,
      status: "invoiced",
      deliveryDate: "04/01/2026",
      items: [
        {
          productName: "Veeba Schezwan Chutney 1kg",
          quantity: 100,
          unit: "pcs",
          unitPrice: 265.00,
          total: 26500.00
        },
        {
          productName: "Veeba Garlic Mayonnaise 1kg",
          quantity: 80,
          unit: "pcs",
          unitPrice: 305.00,
          total: 24400.00
        },
        {
          productName: "Veeba Tandoori Sauce 1kg",
          quantity: 70,
          unit: "pcs",
          unitPrice: 290.00,
          total: 20300.00
        }
      ],
      trackingInfo: {
        trackingId: "VB2025122800089",
        status: "Delivered on 04/01/2026"
      }
    },
    {
      id: 4,
      orderNumber: "ORD-2025-009876",
      orderDate: "20/12/2025",
      totalAmount: 423560.00,
      status: "invoiced",
      deliveryDate: "27/12/2025",
      items: [
        {
          productName: "Veeba Pizza Pasta Sauce 1kg",
          quantity: 90,
          unit: "pcs",
          unitPrice: 255.00,
          total: 22950.00
        },
        {
          productName: "Veeba Sweet Chilli Sauce 1kg",
          quantity: 75,
          unit: "pcs",
          unitPrice: 270.00,
          total: 20250.00
        }
      ],
      trackingInfo: {
        trackingId: "VB2025122000067",
        status: "Delivered on 27/12/2025"
      }
    },
    {
      id: 5,
      orderNumber: "ORD-2025-009654",
      orderDate: "15/12/2025",
      totalAmount: 198750.50,
      status: "cancelled",
      deliveryDate: "22/12/2025",
      items: [
        {
          productName: "Veeba Burger Mayonnaise 1kg",
          quantity: 55,
          unit: "pcs",
          unitPrice: 280.00,
          total: 15400.00
        }
      ],
      trackingInfo: null
    },
    {
      id: 6,
      orderNumber: "ORD-2025-009543",
      orderDate: "10/12/2025",
      totalAmount: 334890.00,
      status: "invoiced",
      deliveryDate: "17/12/2025",
      items: [
        {
          productName: "Veeba Mexican Salsa 1kg",
          quantity: 65,
          unit: "pcs",
          unitPrice: 295.00,
          total: 19175.00
        },
        {
          productName: "Veeba Cocktail Sauce 1kg",
          quantity: 50,
          unit: "pcs",
          unitPrice: 310.00,
          total: 15500.00
        }
      ],
      trackingInfo: {
        trackingId: "VB2025121000045",
        status: "Delivered on 17/12/2025"
      }
    }
  ];

  const filteredOrders = useMemo(() => {
    let filtered = [...mockOrders];

    if (filters?.search) {
      filtered = filtered?.filter(order =>
        order?.orderNumber?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    if (filters?.status !== 'all') {
      filtered = filtered?.filter(order => order?.status === filters?.status);
    }

    filtered?.sort((a, b) => {
      const aValue = a?.[sortConfig?.field];
      const bValue = b?.[sortConfig?.field];

      if (sortConfig?.field === 'orderDate' || sortConfig?.field === 'deliveryDate') {
        const aDate = new Date(aValue.split('/').reverse().join('-'));
        const bDate = new Date(bValue.split('/').reverse().join('-'));
        return sortConfig?.direction === 'asc' ? aDate - bDate : bDate - aDate;
      }

      if (typeof aValue === 'number') {
        return sortConfig?.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return sortConfig?.direction === 'asc'
        ? String(aValue)?.localeCompare(String(bValue))
        : String(bValue)?.localeCompare(String(aValue));
    });

    return filtered;
  }, [filters, sortConfig]);

  const orderSummary = useMemo(() => {
    return {
      totalOrders: mockOrders?.length,
      openOrders: mockOrders?.filter(o => o?.status === 'open')?.length,
      dispatchedOrders: mockOrders?.filter(o => o?.status === 'dispatched')?.length,
      totalValue: mockOrders?.reduce((sum, order) => sum + order?.totalAmount, 0)
    };
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      dateRange: 'all',
      startDate: '',
      endDate: ''
    });
  };

  const handleSort = (field, direction) => {
    setSortConfig({ field, direction });
  };

  const handleRepeatOrder = (order) => {
    alert(`Repeat order functionality for ${order?.orderNumber} will be implemented with ERP integration`);
  };

  const handleExport = () => {
    alert(`Exporting ${selectedOrders?.length} orders to CSV`);
  };

  const handleClearSelection = () => {
    setSelectedOrders([]);
  };

  return (
    <>
      <Helmet>
        <title>Order Management - Veeba Foods Customer Portal</title>
        <meta name="description" content="View and manage your sales orders with comprehensive tracking and status monitoring" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-16">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <Breadcrumb />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 md:mb-8">
              <div>
                <h1 className="font-heading font-semibold text-2xl md:text-3xl lg:text-4xl text-foreground mb-2">
                  Order Management
                </h1>
                <p className="font-body text-sm md:text-base text-muted-foreground">
                  View, track, and manage all your sales orders
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="default"
                  iconName="Download"
                  iconPosition="left"
                  onClick={() => alert('Export all orders functionality')}
                >
                  Export All
                </Button>
                <Button
                  variant="default"
                  size="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => alert('New order functionality will be implemented')}
                >
                  New Order
                </Button>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <OrderSummaryPanel summary={orderSummary} />

              <OrderFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                resultsCount={filteredOrders?.length}
              />

              {showMobileView ? (
                <div className="space-y-4">
                  {filteredOrders?.map(order => (
                    <OrderMobileCard
                      key={order?.id}
                      order={order}
                      onRepeatOrder={handleRepeatOrder}
                    />
                  ))}
                </div>
              ) : (
                <OrderTable
                  orders={filteredOrders}
                  onRepeatOrder={handleRepeatOrder}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />
              )}

              {filteredOrders?.length === 0 && (
                <div className="bg-card rounded-xl p-12 text-center shadow-warm-sm border border-border">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="ShoppingCart" size={40} color="var(--color-muted-foreground)" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                    No Orders Found
                  </h3>
                  <p className="font-body text-base text-muted-foreground mb-6">
                    Try adjusting your filters or create a new order
                  </p>
                  <Button
                    variant="default"
                    size="lg"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => alert('New order functionality')}
                  >
                    Create New Order
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>

        <BulkActionsBar
          selectedCount={selectedOrders?.length}
          onExport={handleExport}
          onClearSelection={handleClearSelection}
        />
      </div>
    </>
  );
};

export default OrderManagement;
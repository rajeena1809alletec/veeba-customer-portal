import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { getSPSalesOrder } from 'services/BusinessCentralAPI';
import CustomDateRangeModal from './components/CustomDateRangeModal';


// const mapStatus = (bcStatus) => {
//   if (!bcStatus) return 'open';
//   const s = bcStatus.toLowerCase().replace(/_x0020_/g, ' ');
//   if (s === 'open') return 'open';
//   if (s === 'released') return 'released';
//   if (s === 'pending approval') return 'pending approval';
//   if (s === 'pending prepayment') return 'pending prepayment';
//   return 'open';
// };
const mapStatus = (bcStatus, clBlock) => {
  if (clBlock === true) return 'blocked';

  const s = (bcStatus || '').toLowerCase().replace(/_x0020_/g, ' ').trim();

  if (s === 'released') return 'open';
  if (s === 'open') return 'open';
  if (s === 'pending approval') return 'pending approval';
  if (s === 'pending prepayment') return 'pending prepayment';

  return 'open';
};

const getCurrentMonthDateRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1);
  const firstDayTemp = new Date(2025, 4, 1);
  const lastDay = new Date(year, month + 1, 0);


  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return {
    startDate: formatDate(firstDay),
    endDate: formatDate(lastDay)
  };
};
const getCurrentFinancialYearDateRange = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  let startYear;
  let endYear;

  if (currentMonth >= 4) {
    startYear = currentYear;
    endYear = currentYear + 1;
  } else {
    startYear = currentYear - 1;
    endYear = currentYear;
  }

  return {
    startDate: `${startYear}-04-01`,
    endDate: `${endYear}-03-31`
  };
};

const SPOrderManagement = () => {
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allOrders, setAllOrders] = useState([]);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: null, end: null });
  const [filteredOrders, setFilteredOrders] = useState([]);


  useEffect(() => {
    const handleResize = () => {
      setShowMobileView(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const salespersonCode = localStorage.getItem('salespersonCode');
        const customersForSalesperson = localStorage.getItem('customersForSalesperson');

        if (!salespersonCode) {
          console.error('Salesperson code not found');
          navigate('/login');
          return;
        }
        if (!customersForSalesperson || customersForSalesperson.trim() === '') {
          console.error('No customers available for this salesperson');
          setAllOrders([]);
          setFilteredOrders([]);
          setLoading(false);
          return;
        }
        const { startDate, endDate } = getCurrentFinancialYearDateRange();
        const result = await getSPSalesOrder(customersForSalesperson, startDate, endDate);

        if (result.success) {
          const mapped = result.data.map((entry) => ({
            id: entry.no,
            orderNumber: entry.no,
            orderDate: entry.postingDate || '',
            totalAmount: entry.amount || 0,
            status: mapStatus(entry.status, entry.clBlock),
            bcStatus: entry.status || '',
            deliveryDate: entry.requestedDeliveryDate || '',
            documentType: entry.documentType,
            postingDate: entry.postingDate || '',
            items: [],
            trackingInfo: null,
            customerNo: entry.sellToCustomerNo || '',
            salespersonCode: entry.salespersonCode || '',
            salespersonName: entry.salesperson?.[0]?.name || ''
          }));

          setAllOrders(mapped);
        } else {
          console.error('Failed to fetch sales orders:', result.error);
          setAllOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setAllOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

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

  useEffect(() => {
    let filtered = [...allOrders];

    if (filters?.search) {
      filtered = filtered.filter(order =>
        order?.orderNumber?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        order?.customerNo?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        order?.salespersonCode?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        order?.salespersonName?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    if (filters?.status !== 'all') {
      filtered = filtered.filter(order => order?.status === filters?.status);
    }

    if (filters?.dateRange !== 'all') {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      let startDate;
      let endDate = new Date();

      switch (filters?.dateRange) {
        case 'today':
          startDate = new Date(today);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(today);
          endDate.setHours(23, 59, 59, 999);
          break;

        case 'week':
          startDate = new Date(today);
          startDate.setDate(today.getDate() - today.getDay());
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          break;

        case 'month':
          startDate = new Date(currentYear, currentMonth, 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(currentYear, currentMonth + 1, 0);
          endDate.setHours(23, 59, 59, 999);
          break;

        case 'quarter':
          const currentQuarter = Math.floor(currentMonth / 3);
          startDate = new Date(currentYear, currentQuarter * 3, 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(currentYear, currentQuarter * 3 + 3, 0);
          endDate.setHours(23, 59, 59, 999);
          break;

        case 'year':
          startDate = new Date(currentYear, 0, 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(currentYear, 11, 31);
          endDate.setHours(23, 59, 59, 999);
          break;

        case 'custom':
          if (customDateRange.start && customDateRange.end) {
            startDate = new Date(customDateRange.start);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(customDateRange.end);
            endDate.setHours(23, 59, 59, 999);
          } else {
            startDate = new Date(0);
            endDate = new Date();
            endDate.setHours(23, 59, 59, 999);
          }
          break;

        default:
          startDate = new Date(0);
          endDate.setHours(23, 59, 59, 999);
          break;
      }

      filtered = filtered.filter(t => {
        if (!t.orderDate) return false;
        const d = new Date(t.orderDate);
        return !isNaN(d.getTime()) && d >= startDate && d <= endDate;
      });
    }

    // Apply sort
    filtered.sort((a, b) => {
      const aVal = a?.[sortConfig?.field];
      const bVal = b?.[sortConfig?.field];

      if (sortConfig?.field === 'orderDate' || sortConfig?.field === 'deliveryDate') {
        const aDate = aVal ? new Date(aVal).getTime() : 0;
        const bDate = bVal ? new Date(bVal).getTime() : 0;
        return sortConfig?.direction === 'asc' ? aDate - bDate : bDate - aDate;
      }
      if (typeof aVal === 'number') {
        return sortConfig?.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortConfig?.direction === 'asc'
        ? String(aVal)?.localeCompare(String(bVal))
        : String(bVal)?.localeCompare(String(aVal));
    });

    setFilteredOrders(filtered);
  }, [filters, sortConfig, allOrders, customDateRange]);

  const orderSummary = {
    totalOrders: allOrders?.length || 0,
    totalOrdersAmount: allOrders?.reduce((sum, order) => sum + (order?.totalAmount || 0), 0) || 0,

    openOrders: allOrders?.filter(o => o?.status === 'open')?.length || 0,
    openOrdersAmount: allOrders
      ?.filter(o => o?.status === 'open')
      ?.reduce((sum, order) => sum + (order?.totalAmount || 0), 0) || 0,

    blockedOrders: allOrders?.filter(o => o?.status === 'blocked')?.length || 0,
    blockedOrdersAmount: allOrders
      ?.filter(o => o?.status === 'blocked')
      ?.reduce((sum, order) => sum + (order?.totalAmount || 0), 0) || 0,

    dispatchedOrders: allOrders?.filter(o => o?.status === 'dispatched')?.length || 0,
    dispatchedOrdersAmount: allOrders
      ?.filter(o => o?.status === 'dispatched')
      ?.reduce((sum, order) => sum + (order?.totalAmount || 0), 0) || 0,

    totalValue: allOrders?.reduce((sum, order) => sum + (order?.totalAmount || 0), 0) || 0
  };

  const handleFilterChange = (key, value) => {
    if (key === 'dateRange' && value === 'custom') {
      setShowCustomDateModal(true);
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
      if (key === 'dateRange') {
        setCustomDateRange({ start: null, end: null });
      }
    }
  };

  const handleCustomDateApply = (startDate, endDate) => {
    setCustomDateRange({ start: startDate, end: endDate });
    setFilters(prev => ({ ...prev, dateRange: 'custom' }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      dateRange: 'all',
      startDate: '',
      endDate: ''
    });
    setCustomDateRange({ start: null, end: null });
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
  const handleDownloadAllEntries = () => {
    if (!filteredOrders || filteredOrders.length === 0) {
      alert('No orders to download.');
      return;
    }

    const headers = [
      'Order Number',
      'Customer No',
      'Salesperson Code',
      'Salesperson Name',
      'Order Date',
      'Delivery Date',
      'Status',
      'BC Status',
      'Total Amount',
      'Document Type'
    ];

    const rows = filteredOrders.map(order => [
      order?.orderNumber || '',
      order?.customerNo || '',
      order?.salespersonCode || '',
      order?.salespersonName || '',
      order?.orderDate || '',
      order?.deliveryDate || '',
      order?.status || '',
      order?.bcStatus || '',
      order?.totalAmount !== undefined ? Number(order.totalAmount).toFixed(2) : '0.00',
      order?.documentType || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sp-orders-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <>
        <Helmet><title>Order Management - Veeba Foods Customer Portal</title></Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-16">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading orders...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

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
                  onClick={handleDownloadAllEntries}
                >
                  Download All Entries
                </Button>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <OrderSummaryPanel summary={orderSummary} />

              <OrderFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                resultsCount={filteredOrders?.length} customDateRange={customDateRange}
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

              {/* {filteredOrders?.length === 0 && (
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
              )} */}
            </div>
          </div>
        </main>

        <BulkActionsBar
          selectedCount={selectedOrders?.length}
          onExport={handleExport}
          onClearSelection={handleClearSelection}
        />
      </div>
      {showCustomDateModal && (
        <CustomDateRangeModal
          isOpen={showCustomDateModal}
          onClose={() => setShowCustomDateModal(false)}
          onApply={handleCustomDateApply}
        />
      )}
    </>
  );
};

export default SPOrderManagement;
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import FinancialMetricCard from './components/FinancialMetricCard';
import DispatchFilters from './components/DispatchFilters';
import DispatchTable from './components/DispatchTable';
import AgingAnalysisChart from './components/AgingAnalysisChart';
import PaymentAlerts from './components/PaymentAlerts';
import StatementGenerator from './components/StatementGenerator';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useNavigate } from 'react-router-dom';
import { getCustomerLedgerEntries, getCustomerByCustomerId, getCurrentMonthInvoiceAmount, getOverdueInvoiceAmount, getDispatchDetails } from 'services/BusinessCentralAPI';

import CustomDateRangeModal from './components/CustomDateRangeModal';


const getCurrentMonthDateRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1);
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

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};



const DispatchDetails = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionType, setTransactionType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allTransactions, setAllTransactions] = useState([]);

  const [customerFinancialData, setCustomerFinancialData] = useState(null);
  const [currentMonthAmount, setCurrentMonthAmount] = useState(0);
  const [overdueAmount, setOverdueAmount] = useState(0);

  // Add state for custom date range modal
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: null, end: null });

  const [creditUtilization, setCreditUtilization] = useState('0%');


  // const financialMetrics = [
  //   {
  //     title: 'Total Outstanding',
  //     amount: customerFinancialData?.balanceLCY
  //       ? `₹${customerFinancialData.balanceLCY.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  //       : '₹0.00',
  //     icon: 'Wallet',
  //     iconColor: 'var(--color-error)',
  //     bgColor: 'bg-error/10',
  //     trend: 'down',
  //     trendValue: '8.2%',
  //     subtitle: 'Across all invoices'
  //   },
  //   {
  //     title: 'Current Month Purchases',
  //     amount: currentMonthAmount
  //       ? `₹${currentMonthAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  //       : '₹0.00',
  //     icon: 'ShoppingCart',
  //     iconColor: 'var(--color-primary)',
  //     bgColor: 'bg-primary/10',
  //     trend: 'up',
  //     trendValue: '12.5%',
  //     subtitle: 'January 2026'
  //   },
  //   {
  //     title: 'Credit Limit Utilization',
  //     amount: creditUtilization,
  //     icon: 'TrendingUp',
  //     iconColor: 'var(--color-warning)',
  //     bgColor: 'bg-warning/10',
  //     subtitle: '₹12,45,680 / ₹20,00,000'
  //   },
  //   {
  //     title: 'Overdue Amount',
  //     amount: overdueAmount
  //       ? `₹${Math.abs(overdueAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  //       : '₹0.00',
  //     icon: 'AlertCircle',
  //     iconColor: 'var(--color-error)',
  //     bgColor: 'bg-error/10',
  //     trend: 'up',
  //     trendValue: '5.3%',
  //     subtitle: '3 invoices overdue'
  //   }
  // ];


  const mockTransactions = [];
  // const agingData = [
  //   { period: '0-30 Days', amount: 456780.50 },
  //   { period: '31-60 Days', amount: 345670.00 },
  //   { period: '61-90 Days', amount: 234560.00 },
  //   { period: '90+ Days', amount: 208670.00 }
  // ];

  // const paymentAlerts = [
  //   {
  //     id: 1,
  //     type: 'overdue',
  //     title: 'Payment Overdue',
  //     message: 'Invoice payment is 10 days past due date. Please settle immediately to avoid late fees.',
  //     invoiceRef: 'INV-2026-0144',
  //     amount: 234560.00,
  //     daysInfo: '10 days overdue'
  //   },
  //   {
  //     id: 2,
  //     type: 'due_soon',
  //     title: 'Payment Due Soon',
  //     message: 'Invoice payment is due in 5 days. Please arrange payment to maintain good credit standing.',
  //     invoiceRef: 'INV-2026-0145',
  //     amount: 145680.50,
  //     daysInfo: 'Due in 5 days'
  //   },
  //   {
  //     id: 3,
  //     type: 'reminder',
  //     title: 'Payment Reminder',
  //     message: 'Friendly reminder about upcoming payment due in 15 days.',
  //     invoiceRef: 'INV-2025-0987',
  //     amount: 187650.00,
  //     daysInfo: 'Due in 15 days'
  //   }
  // ];

  useEffect(() => {
    const fetchLedgerEntries = async () => {
      try {
        setLoading(true);

        // Get customer ID from localStorage
        const customerId = localStorage.getItem('customerId');

        if (!customerId) {
          console.error('Customer ID not found');
          navigate('/login');
          return;
        }

        const { startDate, endDate } = getCurrentMonthDateRange();
        const today = getTodayDate();
        console.log('Fetching customer data for month:', startDate, 'to', endDate);

        // Fetch ledger entries from BC API

        const dispatchResult = await getDispatchDetails(customerId);

        if (dispatchResult.success) {
          const mapped = dispatchResult.data.map((entry) => ({
            id: entry.no,
            invoiceNo: entry.no,
            invoiceDate: entry.postingDate,
            dispatchDate: entry.postingDate,
            lrNo: entry.lrRRNo || '',
            transporterName: entry.transporterVendorNo || '',
            driverContact: entry.driverMobNo || '',           // not in API yet
          }));

          setAllTransactions(mapped);
          setFilteredTransactions(mapped);
        } else {
          console.error('Failed to fetch dispatch details:', dispatchResult.error);
          setAllTransactions([]);
          setFilteredTransactions([]);
        }



      } catch (error) {
        console.error('Error in fetchLedgerEntries:', error);
        // Use mock data as fallback
        setAllTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
      } finally {
        setLoading(false);
      }
    };

    fetchLedgerEntries();
  }, [navigate]);

  useEffect(() => {
    let filtered = [...allTransactions];

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t?.invoiceNo?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        t?.lrNo?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        t?.transporterName?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }


    if (dateRange !== 'all') {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      let startDate;
      let endDate = new Date();

      switch (dateRange) {

        case 'today':
          startDate = new Date(today);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(today);
          endDate.setHours(23, 59, 59, 999);
          break;

        case 'week':
          const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
          startDate = new Date(today);
          startDate.setDate(today.getDate() - dayOfWeek); // Start from Sunday
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
          const quarterStartMonth = currentQuarter * 3;
          startDate = new Date(currentYear, quarterStartMonth, 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(currentYear, quarterStartMonth + 3, 0);
          endDate.setHours(23, 59, 59, 999);
          break;

        case 'year':
          startDate = new Date(currentYear, 0, 1); // January 1st
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(currentYear, 11, 31); // December 31st
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'custom':  // ✅ ADD THIS CASE
          if (customDateRange.start && customDateRange.end) {
            startDate = new Date(customDateRange.start);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(customDateRange.end);
            endDate.setHours(23, 59, 59, 999);
          } else {
            // If custom range not set yet, show all
            startDate = new Date(0);
            endDate = new Date();
            endDate.setHours(23, 59, 59, 999);
          }
          break;

        default:
          startDate = new Date(0); // Beginning of time
          endDate.setHours(23, 59, 59, 999);
          break;
      }

      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.invoiceDate);
        return transactionDate >= startDate && transactionDate <= endDate;
      });

    }
    setFilteredTransactions(filtered);
  }, [searchTerm, dateRange, allTransactions, customDateRange]);

  const handleDateRangeChange = (value) => {
    if (value === 'custom') {
      setShowCustomDateModal(true);
    } else {
      setDateRange(value);
      setCustomDateRange({ start: null, end: null }); // Reset custom range
    }
  };

  const handleCustomDateApply = (startDate, endDate) => {
    setCustomDateRange({ start: startDate, end: endDate });
    setDateRange('custom');
  };


  const handleResetFilters = () => {
    setSearchTerm('');
    setTransactionType('all');
    setDateRange('all');
    setCustomDateRange({ start: null, end: null });
  };
  const handleDownloadAllEntries = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      alert('No transactions to download.');
      return;
    }

    const headers = ['Type', 'Date', 'Reference', 'Amount', 'Remaining Amount', 'Status', 'Due Date'];

    const rows = filteredTransactions.map(t => [
      t.type || '',
      t.date || '',
      t.reference || '',
      t.amount?.toFixed(2) || '0.00',
      t.remainingAmtLCY !== undefined ? Math.abs(t.remainingAmtLCY).toFixed(2) : '0.00',
      t.status || '',
      t.dueDate || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = (transaction) => {
    console.log('Downloading PDF for:', transaction?.reference);
    alert(`Downloading ${transaction?.reference}.pdf`);
  };

  const handleViewDetails = (transaction) => {
    console.log('Viewing details for:', transaction);
    alert(`Viewing details for ${transaction?.reference}`);
  };

  const handlePayNow = (alert) => {
    setSelectedAlert(alert);
    setShowPaymentModal(true);
  };

  const handleGenerateStatement = (params) => {
    console.log('Generating statement:', params);
    alert(`Statement generated for ${params?.startDate} to ${params?.endDate} in ${params?.format?.toUpperCase()} format`);
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Dispatch Details - Veeba Foods Customer Portal</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-16">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading financial data...</p>
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
        <title>Dispatch Details - Veeba Foods Customer Portal</title>
        <meta name="description" content="View your financial information, outstanding balances, payment history, and account statements with real-time ERP integration" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-16">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <Breadcrumb />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
              <div>
                <h1 className="font-heading font-semibold text-2xl md:text-3xl lg:text-4xl text-foreground mb-2">
                  Dispatch Details
                </h1>
                <p className="font-body text-sm md:text-base text-muted-foreground">
                  Comprehensive view of your disptach details
                </p>
              </div>

            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              {financialMetrics?.map((metric, index) => (
                <FinancialMetricCard key={index} {...metric} />
              ))}
            </div>

            <div className="mb-6 md:mb-8">
              <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 md:p-5 flex items-start gap-3">
                <Icon name="AlertTriangle" size={24} color="var(--color-warning)" className="flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-sm md:text-base text-foreground mb-1">
                    Credit Limit Alert
                  </h3>
                  <p className="font-body text-sm text-muted-foreground">
                    You have utilized {creditUtilization} of your credit limit. Consider settling outstanding invoices to free up credit.
                  </p>
                </div>
              </div>
            </div> */}

            <div className="grid grid-cols-1 gap-6 md:gap-8 mb-6 md:mb-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading font-semibold text-lg md:text-xl text-foreground">
                      All Dispatch Details
                    </h2>
                    {/* <Button
                      variant="outline"
                      iconName="Download"
                      iconPosition="left"
                      onClick={handleDownloadAllEntries}
                    >
                      Download All Entries
                    </Button> */}
                  </div>
                  <DispatchFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    dateRange={dateRange}
                    onDateRangeChange={handleDateRangeChange}
                    onReset={handleResetFilters}
                  />
                  <DispatchTable
                    transactions={filteredTransactions}
                    onViewDetails={handleViewDetails}
                  />
                </div>

                {/* <AgingAnalysisChart data={agingData} /> */}
              </div>

              {/* <div className="space-y-6">
                <div>
                  <h2 className="font-heading font-semibold text-lg md:text-xl text-foreground mb-4">
                    Payment Alerts
                  </h2>
                  <PaymentAlerts
                    alerts={paymentAlerts}
                    onPayNow={handlePayNow}
                    onViewDetails={handleViewDetails}
                  />
                </div>

                <StatementGenerator onGenerate={handleGenerateStatement} />
              </div> */}
            </div>

            {/* <div className="bg-card rounded-xl p-6 md:p-8 border border-border shadow-warm-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-primary/10 rounded-lg p-3">
                  <Icon name="Info" size={24} color="var(--color-primary)" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-base md:text-lg text-foreground mb-2">
                    Financial Information
                  </h3>
                  <p className="font-body text-sm text-muted-foreground mb-4">
                    All financial data is synchronized in real-time with Business Central ERP. Last sync: {new Date()?.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3">
                  <h4 className="font-heading font-medium text-sm text-foreground">Payment Terms</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-caption text-sm text-muted-foreground">Credit Period</span>
                      <span className="font-body text-sm text-foreground">30 Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-caption text-sm text-muted-foreground">Credit Limit</span>
                      <span className="font-body text-sm text-foreground data-text">₹20,00,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-caption text-sm text-muted-foreground">Available Credit</span>
                      <span className="font-body text-sm text-success data-text">₹7,54,319.50</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-heading font-medium text-sm text-foreground">Account Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-caption text-sm text-muted-foreground">Total Invoices (MTD)</span>
                      <span className="font-body text-sm text-foreground">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-caption text-sm text-muted-foreground">Total Payments (MTD)</span>
                      <span className="font-body text-sm text-foreground">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-caption text-sm text-muted-foreground">Average Payment Days</span>
                      <span className="font-body text-sm text-foreground">28 Days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </main>
      </div>
      {/* {showPaymentModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-xl max-w-md w-full p-6 shadow-warm-xl animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-semibold text-lg text-foreground">
                Make Payment
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 rounded-lg hover:bg-muted transition-smooth"
              >
                <Icon name="X" size={20} color="var(--color-muted-foreground)" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-caption text-xs text-muted-foreground mb-1">
                  {selectedAlert ? 'Invoice Reference' : 'Total Outstanding'}
                </p>
                <p className="font-body text-sm text-foreground data-text mb-2">
                  {selectedAlert ? selectedAlert?.invoiceRef : 'Multiple Invoices'}
                </p>
                <p className="font-body text-2xl font-semibold text-foreground data-text">
                  ₹{selectedAlert ? selectedAlert?.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '12,45,680.50'}
                </p>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Icon name="Info" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
                  <p className="font-caption text-xs text-muted-foreground">
                    You will be redirected to our secure payment gateway to complete the transaction. All major payment methods are accepted.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                iconName="CreditCard"
                iconPosition="left"
                onClick={() => {
                  alert('Redirecting to payment gateway...');
                  setShowPaymentModal(false);
                }}
                className="flex-1"
              >
                Proceed to Pay
              </Button>
            </div>
          </div>
        </div>
      )} */}

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

export default DispatchDetails;
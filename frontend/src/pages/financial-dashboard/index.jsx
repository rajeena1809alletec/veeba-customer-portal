import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import FinancialMetricCard from './components/FinancialMetricCard';
import TransactionFilters from './components/TransactionFilters';
import TransactionsTable from './components/TransactionsTable';
import AgingAnalysisChart from './components/AgingAnalysisChart';
import PaymentAlerts from './components/PaymentAlerts';
import StatementGenerator from './components/StatementGenerator';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useNavigate } from 'react-router-dom';
import { getCustomerLedgerEntries, getCustomerByCustomerId, getCurrentMonthInvoiceAmount, getOverdueInvoiceAmount } from 'services/BusinessCentralAPI';

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



const FinancialDashboard = () => {
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


  const financialMetrics = [
    {
      title: 'Total Outstanding',
      amount: customerFinancialData?.balanceLCY
        ? `₹${customerFinancialData.balanceLCY.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : '₹0.00',
      icon: 'Wallet',
      iconColor: 'var(--color-error)',
      bgColor: 'bg-error/10',
      trend: 'down',
      trendValue: '8.2%',
      subtitle: 'Across all invoices'
    },
    {
      title: 'Current Month Purchases',
      amount: currentMonthAmount
        ? `₹${currentMonthAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : '₹0.00',
      icon: 'ShoppingCart',
      iconColor: 'var(--color-primary)',
      bgColor: 'bg-primary/10',
      trend: 'up',
      trendValue: '12.5%',
      subtitle: 'January 2026'
    },
    {
      title: 'Credit Limit Utilization',
      amount: creditUtilization,
      icon: 'TrendingUp',
      iconColor: 'var(--color-warning)',
      bgColor: 'bg-warning/10',
      subtitle: '₹12,45,680 / ₹20,00,000'
    },
    {
      title: 'Overdue Amount',
      amount: overdueAmount
        ? `₹${Math.abs(overdueAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : '₹0.00',
      icon: 'AlertCircle',
      iconColor: 'var(--color-error)',
      bgColor: 'bg-error/10',
      trend: 'up',
      trendValue: '5.3%',
      subtitle: '3 invoices overdue'
    }
  ];

  //status == pending (for invoice: due date > current date)
  // const mockTransactions = [
  //   {
  //     id: 1,
  //     type: 'invoice',
  //     date: '2026-01-05',
  //     reference: 'INV-2026-0145',
  //     amount: 145680.50,
  //     status: 'pending',
  //     dueDate: '2026-01-20'
  //   },
  //   {
  //     id: 2,
  //     type: 'payment',
  //     date: '2026-01-04',
  //     reference: 'PAY-2026-0089',
  //     amount: 98450.00,
  //     status: 'processed',
  //     paymentMode: 'NEFT'
  //   },
  //   {
  //     id: 3,
  //     type: 'invoice',
  //     date: '2026-01-03',
  //     reference: 'INV-2026-0144',
  //     amount: 234560.00,
  //     status: 'overdue',
  //     dueDate: '2025-12-28'
  //   },
  //   {
  //     id: 4,
  //     type: 'credit_note',
  //     date: '2026-01-02',
  //     reference: 'CN-2026-0023',
  //     amount: 12450.00,
  //     status: 'processed',
  //     reason: 'Product return'
  //   },
  //   {
  //     id: 5,
  //     type: 'invoice',
  //     date: '2025-12-30',
  //     reference: 'INV-2025-0987',
  //     amount: 187650.00,
  //     status: 'paid',
  //     dueDate: '2026-01-15'
  //   },
  //   {
  //     id: 6,
  //     type: 'payment',
  //     date: '2025-12-28',
  //     reference: 'PAY-2025-0456',
  //     amount: 156780.00,
  //     status: 'processed',
  //     paymentMode: 'RTGS'
  //   },
  //   {
  //     id: 7,
  //     type: 'invoice',
  //     date: '2025-12-25',
  //     reference: 'INV-2025-0986',
  //     amount: 98760.50,
  //     status: 'pending',
  //     dueDate: '2026-01-10'
  //   },
  //   {
  //     id: 8,
  //     type: 'debit_note',
  //     date: '2025-12-22',
  //     reference: 'DN-2025-0015',
  //     amount: 8950.00,
  //     status: 'processed',
  //     reason: 'Shortage claim'
  //   }
  // ];

  const mockTransactions = [];
  const agingData = [
    { period: '0-30 Days', amount: 456780.50 },
    { period: '31-60 Days', amount: 345670.00 },
    { period: '61-90 Days', amount: 234560.00 },
    { period: '90+ Days', amount: 208670.00 }
  ];

  const paymentAlerts = [
    {
      id: 1,
      type: 'overdue',
      title: 'Payment Overdue',
      message: 'Invoice payment is 10 days past due date. Please settle immediately to avoid late fees.',
      invoiceRef: 'INV-2026-0144',
      amount: 234560.00,
      daysInfo: '10 days overdue'
    },
    {
      id: 2,
      type: 'due_soon',
      title: 'Payment Due Soon',
      message: 'Invoice payment is due in 5 days. Please arrange payment to maintain good credit standing.',
      invoiceRef: 'INV-2026-0145',
      amount: 145680.50,
      daysInfo: 'Due in 5 days'
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Payment Reminder',
      message: 'Friendly reminder about upcoming payment due in 15 days.',
      invoiceRef: 'INV-2025-0987',
      amount: 187650.00,
      daysInfo: 'Due in 15 days'
    }
  ];

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
        const [customerResult, ledgerResult, currentMonthResult, overdueResult] = await Promise.all([
          getCustomerByCustomerId(customerId),
          getCustomerLedgerEntries(customerId, { open: true }),
          getCurrentMonthInvoiceAmount(customerId, startDate, endDate),
          getOverdueInvoiceAmount(customerId, today) // NEW API CALL
        ]);

        if (customerResult.success) {
          const customerData = customerResult.data;
          // console.log('Customer financial data:', customerData);
          setCustomerFinancialData(customerData);

          const balanceLCY = customerData.balanceLCY || 0;
          const creditLimitLCY = customerData.creditLimitLCY || 0;

          const utilizationPercentage = (balanceLCY / creditLimitLCY) * 100;
          setCreditUtilization(`${utilizationPercentage.toFixed(1)}%`);

        } else {
          console.error('Failed to fetch customer data:', customerResult.error);
        }

        if (currentMonthResult.success) {
          const monthData = currentMonthResult.data;
          // console.log('Current month invoice data:', monthData);
          setCurrentMonthAmount(monthData.amount || 0);
        } else {
          console.error('Failed to fetch current month amount:', currentMonthResult.error);
          setCurrentMonthAmount(0);
        }

        if (overdueResult.success) {
          const overdueData = overdueResult.data;
          // console.log('Overdue invoice data:', overdueData);
          setOverdueAmount(overdueData.amount || 0);
        } else {
          console.error('Failed to fetch overdue amount:', overdueResult.error);
          setOverdueAmount(0);
        }

        if (ledgerResult.success) {
          const ledgerEntries = ledgerResult.data;
          // console.log('ledger entriesss: ', ledgerResult.data)
          const mappedTransactions = ledgerEntries.map((entry, index) => {

            let type = 'invoice';
            if (entry.documentType === 'Payment') {
              type = 'payment';
            } else if (entry.documentType === 'Credit Memo') {
              type = 'credit_note';
            } else if (entry.documentType === 'Finance Charge Memo') {
              type = 'debit_note';
            } else if (entry.documentType === 'Invoice') {
              type = 'invoice';
            } else if (entry.documentType === 'Order') {
              type = 'order';
            }

            let status = 'processed';
            let calculatedDueDate = null;

            if (type === 'invoice') {
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              if (entry.dueDate) {
                calculatedDueDate = entry.dueDate;
                const dueDate = new Date(entry.dueDate);
                dueDate.setHours(0, 0, 0, 0);

                if (dueDate > today) {
                  status = 'pending';
                } else if (dueDate < today) {
                  status = 'overdue';
                } else if (dueDate.getTime() === today.getTime()) {
                  status = 'pending';
                } else if (dueDate.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000) {
                  status = 'pending';
                } else {
                  status = 'pending';
                }
              }
              else {
                const dueDate = new Date(entry.postingDate);
                dueDate.setDate(dueDate.getDate() + 30);
                calculatedDueDate = dueDate.toISOString().split('T')[0];

                if (dueDate < today) {
                  status = 'overdue';
                } else if (dueDate.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000) {
                  status = 'pending';
                } else {
                  status = 'pending';
                }
              }
            }

            return {
              id: entry.ledgerEntryNo,
              type: entry.documentType,
              date: entry.postingDate,
              reference: entry.documentNo,
              externalReference: entry.externalDocumentNo || '',
              amount: Math.abs(entry.amountLCY),
              status: status,
              dueDate: entry.dueDate,
              paymentMode: type === 'payment' ? 'Bank Transfer' : null,
              originalAmount: entry.originalAmtLCY,
              remainingAmt: entry.remainingAmount,
              remainingAmtLCY: entry.remainingAmtLCY
            };
          });

          setAllTransactions(mappedTransactions);
          setFilteredTransactions(mappedTransactions);
        } else {
          console.error('Failed to fetch ledger entries:', ledgerResult.error);
          setAllTransactions(mockTransactions);
          setFilteredTransactions(mockTransactions);
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
        t?.reference?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        t?.amount?.toString()?.includes(searchTerm) ||
        t?.externalReference?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    if (transactionType !== 'all') {
      filtered = filtered.filter(t => {
        const typeMap = {
          'Invoice': 'invoice',
          'Payment': 'payment',
          'Credit Memo': 'credit_note',
          'Finance Charge Memo': 'debit_note',
          'Order': 'order'
        };

        const mappedType = typeMap[t?.type] || t?.type?.toLowerCase();
        return mappedType === transactionType;
      });
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
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });

    }
    setFilteredTransactions(filtered);
  }, [searchTerm, transactionType, dateRange, allTransactions, customDateRange]);

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
          <title>Financial Dashboard - Veeba Foods Customer Portal</title>
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
        <title>Financial Dashboard - Veeba Foods Customer Portal</title>
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
                  Financial Dashboard
                </h1>
                <p className="font-body text-sm md:text-base text-muted-foreground">
                  Comprehensive view of your financial transactions and account status
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  iconName="RefreshCw"
                  iconPosition="left"
                  onClick={() => window.location?.reload()}
                >
                  Sync ERP
                </Button>
                <Button
                  variant="default"
                  iconName="CreditCard"
                  iconPosition="left"
                  onClick={() => setShowPaymentModal(true)}
                >
                  Make Payment
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="font-heading font-semibold text-lg md:text-xl text-foreground mb-4">
                    Recent Transactions
                  </h2>
                  <TransactionFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    transactionType={transactionType}
                    onTypeChange={setTransactionType}
                    dateRange={dateRange}
                    onDateRangeChange={handleDateRangeChange}  // ✅ CHANGE THIS
                    onReset={handleResetFilters}
                  />
                  <TransactionsTable
                    transactions={filteredTransactions}
                    onDownloadPDF={handleDownloadPDF}
                    onViewDetails={handleViewDetails}
                  />
                </div>

                <AgingAnalysisChart data={agingData} />
              </div>

              <div className="space-y-6">
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
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 md:p-8 border border-border shadow-warm-sm">
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
            </div>
          </div>
        </main>
      </div>
      {showPaymentModal && (
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
      )}

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

export default FinancialDashboard;
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
// import { getCustomerLedgerEntries, getCustomerByCustomerId, getCurrentMonthInvoiceAmount, getOverdueInvoiceAmount } from 'services/BusinessCentralAPI';
import { getCustomersByNoList, getSPLedgerEntries, getSPCurrentMonthInvoiceAmount, getSPOverdueInvoiceAmount } from 'services/BusinessCentralAPI';

import CustomDateRangeModal from './components/CustomDateRangeModal';

const BATCH_SIZE = 90;

const parseCustomerList = (customersForSalesperson) => {
  if (!customersForSalesperson) return [];

  return [...new Set(
    customersForSalesperson
      .split('|')
      .map(item => item.trim())
      .filter(Boolean)
  )];
};

const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};


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



const SPFinancialDashboard = () => {
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
  const [assignmentError, setAssignmentError] = useState('');
  const [agingData, setAgingData] = useState([
    { period: '0-30 Days', amount: 0 },
    { period: '31-60 Days', amount: 0 },
    { period: '61-90 Days', amount: 0 },
    { period: '90+ Days', amount: 0 }
  ]);


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
    // {
    //   title: 'Current Month Purchases',
    //   amount: currentMonthAmount
    //     ? `₹${currentMonthAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    //     : '₹0.00',
    //   icon: 'ShoppingCart',
    //   iconColor: 'var(--color-primary)',
    //   bgColor: 'bg-primary/10',
    //   trend: 'up',
    //   trendValue: '12.5%',
    //   subtitle: 'January 2026'
    // },
    // {
    //   title: 'Credit Limit Utilization',
    //   amount: creditUtilization,
    //   icon: 'TrendingUp',
    //   iconColor: 'var(--color-warning)',
    //   bgColor: 'bg-warning/10',
    //   subtitle: '₹12,45,680 / ₹20,00,000'
    // },
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

  const mockTransactions = [];
  // const agingData = [
  //   { period: '0-30 Days', amount: 456780.50 },
  //   { period: '31-60 Days', amount: 345670.00 },
  //   { period: '61-90 Days', amount: 234560.00 },
  //   { period: '90+ Days', amount: 208670.00 }
  // ];

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

        const salespersonCode = localStorage.getItem('salespersonCode');
        const customersForSalesperson = localStorage.getItem('customersForSalesperson');
        const ASOSalespersons = localStorage.getItem('ASOSalespersons');
        const effectiveSalespersonCodes = ASOSalespersons?.trim() ? ASOSalespersons : salespersonCode;

        const showAssignmentAlert = (message) => {
          setAssignmentError(message);
          setAllTransactions([]);
          setFilteredTransactions([]);
          setCustomerFinancialData({ balanceLCY: 0, creditLimitLCY: 0 });
          setCurrentMonthAmount(0);
          setOverdueAmount(0);
          setCreditUtilization('0%');
          setLoading(false);
          // alert(message);
        };


        if (!salespersonCode) {
          console.error('Salesperson code not found');
          navigate('/login');
          return;
        }
        if (!ASOSalespersons || ASOSalespersons.trim() === '') {
          console.error('No ASO salespersons mapped for this salesperson');
          showAssignmentAlert('No ASO salespersons are mapped to the currently logged-in salesperson. Please contact your administrator.');
          return;
        }

        if (!customersForSalesperson || customersForSalesperson.trim() === '') {
          console.error('No customers available for this salesperson');
          showAssignmentAlert('No customers are available for this salesperson. Please contact your administrator.');
          return;
        }

        const customerList = parseCustomerList(customersForSalesperson);
        const customerChunks = chunkArray(customerList, BATCH_SIZE);
        const customerChunkStrings = customerChunks.map(chunk => chunk.join('|'));

        const { startDate, endDate } = getCurrentMonthDateRange();
        const today = getTodayDate();
        console.log('Fetching customer data for month:', startDate, 'to', endDate);

        const customerListPromises = customerChunkStrings.map(chunkStr =>
          getCustomersByNoList(chunkStr)
        );

        const ledgerPromises = customerChunkStrings.map(chunkStr =>
          getSPLedgerEntries(chunkStr, { open: true })
        );

        const [customerListResults,
          ledgerResults,
          // currentMonthResult,
          overdueResult] = await Promise.all([
            Promise.all(customerListPromises),
            Promise.all(ledgerPromises),
            // getSPCurrentMonthInvoiceAmount(effectiveSalespersonCodes, startDate, endDate),
            getSPOverdueInvoiceAmount(effectiveSalespersonCodes, today)
          ]);

        const failedCustomerListResult = customerListResults.find(r => !r?.success);
        const combinedCustomerList = customerListResults.flatMap(r => r?.data || []);

        if (!failedCustomerListResult && combinedCustomerList.length > 0) {
          let totalBalanceLCY = 0;
          let totalCreditLimitLCY = 0;

          combinedCustomerList.forEach(customer => {
            totalBalanceLCY += customer.balanceLCY || 0;
            totalCreditLimitLCY += customer.creditLimitLCY || 0;
          });

          setCustomerFinancialData({
            balanceLCY: totalBalanceLCY,
            creditLimitLCY: totalCreditLimitLCY
          });

          // const utilizationPercentage =
          //   totalCreditLimitLCY > 0 ? (totalBalanceLCY / totalCreditLimitLCY) * 100 : 0;

          // setCreditUtilization(`${utilizationPercentage.toFixed(1)}%`);
        } else {
          console.error('Failed to fetch one or more customer list batches:', failedCustomerListResult?.error);
          setCustomerFinancialData({ balanceLCY: 0, creditLimitLCY: 0 });
          // setCreditUtilization('0%');
        }

        // if (customerResult.success) {
        //   const customerData = customerResult.data;
        //   // console.log('Customer financial data:', customerData);
        //   setCustomerFinancialData(customerData);

        //   const balanceLCY = customerData.balanceLCY || 0;
        //   const creditLimitLCY = customerData.creditLimitLCY || 0;

        //   // const utilizationPercentage = (balanceLCY / creditLimitLCY) * 100;
        //   const utilizationPercentage = creditLimitLCY > 0 ? (balanceLCY / creditLimitLCY) * 100 : 0;
        //   setCreditUtilization(`${utilizationPercentage.toFixed(1)}%`);

        // } else {
        //   console.error('Failed to fetch customer data:', customerResult.error);
        // }


        // if (currentMonthResult.success) {
        //   const monthData = currentMonthResult.data;
        //   // console.log('Current month invoice data:', monthData);
        //   setCurrentMonthAmount(monthData.amount || 0);
        // } else {
        //   console.error('Failed to fetch current month amount:', currentMonthResult.error);
        //   setCurrentMonthAmount(0);
        // }

        if (overdueResult.success) {
          const overdueData = overdueResult.data;
          // console.log('Overdue invoice data:', overdueData);
          setOverdueAmount(overdueData.amount || 0);
        } else {
          console.error('Failed to fetch overdue amount:', overdueResult.error);
          setOverdueAmount(0);
        }

        const failedLedgerResult = ledgerResults.find(r => !r?.success);
        const combinedLedgerEntries = ledgerResults.flatMap(r => r?.data || []);

        if (!failedLedgerResult) {
          const mappedTransactions = combinedLedgerEntries.map((entry, index) => {
            const documentType = entry.documentType?.replace(/_x0020_/g, ' ');

            let type = 'invoice';
            if (documentType === 'Payment') {
              type = 'payment';
            } else if (documentType === 'Credit Memo') {
              type = 'credit_note';
            } else if (documentType === 'Finance Charge Memo') {
              type = 'debit_note';
            } else if (documentType === 'Invoice') {
              type = 'invoice';
            } else if (documentType === 'Order') {
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
              } else {
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
            // const customer = entry.customer?.[0] || {};
            const salesperson = entry.customer?.[0].salesperson?.[0] || {};
            const vp = salesperson.salespersonsHierarchyVP?.[0] || {};
            const nsm = salesperson.salespersonsHierarchyNSM?.[0] || {};
            const rsm = salesperson.salespersonsHierarchyRSM?.[0] || {};
            const zsm = salesperson.salespersonsHierarchyZSM?.[0] || {};
            const asm = salesperson.salespersonsHierarchyASM?.[0] || {};
            const aso = salesperson.salespersonsHierarchyASO?.[0] || {};

            return {
              id: entry.ledgerEntryNo,
              type: documentType,
              date: entry.postingDate,
              reference: entry.documentNo,
              externalReference: entry.externalDocumentNo || '',
              amount: Math.abs(entry.amountLCY),
              status: status,
              dueDate: entry.dueDate,
              paymentMode: type === 'payment' ? 'Bank Transfer' : null,
              originalAmount: entry.originalAmtLCY,
              remainingAmt: entry.remainingAmount,
              remainingAmtLCY: entry.remainingAmtLCY,
              customerNo: entry.customerNo,
              customerName: entry.customer?.[0].name || '',
              salespersonCode: salesperson.code || '',
              salespersonName: salesperson.name || '',
              salespersonLevel: salesperson.level || '',

              vpCode: vp.code || salesperson.vpCode || '',
              vpName: vp.name || '',

              nsmCode: nsm.code || salesperson.nsmCode || '',
              nsmName: nsm.name || '',

              rsmCode: rsm.code || salesperson.rsmCode || '',
              rsmName: rsm.name || '',

              zsmCode: zsm.code || salesperson.zsmCode || '',
              zsmName: zsm.name || '',

              asmCode: asm.code || salesperson.asmCode || '',
              asmName: asm.name || '',

              asoCode: aso.code || salesperson.asoCode || '',
              asoName: aso.name || ''
            };
          });
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const agingBuckets = {
            '0-30 Days': 0,
            '31-60 Days': 0,
            '61-90 Days': 0,
            '90+ Days': 0
          };

          combinedLedgerEntries.forEach((entry) => {
            const documentType = entry.documentType?.replace(/_x0020_/g, ' ') || '';

            if (documentType !== 'Invoice') return;
            if (!entry.dueDate) return;

            const dueDate = new Date(entry.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            const diffTime = today.getTime() - dueDate.getTime();
            const overdueDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (overdueDays <= 0) return;

            // const amount = Math.abs(Number(entry.remainingAmtLCY ?? entry.remainingAmount ?? entry.amountLCY ?? 0));
            const amount = Math.abs(Number(entry.remainingAmount ?? entry.remainingAmtLCY ?? entry.amount ?? 0));

            if (overdueDays <= 30) {
              agingBuckets['0-30 Days'] += amount;
            } else if (overdueDays <= 60) {
              agingBuckets['31-60 Days'] += amount;
            } else if (overdueDays <= 90) {
              agingBuckets['61-90 Days'] += amount;
            } else {
              agingBuckets['90+ Days'] += amount;
            }
          });

          setAgingData([
            { period: '0-30 Days', amount: agingBuckets['0-30 Days'] },
            { period: '31-60 Days', amount: agingBuckets['31-60 Days'] },
            { period: '61-90 Days', amount: agingBuckets['61-90 Days'] },
            { period: '90+ Days', amount: agingBuckets['90+ Days'] }
          ]);

          setAllTransactions(mappedTransactions);
          setFilteredTransactions(mappedTransactions);
        } else {
          console.error('Failed to fetch one or more ledger batches:', failedLedgerResult?.error);
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
      const searchLower = searchTerm.toLowerCase();

      filtered = filtered.filter(t =>
        t?.reference?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        t?.amount?.toString()?.includes(searchTerm) ||
        t?.externalReference?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        t?.customerNo?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        t?.customerName?.toLowerCase()?.includes(searchLower) ||
        t?.salespersonCode?.toLowerCase()?.includes(searchLower) ||
        t?.salespersonName?.toLowerCase()?.includes(searchLower) ||
        t?.salespersonLevel?.toLowerCase()?.includes(searchLower) ||
        t?.vpName?.toLowerCase()?.includes(searchLower) ||
        t?.nsmName?.toLowerCase()?.includes(searchLower) ||
        t?.rsmName?.toLowerCase()?.includes(searchLower) ||
        t?.zsmName?.toLowerCase()?.includes(searchLower) ||
        t?.asmName?.toLowerCase()?.includes(searchLower) ||
        t?.asoName?.toLowerCase()?.includes(searchLower)
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
  const handleDownloadAllEntries = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      alert('No transactions to download.');
      return;
    }

    const headers = [
      'Type',
      'Date',
      'Due Date',
      'Reference',
      'Customer No',
      'Customer Name',
      'Amount',
      'Remaining Amount',
      'Status',
      'Salesperson Code',
      'Salesperson Name',
      'Salesperson Level',
      'NSM Name',
      'RSM Name',
      'ZSM Name',
      'ASM Name',
      'ASO Name',
      'VP Name'
    ];
    const rows = filteredTransactions.map(t => [
      t.type || '',
      t.date || '',
      t.dueDate || '',
      t.reference || '',
      t.customerNo || '',
      t.customerName || '',
      t.amount?.toFixed(2) || '0.00',
      t.remainingAmtLCY !== undefined ? Math.abs(t.remainingAmtLCY).toFixed(2) : '0.00',
      t.status || '',
      t.salespersonCode || '',
      t.salespersonName || '',
      t.salespersonLevel || '',
      t.nsmName || '',
      t.rsmName || '',
      t.zsmName || '',
      t.asmName || '',
      t.asoName || '',
      t.vpName || ''
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

  const creditLimit = customerFinancialData?.creditLimitLCY || 0;
  const outstandingBalance = customerFinancialData?.balanceLCY || 0;
  const availableCredit = Math.max(creditLimit - outstandingBalance, 0);

  const totalInvoices = allTransactions.filter((t) => t?.type === 'Invoice').length;
  const totalPayments = allTransactions.filter((t) => t?.type === 'Payment').length;

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
        <title>Financial Dashboard - Veeba Food Salesperson Portal</title>
        <meta name="description" content="View aggregated financial information, outstanding balances, and transaction history for assigned customers" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-16">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <Breadcrumb />
            {assignmentError && (
              <div className="mb-6 md:mb-8">
                <div className="bg-error/10 border border-error/30 rounded-xl p-4 md:p-5 flex items-start gap-3">
                  <Icon name="AlertTriangle" size={24} color="var(--color-error)" className="flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-sm md:text-base text-foreground mb-1">
                      Assignment Alert
                    </h3>
                    <p className="font-body text-sm text-muted-foreground">
                      {assignmentError}
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                {/* <Button
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
                </Button> */}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              {financialMetrics?.map((metric, index) => (
                <FinancialMetricCard key={index} {...metric} />
              ))}
            </div>

            {/* <div className="mb-6 md:mb-8">
              <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 md:p-5 flex items-start gap-3">
                <Icon name="AlertTriangle" size={24} color="var(--color-warning)" className="flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-sm md:text-base text-foreground mb-1">
                    Credit Limit Alert
                  </h3>
                  <p className="font-body text-sm text-muted-foreground">
                    You have utilized {creditUtilization} of your credit limit.
                  </p>
                </div>
              </div>
            </div> */}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-6 md:mb-8">
              <div className="lg:col-span-12 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading font-semibold text-lg md:text-xl text-foreground">
                      Recent Transactions
                    </h2>
                    <Button
                      variant="outline"
                      iconName="Download"
                      iconPosition="left"
                      onClick={handleDownloadAllEntries}
                    >
                      Download All Entries
                    </Button>
                  </div>
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

              {/* <div className="lg:col-span-2 space-y-6">
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
                    {/* <div className="flex justify-between">
                      <span className="font-caption text-sm text-muted-foreground">Credit Period</span>
                      <span className="font-body text-sm text-foreground">30 Days</span>
                    </div> */}

                    {creditLimit > 0 && (
                      <div className="flex justify-between">
                        <span className="font-caption text-sm text-muted-foreground">Credit Limit</span>
                        <span className="font-body text-sm text-foreground data-text">
                          ₹{creditLimit.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </span>
                      </div>
                    )}

                    {creditLimit > 0 && (
                      <div className="flex justify-between">
                        <span className="font-caption text-sm text-muted-foreground">Available Credit</span>
                        <span className="font-body text-sm text-success data-text">
                          ₹{availableCredit.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-heading font-medium text-sm text-foreground">Account Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-caption text-sm text-muted-foreground">Total Invoices (MTD)</span>
                      <span className="font-body text-sm text-foreground">{totalInvoices}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-caption text-sm text-muted-foreground">Total Payments (MTD)</span>
                      <span className="font-body text-sm text-foreground">{totalPayments}</span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span className="font-caption text-sm text-muted-foreground">Average Payment Days</span>
                      <span className="font-body text-sm text-foreground">28 Days</span>
                    </div> */}
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

export default SPFinancialDashboard;
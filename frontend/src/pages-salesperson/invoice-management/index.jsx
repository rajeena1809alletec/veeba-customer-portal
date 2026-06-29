import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import { getSPDispatchDetails, getSPPendingInvoiceAmount, getSPOverdueInvoiceAmount } from 'services/BusinessCentralAPI';
import Icon from 'components/AppIcon';

import Button from '../../components/ui/Button';
import InvoiceFilters from './components/InvoiceFilters';
import InvoiceSummary from './components/InvoiceSummary';
import InvoiceTable from './components/InvoiceTable';
// import BulkActions from './components/BulkActions';

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
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const SPInvoiceManagement = () => {
  const [filters, setFilters] = useState({
    search: '',
    dateRange: 'all',
    fromDate: '',
    toDate: ''
  });

  // const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allInvoices, setAllInvoices] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalInvoiced: 0,
    pendingPayments: 0,
    pendingCount: 0,
    overdueAmount: 0,
    overdueCount: 0,
    totalGST: 0
  });

  const mockInvoices = [
    {
      id: 1,
      invoiceNumber: "INV-2026-0847",
      orderRef: "ORD-2026-1234",
      date: "05/01/2026",
      amount: 27384.50,
      gst: 4929.21,
      status: "paid",
      type: "invoice"
    },
    {
      id: 2,
      invoiceNumber: "INV-2026-0846",
      orderRef: "ORD-2026-1198",
      date: "03/01/2026",
      amount: 45678.90,
      gst: 8222.20,
      status: "pending",
      type: "invoice"
    }
  ];

  // const summaryData = {
  //   totalInvoiced: 384326.75,
  //   pendingPayments: 75555.30,
  //   pendingCount: 2,
  //   overdueAmount: 135791.55,
  //   overdueCount: 2,
  //   totalGST: 69173.41
  // };
  useEffect(() => {
    applyFilters();
  }, [filters, allInvoices]);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        setLoading(true);

        const salespersonCode = localStorage.getItem('salespersonCode');
        const customersForSalesperson = localStorage.getItem('customersForSalesperson');
        const ASOSalespersons = localStorage.getItem('ASOSalespersons');
        const effectiveSalespersonCodes = ASOSalespersons?.trim() ? ASOSalespersons : salespersonCode;

        if (!salespersonCode) {
          console.error('Salesperson code not found');
          navigate('/login');
          return;
        }

        if (!customersForSalesperson || customersForSalesperson.trim() === '') {
          console.error('No customers available for this salesperson');
          setAllInvoices([]);
          setFilteredInvoices([]);
          setLoading(false);
          return;
        }

        const { startDate, endDate } = getCurrentFinancialYearDateRange();
        console.log('Fetching invoice data for financial year:', startDate, 'to', endDate);

        const today = getTodayDate();

        const customerList = parseCustomerList(customersForSalesperson);
        const customerChunks = chunkArray(customerList, BATCH_SIZE);

        const dispatchPromises = customerChunks.map(chunk =>
          getSPDispatchDetails(chunk.join(' | '), startDate, endDate)
        );

        const [dispatchResults,
          // pendingResult,
          // overdueResult
        ] = await Promise.all([
          Promise.all(dispatchPromises),
          // getSPPendingInvoiceAmount(effectiveSalespersonCodes),
          // getSPOverdueInvoiceAmount(effectiveSalespersonCodes, today)
        ]);

        const failedDispatchResult = dispatchResults.find(r => !r?.success);

        if (!failedDispatchResult) {
          const combinedDispatchData = dispatchResults.flatMap(r => r?.data || []);

          const mapped = combinedDispatchData.map((entry, index) => {
            const salesperson = entry.customer?.[0]?.salesperson?.[0] || {};

            return {
              id: entry.no || index + 1,
              invoiceNumber: entry.no || '',
              orderRef: entry.orderNo || '',
              date: entry.postingDate || '',
              amount: Number(entry.amount || 0),
              gst: Number(entry.gstAmount || 0),
              status: entry.status?.toLowerCase() || 'pending',
              type: entry.documentType?.toLowerCase() || 'invoice',
              customerNo: entry.sellToCustomerNo || '',
              salespersonCode: salesperson.code || '',
              salespersonName: salesperson.name || '',
              salespersonLevel: salesperson.level || '',
              nsmName: salesperson.salespersonsHierarchyNSM?.[0]?.name || '',
              rsmName: salesperson.salespersonsHierarchyRSM?.[0]?.name || '',
              zsmName: salesperson.salespersonsHierarchyZSM?.[0]?.name || '',
              asmName: salesperson.salespersonsHierarchyASM?.[0]?.name || '',
              asoName: salesperson.salespersonsHierarchyASO?.[0]?.name || '',
              vpName: salesperson.salespersonsHierarchyVP?.[0]?.name || ''
            };
          });

          setAllInvoices(mapped);
          setFilteredInvoices(mapped);

          // k
        } else {
          console.error('One or more dispatch batch calls failed:', failedDispatchResult?.error);
          setAllInvoices([]);
          setFilteredInvoices([]);
        }
      } catch (error) {
        console.error('Error fetching invoice data:', error);
        setAllInvoices([]);
        setFilteredInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [navigate]);


  const applyFilters = () => {
    let filtered = [...allInvoices];

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase().trim();
      filtered = filtered.filter(
        inv =>
          inv?.invoiceNumber?.toLowerCase()?.includes(searchLower) ||
          inv?.orderRef?.toLowerCase()?.includes(searchLower) ||
          inv?.customerNo?.toLowerCase()?.includes(searchLower) ||
          // inv?.salespersonCode?.toLowerCase()?.includes(searchLower) ||
          inv?.salespersonName?.toLowerCase()?.includes(searchLower) ||
          inv?.salespersonLevel?.toLowerCase()?.includes(searchLower) ||
          inv?.nsmName?.toLowerCase()?.includes(searchLower) ||
          inv?.rsmName?.toLowerCase()?.includes(searchLower) ||
          inv?.zsmName?.toLowerCase()?.includes(searchLower) ||
          inv?.asmName?.toLowerCase()?.includes(searchLower) ||
          inv?.asoName?.toLowerCase()?.includes(searchLower) ||
          inv?.vpName?.toLowerCase()?.includes(searchLower)
      );
    }

    if (filters?.dateRange && filters.dateRange !== 'all') {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();

      let startDate;
      let endDate = new Date();

      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(today);
          startDate.setHours(0, 0, 0, 0);

          endDate = new Date(today);
          endDate.setHours(23, 59, 59, 999);
          break;

        case 'week': {
          const dayOfWeek = today.getDay();
          startDate = new Date(today);
          startDate.setDate(today.getDate() - dayOfWeek);
          startDate.setHours(0, 0, 0, 0);

          endDate = new Date(today);
          endDate.setHours(23, 59, 59, 999);
          break;
        }

        case 'month':
          startDate = new Date(currentYear, currentMonth, 1);
          startDate.setHours(0, 0, 0, 0);

          endDate = new Date(currentYear, currentMonth + 1, 0);
          endDate.setHours(23, 59, 59, 999);
          break;

        case 'quarter': {
          const currentQuarter = Math.floor(currentMonth / 3);
          const quarterStartMonth = currentQuarter * 3;

          startDate = new Date(currentYear, quarterStartMonth, 1);
          startDate.setHours(0, 0, 0, 0);

          endDate = new Date(currentYear, quarterStartMonth + 3, 0);
          endDate.setHours(23, 59, 59, 999);
          break;
        }

        case 'year':
          startDate = new Date(currentYear, 0, 1);
          startDate.setHours(0, 0, 0, 0);

          endDate = new Date(currentYear, 11, 31);
          endDate.setHours(23, 59, 59, 999);
          break;

        default:
          startDate = new Date(0);
          endDate = new Date();
          endDate.setHours(23, 59, 59, 999);
          break;
      }

      filtered = filtered.filter(inv => {
        const invoiceDate = new Date(inv.date);
        return !isNaN(invoiceDate) && invoiceDate >= startDate && invoiceDate <= endDate;
      });
    }

    setFilteredInvoices(filtered);
  };

  // const applyFilters = () => {
  //   let filtered = [...allInvoices];

  //   if (filters?.search) {
  //     const searchLower = filters?.search?.toLowerCase();
  //     filtered = filtered?.filter(
  //       inv =>
  //         inv?.invoiceNumber?.toLowerCase()?.includes(searchLower) ||
  //         inv?.orderRef?.toLowerCase()?.includes(searchLower)
  //     );
  //   }

  // if (filters?.status !== 'all') {
  //   filtered = filtered?.filter(inv => inv?.status === filters?.status);
  // }

  // if (filters?.type !== 'all') {
  //   filtered = filtered?.filter(inv => inv?.type === filters?.type);
  // }

  // if (filters?.minAmount) {
  //   filtered = filtered?.filter(inv => inv?.amount >= parseFloat(filters?.minAmount));
  // }

  // if (filters?.maxAmount) {
  //   filtered = filtered?.filter(inv => inv?.amount <= parseFloat(filters?.maxAmount));
  // }
  // if (filters?.fromDate) {
  //   const from = new Date(filters.fromDate);
  //   filtered = filtered.filter(inv => {
  //     const invDate = new Date(inv.date);
  //     return !isNaN(invDate) && invDate >= from;
  //   });
  // }

  // if (filters?.toDate) {
  //   const to = new Date(filters.toDate);
  //   to.setHours(23, 59, 59, 999);
  //   filtered = filtered.filter(inv => {
  //     const invDate = new Date(inv.date);
  //     return !isNaN(invDate) && invDate <= to;
  //   });
  // }

  //   setFilteredInvoices(filtered);
  // };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      dateRange: 'all',
      fromDate: '',
      toDate: ''
    });
    setFilteredInvoices(allInvoices);
  };

  // const handleSelectInvoice = (id) => {
  //   setSelectedInvoices(prev =>
  //     prev?.includes(id) ? prev?.filter(i => i !== id) : [...prev, id]
  //   );
  // };

  // const handleSelectAll = () => {
  //   if (selectedInvoices?.length === filteredInvoices?.length) {
  //     setSelectedInvoices([]);
  //   } else {
  //     setSelectedInvoices(filteredInvoices?.map(inv => inv?.id));
  //   }
  // };


  // const handleClearSelection = () => {
  //   setSelectedInvoices([]);
  // };

  const handleDownloadEntries = () => {
    if (!filteredInvoices.length) {
      alert('No invoices to download.');
      return;
    }

    const headers = [
      'Invoice Number',
      'Order Ref',
      'Customer No',
      'Date',
      'Amount',
      // 'Salesperson Code',
      'Salesperson Name',
      'Salesperson Level',
      'NSM Name',
      'RSM Name',
      'ZSM Name',
      'ASM Name',
      'ASO Name',
      'VP Name'
    ];
    const rows = filteredInvoices.map(inv => [
      inv.invoiceNumber || '',
      inv.orderRef || '',
      inv.customerNo || '',
      inv.date || '',
      inv.amount ?? 0,
      // inv.salespersonCode || '',
      inv.salespersonName || '',
      inv.salespersonLevel || '',
      inv.nsmName || '',
      inv.rsmName || '',
      inv.zsmName || '',
      inv.asmName || '',
      inv.asoName || '',
      inv.vpName || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice_entries_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };



  if (loading) {
    return (
      <>
        <Helmet>
          <title>Invoice Management - Veeba Customer Portal</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-16">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading invoice data...</p>
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
        <title>Invoice Management - Veeba Customer Portal</title>
        <meta
          name="description"
          content="Access, download, and manage your invoices and credit notes with comprehensive search and filtering capabilities"
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-16">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <Breadcrumb />

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
              <div>
                <h1 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-foreground mb-2">
                  Invoice Management
                </h1>
                <p className="font-caption text-sm md:text-base text-muted-foreground">
                  Access and manage your invoices, credit notes, and payment records
                </p>
              </div>
              <Button
                variant="default"
                iconName="Download"
                iconPosition="left"
                onClick={handleDownloadEntries}
              >
                Download Entries
              </Button>
            </div>

            {/* Summary Cards */}
            {/* <div className="mb-6 md:mb-8">
              <InvoiceSummary summary={summaryData} />
            </div> */}

            {/* Filters */}
            <div className="mb-6">
              <InvoiceFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                onApply={applyFilters}
              />
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <p className="font-caption text-sm text-muted-foreground">
                Showing {filteredInvoices?.length} of {allInvoices?.length} invoices
              </p>
              {/* {selectedInvoices?.length > 0 && (
                <p className="font-caption text-sm text-primary font-medium">
                  {selectedInvoices?.length} selected
                </p>
              )} */}
            </div>

            {/* Invoice Table */}
            <InvoiceTable
              invoices={filteredInvoices}
            // selectedInvoices={selectedInvoices}
            // onSelectInvoice={handleSelectInvoice}
            // onSelectAll={handleSelectAll}
            />

            {/* Bulk Actions */}
            {/* <BulkActions
              selectedCount={selectedInvoices?.length}
              onDownloadAll={handleDownloadAll}
              onClearSelection={handleClearSelection}
            /> */}
          </div>
        </main>
      </div>
    </>
  );
};

export default SPInvoiceManagement;
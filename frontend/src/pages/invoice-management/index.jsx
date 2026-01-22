import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';

import Button from '../../components/ui/Button';
import InvoiceFilters from './components/InvoiceFilters';
import InvoiceSummary from './components/InvoiceSummary';
import InvoiceTable from './components/InvoiceTable';
import BulkActions from './components/BulkActions';

const InvoiceManagement = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    type: 'all',
    fromDate: '',
    toDate: '',
    minAmount: '',
    maxAmount: ''
  });

  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);

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
    },
    {
      id: 3,
      invoiceNumber: "CN-2026-0124",
      orderRef: "ORD-2026-1156",
      date: "02/01/2026",
      amount: 8450.00,
      gst: 1521.00,
      status: "paid",
      type: "credit_note"
    },
    {
      id: 4,
      invoiceNumber: "INV-2026-0845",
      orderRef: "ORD-2026-1187",
      date: "28/12/2025",
      amount: 62340.75,
      gst: 11221.34,
      status: "overdue",
      type: "invoice"
    },
    {
      id: 5,
      invoiceNumber: "INV-2026-0844",
      orderRef: "ORD-2026-1165",
      date: "26/12/2025",
      amount: 38920.40,
      gst: 7005.67,
      status: "partially_paid",
      type: "invoice"
    },
    {
      id: 6,
      invoiceNumber: "INV-2026-0843",
      orderRef: "ORD-2026-1143",
      date: "22/12/2025",
      amount: 51234.60,
      gst: 9222.23,
      status: "paid",
      type: "invoice"
    },
    {
      id: 7,
      invoiceNumber: "INV-2026-0842",
      orderRef: "ORD-2026-1121",
      date: "20/12/2025",
      amount: 29876.30,
      gst: 5377.73,
      status: "pending",
      type: "invoice"
    },
    {
      id: 8,
      invoiceNumber: "CN-2026-0123",
      orderRef: "ORD-2026-1098",
      date: "18/12/2025",
      amount: 5670.00,
      gst: 1020.60,
      status: "paid",
      type: "credit_note"
    },
    {
      id: 9,
      invoiceNumber: "INV-2026-0841",
      orderRef: "ORD-2026-1087",
      date: "15/12/2025",
      amount: 73450.80,
      gst: 13221.14,
      status: "overdue",
      type: "invoice"
    },
    {
      id: 10,
      invoiceNumber: "INV-2026-0840",
      orderRef: "ORD-2026-1054",
      date: "12/12/2025",
      amount: 41290.50,
      gst: 7432.29,
      status: "paid",
      type: "invoice"
    }
  ];

  const summaryData = {
    totalInvoiced: 384326.75,
    pendingPayments: 75555.30,
    pendingCount: 2,
    overdueAmount: 135791.55,
    overdueCount: 2,
    totalGST: 69173.41
  };

  useEffect(() => {
    applyFilters();
  }, []);

  const applyFilters = () => {
    let filtered = [...mockInvoices];

    if (filters?.search) {
      const searchLower = filters?.search?.toLowerCase();
      filtered = filtered?.filter(
        inv =>
          inv?.invoiceNumber?.toLowerCase()?.includes(searchLower) ||
          inv?.orderRef?.toLowerCase()?.includes(searchLower)
      );
    }

    if (filters?.status !== 'all') {
      filtered = filtered?.filter(inv => inv?.status === filters?.status);
    }

    if (filters?.type !== 'all') {
      filtered = filtered?.filter(inv => inv?.type === filters?.type);
    }

    if (filters?.minAmount) {
      filtered = filtered?.filter(inv => inv?.amount >= parseFloat(filters?.minAmount));
    }

    if (filters?.maxAmount) {
      filtered = filtered?.filter(inv => inv?.amount <= parseFloat(filters?.maxAmount));
    }

    setFilteredInvoices(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      type: 'all',
      fromDate: '',
      toDate: '',
      minAmount: '',
      maxAmount: ''
    });
    setFilteredInvoices(mockInvoices);
  };

  const handleSelectInvoice = (id) => {
    setSelectedInvoices(prev =>
      prev?.includes(id) ? prev?.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedInvoices?.length === filteredInvoices?.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices?.map(inv => inv?.id));
    }
  };

  const handleDownloadAll = () => {
    console.log('Downloading selected invoices:', selectedInvoices);
    alert(`Downloading ${selectedInvoices?.length} invoice(s)...`);
  };

  const handleClearSelection = () => {
    setSelectedInvoices([]);
  };

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
              >
                Export All
              </Button>
            </div>

            {/* Summary Cards */}
            <div className="mb-6 md:mb-8">
              <InvoiceSummary summary={summaryData} />
            </div>

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
                Showing {filteredInvoices?.length} of {mockInvoices?.length} invoices
              </p>
              {selectedInvoices?.length > 0 && (
                <p className="font-caption text-sm text-primary font-medium">
                  {selectedInvoices?.length} selected
                </p>
              )}
            </div>

            {/* Invoice Table */}
            <InvoiceTable
              invoices={filteredInvoices}
              selectedInvoices={selectedInvoices}
              onSelectInvoice={handleSelectInvoice}
              onSelectAll={handleSelectAll}
            />

            {/* Bulk Actions */}
            <BulkActions
              selectedCount={selectedInvoices?.length}
              onDownloadAll={handleDownloadAll}
              onClearSelection={handleClearSelection}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default InvoiceManagement;
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import CustomerFilters from './components/CustomerFilters';
import CustomersTable from './components/CustomerTable';
import { getCustomersByNoListExpanded, getSPOverdueInvoiceAmount } from 'services/BusinessCentralAPI';
import FinancialMetricCard from './components/FinancialMetricCard';
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
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


const SPCustomers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [totalOverdueAmount, setTotalOverdueAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const financialMetrics = [
    {
      title: 'Total Outstanding',
      amount: `₹${totalOutstanding.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      icon: 'Wallet',
      iconColor: 'var(--color-error)',
      bgColor: 'bg-error/10',
      subtitle: 'Across all customers'
    },
    {
      title: 'Overdue Amount',
      amount: `₹${Math.abs(totalOverdueAmount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      icon: 'AlertCircle',
      iconColor: 'var(--color-error)',
      bgColor: 'bg-error/10',
      subtitle: 'Across all customers'
    }
  ];
  useEffect(() => {
    const fetchCustomers = async () => {
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
          setAllCustomers([]);
          setFilteredCustomers([]);
          setTotalOutstanding(0);
          setTotalOverdueAmount(0);
          return;
        }

        const customerList = parseCustomerList(customersForSalesperson);
        const customerChunks = chunkArray(customerList, BATCH_SIZE);

        const customerPromises = customerChunks.map(chunk =>
          getCustomersByNoListExpanded(chunk.join('|'))
        );

        const today = getTodayDate();

        const [customerResults, overdueResult] = await Promise.all([
          Promise.all(customerPromises),
          getSPOverdueInvoiceAmount(effectiveSalespersonCodes, today)
        ]);

        const failedCustomerResult = customerResults.find(r => !r?.success);

        if (!failedCustomerResult) {
          const combinedCustomerData = customerResults.flatMap(r => r?.data || []);

          const mapped = combinedCustomerData.map((customer) => {
            const salesperson = customer.salesperson?.[0] || {};

            return {
              id: customer.no || '',
              code: customer.no || '',
              name: customer.name || '',
              contactName: customer.contactName || '',
              email: customer.email || '',
              city: customer.billingCity || '',
              state: customer.billingState || '',
              paymentTermCode: customer.paymentTermsCode || '',
              creditLimit: customer.creditLimitLCY || 0,
              outstanding: customer.balanceLCY || 0,
              overdueAmount: customer.overdueAmounts,

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
          const totalOutstandingValue = combinedCustomerData.reduce(
            (sum, customer) => sum + (customer.balanceLCY || 0),
            0
          );

          setTotalOutstanding(totalOutstandingValue);

          if (overdueResult?.success) {
            setTotalOverdueAmount(overdueResult.data?.amount || 0);
          } else {
            console.error('Failed to fetch overdue amount:', overdueResult?.error);
            setTotalOverdueAmount(0);
          }

          setAllCustomers(mapped);
          setFilteredCustomers(mapped);
        } else {
          console.error('One or more customer batch calls failed:', failedCustomerResult?.error);
          setAllCustomers([]);
          setFilteredCustomers([]);
          setTotalOutstanding(0);
          setTotalOverdueAmount(0);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
        setAllCustomers([]);
        setFilteredCustomers([]);
        setTotalOutstanding(0);
        setTotalOverdueAmount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [navigate]);

  useEffect(() => {
    let filtered = [...allCustomers];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase().trim();

      filtered = filtered.filter(c =>
        c?.code?.toLowerCase()?.includes(searchLower) ||
        c?.name?.toLowerCase()?.includes(searchLower) ||
        c?.contactName?.toLowerCase()?.includes(searchLower) ||
        c?.email?.toLowerCase()?.includes(searchLower) ||
        c?.city?.toLowerCase()?.includes(searchLower) ||
        c?.state?.toLowerCase()?.includes(searchLower) ||
        c?.paymentTermCode?.toLowerCase()?.includes(searchLower) ||
        c?.salespersonCode?.toLowerCase()?.includes(searchLower) ||
        c?.salespersonName?.toLowerCase()?.includes(searchLower) ||
        c?.salespersonLevel?.toLowerCase()?.includes(searchLower) ||
        c?.nsmName?.toLowerCase()?.includes(searchLower) ||
        c?.rsmName?.toLowerCase()?.includes(searchLower) ||
        c?.zsmName?.toLowerCase()?.includes(searchLower) ||
        c?.asmName?.toLowerCase()?.includes(searchLower) ||
        c?.asoName?.toLowerCase()?.includes(searchLower) ||
        c?.vpName?.toLowerCase()?.includes(searchLower)
      );
    }

    setFilteredCustomers(filtered);
  }, [searchTerm, allCustomers]);


  const handleResetFilters = () => {
    setSearchTerm('');
  };


  const handleDownloadAllCustomers = () => {
    if (!filteredCustomers || filteredCustomers.length === 0) {
      alert('No customer entries to download.');
      return;
    }

    const headers = [
      'Code',
      'Name',
      'City',
      'State',
      'Payment Term Code',
      'Credit Limit',
      'Outstanding',
      'overdueAmount',
      'Salesperson Code',
      'Salesperson Name',
      'Salesperson Level',
      'NSM Name',
      'RSM Name',
      'ZSM Name',
      'ASM Name',
      'ASO Name',
      'VP Name',
      'Contact Name',
      'E-mail ID'
    ];

    const rows = filteredCustomers.map(c => [
      c.code || '',
      c.name || '',
      c.city || '',
      c.state || '',
      c.paymentTermCode || '',
      c.creditLimit || 0,
      c.outstanding || 0,
      c.overdueAmount || 0,
      c.salespersonCode || '',
      c.salespersonName || '',
      c.salespersonLevel || '',
      c.nsmName || '',
      c.rsmName || '',
      c.zsmName || '',
      c.asmName || '',
      c.asoName || '',
      c.vpName || '',
      c.contactName || '',
      c.email || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sp_customers_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleViewDetails = (customer) => {
    const customerNo = encodeURIComponent(customer?.code || '');
    const customerName = encodeURIComponent(customer?.name || '');

    navigate(`/sp-customer-financial-entries?customerNo=${customerNo}&customerName=${customerName}`);
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Customers - Veeba Foods Customer Portal</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-16">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading customer data...</p>
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
        <title>Customers - Veeba Foods Customer Portal</title>
        <meta name="description" content="View all customers mapped to the salesperson" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-16">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <Breadcrumb />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
              <div>
                <h1 className="font-heading font-semibold text-2xl md:text-3xl lg:text-4xl text-foreground mb-2">
                  Customers
                </h1>
                <p className="font-body text-sm md:text-base text-muted-foreground">
                  Comprehensive view of all customers mapped to the salesperson
                </p>
              </div>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              {financialMetrics.map((metric, index) => (
                <FinancialMetricCard key={index} {...metric} />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 md:gap-8 mb-6 md:mb-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading font-semibold text-lg md:text-xl text-foreground">
                      All Customers
                    </h2>

                    <Button
                      variant="outline"
                      iconName="Download"
                      iconPosition="left"
                      onClick={handleDownloadAllCustomers}
                    >
                      Download All Customers
                    </Button>
                  </div>
                  <CustomerFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onReset={handleResetFilters}
                  />
                  <CustomersTable
                    customers={filteredCustomers}
                    onViewDetails={handleViewDetails}
                  />
                </div>
              </div>
            </div>


          </div>
        </main>
      </div>
    </>
  );
};

export default SPCustomers;
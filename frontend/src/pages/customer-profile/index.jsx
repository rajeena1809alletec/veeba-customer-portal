import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import CompanyInfoTab from './components/CompanyInfoTab';
import ContactDetailsTab from './components/ContactDetailsTab';
import AddressManagementTab from './components/AddressManagementTab';
import FinancialInfoTab from './components/FinancialInfoTab';
import DocumentsTab from './components/DocumentsTab';
import ChangeHistoryTab from './components/ChangeHistoryTab';

import { useNavigate } from 'react-router-dom';
import { getCustomerByCustomerId } from 'services/BusinessCentralAPI';


const CustomerProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('company');

  const [companyData, setCompanyData] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [financialData, setFinancialData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [changeHistory, setChangeHistory] = useState([]);


  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get customerId from localStorage - CHANGED FROM EMAIL
        const customerId = localStorage.getItem('customerId');

        if (!customerId) {
          setError('Customer ID not found. Please login again.');
          navigate('/login');
          return;
        }

        // Fetch customer data from BC - CHANGED FUNCTION CALL
        const result = await getCustomerByCustomerId(customerId);

        if (result.success) {
          const customerData = result.data;
          console.log('Customer data fetched:', customerData);

          // Map BC data to your component structure
          setCompanyData({
            legalName: customerData.name || 'N/A',
            tradeName: customerData.name || 'N/A',
            customerCode: customerData.no || 'N/A',
            businessType: customerData.businessType, // Default or from custom field
            gstNumber: customerData.gstNumber || 'N/A',
            panNumber: customerData.panNo, // Add if you have this field in BC
            registrationDate: 'N/A', // Add if you have this field in BC
            website: customerData.homePage, // Add if you have this field in BC
            categories: ['Distributor'] // Default or from custom field
          });

          // Map contact details
          setContacts([{
            id: 1,
            name: customerData.name || 'N/A',
            designation: 'Primary Contact',
            email: customerData.email || 'N/A',
            phone: customerData.mobilePhoneNo || 'N/A',
            department: '',
            isPrimary: true
          }]);

          // Map addresses
          const addressList = [];

          // Billing Address
          if (customerData.billingAddress1) {
            addressList.push({
              id: 1,
              label: 'Billing Address',
              type: 'Billing',
              street: `${customerData.billingAddress1}${customerData.billingAddress2 ? ', ' + customerData.billingAddress2 : ''}`,
              city: customerData.billingCity || 'N/A',
              state: customerData.billingState || 'N/A',
              pinCode: customerData.billingPincode || 'N/A',
              gstNumber: customerData.gstNumber || 'N/A',
              isDefault: true
            });
          }

          // Shipping Addresses (if available from shipToAddresses part)
          // Note: You'll need to expand shipToAddresses in the API call or fetch separately

          setAddresses(addressList);

          // Set default financial data (customize based on your BC fields)
          setFinancialData({
            creditLimit: customerData.creditLimitLCY,
            creditUsed: 0,
            paymentTerms: 'Net 30 Days',
            priceList: 'Standard',
            discountTier: 'Standard',
            customerCategory: 'Regular',
            currency: 'INR (₹)',
            tradeDiscount: '0%',
            schemeEligible: false,
            lastReviewDate: 'N/A',
            nextReviewDate: 'N/A',
            creditRating: 'N/A'
          });

          // Initialize empty arrays for documents and history
          setDocuments([]);
          setChangeHistory([]);

        } else {
          setError(result.error || 'Failed to fetch customer data');
        }
      } catch (err) {
        console.error('Error in fetchCustomerData:', err);
        setError('An unexpected error occurred while fetching customer data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, [navigate]);

  // const companyData = {
  //   legalName: "Sharma Distributors Private Limited",
  //   tradeName: "Sharma Foods & Beverages",
  //   customerCode: "CUST-2024-00156",
  //   businessType: "Private Limited Company",
  //   gstNumber: "27AABCS1234F1Z5",
  //   panNumber: "AABCS1234F",
  //   registrationDate: "15/03/2018",
  //   website: "https://www.sharmafoods.com",
  //   categories: ["Distributor", "Wholesaler", "B2B Supplier"]
  // };

  // const contacts = [
  //   {
  //     id: 1,
  //     name: "Rajesh Sharma",
  //     designation: "Managing Director",
  //     email: "rajesh.sharma@sharmafoods.com",
  //     phone: "+919876543210",
  //     department: "Management",
  //     isPrimary: true
  //   },
  //   {
  //     id: 2,
  //     name: "Priya Verma",
  //     designation: "Purchase Manager",
  //     email: "priya.verma@sharmafoods.com",
  //     phone: "+919876543211",
  //     department: "Procurement",
  //     isPrimary: false
  //   },
  //   {
  //     id: 3,
  //     name: "Amit Kumar",
  //     designation: "Finance Head",
  //     email: "amit.kumar@sharmafoods.com",
  //     phone: "+919876543212",
  //     department: "Finance & Accounts",
  //     isPrimary: false
  //   },
  //   {
  //     id: 4,
  //     name: "Sneha Patel",
  //     designation: "Operations Manager",
  //     email: "sneha.patel@sharmafoods.com",
  //     phone: "+919876543213",
  //     department: "Operations",
  //     isPrimary: false
  //   }
  // ];

  // const addresses = [
  //   {
  //     id: 1,
  //     label: "Corporate Office",
  //     type: "Billing",
  //     street: "Plot No. 45, Sector 18, Industrial Area, Phase II",
  //     city: "Mumbai",
  //     state: "Maharashtra",
  //     pinCode: "400001",
  //     gstNumber: "27AABCS1234F1Z5",
  //     isDefault: true
  //   },
  //   {
  //     id: 2,
  //     label: "Warehouse - Andheri",
  //     type: "Shipping",
  //     street: "Godown No. 12, MIDC Industrial Estate, Andheri East",
  //     city: "Mumbai",
  //     state: "Maharashtra",
  //     pinCode: "400093",
  //     gstNumber: "27AABCS1234F1Z5",
  //     isDefault: false
  //   },
  //   {
  //     id: 3,
  //     label: "Distribution Center - Pune",
  //     type: "Warehouse",
  //     street: "Survey No. 234, Hinjewadi Phase III, Near IT Park",
  //     city: "Pune",
  //     state: "Maharashtra",
  //     pinCode: "411057",
  //     gstNumber: "27AABCS1234F1Z6",
  //     isDefault: false
  //   },
  //   {
  //     id: 4,
  //     label: "Branch Office - Thane",
  //     type: "Shipping",
  //     street: "Shop No. 8-9, Ground Floor, Viviana Mall Complex",
  //     city: "Thane",
  //     state: "Maharashtra",
  //     pinCode: "400601",
  //     gstNumber: "27AABCS1234F1Z5",
  //     isDefault: false
  //   }
  // ];

  // const financialData = {
  //   creditLimit: 5000000,
  //   creditUsed: 3250000,
  //   paymentTerms: "Net 30 Days",
  //   priceList: "Premium Distributor",
  //   discountTier: "Tier 2 - Gold",
  //   customerCategory: "Key Account",
  //   currency: "INR (₹)",
  //   tradeDiscount: "12%",
  //   schemeEligible: true,
  //   lastReviewDate: "15/12/2025",
  //   nextReviewDate: "15/03/2026",
  //   creditRating: "A+"
  // };

  // const documents = [
  //   {
  //     id: 1,
  //     name: "GST Registration Certificate",
  //     category: "Tax Documents",
  //     type: "PDF",
  //     uploadDate: "15/03/2024",
  //     expiryDate: null,
  //     size: "2.4 MB",
  //     documentNumber: "27AABCS1234F1Z5",
  //     status: "Verified"
  //   },
  //   {
  //     id: 2,
  //     name: "PAN Card",
  //     category: "Tax Documents",
  //     type: "PDF",
  //     uploadDate: "15/03/2024",
  //     expiryDate: null,
  //     size: "856 KB",
  //     documentNumber: "AABCS1234F",
  //     status: "Verified"
  //   },
  //   {
  //     id: 3,
  //     name: "Certificate of Incorporation",
  //     category: "Business Registration",
  //     type: "PDF",
  //     uploadDate: "20/03/2024",
  //     expiryDate: null,
  //     size: "1.8 MB",
  //     documentNumber: "U51909MH2018PTC307856",
  //     status: "Verified"
  //   },
  //   {
  //     id: 4,
  //     name: "FSSAI License",
  //     category: "Certificates",
  //     type: "PDF",
  //     uploadDate: "25/03/2024",
  //     expiryDate: "24/03/2027",
  //     size: "1.2 MB",
  //     documentNumber: "10019021000145",
  //     status: "Verified"
  //   },
  //   {
  //     id: 5,
  //     name: "Distribution Agreement",
  //     category: "Agreements",
  //     type: "PDF",
  //     uploadDate: "10/04/2024",
  //     expiryDate: "09/04/2027",
  //     size: "3.5 MB",
  //     documentNumber: "AGR-2024-156",
  //     status: "Verified"
  //   },
  //   {
  //     id: 6,
  //     name: "Bank Account Details",
  //     category: "Business Registration",
  //     type: "PDF",
  //     uploadDate: "15/04/2024",
  //     expiryDate: null,
  //     size: "654 KB",
  //     documentNumber: null,
  //     status: "Verified"
  //   },
  //   {
  //     id: 7,
  //     name: "Trade License",
  //     category: "Certificates",
  //     type: "Image",
  //     uploadDate: "20/04/2024",
  //     expiryDate: "19/04/2026",
  //     size: "2.1 MB",
  //     documentNumber: "TL/2024/00234",
  //     status: "Pending"
  //   },
  //   {
  //     id: 8,
  //     name: "Insurance Policy",
  //     category: "Certificates",
  //     type: "PDF",
  //     uploadDate: "25/04/2024",
  //     expiryDate: "24/04/2025",
  //     size: "1.9 MB",
  //     documentNumber: "POL/2024/567890",
  //     status: "Expired"
  //   }
  // ];

  // const changeHistory = [
  //   {
  //     id: 1,
  //     type: "Profile Update",
  //     title: "Trade Name Updated",
  //     description: "Company trade name was modified",
  //     changes: [
  //       {
  //         field: "Trade Name",
  //         oldValue: "Sharma Foods",
  //         newValue: "Sharma Foods & Beverages"
  //       }
  //     ],
  //     modifiedBy: "Rajesh Sharma",
  //     date: "05/01/2026",
  //     time: "14:30 IST",
  //     ipAddress: "103.45.67.89"
  //   },
  //   {
  //     id: 2,
  //     type: "Contact Change",
  //     title: "Primary Contact Updated",
  //     description: "Primary contact phone number was changed",
  //     changes: [
  //       {
  //         field: "Phone Number",
  //         oldValue: "+919876543200",
  //         newValue: "+919876543210"
  //       }
  //     ],
  //     modifiedBy: "Priya Verma",
  //     date: "03/01/2026",
  //     time: "11:15 IST",
  //     ipAddress: "103.45.67.89"
  //   },
  //   {
  //     id: 3,
  //     type: "Address Update",
  //     title: "New Shipping Address Added",
  //     description: "Branch office address in Thane was added",
  //     changes: null,
  //     modifiedBy: "Amit Kumar",
  //     date: "28/12/2025",
  //     time: "16:45 IST",
  //     ipAddress: "103.45.67.90"
  //   },
  //   {
  //     id: 4,
  //     type: "Document Upload",
  //     title: "Insurance Policy Uploaded",
  //     description: "New insurance policy document was uploaded",
  //     changes: null,
  //     modifiedBy: "Sneha Patel",
  //     date: "25/12/2025",
  //     time: "10:20 IST",
  //     ipAddress: "103.45.67.89"
  //   },
  //   {
  //     id: 5,
  //     type: "Financial Update",
  //     title: "Credit Limit Increased",
  //     description: "Credit limit was revised after quarterly review",
  //     changes: [
  //       {
  //         field: "Credit Limit",
  //         oldValue: "₹40,00,000",
  //         newValue: "₹50,00,000"
  //       }
  //     ],
  //     modifiedBy: "System (ERP Sync)",
  //     date: "15/12/2025",
  //     time: "09:00 IST",
  //     ipAddress: "System"
  //   },
  //   {
  //     id: 6,
  //     type: "Profile Update",
  //     title: "Website URL Updated",
  //     description: "Company website URL was modified",
  //     changes: [
  //       {
  //         field: "Website",
  //         oldValue: "http://sharmafoods.com",
  //         newValue: "https://www.sharmafoods.com"
  //       }
  //     ],
  //     modifiedBy: "Rajesh Sharma",
  //     date: "10/12/2025",
  //     time: "15:30 IST",
  //     ipAddress: "103.45.67.89"
  //   }
  // ];

  const tabs = [
    { id: 'company', label: 'Company Info', icon: 'Building2' },
    { id: 'contacts', label: 'Contact Details', icon: 'Users' },
    { id: 'addresses', label: 'Addresses', icon: 'MapPin' },
    { id: 'financial', label: 'Financial Info', icon: 'DollarSign' },
    { id: 'documents', label: 'Documents', icon: 'FileText' },
    { id: 'history', label: 'Change History', icon: 'History' }
  ];

  const handleCompanyUpdate = (updatedData) => {
    console.log('Company data updated:', updatedData);
  };

  const handleContactsUpdate = (updatedContacts) => {
    console.log('Contacts updated:', updatedContacts);
  };


  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Customer Profile - Veeba Foods</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-16">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading customer profile...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  // ADD ERROR STATE - Place this after loading state, before main return
  if (error) {
    return (
      <>
        <Helmet>
          <title>Customer Profile - Veeba Foods</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-16">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Icon name="AlertCircle" size={48} className="text-destructive mx-auto mb-4" />
                  <p className="text-destructive text-lg font-semibold mb-2">Error Loading Profile</p>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  // ADD NO DATA STATE - Place this after error state, before main return
  if (!companyData) {
    return (
      <>
        <Helmet>
          <title>Customer Profile - Veeba Foods</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-16">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Icon name="FileQuestion" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No customer data found</p>
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
        <title>Customer Profile - Veeba Foods</title>
        <meta name="description" content="Manage your business profile, contacts, addresses, and financial information on Veeba Foods B2B portal" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <Breadcrumb />

            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 md:p-8 mb-6 md:mb-8 border border-primary/20">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name="Building2" size={48} color="var(--color-primary)" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                    {companyData?.tradeName}
                  </h1>
                  <p className="text-sm md:text-base font-caption text-muted-foreground mb-3">
                    {companyData?.legalName}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 md:gap-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm font-caption font-medium">
                      <Icon name="Hash" size={14} />
                      {companyData?.customerCode}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-success/10 text-success rounded-md text-sm font-caption font-medium">
                      <Icon name="CheckCircle" size={14} />
                      Active Account
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-md text-sm font-caption font-medium">
                      <Icon name="Award" size={14} />
                      Key Account
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-warm-md border border-border overflow-hidden">
              <div className="border-b border-border overflow-x-auto scrollbar-custom">
                <div className="flex min-w-max lg:min-w-0">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`
                        flex items-center gap-2 px-4 md:px-6 py-4 font-caption font-medium text-sm md:text-base
                        transition-smooth border-b-2 flex-shrink-0
                        ${activeTab === tab?.id
                          ? 'text-primary border-primary bg-primary/5' : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50'
                        }
                      `}
                    >
                      <Icon name={tab?.icon} size={18} />
                      <span className="whitespace-nowrap">{tab?.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 md:p-8">
                {activeTab === 'company' && (
                  <CompanyInfoTab
                    companyData={companyData}
                    onUpdate={handleCompanyUpdate}
                  />
                )}
                {activeTab === 'contacts' && (
                  <ContactDetailsTab
                    contacts={contacts}
                    onUpdate={handleContactsUpdate}
                  />
                )}
                {activeTab === 'addresses' && (
                  <AddressManagementTab addresses={addresses} />
                )}
                {activeTab === 'financial' && (
                  <FinancialInfoTab financialData={financialData} />
                )}
                {activeTab === 'documents' && (
                  <DocumentsTab documents={documents} />
                )}
                {activeTab === 'history' && (
                  <ChangeHistoryTab history={changeHistory} />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CustomerProfile;
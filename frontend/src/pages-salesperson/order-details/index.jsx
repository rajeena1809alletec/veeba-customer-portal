import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import OrderHeader from './components/OrderHeader';
import LineItemsTable from './components/LineItemsTable';
import TrackingTimeline from './components/TrackingTimeline';
import DocumentsSection from './components/DocumentsSection';
import OrderSummaryCard from './components/OrderSummaryCard';
import { getSalesOrderFromDocNo } from 'services/BusinessCentralAPI';

const formatDateTime = (dateTime) => {
  if (!dateTime) return 'Pending';

  const date = new Date(dateTime);
  if (isNaN(date.getTime())) return 'Pending';

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const SPOrderDetails = ({ onClose, orderData: orderDataProp }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const documentNo = queryParams.get('documentNo');
  const documentType = queryParams.get('documentType');

  const [showDispatchModal, setShowDispatchModal] = useState(false);

  const handleOpenDispatchModal = () => {
    if (orderData?.trackingData?.dispatchDetails?.length) {
      setShowDispatchModal(true);
    }
  };

  const handleCloseDispatchModal = () => {
    setShowDispatchModal(false);
  };
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowDispatchModal(false);
      }
    };

    if (showDispatchModal) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [showDispatchModal]);

  const mockOrderData = {
    orderNumber: "SO-2026-00847",
    orderDate: "15/12/2025",
    status: "Dispatched",
    expectedDelivery: "20/01/2026",
    shipToLocation: "",
    totalAmount: 245680.50,
    lineItems: [
      {
        id: 1,
        productCode: "VB-MS-1KG",
        productName: "Veeba Mayonnaise Eggless",
        productImage: "https://images.unsplash.com/photo-1664478911514-36dacf3b876a",
        productImageAlt: "White squeeze bottle of Veeba eggless mayonnaise with red and yellow branding on white background",
        packSize: "1 Kg Bottle",
        quantity: 50,
        unit: "Bottles",
        unitPrice: 185.00,
        gstRate: 12
      },
      {
        id: 2,
        productCode: "VB-TC-500G",
        productName: "Veeba Tomato Ketchup",
        productImage: "https://images.unsplash.com/photo-1580342583488-e6b33ece69d7",
        productImageAlt: "Red plastic bottle of tomato ketchup with Veeba branding label on wooden table surface",
        packSize: "500g Bottle",
        quantity: 100,
        unit: "Bottles",
        unitPrice: 95.00,
        gstRate: 12
      },
      {
        id: 3,
        productCode: "VB-CS-1KG",
        productName: "Veeba Chef\'s Special Sauce",
        productImage: "https://images.unsplash.com/photo-1664478911600-5604555816a5",
        productImageAlt: "Brown squeeze bottle of chef special sauce with Veeba logo and orange accent colors",
        packSize: "1 Kg Bottle",
        quantity: 75,
        unit: "Bottles",
        unitPrice: 225.00,
        gstRate: 12
      },
      {
        id: 4,
        productCode: "VB-MS-5KG",
        productName: "Veeba Mint Mayonnaise",
        productImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1dc50755d-1767763060710.png",
        productImageAlt: "Large white container of mint flavored mayonnaise with green Veeba branding and fresh mint leaf imagery",
        packSize: "5 Kg Jar",
        quantity: 30,
        unit: "Jars",
        unitPrice: 850.00,
        gstRate: 12
      },
      {
        id: 5,
        productCode: "VB-PS-1KG",
        productName: "Veeba Pizza & Sandwich Sauce",
        productImage: "https://images.unsplash.com/photo-1644083102317-446fe7231e8b",
        productImageAlt: "Red squeeze bottle of pizza and sandwich sauce with Veeba branding and Italian food graphics",
        packSize: "1 Kg Bottle",
        quantity: 60,
        unit: "Bottles",
        unitPrice: 195.00,
        gstRate: 12
      }],

    trackingData: {
      trackingNumber: "VB2026TRK847523",
      challanNumber: "DC-2026-001234",
      estimatedDelivery: "20/01/2026, 5:00 PM",
      timeline: [
        {
          status: "Confirmed",
          timestamp: "15/12/2025, 10:30 AM",
          description: "Order confirmed and payment verified",
          location: "",
          completed: true,
          current: false
        },
        {
          status: "Processing",
          timestamp: "16/12/2025, 2:15 PM",
          description: "Order picked and packed for dispatch",
          location: "",
          completed: true,
          current: false
        },
        {
          status: "Dispatched",
          timestamp: "17/12/2025, 9:00 AM",
          description: "Shipment dispatched",
          location: "",
          remarks: "",
          completed: true,
          current: true
        },
        // {
        //   status: "In Transit",
        //   timestamp: "Pending",
        //   description: "Package in transit to destination",
        //   location: "Mumbai Hub",
        //   completed: false,
        //   current: false
        // },
        // {
        //   status: "Out for Delivery",
        //   timestamp: "Pending",
        //   description: "Out for delivery to your location",
        //   location: "Mumbai Warehouse",
        //   completed: false,
        //   current: false
        // },
        // {
        //   status: "Delivered",
        //   timestamp: "Pending",
        //   description: "Package delivered successfully",
        //   location: "Mumbai Warehouse",
        //   completed: false,
        //   current: false
        // }
      ]

    },
    documents: [
      {
        id: 1,
        type: "Tax Invoice",
        documentNumber: "INV-2026-00847",
        date: "17/12/2025",
        fileSize: 245680,
        isNew: true
      },
      // {
      //   id: 2,
      //   type: "Delivery Challan",
      //   documentNumber: "DC-2026-001234",
      //   date: "17/12/2025",
      //   fileSize: 189340,
      //   isNew: true
      // },
      // {
      //   id: 3,
      //   type: "Packing List",
      //   documentNumber: "PL-2026-00847",
      //   date: "16/12/2025",
      //   fileSize: 156720,
      //   isNew: false
      // },
      {
        id: 2,
        type: "Invoice",
        documentNumber: "SO-2026-00847",
        date: "15/12/2025",
        fileSize: 234560,
        isNew: false
      }],

    summary: {
      customerName: "Mumbai Food Distributors Pvt Ltd",
      customerCode: "CUST-MH-2024-0156",
      gstNumber: "27AABCU9603R1ZM",
      paymentTerms: "Net 30 Days",
      shippingAddress: "Plot No. 45, MIDC Industrial Area, Andheri East, Mumbai - 400093, Maharashtra",
      billingAddress: "Office No. 12, Trade Center, Bandra West, Mumbai - 400050, Maharashtra",
      specialInstructions: "Please ensure temperature-controlled delivery. Delivery timing: 9 AM to 6 PM only. Contact warehouse manager Mr. Sharma (+91-9876543210) 30 minutes before arrival.",
      referenceNumber: "PO-MFD-2025-1234"
    }
  };
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError('');

        if (!documentNo || !documentType) {
          setError('Missing document number or document type');
          setLoading(false);
          return;
        }

        const result = await getSalesOrderFromDocNo(documentNo, documentType);

        if (result.success) {
          const entry = result.data;

          // const mappedOrder = {
          //   orderNumber: entry.no,
          //   orderDate: entry.orderDate || entry.postingDate || '',
          //   status: entry.status || '',
          //   expectedDelivery: entry.requestedDeliveryDate || '',
          //   shipToLocation: entry.shipToName || '',
          //   totalAmount: entry.amount || 0,
          //   lineItems: (entry.customerOrdersLines || []).map((line, index) => ({
          //     id: line.lineNo || index + 1,
          //     orderNo: line.documentNo || entry.no || '',
          //     itemNo: line.no || '',
          //     description: line.description || '',
          //     uom: line.unitOfMeasure || '',
          //     qty: line.quantity || 0,
          //     unitPrice: line.unitPrice || 0,
          //     gstRate: line.gstRate || 0,
          //     invoicedQty: line.quantityInvoiced || 0,
          //     outstandingQty: line.outstandingQuantity || 0,
          //     lineNo: line.lineNo || 0,
          //   })),
          //   trackingData: null,
          //   documents: [],
          //   summary: {
          //     customerName: entry.sellToCustomerName || '',
          //     customerCode: entry.sellToCustomerNo || '',
          //     gstNumber: '',
          //     paymentTerms: '',
          //     shippingAddress: entry.shipToAddress || '',
          //     billingAddress: '',
          //     specialInstructions: '',
          //     referenceNumber: entry.externalDocumentNo || '',
          //   }
          // };
          const apiOrder = {
            orderNumber: entry.no || mockOrderData.orderNumber,
            orderDate: entry.orderDate || entry.postingDate || mockOrderData.orderDate,
            status: entry.status || mockOrderData.status,
            expectedDelivery: entry.requestedDeliveryDate || mockOrderData.expectedDelivery,
            shipToLocation: entry.shipToCity || '',
            totalAmount: entry.amount || mockOrderData.totalAmount,
            lineItems: (entry.customerOrdersLines || []).map((line, index) => ({
              id: line.lineNo || index + 1,
              orderNo: line.documentNo || entry.no || '',
              itemNo: line.no || '',
              description: line.description || '',
              uom: line.unitOfMeasure || '',
              qty: line.quantity || 0,
              unitPrice: line.unitPrice || 0,
              gstRate: line.gstPer || 0,
              invoicedQty: line.quantityInvoiced || 0,
              outstandingQty: line.outstandingQuantity || 0,
              lineNo: line.lineNo || 0,
            })),
            summary: {
              customerName: entry.sellToCustomerName || '',
              customerCode: entry.sellToCustomerNo || '',
              gstNumber: '',
              paymentTerms: '',
              shippingAddress: entry.shipToAddress || '',
              billingAddress: '',
              specialInstructions: '',
              referenceNumber: entry.externalDocumentNo || '',
            }
          };

          const mergedOrder = {
            ...mockOrderData,
            ...apiOrder,
            lineItems: apiOrder.lineItems?.length ? apiOrder.lineItems : mockOrderData.lineItems,
            trackingData: {
              ...mockOrderData.trackingData,
              trackingNumber: entry.packageTrackingNo || '',
              challanNumber: '',
              estimatedDelivery: apiOrder.expectedDelivery || mockOrderData.trackingData?.estimatedDelivery,
              dispatchDetails: entry.dispatchdetails || [],
              timeline: (mockOrderData.trackingData?.timeline || []).map((item) => {
                if (item.status === 'Confirmed') {
                  return {
                    ...item, timestamp: formatDateTime(entry.systemCreatedAt),
                  };
                }
                if (item.status === 'Dispatched') {
                  const hasDispatch = (entry.dispatchdetails || []).length > 0;
                  return {
                    ...item, description: hasDispatch ? 'Shipment dispatched' : 'Shipment yet to be dispatched',
                  };
                }
                return item;
              }),
            },
            documents: mockOrderData.documents,
            summary: {
              ...mockOrderData.summary,
              ...apiOrder.summary,
            },
          };

          setOrderData(mergedOrder);

          // setOrderData(mappedOrder);
        } else {
          setError(result.error || 'Failed to fetch order details');
        }
      } catch (err) {
        console.error('Error loading order details:', err);
        setError('Something went wrong while loading order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [documentNo, documentType]);

  const data = orderData;
  // const [showComplaintModal, setShowComplaintModal] = useState(false);
  // const [selectedItem, setSelectedItem] = useState(null);
  // const isModal = !!onClose; // ✅ true when used as modal


  // const handleRepeatOrder = () => {
  //   navigate('/order-management', {
  //     state: { repeatOrder: orderData?.lineItems }
  //   });
  // };

  const handleDownloadExcel = () => {
    const rows = orderData?.lineItems || [];

    if (!rows.length) {
      alert('No line items available to download.');
      return;
    }

    const headers = [
      'Order No.',
      'Item No.',
      'Description',
      'UOM',
      'Qty',
      'Unit Price',
      'GST Rate',
      'Invoiced Qty',
      'Outstanding Qty'
    ];

    const csvRows = rows.map((item) => [
      item?.orderNo || '',
      item?.itemNo || '',
      item?.description || '',
      item?.uom || '',
      item?.qty ?? 0,
      item?.unitPrice ?? 0,
      item?.gstRate ?? 0,
      item?.invoicedQty ?? 0,
      item?.outstandingQty ?? 0
    ]);

    const escapeCsvValue = (value) => {
      const stringValue = String(value ?? '');
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const csvContent = [
      headers.map(escapeCsvValue).join(','),
      ...csvRows.map((row) => row.map(escapeCsvValue).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `${orderData?.orderNumber || 'order-lines'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleRaiseComplaint = (item = null) => {
    navigate('/complaint-management', {
      state: {
        orderNumber: orderData?.orderNumber,
        lineItem: item
      }
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Order ${orderData?.orderNumber}`,
        text: `Order details for ${orderData?.orderNumber}`,
        url: window.location?.href
      })?.catch((err) => console.log('Share failed:', err));
    } else {
      navigator.clipboard?.writeText(window.location?.href);
      alert('Order link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDocument = (doc) => {
    console.log('Downloading document:', doc?.documentNumber);
    alert(`Downloading ${doc?.type}: ${doc?.documentNumber}`);
  };

  const handleViewDocument = (doc) => {
    console.log('Viewing document:', doc?.documentNumber);
    alert(`Opening ${doc?.type}: ${doc?.documentNumber} in new window`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <Icon name="Loader2" size={40} className="animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading order details...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <div className="bg-card rounded-xl p-8 border border-border text-center">
              <h2 className="font-heading font-semibold text-xl text-foreground mb-2">
                Unable to load order details
              </h2>
              <p className="text-muted-foreground mb-4">
                {error || 'Order details not found'}
              </p>
              <Button variant="default" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Order Details - {data?.orderNumber} | Veeba Foods Customer Portal</title>
        <meta name="description" content={`View detailed information for order ${data?.orderNumber} including line items, tracking, and documents`} />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-16">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <Breadcrumb />

            <div className="space-y-6 md:space-y-8">
              <OrderHeader
                order={data}
                onDownloadExcel={handleDownloadExcel}
                onRaiseComplaint={() => handleRaiseComplaint()}
                onShare={handleShare}
                onPrint={handlePrint}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                <div className="lg:col-span-9 space-y-6 md:space-y-8">
                  <LineItemsTable
                    lineItems={data?.lineItems}
                    onRaiseComplaint={handleRaiseComplaint} />


                  <TrackingTimeline trackingData={data?.trackingData} onDispatchedClick={handleOpenDispatchModal} />

                  {/* <DocumentsSection
                    documents={mockOrderData?.documents}
                    onDownload={handleDownloadDocument}
                    onView={handleViewDocument} /> */}

                </div>

                <div className="lg:col-span-3 space-y-6">
                  <OrderSummaryCard summary={data?.summary} />

                  <div className="bg-card rounded-xl p-4 md:p-6 shadow-warm-md border border-border">
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Icon name="HelpCircle" size={20} color="var(--color-primary)" />
                      Need Help?
                    </h3>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        iconName="MessageSquare"
                        iconPosition="left"
                        fullWidth
                        onClick={() => navigate('/complaint-management')}>

                        Raise Complaint
                      </Button>
                      <Button
                        variant="outline"
                        iconName="Phone"
                        iconPosition="left"
                        fullWidth>

                        Contact Support
                      </Button>
                      <Button
                        variant="outline"
                        iconName="Mail"
                        iconPosition="left"
                        fullWidth>

                        Email Us
                      </Button>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <Icon name="Info" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-body text-foreground mb-2 font-medium">
                          Order Information
                        </p>
                        <p className="text-xs text-muted-foreground font-caption">
                          This order is synced with our ERP system. Any updates will reflect in real-time. For urgent queries, contact your sales representative.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {showDispatchModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={handleCloseDispatchModal}
        >
          <div
            className="bg-card w-full max-w-4xl rounded-xl border border-border shadow-warm-lg max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                  Dispatch Details
                </h2>
                <p className="text-sm text-muted-foreground">
                  Details for dispatched shipment records
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseDispatchModal}
                className="p-2 rounded-md hover:bg-muted transition-smooth"
                aria-label="Close dispatch details modal"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
              {data?.trackingData?.dispatchDetails?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.trackingData.dispatchDetails.map((dispatch, index) => (
                    <div
                      key={dispatch?.no || index}
                      className="bg-background rounded-xl border border-border p-4 md:p-5 shadow-warm-md"
                    >
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground font-caption mb-1">
                            Dispatch Doc No.
                          </p>
                          <p className="text-base font-semibold text-foreground font-mono break-all">
                            {dispatch?.no || '-'}
                          </p>
                        </div>

                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon name="Truck" size={18} color="var(--color-primary)" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground font-caption mb-1">
                            LR / RR No.
                          </p>
                          <p className="text-sm md:text-base text-foreground font-body">
                            {dispatch?.lrRRNo || '-'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground font-caption mb-1">
                            Transporter Vendor No.
                          </p>
                          <p className="text-sm md:text-base text-foreground font-body">
                            {dispatch?.transporterVendorNo || '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No dispatch details available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <style>{`
  @media print {
    header, nav, button, .no-print {
      display: none !important;
    }
    main {
      padding-top: 0 !important;
    }
  }
`}</style>
    </>);

};

export default SPOrderDetails;
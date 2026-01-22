import React, { useState } from 'react';
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

const OrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const mockOrderData = {
    orderNumber: "SO-2026-00847",
    orderDate: "15/12/2025",
    status: "Dispatched",
    expectedDelivery: "20/01/2026",
    shipToLocation: "Mumbai Warehouse",
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
        location: "Veeba Foods - Delhi Plant",
        completed: true,
        current: false
      },
      {
        status: "Processing",
        timestamp: "16/12/2025, 2:15 PM",
        description: "Order picked and packed for dispatch",
        location: "Veeba Foods - Delhi Plant",
        completed: true,
        current: false
      },
      {
        status: "Dispatched",
        timestamp: "17/12/2025, 9:00 AM",
        description: "Shipment dispatched via Blue Dart Express",
        location: "Delhi Distribution Center",
        remarks: "Vehicle No: DL-3C-AB-1234, Driver: Rajesh Kumar (+91-9876543210)",
        completed: true,
        current: true
      },
      {
        status: "In Transit",
        timestamp: "Pending",
        description: "Package in transit to destination",
        location: "Mumbai Hub",
        completed: false,
        current: false
      },
      {
        status: "Out for Delivery",
        timestamp: "Pending",
        description: "Out for delivery to your location",
        location: "Mumbai Warehouse",
        completed: false,
        current: false
      },
      {
        status: "Delivered",
        timestamp: "Pending",
        description: "Package delivered successfully",
        location: "Mumbai Warehouse",
        completed: false,
        current: false
      }]

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
    {
      id: 2,
      type: "Delivery Challan",
      documentNumber: "DC-2026-001234",
      date: "17/12/2025",
      fileSize: 189340,
      isNew: true
    },
    {
      id: 3,
      type: "Packing List",
      documentNumber: "PL-2026-00847",
      date: "16/12/2025",
      fileSize: 156720,
      isNew: false
    },
    {
      id: 4,
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

  const [orderData] = useState(mockOrderData);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleRepeatOrder = () => {
    navigate('/order-management', {
      state: { repeatOrder: orderData?.lineItems }
    });
  };

  const handleRaiseComplaint = (item = null) => {
    setSelectedItem(item);
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

  return (
    <>
      <Helmet>
        <title>Order Details - {orderData?.orderNumber} | Veeba Foods Customer Portal</title>
        <meta name="description" content={`View detailed information for order ${orderData?.orderNumber} including line items, tracking, and documents`} />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <Breadcrumb />

            <div className="space-y-6 md:space-y-8">
              <OrderHeader
                order={orderData}
                onRepeatOrder={handleRepeatOrder}
                onRaiseComplaint={() => handleRaiseComplaint()}
                onShare={handleShare}
                onPrint={handlePrint} />


              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                  <LineItemsTable
                    lineItems={orderData?.lineItems}
                    onRaiseComplaint={handleRaiseComplaint} />


                  <TrackingTimeline trackingData={orderData?.trackingData} />

                  <DocumentsSection
                    documents={orderData?.documents}
                    onDownload={handleDownloadDocument}
                    onView={handleViewDocument} />

                </div>

                <div className="space-y-6">
                  <OrderSummaryCard summary={orderData?.summary} />

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
      <style jsx>{`
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

export default OrderDetails;
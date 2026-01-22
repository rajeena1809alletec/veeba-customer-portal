import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ComplaintStats from './components/ComplaintStats';
import ComplaintFilters from './components/ComplaintFilters';
import ComplaintCard from './components/ComplaintCard';
import NewComplaintModal from './components/NewComplaintModal';
import ComplaintDetailsModal from './components/ComplaintDetailsModal';

const ComplaintManagement = () => {
  const [showNewComplaintModal, setShowNewComplaintModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    issueType: 'all',
    priority: 'all'
  });

  // Mock complaints data
  const complaintsData = [
  {
    id: 1,
    complaintNumber: "CMP-2026-001",
    dateRaised: "2026-01-05T10:30:00",
    orderReference: "ORD-2026-001",
    productName: "Veeba Mayonnaise 1kg",
    issueType: "Shortage",
    description: "Received only 8 units instead of ordered 10 units of Veeba Mayonnaise 1kg. The delivery challan shows 10 units but physical count is 8 units. This shortage was discovered during goods receipt verification.",
    quantityAffected: "2",
    expectedResolution: "Credit Note",
    priority: "High",
    status: "Open",
    resolutionTimeline: "2-3 business days",
    attachmentCount: 3,
    timeline: [
    {
      title: "Complaint Raised",
      description: "Complaint submitted with supporting documentation",
      timestamp: "2026-01-05T10:30:00",
      icon: "FileText",
      type: "default",
      user: "Customer"
    },
    {
      title: "Acknowledged",
      description: "Complaint received and assigned to investigation team",
      timestamp: "2026-01-05T11:15:00",
      icon: "CheckCircle",
      type: "success",
      user: "Support Team"
    }],

    attachments: [
    {
      name: "delivery_challan.jpg",
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_16d55b4b3-1767763058210.png",
      alt: "Delivery challan document showing order details with 10 units mentioned on white paper with blue header",
      type: "image",
      size: "2.4 MB"
    },
    {
      name: "received_items.jpg",
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_118027be7-1767763061788.png",
      alt: "Photo of 8 Veeba Mayonnaise jars arranged on warehouse shelf showing actual received quantity",
      type: "image",
      size: "1.8 MB"
    },
    {
      name: "invoice_copy.pdf",
      url: "#",
      alt: "PDF copy of invoice document",
      type: "pdf",
      size: "856 KB"
    }]

  },
  {
    id: 2,
    complaintNumber: "CMP-2026-002",
    dateRaised: "2026-01-04T14:20:00",
    orderReference: "ORD-2025-156",
    productName: "Veeba Tomato Ketchup 500g",
    issueType: "Leakage",
    description: "Multiple bottles of Veeba Tomato Ketchup 500g showing leakage from cap area. The product appears to have been damaged during transit. Approximately 15 bottles out of 50 received are affected with visible ketchup leakage staining the outer packaging.",
    quantityAffected: "15",
    expectedResolution: "Replacement",
    priority: "High",
    status: "Under Investigation",
    resolutionTimeline: "3-5 business days",
    attachmentCount: 4,
    timeline: [
    {
      title: "Complaint Raised",
      description: "Leakage issue reported with photographic evidence",
      timestamp: "2026-01-04T14:20:00",
      icon: "FileText",
      type: "default",
      user: "Customer"
    },
    {
      title: "Investigation Started",
      description: "Quality team reviewing the issue and checking batch details",
      timestamp: "2026-01-04T16:45:00",
      icon: "Search",
      type: "default",
      user: "Quality Team"
    },
    {
      title: "Batch Analysis",
      description: "Checking production batch records and transport conditions",
      timestamp: "2026-01-05T09:30:00",
      icon: "ClipboardCheck",
      type: "default",
      user: "Quality Team"
    }],

    attachments: [
    {
      name: "leakage_overview.jpg",
      url: "https://images.unsplash.com/photo-1612845071864-a79ecec01cc8",
      alt: "Overview photo showing multiple ketchup bottles with visible red stains on cardboard packaging in warehouse",
      type: "image",
      size: "3.1 MB"
    },
    {
      name: "bottle_closeup.jpg",
      url: "https://images.unsplash.com/photo-1604888594877-57c4a4a830e0",
      alt: "Close-up image of damaged ketchup bottle cap showing red sauce leaking from seal area",
      type: "image",
      size: "2.2 MB"
    }]

  },
  {
    id: 3,
    complaintNumber: "CMP-2025-145",
    dateRaised: "2025-12-28T11:15:00",
    orderReference: "ORD-2025-145",
    productName: "Veeba Sandwich Spread 250g",
    issueType: "Damage",
    description: "Received cartons with physical damage resulting in crushed and dented jars of Veeba Sandwich Spread 250g. The outer packaging shows signs of rough handling during transportation. Some jars have cracked lids and compromised seals.",
    quantityAffected: "12",
    expectedResolution: "Both",
    priority: "Medium",
    status: "Resolved",
    resolutionTimeline: "Resolved",
    attachmentCount: 2,
    timeline: [
    {
      title: "Complaint Raised",
      description: "Physical damage reported with evidence of rough handling",
      timestamp: "2025-12-28T11:15:00",
      icon: "FileText",
      type: "default",
      user: "Customer"
    },
    {
      title: "Investigation Completed",
      description: "Confirmed transport damage, approved for replacement and credit",
      timestamp: "2025-12-29T10:30:00",
      icon: "CheckCircle",
      type: "success",
      user: "Logistics Team"
    },
    {
      title: "Resolution Processed",
      description: "Credit note issued and replacement order dispatched",
      timestamp: "2025-12-30T14:20:00",
      icon: "Package",
      type: "success",
      user: "Finance Team"
    }],

    attachments: [
    {
      name: "damaged_carton.jpg",
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_12c172a00-1766127680023.png",
      alt: "Damaged cardboard carton with visible dents and tears showing rough handling during shipping",
      type: "image",
      size: "2.8 MB"
    }],

    resolution: {
      type: "Credit Note + Replacement",
      date: "2025-12-30T14:20:00",
      creditNoteNumber: "CN-2025-089",
      replacementOrderNumber: "ORD-2026-003",
      summary: "Complaint resolved successfully with credit note and replacement order",
      details: "A credit note of ₹3,240 has been issued to your account for the damaged items. Additionally, a replacement order (ORD-2026-003) has been dispatched and will reach you within 2-3 business days. We apologize for the inconvenience caused."
    }
  },
  {
    id: 4,
    complaintNumber: "CMP-2025-132",
    dateRaised: "2025-12-20T09:45:00",
    orderReference: "ORD-2025-134",
    productName: "Veeba Peri Peri Sauce 320g",
    issueType: "Expiry",
    description: "Received stock of Veeba Peri Peri Sauce 320g with expiry date within 2 months. As per our agreement, products should have minimum 6 months shelf life at the time of delivery. This short shelf life makes it difficult to sell the product before expiry.",
    quantityAffected: "30",
    expectedResolution: "Replacement",
    priority: "High",
    status: "Resolved",
    resolutionTimeline: "Resolved",
    attachmentCount: 2,
    timeline: [
    {
      title: "Complaint Raised",
      description: "Short shelf life issue reported with batch details",
      timestamp: "2025-12-20T09:45:00",
      icon: "FileText",
      type: "default",
      user: "Customer"
    },
    {
      title: "Batch Verification",
      description: "Confirmed short expiry date, approved for replacement",
      timestamp: "2025-12-20T15:30:00",
      icon: "CheckCircle",
      type: "success",
      user: "Quality Team"
    },
    {
      title: "Replacement Dispatched",
      description: "Fresh stock with 8 months shelf life dispatched",
      timestamp: "2025-12-22T11:00:00",
      icon: "Package",
      type: "success",
      user: "Warehouse Team"
    }],

    attachments: [
    {
      name: "expiry_date.jpg",
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_149aaf10e-1767763058648.png",
      alt: "Close-up photo of product label showing expiry date printed on Peri Peri sauce bottle",
      type: "image",
      size: "1.5 MB"
    }],

    resolution: {
      type: "Replacement",
      date: "2025-12-22T11:00:00",
      replacementOrderNumber: "ORD-2025-167",
      summary: "Replacement order dispatched with fresh stock",
      details: "We have dispatched a replacement order (ORD-2025-167) with fresh stock having 8 months shelf life. The short-dated stock can be returned with our delivery executive. We apologize for this oversight and have implemented additional checks to prevent such issues."
    }
  },
  {
    id: 5,
    complaintNumber: "CMP-2025-118",
    dateRaised: "2025-12-15T16:30:00",
    orderReference: "ORD-2025-120",
    productName: "Veeba Caesar Dressing 300g",
    issueType: "Quality Issue",
    description: "Multiple bottles of Veeba Caesar Dressing 300g showing separation of ingredients and unusual consistency. The product appears to have been stored in improper temperature conditions. Customers have complained about the taste and texture being different from usual.",
    quantityAffected: "8",
    expectedResolution: "Credit Note",
    priority: "Medium",
    status: "Closed",
    resolutionTimeline: "Resolved",
    attachmentCount: 3,
    timeline: [
    {
      title: "Complaint Raised",
      description: "Quality issue reported with product samples",
      timestamp: "2025-12-15T16:30:00",
      icon: "FileText",
      type: "default",
      user: "Customer"
    },
    {
      title: "Quality Analysis",
      description: "Lab testing confirmed storage temperature issue",
      timestamp: "2025-12-16T14:20:00",
      icon: "FlaskConical",
      type: "default",
      user: "Quality Lab"
    },
    {
      title: "Resolution Completed",
      description: "Credit note issued and quality protocols reviewed",
      timestamp: "2025-12-18T10:15:00",
      icon: "CheckCircle",
      type: "success",
      user: "Quality Manager"
    }],

    attachments: [
    {
      name: "product_consistency.jpg",
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_1b02e4f27-1767763059640.png",
      alt: "Photo showing Caesar dressing with visible separation of oil and other ingredients in clear glass bottle",
      type: "image",
      size: "2.1 MB"
    }],

    resolution: {
      type: "Credit Note",
      date: "2025-12-18T10:15:00",
      creditNoteNumber: "CN-2025-076",
      summary: "Credit note issued for quality issue",
      details: "A credit note of ₹2,160 has been issued to your account. Our quality team has identified a temperature control issue during transit which caused the product separation. We have implemented enhanced cold chain monitoring to prevent recurrence. Thank you for bringing this to our attention."
    }
  },
  {
    id: 6,
    complaintNumber: "CMP-2025-095",
    dateRaised: "2025-12-08T13:20:00",
    orderReference: "ORD-2025-098",
    productName: "Veeba Mint Mayonnaise 250g",
    issueType: "Wrong Product",
    description: "Received Veeba Garlic Mayonnaise 250g instead of ordered Veeba Mint Mayonnaise 250g. The invoice and delivery challan correctly mention Mint Mayonnaise but the physical product delivered is Garlic Mayonnaise. This has caused issues with our menu planning.",
    quantityAffected: "20",
    expectedResolution: "Replacement",
    priority: "High",
    status: "Resolved",
    resolutionTimeline: "Resolved",
    attachmentCount: 2,
    timeline: [
    {
      title: "Complaint Raised",
      description: "Wrong product delivery reported",
      timestamp: "2025-12-08T13:20:00",
      icon: "FileText",
      type: "default",
      user: "Customer"
    },
    {
      title: "Verified",
      description: "Picking error confirmed, replacement approved",
      timestamp: "2025-12-08T17:45:00",
      icon: "CheckCircle",
      type: "success",
      user: "Warehouse Manager"
    },
    {
      title: "Correct Product Dispatched",
      description: "Mint Mayonnaise dispatched with return pickup arranged",
      timestamp: "2025-12-09T10:30:00",
      icon: "Package",
      type: "success",
      user: "Logistics Team"
    }],

    attachments: [
    {
      name: "wrong_product.jpg",
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_19367e069-1767763059913.png",
      alt: "Photo showing Garlic Mayonnaise jar next to invoice document mentioning Mint Mayonnaise",
      type: "image",
      size: "1.9 MB"
    }],

    resolution: {
      type: "Replacement",
      date: "2025-12-09T10:30:00",
      replacementOrderNumber: "ORD-2025-112",
      summary: "Correct product dispatched with return pickup",
      details: "The correct product (Veeba Mint Mayonnaise 250g) has been dispatched via order ORD-2025-112. Our delivery executive will collect the wrong product during delivery. We apologize for the picking error and have retrained our warehouse staff to prevent such mistakes."
    }
  }];


  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: complaintsData?.length,
      open: complaintsData?.filter((c) => c?.status === 'Open')?.length,
      investigating: complaintsData?.filter((c) => c?.status === 'Under Investigation')?.length,
      resolved: complaintsData?.filter((c) => c?.status === 'Resolved' || c?.status === 'Closed')?.length
    };
  }, []);

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    return complaintsData?.filter((complaint) => {
      const matchesSearch = filters?.search === '' ||
      complaint?.complaintNumber?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      complaint?.productName?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      complaint?.orderReference?.toLowerCase()?.includes(filters?.search?.toLowerCase());

      const matchesStatus = filters?.status === 'all' || complaint?.status === filters?.status;
      const matchesIssueType = filters?.issueType === 'all' || complaint?.issueType === filters?.issueType;
      const matchesPriority = filters?.priority === 'all' || complaint?.priority === filters?.priority;

      return matchesSearch && matchesStatus && matchesIssueType && matchesPriority;
    });
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewComplaint = (complaintData) => {
    console.log('New complaint submitted:', complaintData);
    // In real app, this would make an API call
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
  };

  return (
    <>
      <Helmet>
        <title>Complaint Management - Veeba Customer Portal</title>
        <meta name="description" content="Raise and track product complaints for shortage, leakage, damage, and expiry issues with comprehensive documentation capabilities." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <Breadcrumb />

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
              <div>
                <h1 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-foreground mb-2">
                  Complaint Management
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Raise and track product issues with comprehensive documentation
                </p>
              </div>
              <Button
                variant="default"
                size="lg"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setShowNewComplaintModal(true)}>

                Raise New Complaint
              </Button>
            </div>

            {/* Stats */}
            <div className="mb-6 md:mb-8">
              <ComplaintStats stats={stats} />
            </div>

            {/* Filters */}
            <div className="mb-6 md:mb-8">
              <ComplaintFilters filters={filters} onFilterChange={handleFilterChange} />
            </div>

            {/* Complaints List */}
            <div className="space-y-4 md:space-y-6">
              {filteredComplaints?.length > 0 ?
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                  {filteredComplaints?.map((complaint) =>
                <ComplaintCard
                  key={complaint?.id}
                  complaint={complaint}
                  onViewDetails={handleViewDetails} />

                )}
                </div> :

              <div className="bg-card rounded-xl p-12 text-center border border-border">
                  <Icon name="Search" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                    No Complaints Found
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    No complaints match your current filters. Try adjusting your search criteria.
                  </p>
                  <Button
                  variant="outline"
                  onClick={() => setFilters({ search: '', status: 'all', issueType: 'all', priority: 'all' })}>

                    Clear Filters
                  </Button>
                </div>
              }
            </div>
          </div>
        </main>

        {/* Modals */}
        <NewComplaintModal
          isOpen={showNewComplaintModal}
          onClose={() => setShowNewComplaintModal(false)}
          onSubmit={handleNewComplaint} />


        <ComplaintDetailsModal
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          complaint={selectedComplaint} />

      </div>
    </>);

};

export default ComplaintManagement;
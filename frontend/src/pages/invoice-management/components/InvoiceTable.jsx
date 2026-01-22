import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import InvoicePreviewModal from './InvoicePreviewModal';
import PaymentModal from './PaymentModal';
import DisputeModal from './DisputeModal';

const InvoiceTable = ({ invoices, selectedInvoices, onSelectInvoice, onSelectAll }) => {
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [paymentInvoice, setPaymentInvoice] = useState(null);
  const [disputeInvoice, setDisputeInvoice] = useState(null);

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { label: 'Paid', color: 'bg-success/10 text-success', icon: 'CheckCircle2' },
      pending: { label: 'Pending', color: 'bg-warning/10 text-warning', icon: 'Clock' },
      overdue: { label: 'Overdue', color: 'bg-error/10 text-error', icon: 'AlertCircle' },
      partially_paid: { label: 'Partially Paid', color: 'bg-accent/10 text-accent', icon: 'TrendingUp' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-caption font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={14} />
        {config?.label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    return type === 'credit_note' ? (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-caption font-medium bg-primary/10 text-primary">
        <Icon name="FileCheck" size={12} />
        Credit Note
      </span>
    ) : null;
  };

  const handleDownload = (invoice) => {
    console.log('Downloading invoice:', invoice?.invoiceNumber);
  };

  const handlePayment = (invoice) => {
    setPaymentInvoice(invoice);
  };

  const handleDispute = (invoice) => {
    setDisputeInvoice(invoice);
  };

  const handlePreview = (invoice) => {
    setPreviewInvoice(invoice);
  };

  return (
    <>
      <div className="bg-card rounded-xl border border-border shadow-warm-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto scrollbar-custom">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    checked={selectedInvoices?.length === invoices?.length && invoices?.length > 0}
                    onChange={onSelectAll}
                    indeterminate={selectedInvoices?.length > 0 && selectedInvoices?.length < invoices?.length}
                  />
                </th>
                <th className="px-4 py-3 text-left font-caption font-semibold text-sm text-foreground">
                  Invoice Details
                </th>
                <th className="px-4 py-3 text-left font-caption font-semibold text-sm text-foreground">
                  Order Ref
                </th>
                <th className="px-4 py-3 text-left font-caption font-semibold text-sm text-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-right font-caption font-semibold text-sm text-foreground">
                  Amount
                </th>
                <th className="px-4 py-3 text-right font-caption font-semibold text-sm text-foreground">
                  GST
                </th>
                <th className="px-4 py-3 text-center font-caption font-semibold text-sm text-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-center font-caption font-semibold text-sm text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices?.map((invoice) => (
                <tr key={invoice?.id} className="hover:bg-muted/30 transition-smooth">
                  <td className="px-4 py-4">
                    <Checkbox
                      checked={selectedInvoices?.includes(invoice?.id)}
                      onChange={() => onSelectInvoice(invoice?.id)}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handlePreview(invoice)}
                        className="font-heading font-semibold text-sm text-primary hover:underline text-left"
                      >
                        {invoice?.invoiceNumber}
                      </button>
                      {getTypeBadge(invoice?.type)}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-caption text-sm text-foreground">
                      {invoice?.orderRef}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-caption text-sm text-muted-foreground">
                      {invoice?.date}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-data font-semibold text-sm text-foreground">
                      ₹{invoice?.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-data text-sm text-muted-foreground">
                      ₹{invoice?.gst?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {getStatusBadge(invoice?.status)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handlePreview(invoice)}
                        className="p-2 rounded-lg hover:bg-muted transition-smooth"
                        title="Preview"
                      >
                        <Icon name="Eye" size={18} color="var(--color-muted-foreground)" />
                      </button>
                      <button
                        onClick={() => handleDownload(invoice)}
                        className="p-2 rounded-lg hover:bg-muted transition-smooth"
                        title="Download PDF"
                      >
                        <Icon name="Download" size={18} color="var(--color-primary)" />
                      </button>
                      {invoice?.status !== 'paid' && (
                        <button
                          onClick={() => handlePayment(invoice)}
                          className="p-2 rounded-lg hover:bg-muted transition-smooth"
                          title="Make Payment"
                        >
                          <Icon name="CreditCard" size={18} color="var(--color-success)" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDispute(invoice)}
                        className="p-2 rounded-lg hover:bg-muted transition-smooth"
                        title="Raise Dispute"
                      >
                        <Icon name="AlertTriangle" size={18} color="var(--color-warning)" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-border">
          {invoices?.map((invoice) => (
            <div key={invoice?.id} className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <Checkbox
                  checked={selectedInvoices?.includes(invoice?.id)}
                  onChange={() => onSelectInvoice(invoice?.id)}
                />
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => handlePreview(invoice)}
                    className="font-heading font-semibold text-base text-primary hover:underline text-left mb-1"
                  >
                    {invoice?.invoiceNumber}
                  </button>
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeBadge(invoice?.type)}
                    {getStatusBadge(invoice?.status)}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Order:</span>
                      <span className="font-caption text-foreground">{invoice?.orderRef}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-caption text-foreground">{invoice?.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-data font-semibold text-foreground">
                        ₹{invoice?.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">GST:</span>
                      <span className="font-data text-foreground">
                        ₹{invoice?.gst?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Eye"
                  iconPosition="left"
                  onClick={() => handlePreview(invoice)}
                >
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                  onClick={() => handleDownload(invoice)}
                >
                  Download
                </Button>
                {invoice?.status !== 'paid' && (
                  <Button
                    variant="default"
                    size="sm"
                    iconName="CreditCard"
                    iconPosition="left"
                    onClick={() => handlePayment(invoice)}
                  >
                    Pay
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {invoices?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 md:py-16">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <Icon name="FileText" size={32} color="var(--color-muted-foreground)" />
            </div>
            <h3 className="font-heading font-semibold text-lg md:text-xl text-foreground mb-2">
              No Invoices Found
            </h3>
            <p className="font-caption text-sm md:text-base text-muted-foreground text-center max-w-md">
              No invoices match your current filters. Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>
      {previewInvoice && (
        <InvoicePreviewModal
          invoice={previewInvoice}
          onClose={() => setPreviewInvoice(null)}
        />
      )}
      {paymentInvoice && (
        <PaymentModal
          invoice={paymentInvoice}
          onClose={() => setPaymentInvoice(null)}
        />
      )}
      {disputeInvoice && (
        <DisputeModal
          invoice={disputeInvoice}
          onClose={() => setDisputeInvoice(null)}
        />
      )}
    </>
  );
};

export default InvoiceTable;
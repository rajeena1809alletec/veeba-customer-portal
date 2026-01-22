import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const InvoicePreviewModal = ({ invoice, onClose }) => {
  const handleDownload = () => {
    console.log('Downloading invoice:', invoice?.invoiceNumber);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-xl shadow-warm-xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg md:text-xl text-foreground">
                Invoice Preview
              </h2>
              <p className="font-caption text-sm text-muted-foreground">
                {invoice?.invoiceNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-smooth"
          >
            <Icon name="X" size={20} color="var(--color-foreground)" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto scrollbar-custom max-h-[calc(90vh-180px)]">
          {/* Invoice Header */}
          <div className="bg-muted/30 rounded-lg p-4 md:p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Utensils" size={32} color="var(--color-primary)" />
                  <span className="font-heading font-bold text-2xl text-primary">Veeba Foods</span>
                </div>
                <p className="font-caption text-sm text-muted-foreground max-w-xs">
                  Plot No. 92, Sector 3, IMT Manesar\nGurugram, Haryana - 122050\nGSTIN: 06AABCV1234F1Z5
                </p>
              </div>
              <div className="text-right">
                <h3 className="font-heading font-bold text-2xl text-foreground mb-1">
                  {invoice?.type === 'credit_note' ? 'CREDIT NOTE' : 'TAX INVOICE'}
                </h3>
                <p className="font-caption text-sm text-muted-foreground">
                  Original for Recipient
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <h4 className="font-caption font-semibold text-sm text-foreground mb-2">
                  Bill To:
                </h4>
                <p className="font-caption text-sm text-muted-foreground">
                  Modern Retail Distributors Pvt Ltd\n123, Commercial Complex, Sector 18\nNoida, Uttar Pradesh - 201301\nGSTIN: 09AABCM1234D1Z8
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-caption text-sm text-muted-foreground">Invoice No:</span>
                  <span className="font-data font-semibold text-sm text-foreground">{invoice?.invoiceNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-caption text-sm text-muted-foreground">Invoice Date:</span>
                  <span className="font-caption text-sm text-foreground">{invoice?.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-caption text-sm text-muted-foreground">Order Ref:</span>
                  <span className="font-caption text-sm text-foreground">{invoice?.orderRef}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-caption text-sm text-muted-foreground">Due Date:</span>
                  <span className="font-caption text-sm text-foreground">25/01/2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-6">
            <h4 className="font-heading font-semibold text-base text-foreground mb-4">
              Invoice Items
            </h4>
            <div className="overflow-x-auto scrollbar-custom">
              <table className="w-full">
                <thead className="bg-muted/50 border-y border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-caption font-semibold text-sm text-foreground">
                      Item Description
                    </th>
                    <th className="px-4 py-3 text-center font-caption font-semibold text-sm text-foreground">
                      HSN
                    </th>
                    <th className="px-4 py-3 text-right font-caption font-semibold text-sm text-foreground">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-right font-caption font-semibold text-sm text-foreground">
                      Rate
                    </th>
                    <th className="px-4 py-3 text-right font-caption font-semibold text-sm text-foreground">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-caption text-sm text-foreground">
                      Veeba Mayonnaise 1kg
                    </td>
                    <td className="px-4 py-3 text-center font-data text-sm text-muted-foreground">
                      21039090
                    </td>
                    <td className="px-4 py-3 text-right font-data text-sm text-foreground">
                      50
                    </td>
                    <td className="px-4 py-3 text-right font-data text-sm text-foreground">
                      ₹285.00
                    </td>
                    <td className="px-4 py-3 text-right font-data font-semibold text-sm text-foreground">
                      ₹14,250.00
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-caption text-sm text-foreground">
                      Veeba Thousand Island 1kg
                    </td>
                    <td className="px-4 py-3 text-center font-data text-sm text-muted-foreground">
                      21039090
                    </td>
                    <td className="px-4 py-3 text-right font-data text-sm text-foreground">
                      30
                    </td>
                    <td className="px-4 py-3 text-right font-data text-sm text-foreground">
                      ₹295.00
                    </td>
                    <td className="px-4 py-3 text-right font-data font-semibold text-sm text-foreground">
                      ₹8,850.00
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Tax Summary */}
          <div className="bg-muted/30 rounded-lg p-4 md:p-6">
            <div className="space-y-3 max-w-md ml-auto">
              <div className="flex items-center justify-between">
                <span className="font-caption text-sm text-muted-foreground">Subtotal:</span>
                <span className="font-data font-semibold text-sm text-foreground">
                  ₹{(invoice?.amount - invoice?.gst)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-caption text-sm text-muted-foreground">CGST (9%):</span>
                <span className="font-data text-sm text-foreground">
                  ₹{(invoice?.gst / 2)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-caption text-sm text-muted-foreground">SGST (9%):</span>
                <span className="font-data text-sm text-foreground">
                  ₹{(invoice?.gst / 2)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="font-heading font-semibold text-base text-foreground">Total Amount:</span>
                <span className="font-data font-bold text-xl text-primary">
                  ₹{invoice?.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-6 p-4 bg-muted/20 rounded-lg">
            <h4 className="font-caption font-semibold text-sm text-foreground mb-2">
              Terms &amp; Conditions:
            </h4>
            <ul className="space-y-1 font-caption text-xs text-muted-foreground">
              <li>• Payment due within 15 days from invoice date</li>
              <li>• Interest @18% p.a. will be charged on delayed payments</li>
              <li>• All disputes subject to Gurugram jurisdiction</li>
              <li>• Goods once sold will not be taken back</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-border">
          <Button
            variant="outline"
            iconName="X"
            iconPosition="left"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="default"
            iconName="Download"
            iconPosition="left"
            onClick={handleDownload}
          >
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreviewModal;
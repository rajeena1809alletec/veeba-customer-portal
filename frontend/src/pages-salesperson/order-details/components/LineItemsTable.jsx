import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const LineItemsTable = ({ lineItems, onRaiseComplaint }) => {
  const [expandedItems, setExpandedItems] = useState([]);

  const toggleExpand = (itemId) => {
    setExpandedItems(prev =>
      prev?.includes(itemId)
        ? prev?.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const calculateLineTotal = (item) => {
    const subtotal = (item?.qty || 0) * (item?.unitPrice || 0);
    const gstAmount = (subtotal * (item?.gstRate || 0)) / 100;
    return subtotal + gstAmount;
  };

  return (
    <div className="bg-card rounded-xl shadow-warm-md border border-border overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border">
        <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground flex items-center gap-2">
          <Icon name="Package" size={24} color="var(--color-primary)" />
          Order Line Items
        </h2>
      </div>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-caption font-semibold text-foreground">Order No.</th>
              <th className="px-6 py-4 text-left text-sm font-caption font-semibold text-foreground">Item No.</th>
              <th className="px-6 py-4 text-left text-sm font-caption font-semibold text-foreground">Description</th>
              <th className="px-6 py-4 text-left text-sm font-caption font-semibold text-foreground">UOM</th>
              <th className="px-6 py-4 text-right text-sm font-caption font-semibold text-foreground">Qty</th>
              <th className="px-6 py-4 text-right text-sm font-caption font-semibold text-foreground">Unit Price</th>
              <th className="px-6 py-4 text-right text-sm font-caption font-semibold text-foreground">GST Rate</th>
              <th className="px-6 py-4 text-right text-sm font-caption font-semibold text-foreground">Invoiced Qty</th>
              <th className="px-6 py-4 text-right text-sm font-caption font-semibold text-foreground">Outstanding Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {lineItems?.map((item) => (
              <tr key={item?.id} className="hover:bg-muted/30 transition-smooth">
                <td className="px-6 py-4">
                  <span className="font-body text-sm text-foreground">{item?.orderNo || '-'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-foreground">{item?.itemNo || '-'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-body text-sm text-foreground">{item?.description || '-'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-body text-sm text-foreground">{item?.uom || '-'}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-body text-sm text-foreground">{item?.qty ?? 0}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-body text-sm text-foreground">
                    ₹{item?.unitPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-body text-sm text-foreground">{item?.gstRate ?? 0}%</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-body text-sm text-foreground">{item?.invoicedQty ?? 0}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-body text-sm text-foreground">{item?.outstandingQty ?? 0}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-border">
        {lineItems?.map((item) => (
          <div key={item?.id} className="p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <h3 className="font-body font-medium text-foreground text-sm mb-1">
                  {item?.description || '-'}
                </h3>
                <p className="text-xs text-muted-foreground font-caption">Order No: {item?.orderNo || '-'}</p>
                <p className="text-xs text-muted-foreground font-caption">Item No: {item?.itemNo || '-'}</p>
              </div>
              <button
                onClick={() => toggleExpand(item?.id)}
                className="p-2 hover:bg-muted rounded-md transition-smooth flex-shrink-0"
              >
                <Icon
                  name={expandedItems?.includes(item?.id) ? "ChevronUp" : "ChevronDown"}
                  size={20}
                  color="var(--color-muted-foreground)"
                />
              </button>
            </div>

            {expandedItems?.includes(item?.id) && (
              <div className="space-y-2 pt-3 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-caption">UOM:</span>
                  <span className="text-foreground font-body">{item?.uom || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-caption">Qty:</span>
                  <span className="text-foreground font-body">{item?.qty ?? 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-caption">Unit Price:</span>
                  <span className="text-foreground font-body">
                    ₹{item?.unitPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-caption">GST Rate:</span>
                  <span className="text-foreground font-body">{item?.gstRate ?? 0}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-caption">Invoiced Qty:</span>
                  <span className="text-foreground font-body">{item?.invoicedQty ?? 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-caption">Outstanding Qty:</span>
                  <span className="text-foreground font-body">{item?.outstandingQty ?? 0}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-border">
                  <span className="text-foreground font-caption font-semibold">Line Total:</span>
                  <span className="text-primary font-body font-bold">
                    ₹{calculateLineTotal(item)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Summary Section */}
      <div className="p-4 md:p-6 bg-muted/30 border-t border-border">
        <div className="max-w-md ml-auto space-y-2">
          <div className="flex justify-between text-sm md:text-base">
            <span className="text-muted-foreground font-caption">Subtotal:</span>
            <span className="text-foreground font-body">
              ₹{lineItems?.reduce((sum, item) => sum + ((item?.qty || 0) * (item?.unitPrice || 0)), 0)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-sm md:text-base">
            <span className="text-muted-foreground font-caption">Total GST:</span>
            <span className="text-foreground font-body">
              ₹{lineItems?.reduce((sum, item) => {
                const subtotal = (item?.qty || 0) * (item?.unitPrice || 0);
                return sum + (subtotal * (item?.gstRate || 0) / 100);
              }, 0)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-base md:text-lg pt-2 border-t border-border">
            <span className="text-foreground font-heading font-semibold">Grand Total:</span>
            <span className="text-primary font-heading font-bold">
              ₹{lineItems?.reduce((sum, item) => sum + calculateLineTotal(item), 0)?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineItemsTable;
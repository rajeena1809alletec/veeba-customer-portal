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
    const subtotal = item?.quantity * item?.unitPrice;
    const gstAmount = (subtotal * item?.gstRate) / 100;
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
              <th className="px-6 py-4 text-left text-sm font-caption font-semibold text-foreground">Product</th>
              <th className="px-6 py-4 text-left text-sm font-caption font-semibold text-foreground">Code</th>
              <th className="px-6 py-4 text-right text-sm font-caption font-semibold text-foreground">Quantity</th>
              <th className="px-6 py-4 text-right text-sm font-caption font-semibold text-foreground">Unit Price</th>
              <th className="px-6 py-4 text-right text-sm font-caption font-semibold text-foreground">GST Rate</th>
              <th className="px-6 py-4 text-right text-sm font-caption font-semibold text-foreground">Line Total</th>
              <th className="px-6 py-4 text-center text-sm font-caption font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {lineItems?.map((item) => (
              <tr key={item?.id} className="hover:bg-muted/30 transition-smooth">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={item?.productImage}
                        alt={item?.productImageAlt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-body font-medium text-foreground text-sm md:text-base line-clamp-2">
                        {item?.productName}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground font-caption mt-1">
                        {item?.packSize}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-foreground">{item?.productCode}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-body text-sm md:text-base text-foreground font-medium">
                    {item?.quantity} {item?.unit}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-body text-sm md:text-base text-foreground">
                    ₹{item?.unitPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-body text-sm md:text-base text-muted-foreground">
                    {item?.gstRate}%
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-body text-sm md:text-base text-foreground font-semibold">
                    ₹{calculateLineTotal(item)?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="AlertCircle"
                    onClick={() => onRaiseComplaint(item)}
                  >
                    Report Issue
                  </Button>
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
            <div className="flex gap-3 mb-3">
              <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={item?.productImage}
                  alt={item?.productImageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-body font-medium text-foreground text-sm line-clamp-2 mb-1">
                  {item?.productName}
                </h3>
                <p className="text-xs text-muted-foreground font-caption mb-1">{item?.packSize}</p>
                <p className="font-mono text-xs text-muted-foreground">{item?.productCode}</p>
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
                  <span className="text-muted-foreground font-caption">Quantity:</span>
                  <span className="text-foreground font-body font-medium">
                    {item?.quantity} {item?.unit}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-caption">Unit Price:</span>
                  <span className="text-foreground font-body">
                    ₹{item?.unitPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-caption">GST Rate:</span>
                  <span className="text-foreground font-body">{item?.gstRate}%</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-border">
                  <span className="text-foreground font-caption font-semibold">Line Total:</span>
                  <span className="text-primary font-body font-bold">
                    ₹{calculateLineTotal(item)?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="AlertCircle"
                  iconPosition="left"
                  onClick={() => onRaiseComplaint(item)}
                  fullWidth
                  className="mt-3"
                >
                  Report Issue
                </Button>
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
              ₹{lineItems?.reduce((sum, item) => sum + (item?.quantity * item?.unitPrice), 0)?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-sm md:text-base">
            <span className="text-muted-foreground font-caption">Total GST:</span>
            <span className="text-foreground font-body">
              ₹{lineItems?.reduce((sum, item) => {
                const subtotal = item?.quantity * item?.unitPrice;
                return sum + (subtotal * item?.gstRate / 100);
              }, 0)?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
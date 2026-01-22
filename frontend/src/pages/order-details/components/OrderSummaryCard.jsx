import React from 'react';
import Icon from '../../../components/AppIcon';

const OrderSummaryCard = ({ summary }) => {
  return (
    <div className="bg-card rounded-xl p-4 md:p-6 shadow-warm-md border border-border">
      <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="FileText" size={20} color="var(--color-primary)" />
        Order Summary
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm md:text-base text-muted-foreground font-caption">Customer Name</span>
          <span className="text-sm md:text-base text-foreground font-body font-medium text-right">
            {summary?.customerName}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm md:text-base text-muted-foreground font-caption">Customer Code</span>
          <span className="text-sm md:text-base text-foreground font-mono">
            {summary?.customerCode}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm md:text-base text-muted-foreground font-caption">GST Number</span>
          <span className="text-sm md:text-base text-foreground font-mono">
            {summary?.gstNumber}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm md:text-base text-muted-foreground font-caption">Payment Terms</span>
          <span className="text-sm md:text-base text-foreground font-body font-medium">
            {summary?.paymentTerms}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm md:text-base text-muted-foreground font-caption">Shipping Address</span>
          <span className="text-sm md:text-base text-foreground font-body text-right max-w-[60%]">
            {summary?.shippingAddress}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm md:text-base text-muted-foreground font-caption">Billing Address</span>
          <span className="text-sm md:text-base text-foreground font-body text-right max-w-[60%]">
            {summary?.billingAddress}
          </span>
        </div>

        {summary?.specialInstructions && (
          <div className="pt-3 mt-3 border-t border-border">
            <p className="text-sm text-muted-foreground font-caption mb-2">Special Instructions</p>
            <p className="text-sm md:text-base text-foreground font-body bg-muted/30 p-3 rounded-md">
              {summary?.specialInstructions}
            </p>
          </div>
        )}

        {summary?.referenceNumber && (
          <div className="flex justify-between items-center py-2">
            <span className="text-sm md:text-base text-muted-foreground font-caption">Reference Number</span>
            <span className="text-sm md:text-base text-foreground font-mono">
              {summary?.referenceNumber}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummaryCard;
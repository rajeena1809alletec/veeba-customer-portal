import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import OrderStatusBadge from './OrderStatusBadge';

const OrderMobileCard = ({ order, onRepeatOrder }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleViewDetails = () => {
    navigate(`/order-details?orderId=${order?.orderNumber}`);
  };

  return (
    <div className="bg-card rounded-xl p-4 shadow-warm-sm border border-border">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <button
            onClick={handleViewDetails}
            className="font-body font-semibold text-base text-primary hover:underline mb-1"
          >
            {order?.orderNumber}
          </button>
          <p className="font-caption text-sm text-muted-foreground">
            {order?.orderDate}
          </p>
        </div>
        <OrderStatusBadge status={order?.status} />
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="font-caption text-sm text-muted-foreground">
            Total Amount
          </span>
          <span className="font-body font-semibold text-base text-foreground">
            ₹{order?.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-caption text-sm text-muted-foreground">
            Delivery Date
          </span>
          <span className="font-caption text-sm text-foreground">
            {order?.deliveryDate}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Button
          variant="outline"
          size="sm"
          iconName="Eye"
          iconPosition="left"
          onClick={handleViewDetails}
          fullWidth
        >
          View Details
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconName="RefreshCw"
          iconPosition="left"
          onClick={() => onRepeatOrder(order)}
          fullWidth
        >
          Repeat
        </Button>
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-2 py-2 text-sm font-caption font-medium text-primary hover:bg-primary/5 rounded-lg transition-smooth"
      >
        <span>{expanded ? 'Hide' : 'Show'} Items</span>
        <Icon
          name={expanded ? 'ChevronUp' : 'ChevronDown'}
          size={16}
          color="var(--color-primary)"
        />
      </button>
      {expanded && (
        <div className="mt-4 pt-4 border-t border-border space-y-3">
          {order?.items?.map((item, index) => (
            <div key={index} className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-body text-sm text-foreground mb-1">
                  {item?.productName}
                </p>
                <p className="font-caption text-xs text-muted-foreground">
                  {item?.quantity} {item?.unit} × ₹{item?.unitPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <span className="font-body font-medium text-sm text-foreground whitespace-nowrap">
                ₹{item?.total?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}

          {order?.trackingInfo && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-2">
                <Icon name="Truck" size={18} color="var(--color-accent)" />
                <div className="flex-1">
                  <p className="font-caption text-xs font-medium text-foreground mb-1">
                    {order?.trackingInfo?.status}
                  </p>
                  <p className="font-caption text-xs text-muted-foreground">
                    ID: {order?.trackingInfo?.trackingId}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderMobileCard;
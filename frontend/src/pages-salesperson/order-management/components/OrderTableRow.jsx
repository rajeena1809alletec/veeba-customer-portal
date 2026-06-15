import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import OrderStatusBadge from './OrderStatusBadge';

const OrderTableRow = ({ order, onRepeatOrder }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleViewDetails = () => {
    navigate(`/order-details?orderId=${order?.orderNumber}`);
  };

  return (
    <>
      <tr className="border-b border-border hover:bg-muted/50 transition-smooth">
        <td className="px-4 py-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-muted rounded transition-smooth"
            aria-label={expanded ? 'Collapse details' : 'Expand details'}
          >
            <Icon
              name={expanded ? 'ChevronDown' : 'ChevronRight'}
              size={18}
              color="var(--color-muted-foreground)"
            />
          </button>
        </td>
        <td className="px-4 py-4">
          <button
            onClick={handleViewDetails}
            className="font-body font-medium text-sm text-primary hover:underline"
          >
            {order?.orderNumber}
          </button>
        </td>
        <td className="px-4 py-4">
          <span className="font-caption text-sm text-foreground">
            {order?.orderDate}
          </span>
        </td>
        <td className="px-4 py-4">
          <span className="font-body font-medium text-sm text-foreground">
            ₹{order?.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </td>
        <td className="px-4 py-4">
          <OrderStatusBadge status={order?.status} />
        </td>
        <td className="px-4 py-4">
          <span className="font-caption text-sm text-muted-foreground">
            {order?.deliveryDate}
          </span>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Eye"
              onClick={handleViewDetails}
            >
              View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="RefreshCw"
              onClick={() => onRepeatOrder(order)}
            >
              Repeat
            </Button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-muted/30">
          <td colSpan="7" className="px-4 py-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Package" size={18} color="var(--color-primary)" />
                <h4 className="font-heading font-semibold text-base text-foreground">
                  Order Items
                </h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left font-caption text-xs font-medium text-muted-foreground uppercase">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left font-caption text-xs font-medium text-muted-foreground uppercase">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left font-caption text-xs font-medium text-muted-foreground uppercase">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-left font-caption text-xs font-medium text-muted-foreground uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order?.items?.map((item, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="px-4 py-3 font-body text-sm text-foreground">
                          {item?.productName}
                        </td>
                        <td className="px-4 py-3 font-caption text-sm text-muted-foreground">
                          {item?.quantity} {item?.unit}
                        </td>
                        <td className="px-4 py-3 font-body text-sm text-foreground">
                          ₹{item?.unitPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 font-body font-medium text-sm text-foreground">
                          ₹{item?.total?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {order?.trackingInfo && (
                <div className="mt-4 p-4 bg-card rounded-lg border border-border">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Truck" size={20} color="var(--color-accent)" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-heading font-semibold text-sm text-foreground mb-1">
                        Tracking Information
                      </h5>
                      <p className="font-caption text-sm text-muted-foreground mb-2">
                        {order?.trackingInfo?.status}
                      </p>
                      <p className="font-caption text-xs text-muted-foreground">
                        Tracking ID: {order?.trackingInfo?.trackingId}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default OrderTableRow;
import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrderHeader = ({ order, onRepeatOrder, onRaiseComplaint, onShare, onPrint }) => {
  const getStatusColor = (status) => {
    const statusColors = {
      'Confirmed': 'bg-primary/10 text-primary border-primary/20',
      'Dispatched': 'bg-accent/10 text-accent border-accent/20',
      'Delivered': 'bg-success/10 text-success border-success/20',
      'Cancelled': 'bg-error/10 text-error border-error/20',
      'Pending': 'bg-warning/10 text-warning border-warning/20'
    };
    return statusColors?.[status] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 lg:p-8 shadow-warm-md border border-border">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6 mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold text-foreground">
              Order #{order?.orderNumber}
            </h1>
            <span className={`px-3 py-1 rounded-md text-sm font-caption font-medium border ${getStatusColor(order?.status)}`}>
              {order?.status}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon name="Calendar" size={18} />
              <span className="text-sm md:text-base font-body">
                Order Date: <span className="text-foreground font-medium">{order?.orderDate}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon name="Truck" size={18} />
              <span className="text-sm md:text-base font-body">
                Expected: <span className="text-foreground font-medium">{order?.expectedDelivery}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon name="MapPin" size={18} />
              <span className="text-sm md:text-base font-body">
                Ship To: <span className="text-foreground font-medium">{order?.shipToLocation}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <p className="text-sm md:text-base text-muted-foreground font-caption mb-1">Total Amount</p>
            <p className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-primary">
              ₹{order?.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground font-caption">Including GST</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 md:gap-3">
        <Button
          variant="default"
          iconName="RefreshCw"
          iconPosition="left"
          onClick={onRepeatOrder}
          className="flex-1 sm:flex-none"
        >
          Repeat Order
        </Button>
        <Button
          variant="outline"
          iconName="MessageSquare"
          iconPosition="left"
          onClick={onRaiseComplaint}
          className="flex-1 sm:flex-none"
        >
          Raise Complaint
        </Button>
        <Button
          variant="ghost"
          iconName="Share2"
          iconPosition="left"
          onClick={onShare}
          className="flex-1 sm:flex-none"
        >
          Share
        </Button>
        <Button
          variant="ghost"
          iconName="Printer"
          iconPosition="left"
          onClick={onPrint}
          className="flex-1 sm:flex-none"
        >
          Print
        </Button>
      </div>
    </div>
  );
};

export default OrderHeader;
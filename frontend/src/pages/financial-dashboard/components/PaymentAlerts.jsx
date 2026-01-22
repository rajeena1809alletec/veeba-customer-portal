import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentAlerts = ({ alerts, onPayNow, onViewDetails }) => {
  const getAlertIcon = (type) => {
    const icons = {
      'overdue': 'AlertCircle',
      'due_soon': 'Clock',
      'reminder': 'Bell'
    };
    return icons?.[type] || 'Info';
  };

  const getAlertColor = (type) => {
    const colors = {
      'overdue': 'border-error/30 bg-error/5',
      'due_soon': 'border-warning/30 bg-warning/5',
      'reminder': 'border-primary/30 bg-primary/5'
    };
    return colors?.[type] || 'border-border bg-card';
  };

  const getIconColor = (type) => {
    const colors = {
      'overdue': 'var(--color-error)',
      'due_soon': 'var(--color-warning)',
      'reminder': 'var(--color-primary)'
    };
    return colors?.[type] || 'var(--color-muted-foreground)';
  };

  if (alerts?.length === 0) {
    return (
      <div className="bg-card rounded-xl p-6 border border-border shadow-warm-sm text-center">
        <div className="bg-success/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={32} color="var(--color-success)" />
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
          All Clear!
        </h3>
        <p className="font-body text-sm text-muted-foreground">
          No pending payment alerts at this time
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {alerts?.map((alert) => (
        <div 
          key={alert?.id} 
          className={`rounded-xl p-4 md:p-5 border-2 ${getAlertColor(alert?.type)} transition-smooth hover:shadow-warm-md`}
        >
          <div className="flex items-start gap-3 md:gap-4">
            <div className="flex-shrink-0 mt-1">
              <Icon name={getAlertIcon(alert?.type)} size={24} color={getIconColor(alert?.type)} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-heading font-semibold text-sm md:text-base text-foreground">
                  {alert?.title}
                </h4>
                <span className="font-caption text-xs text-muted-foreground whitespace-nowrap">
                  {alert?.daysInfo}
                </span>
              </div>
              
              <p className="font-body text-sm text-muted-foreground mb-3">
                {alert?.message}
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-caption text-xs text-muted-foreground">
                    Invoice: <span className="data-text text-foreground">{alert?.invoiceRef}</span>
                  </p>
                  <p className="font-body text-base md:text-lg font-semibold text-foreground data-text">
                    ₹{alert?.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Eye"
                    onClick={() => onViewDetails(alert)}
                    className="flex-1 sm:flex-none"
                  >
                    View
                  </Button>
                  <Button
                    variant={alert?.type === 'overdue' ? 'destructive' : 'default'}
                    size="sm"
                    iconName="CreditCard"
                    iconPosition="left"
                    onClick={() => onPayNow(alert)}
                    className="flex-1 sm:flex-none"
                  >
                    Pay Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentAlerts;
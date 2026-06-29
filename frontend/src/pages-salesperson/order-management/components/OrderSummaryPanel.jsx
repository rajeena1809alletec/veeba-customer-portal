import React from 'react';
import Icon from '../../../components/AppIcon';

const OrderSummaryPanel = ({ summary }) => {
  const formatCurrency = (amount) =>
    `₹${(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  const summaryCards = [
    {
      label: 'Total Orders',
      value: summary?.totalOrders,
      amount: summary?.totalOrdersAmount || 0,
      icon: 'ShoppingCart',
      iconColor: 'var(--color-primary)',
      bgColor: 'bg-primary/10',
      // trend: '+12%',
      // trendUp: true
    },
    {
      label: 'Orders In Process',
      value: summary?.openOrders,
      amount: summary?.openOrdersAmount || 0,
      icon: 'Clock',
      iconColor: 'var(--color-warning)',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Blocked Orders',
      value: summary?.blockedOrders,
      amount: summary?.blockedOrdersAmount || 0,
      icon: 'ShieldAlert',
      iconColor: 'var(--color-error)',
      bgColor: 'bg-error/10',
    },
    {
      label: 'Dispatched',
      value: summary?.dispatchedOrders,
      amount: summary?.dispatchedOrdersAmount || 0,
      icon: 'Truck',
      iconColor: 'var(--color-accent)',
      bgColor: 'bg-accent/10',
      // trend: '+8%',
      // trendUp: true
    },
    // {
    //   label: 'Total Value',
    //   value: `₹${summary?.totalValue?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    //   icon: 'DollarSign',
    //   iconColor: 'var(--color-success)',
    //   bgColor: 'bg-success/10',
    //   // trend: '+15%',
    //   // trendUp: true
    // }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {summaryCards?.map((card, index) => (
        <div
          key={index}
          className="bg-card rounded-xl p-4 md:p-6 shadow-warm-sm border border-border hover:shadow-warm-md transition-smooth"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`${card?.bgColor} rounded-lg p-3`}>
              <Icon name={card?.icon} size={24} color={card?.iconColor} />
            </div>
            {/* <div className={`flex items-center gap-1 text-xs font-caption font-medium ${card?.trendUp ? 'text-success' : 'text-error'}`}>
              <Icon name={card?.trendUp ? 'TrendingUp' : 'TrendingDown'} size={14} />
              <span>{card?.trend}</span>
            </div> */}
          </div>
          <div>
            <p className="font-caption text-sm text-muted-foreground mb-1">
              {card?.label}
            </p>

            <p className="font-heading font-semibold text-2xl md:text-3xl text-foreground">
              {card?.value}
            </p>

            {card?.amount !== undefined && (
              <p className="font-caption text-sm text-muted-foreground mt-2">
                {formatCurrency(card?.amount)}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderSummaryPanel;
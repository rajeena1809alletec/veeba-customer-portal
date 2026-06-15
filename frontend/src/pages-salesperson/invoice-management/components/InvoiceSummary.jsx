import React from 'react';
import Icon from '../../../components/AppIcon';

const InvoiceSummary = ({ summary }) => {
  const summaryCards = [
    {
      title: 'Total Invoiced',
      value: `₹${summary?.totalInvoiced?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: 'FileText',
      iconColor: 'var(--color-primary)',
      bgColor: 'bg-primary/10',
      trend: '+12.5%',
      trendUp: true
    },
    {
      title: 'Pending Payments',
      value: `₹${summary?.pendingPayments?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: 'Clock',
      iconColor: 'var(--color-warning)',
      bgColor: 'bg-warning/10',
      count: `${summary?.pendingCount} invoices`
    },
    {
      title: 'Overdue Amount',
      value: `₹${summary?.overdueAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: 'AlertCircle',
      iconColor: 'var(--color-error)',
      bgColor: 'bg-error/10',
      count: `${summary?.overdueCount} invoices`
    },
    {
      title: 'Total GST',
      value: `₹${summary?.totalGST?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: 'Receipt',
      iconColor: 'var(--color-accent)',
      bgColor: 'bg-accent/10',
      subtitle: 'This month'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {summaryCards?.map((card, index) => (
        <div
          key={index}
          className="bg-card rounded-xl border border-border shadow-warm-sm p-4 md:p-6 transition-smooth hover:shadow-warm-md"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`${card?.bgColor} rounded-lg p-2.5 md:p-3`}>
              <Icon name={card?.icon} size={20} color={card?.iconColor} />
            </div>
            {card?.trend && (
              <span className={`text-xs md:text-sm font-caption font-medium ${card?.trendUp ? 'text-success' : 'text-error'}`}>
                {card?.trend}
              </span>
            )}
          </div>
          <h3 className="font-caption text-xs md:text-sm text-muted-foreground mb-1">
            {card?.title}
          </h3>
          <p className="font-heading font-semibold text-xl md:text-2xl text-foreground mb-1">
            {card?.value}
          </p>
          {card?.count && (
            <p className="font-caption text-xs text-muted-foreground">
              {card?.count}
            </p>
          )}
          {card?.subtitle && (
            <p className="font-caption text-xs text-muted-foreground">
              {card?.subtitle}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default InvoiceSummary;
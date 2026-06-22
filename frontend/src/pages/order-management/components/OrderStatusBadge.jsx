import React from 'react';

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    open: {
      label: 'Open',
      className: 'bg-warning/10 text-warning border-warning/20'
    },
    released: {
      label: 'Released',
      className: 'bg-primary/10 text-primary border-primary/20'
    },
    dispatched: {
      label: 'Dispatched',
      className: 'bg-accent/10 text-accent border-accent/20'
    },
    invoiced: {
      label: 'Invoiced',
      className: 'bg-success/10 text-success border-success/20'
    },
    cancelled: {
      label: 'Cancelled',
      className: 'bg-error/10 text-error border-error/20'
    },
    'pending approval': {
      label: 'Pending Approval',
      className: 'bg-warning/10 text-warning border-warning/20'
    },
    'pending prepayment': {
      label: 'Pending Prepayment',
      className: 'bg-warning/10 text-warning border-warning/20'
    }
  };

  const normalizedStatus = status?.toLowerCase()?.trim();
  const config = statusConfig?.[normalizedStatus] || statusConfig?.open;

  return (
    <span
      className={`
        inline-flex items-center justify-center
        px-3 py-1 rounded-full
        text-xs font-caption font-medium
        border
        ${config?.className}
      `}
    >
      {config?.label}
    </span>
  );
};

export default OrderStatusBadge;
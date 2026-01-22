import React from 'react';

const ComplaintStatusBadge = ({ status }) => {
  const statusConfig = {
    'Open': {
      bg: 'bg-warning/10',
      text: 'text-warning',
      label: 'Open'
    },
    'Under Investigation': {
      bg: 'bg-accent/10',
      text: 'text-accent',
      label: 'Under Investigation'
    },
    'Resolved': {
      bg: 'bg-success/10',
      text: 'text-success',
      label: 'Resolved'
    },
    'Closed': {
      bg: 'bg-muted',
      text: 'text-muted-foreground',
      label: 'Closed'
    },
    'Rejected': {
      bg: 'bg-error/10',
      text: 'text-error',
      label: 'Rejected'
    }
  };

  const config = statusConfig?.[status] || statusConfig?.['Open'];

  return (
    <span className={`
      inline-flex items-center justify-center
      px-3 py-1 rounded-full
      text-xs font-caption font-medium
      ${config?.bg} ${config?.text}
      transition-smooth
    `}>
      {config?.label}
    </span>
  );
};

export default ComplaintStatusBadge;
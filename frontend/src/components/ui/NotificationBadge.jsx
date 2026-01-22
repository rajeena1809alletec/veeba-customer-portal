import React from 'react';

const NotificationBadge = ({ count = 0, variant = 'default', className = '' }) => {
  if (count === 0) return null;

  const displayCount = count > 99 ? '99+' : count;

  const variantStyles = {
    default: 'bg-accent text-accent-foreground',
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
    error: 'bg-error text-error-foreground',
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        min-w-[20px] h-5 px-1.5
        text-xs font-caption font-medium
        rounded-full
        ${variantStyles?.[variant]}
        ${className}
        animate-pulse-subtle
      `}
    >
      {displayCount}
    </span>
  );
};

export default NotificationBadge;
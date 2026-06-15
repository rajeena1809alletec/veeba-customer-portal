import React from 'react';
import Icon from '../../../components/AppIcon';

const ComplaintTypeIcon = ({ type, size = 20 }) => {
  const typeConfig = {
    'Shortage': {
      icon: 'PackageMinus',
      color: 'var(--color-warning)',
      bg: 'bg-warning/10'
    },
    'Leakage': {
      icon: 'Droplet',
      color: 'var(--color-accent)',
      bg: 'bg-accent/10'
    },
    'Damage': {
      icon: 'PackageX',
      color: 'var(--color-error)',
      bg: 'bg-error/10'
    },
    'Expiry': {
      icon: 'Calendar',
      color: 'var(--color-destructive)',
      bg: 'bg-destructive/10'
    },
    'Quality Issue': {
      icon: 'AlertTriangle',
      color: 'var(--color-warning)',
      bg: 'bg-warning/10'
    },
    'Wrong Product': {
      icon: 'PackageSearch',
      color: 'var(--color-accent)',
      bg: 'bg-accent/10'
    }
  };

  const config = typeConfig?.[type] || typeConfig?.['Quality Issue'];

  return (
    <div className={`
      inline-flex items-center justify-center
      w-10 h-10 rounded-lg
      ${config?.bg}
      transition-smooth
    `}>
      <Icon name={config?.icon} size={size} color={config?.color} />
    </div>
  );
};

export default ComplaintTypeIcon;
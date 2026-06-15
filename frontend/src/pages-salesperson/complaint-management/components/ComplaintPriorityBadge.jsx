import React from 'react';
import Icon from '../../../components/AppIcon';

const ComplaintPriorityBadge = ({ priority }) => {
  const priorityConfig = {
    'High': {
      icon: 'AlertCircle',
      color: 'var(--color-error)',
      bg: 'bg-error/10',
      text: 'text-error',
      label: 'High Priority'
    },
    'Medium': {
      icon: 'AlertTriangle',
      color: 'var(--color-warning)',
      bg: 'bg-warning/10',
      text: 'text-warning',
      label: 'Medium Priority'
    },
    'Low': {
      icon: 'Info',
      color: 'var(--color-primary)',
      bg: 'bg-primary/10',
      text: 'text-primary',
      label: 'Low Priority'
    }
  };

  const config = priorityConfig?.[priority] || priorityConfig?.['Medium'];

  return (
    <div className={`
      inline-flex items-center gap-2
      px-3 py-1.5 rounded-md
      ${config?.bg} ${config?.text}
      text-xs font-caption font-medium
      transition-smooth
    `}>
      <Icon name={config?.icon} size={14} color={config?.color} />
      <span>{config?.label}</span>
    </div>
  );
};

export default ComplaintPriorityBadge;
import React from 'react';
import Icon from '../../../components/AppIcon';

const NotificationStats = ({ stats }) => {
  const statCards = [
    {
      label: 'Total Notifications',
      value: stats?.total,
      icon: 'Bell',
      iconColor: 'var(--color-primary)',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Unread',
      value: stats?.unread,
      icon: 'Mail',
      iconColor: 'var(--color-accent)',
      bgColor: 'bg-accent/10'
    },
    {
      label: 'High Priority',
      value: stats?.highPriority,
      icon: 'AlertCircle',
      iconColor: 'var(--color-error)',
      bgColor: 'bg-error/10'
    },
    {
      label: 'Archived',
      value: stats?.archived,
      icon: 'Archive',
      iconColor: 'var(--color-muted-foreground)',
      bgColor: 'bg-muted'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statCards?.map((stat, index) => (
        <div
          key={index}
          className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-warm-sm hover:shadow-warm-md transition-smooth"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`${stat?.bgColor} rounded-lg p-2 md:p-3`}>
              <Icon name={stat?.icon} size={20} color={stat?.iconColor} />
            </div>
          </div>
          <div className="data-text text-2xl md:text-3xl font-bold text-foreground mb-1">
            {stat?.value}
          </div>
          <div className="font-caption text-xs md:text-sm text-muted-foreground">
            {stat?.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationStats;